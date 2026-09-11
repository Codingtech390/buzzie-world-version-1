import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// --------------------------------------------------
// 1. LOAD ENVIRONMENT FIRST
// --------------------------------------------------

const envPath = path.resolve(process.cwd(), ".env.local");

const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  console.error("❌ Failed to load .env.local");
  console.error(`Expected file: ${envPath}`);
  console.error(result.error);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing.");
  console.error(`Checked: ${envPath}`);
  process.exit(1);
}

// --------------------------------------------------
// 2. ADMIN CONFIGURATION
// --------------------------------------------------

const ADMIN_NAME = "BuzzieWorld Admin";
const ADMIN_EMAIL = "admin@buzieworld.com";
const ADMIN_PASSWORD = "Abhijeet@12345";

// --------------------------------------------------
// 3. CREATE ADMIN
// --------------------------------------------------

async function createAdmin() {
  console.log("\n🔐 BuzzieWorld Admin Bootstrap\n");

  try {
    // Dynamic imports after environment is loaded.
    const { User } = await import("@/models/User");

    // Use the application's existing database connection helper.
    const { connectToDatabase } = await import("@/lib/mongoose");

    await connectToDatabase();

    console.log("✓ MongoDB connected");

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const name = ADMIN_NAME.trim();
    const password = ADMIN_PASSWORD;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!name) {
      throw new Error("Admin name cannot be empty.");
    }

    if (!email) {
      throw new Error("Admin email cannot be empty.");
    }

    if (!password || password.length < 12) {
      throw new Error("Admin password must be at least 12 characters long.");
    }


    // --------------------------------------------------
    // CHECK EXISTING ACCOUNT
    // --------------------------------------------------

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.error(`\n❌ An account already exists for: ${email}`);

      console.error(`   Existing role: ${existingUser.role}`);

      console.error("   No changes were made to the existing account.");

      return;
    }

    // --------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // --------------------------------------------------
    // CREATE ADMIN
    // --------------------------------------------------

    const admin = await User.create({
      name,
      email,
      password: passwordHash,
      role: "admin",
      isActive: true,
      addresses: [],
    });

    console.log("\n✅ Admin account created successfully.\n");

    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);

    console.log("\n🔒 Password was hashed and was not printed to the console.");

    console.log("\nYou can now sign in through the normal BuzzieWorld login page.");
  } catch (error) {
    console.error("\n❌ Failed to create admin account.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void createAdmin();
