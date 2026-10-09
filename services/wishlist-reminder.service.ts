import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import Wishlist from "@/models/Wishlist";
import WishlistReminder from "@/models/WishlistReminder";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { sendEmail } from "@/services/email.service";

const MAX_REMINDERS = 3;
const REMINDER_LIMIT = 50;

const DAY = 24 * 60 * 60 * 1000;

const FIRST_REMINDER_DELAY = 3 * DAY;
const SECOND_REMINDER_DELAY = 4 * DAY;
const THIRD_REMINDER_DELAY = 7 * DAY;

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getNextReminderDate(reminderCount: number) {
  if (reminderCount === 1) {
    return new Date(Date.now() + SECOND_REMINDER_DELAY);
  }

  if (reminderCount === 2) {
    return new Date(Date.now() + THIRD_REMINDER_DELAY);
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildWishlistReminderEmail({
  customerName,
  productName,
  productUrl,
}: {
  customerName: string;
  productName: string;
  productUrl: string;
}) {
  const safeCustomerName = escapeHtml(customerName || "there");
  const safeProductName = escapeHtml(productName);
  const safeProductUrl = escapeHtml(productUrl);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You still have something saved</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f8f6fc;
          font-family: Arial, Helvetica, sans-serif;
          color: #2f2344;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="padding: 32px 16px;"
        >
          <tr>
            <td align="center">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 20px;
                  overflow: hidden;
                "
              >
                <tr>
                  <td
                    style="
                      padding: 32px;
                      text-align: center;
                      background-color: #a092cd;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                        line-height: 1.2;
                      "
                    >
                      BuzzieWorld
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 36px 32px;">
                    <h2
                      style="
                        margin: 0 0 16px;
                        font-size: 22px;
                        line-height: 1.35;
                        color: #2f2344;
                      "
                    >
                      You still have something saved 💜
                    </h2>

                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #667085;
                      "
                    >
                      Hi ${safeCustomerName},
                    </p>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #667085;
                      "
                    >
                      You saved
                      <strong style="color: #2f2344;">
                        ${safeProductName}
                      </strong>
                      to your BuzzieWorld wishlist.
                    </p>

                    <p
                      style="
                        margin: 0 0 28px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #667085;
                      "
                    >
                      It's still waiting for you. Take another look before
                      you forget about it!
                    </p>

                    <div style="text-align: center;">
                      <a
                        href="${safeProductUrl}"
                        style="
                          display: inline-block;
                          padding: 14px 26px;
                          background-color: #a092cd;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 12px;
                          font-size: 15px;
                          font-weight: 600;
                        "
                      >
                        View Product
                      </a>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 24px 32px;
                      border-top: 1px solid #eeeaf5;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.5;
                        color: #98a2b3;
                      "
                    >
                      You're receiving this because wishlist reminders are
                      enabled in your BuzzieWorld account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function cancelReminder(reminderId: Types.ObjectId | string) {
  await WishlistReminder.updateOne(
    {
      _id: reminderId,
      status: "processing",
    },
    {
      $set: {
        status: "cancelled",
      },
    },
  );
}

async function releaseReminder(reminderId: Types.ObjectId | string) {
  await WishlistReminder.updateOne(
    {
      _id: reminderId,
      status: "processing",
    },
    {
      $set: {
        status: "active",
      },
      $inc: {
        attempts: 1,
      },
    },
  );
}

async function completeReminder(reminderId: Types.ObjectId | string, currentReminderCount: number) {
  const nextReminderCount = currentReminderCount + 1;

  if (nextReminderCount >= MAX_REMINDERS) {
    await WishlistReminder.updateOne(
      {
        _id: reminderId,
        status: "processing",
      },
      {
        $set: {
          reminderCount: nextReminderCount,
          lastSentAt: new Date(),
          status: "completed",
        },
      },
    );

    return;
  }

  const nextReminderAt = getNextReminderDate(nextReminderCount);

  if (!nextReminderAt) {
    await WishlistReminder.updateOne(
      {
        _id: reminderId,
        status: "processing",
      },
      {
        $set: {
          reminderCount: nextReminderCount,
          lastSentAt: new Date(),
          status: "completed",
        },
      },
    );

    return;
  }

  await WishlistReminder.updateOne(
    {
      _id: reminderId,
      status: "processing",
    },
    {
      $set: {
        reminderCount: nextReminderCount,
        lastSentAt: new Date(),
        nextReminderAt,
        status: "active",
      },
    },
  );
}

async function processReminder(reminder: {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  wishlist: Types.ObjectId;
  product: Types.ObjectId;
  reminderCount: number;
}) {
  const [user, wishlist, product] = await Promise.all([
    User.findById(reminder.user).select("name email isActive preferences").lean(),

    Wishlist.findOne({
      _id: reminder.wishlist,
      user: reminder.user,
      product: reminder.product,
    })
      .select("_id")
      .lean(),

    Product.findById(reminder.product).select("name slug published").lean(),
  ]);

  /*
   * Customer no longer exists or account is disabled.
   */
  if (!user || !user.isActive) {
    await cancelReminder(reminder._id);
    return {
      status: "cancelled",
      reason: "customer_inactive",
    };
  }

  /*
   * Wishlist item was removed.
   */
  if (!wishlist) {
    await cancelReminder(reminder._id);
    return {
      status: "cancelled",
      reason: "wishlist_item_removed",
    };
  }

  /*
   * Product was deleted or unpublished.
   */
  if (!product || product.published === false) {
    await cancelReminder(reminder._id);
    return {
      status: "cancelled",
      reason: "product_unavailable",
    };
  }

  /*
   * Customer has disabled wishlist reminders.
   *
   * We cancel rather than pause so re-enabling the preference
   * does not resurrect old reminder campaigns.
   */
  if (user.preferences?.wishlistReminders !== true) {
    await cancelReminder(reminder._id);

    return {
      status: "cancelled",
      reason: "wishlist_reminders_disabled",
    };
  }

  if (!user.email) {
    await cancelReminder(reminder._id);

    return {
      status: "cancelled",
      reason: "customer_email_missing",
    };
  }

  const productUrl = `${getAppUrl()}/products/${encodeURIComponent(product.slug)}`;

  const html = buildWishlistReminderEmail({
    customerName: user.name,
    productName: product.name,
    productUrl,
  });

  await sendEmail({
    to: user.email,
    subject: "You still have something saved in your BuzzieWorld wishlist 💜",
    html,
  });

  await completeReminder(reminder._id, reminder.reminderCount);

  return {
    status: "sent",
    reminderCount: reminder.reminderCount + 1,
  };
}

/**
 * Processes due wishlist reminders.
 *
 * This function is intended to be called by the protected
 * internal cron endpoint.
 */
export async function processWishlistReminders() {
  await connectToDatabase();

  /*
   * Recover reminders that were claimed by a previous process
   * but remained in "processing" because the process crashed.
   *
   * A 15-minute recovery window prevents a temporary process
   * failure from permanently blocking the reminder.
   */
  const processingCutoff = new Date(Date.now() - 15 * 60 * 1000);

  await WishlistReminder.updateMany(
    {
      status: "processing",
      updatedAt: {
        $lte: processingCutoff,
      },
    },
    {
      $set: {
        status: "active",
      },
      $inc: {
        attempts: 1,
      },
    },
  );

  const summary = {
    processed: 0,
    sent: 0,
    cancelled: 0,
    failed: 0,
  };

  for (let index = 0; index < REMINDER_LIMIT; index += 1) {
    /*
     * Atomically claim one due reminder.
     *
     * This prevents two simultaneous cron requests from
     * processing the same reminder at the same time.
     */
    const reminder = await WishlistReminder.findOneAndUpdate(
      {
        status: "active",
        nextReminderAt: {
          $lte: new Date(),
        },
        reminderCount: {
          $lt: MAX_REMINDERS,
        },
      },
      {
        $set: {
          status: "processing",
        },
      },
      {
        new: true,
      },
    )
      .select("_id user wishlist product reminderCount")
      .lean();

    if (!reminder) {
      break;
    }

    summary.processed += 1;

    try {
      const result = await processReminder(reminder);

      if (result.status === "sent") {
        summary.sent += 1;
      } else if (result.status === "cancelled") {
        summary.cancelled += 1;
      }
    } catch (error) {
      summary.failed += 1;

      console.error(`Wishlist reminder ${reminder._id.toString()} failed:`, error);

      /*
       * Return the reminder to active so a future cron run
       * can retry it.
       */
      await releaseReminder(reminder._id);
    }
  }

  return summary;
}
