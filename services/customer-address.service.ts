import mongoose, { type HydratedDocument } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { User, type IUser, type IUserAddress } from "@/models/User";
import type { CustomerAddress, CustomerAddressInput } from "@/types/customer-address";

function serializeAddress(address: IUserAddress): CustomerAddress {
  return {
    id: address._id?.toString() || "",
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country || "India",
    isDefault: Boolean(address.isDefault),
  };
}

async function findActiveCustomer(userId: string): Promise<HydratedDocument<IUser> | null> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user || !user.isActive || user.role !== "customer") {
    return null;
  }

  return user;
}

function normalizeAddressInput(input: CustomerAddressInput): CustomerAddressInput {
  return {
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2?.trim() || undefined,
    city: input.city.trim(),
    state: input.state.trim(),
    postalCode: input.postalCode.trim(),
    country: input.country?.trim() || "India",
    isDefault: Boolean(input.isDefault),
  };
}

function validateAddressInput(input: CustomerAddressInput) {
  if (!input.fullName) {
    throw new Error("Full name is required.");
  }

  if (input.fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters.");
  }

  if (input.fullName.length > 100) {
    throw new Error("Full name must be 100 characters or fewer.");
  }

  if (!input.phone) {
    throw new Error("Phone number is required.");
  }

  if (input.phone.length > 20) {
    throw new Error("Phone number must be 20 characters or fewer.");
  }

  if (!input.addressLine1) {
    throw new Error("Address line 1 is required.");
  }

  if (input.addressLine1.length > 200) {
    throw new Error("Address line 1 must be 200 characters or fewer.");
  }

  if (input.addressLine2 && input.addressLine2.length > 200) {
    throw new Error("Address line 2 must be 200 characters or fewer.");
  }

  if (!input.city) {
    throw new Error("City is required.");
  }

  if (input.city.length > 100) {
    throw new Error("City must be 100 characters or fewer.");
  }

  if (!input.state) {
    throw new Error("State is required.");
  }

  if (input.state.length > 100) {
    throw new Error("State must be 100 characters or fewer.");
  }

  if (!input.postalCode) {
    throw new Error("Postal code is required.");
  }

  if (input.postalCode.length > 20) {
    throw new Error("Postal code must be 20 characters or fewer.");
  }

  if (!input.country) {
    throw new Error("Country is required.");
  }

  if (input.country.length > 100) {
    throw new Error("Country must be 100 characters or fewer.");
  }
}

function unsetDefaultAddresses(user: IUser, exceptId?: string) {
  user.addresses.forEach((address) => {
    const addressId = address._id?.toString();

    if (!exceptId || addressId !== exceptId) {
      address.isDefault = false;
    }
  });
}

function ensureDefaultAddress(user: IUser) {
  if (user.addresses.length === 0) {
    return;
  }

  const defaultAddresses = user.addresses.filter((address) => address.isDefault);

  if (defaultAddresses.length === 0) {
    user.addresses[0].isDefault = true;
    return;
  }

  if (defaultAddresses.length > 1) {
    let firstDefaultFound = false;

    user.addresses.forEach((address) => {
      if (address.isDefault) {
        if (!firstDefaultFound) {
          firstDefaultFound = true;
        } else {
          address.isDefault = false;
        }
      }
    });
  }
}

export async function getCustomerAddresses(userId: string): Promise<CustomerAddress[]> {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  return user.addresses.map(serializeAddress).sort((a, b) => {
    if (a.isDefault && !b.isDefault) {
      return -1;
    }

    if (!a.isDefault && b.isDefault) {
      return 1;
    }

    return a.fullName.localeCompare(b.fullName);
  });
}

export async function createCustomerAddress(
  userId: string,
  input: CustomerAddressInput,
): Promise<CustomerAddress> {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  const normalized = normalizeAddressInput(input);

  validateAddressInput(normalized);

  const shouldBeDefault = normalized.isDefault === true || user.addresses.length === 0;

  if (shouldBeDefault) {
    unsetDefaultAddresses(user);
  }

  const address = {
    fullName: normalized.fullName,
    phone: normalized.phone,
    addressLine1: normalized.addressLine1,
    addressLine2: normalized.addressLine2,
    city: normalized.city,
    state: normalized.state,
    postalCode: normalized.postalCode,
    country: normalized.country || "India",
    isDefault: shouldBeDefault,
  };

  user.addresses.push(address);

  ensureDefaultAddress(user);

  await user.save();

  const createdAddress = user.addresses[user.addresses.length - 1];

  return serializeAddress(createdAddress);
}

export async function updateCustomerAddress(
  userId: string,
  addressId: string,
  input: CustomerAddressInput,
): Promise<CustomerAddress> {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new Error("Invalid address.");
  }

  const address = user.addresses.find((item) => item._id?.toString() === addressId);

  if (!address) {
    throw new Error("Address not found.");
  }

  const normalized = normalizeAddressInput(input);

  validateAddressInput(normalized);

  const shouldBeDefault = normalized.isDefault === true || Boolean(address.isDefault);

  if (shouldBeDefault) {
    unsetDefaultAddresses(user, addressId);
  }

  address.fullName = normalized.fullName;
  address.phone = normalized.phone;
  address.addressLine1 = normalized.addressLine1;
  address.addressLine2 = normalized.addressLine2;
  address.city = normalized.city;
  address.state = normalized.state;
  address.postalCode = normalized.postalCode;
  address.country = normalized.country || "India";
  address.isDefault = shouldBeDefault;

  ensureDefaultAddress(user);

  await user.save();

  return serializeAddress(address);
}

export async function setCustomerDefaultAddress(
  userId: string,
  addressId: string,
): Promise<CustomerAddress> {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new Error("Invalid address.");
  }

  const address = user.addresses.find((item) => item._id?.toString() === addressId);

  if (!address) {
    throw new Error("Address not found.");
  }

  unsetDefaultAddresses(user, addressId);

  address.isDefault = true;

  await user.save();

  return serializeAddress(address);
}

export async function deleteCustomerAddress(userId: string, addressId: string): Promise<void> {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new Error("Invalid address.");
  }

  const addressIndex = user.addresses.findIndex((item) => item._id?.toString() === addressId);

  if (addressIndex === -1) {
    throw new Error("Address not found.");
  }

  const address = user.addresses[addressIndex];

  if (!address) {
    throw new Error("Address not found.");
  }

  const wasDefault = Boolean(address.isDefault);

  user.addresses.splice(addressIndex, 1);

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  ensureDefaultAddress(user);

  await user.save();
}
