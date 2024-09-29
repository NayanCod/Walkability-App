"use server";

import { StreetType } from "@/types/street.type";
import { db } from "../db";

export const addStreet = async (street: StreetType) => {
  try {
    if (!street.address) return { street: null, error: "Address is required" };
    const newAddress = await db.address.create({ data: street.address });
    delete street.address;
    street.addressId = newAddress.id;
    const newStreet = await db.street.create({ data: street as any });
    return { street: newStreet, error: null };
  } catch (err: any) {
    return { street: null, error: err.message };
  }
};

export const fetchStreetDetails = async (boundingBox: any) => {
  try {
    // fetch street details if latitude and longitude are provided
    // street.boundingBox is present in db
    const fetchedStreet = await db.street.findFirst({
      where: {
        boundingBox: { hasEvery: boundingBox },
      },
    });
    if (fetchedStreet) {
      return { street: fetchedStreet, error: null };
    }
    return {
      street: null,
      error: "No street found for the given coordinates.",
    };
  } catch (error: any) {
    return { street: null, error: error.message };
  }
};
