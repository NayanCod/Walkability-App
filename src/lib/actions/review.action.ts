"use server";

import { StreetType } from "@/types/street.type";
import { db } from "../db";
import { ReviewType } from "@/types/review.type";
import { addStreet, fetchStreetDetails } from "./street.action";

export const addReview = async (
  review: Omit<ReviewType, "street">,
  street: StreetType
) => {
  try {
    let res = await fetchStreetDetails(street.boundingBox);
    if (res.error) {
      res = await addStreet(street);
    }
    if (res.error) {
      return { review: null, error: res.error };
    }

    if (!res.street?.id) {
      return { review: null, error: "Failed to add review. Street not found." };
    }

    if (review.photoUrl) {
      await db.media.create({
        data: {
          type: "image",
          url: review.photoUrl,
          streetId: res.street?.id,
          latitude: review.latitude,
          longitude: review.longitude,
        },
      });
    }

    // delete review.street;

    const newReview = await db.review.create({
      data: { ...review, streetId: res.street?.id },
    });
    return { review: newReview, error: null };
  } catch (err: any) {
    return { review: null, error: err.message };
  }
};

export const fetchReviewByUserId = async (userId: string) => {
  try {
    const review = await db.review.findMany({
      where: {
        userId: userId,
      },
      include: {
        street: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { review, error: null };
  } catch (err: any) {
    return { review: null, error: err.message };
  }
};

export const fetchReviewById = async (id: string) => {
  try {
    const review = await db.review.findUnique({
      where: {
        id: id,
      },
      include: {
        street: true,
      },
    });
    return { review, error: null };
  } catch (err: any) {
    return { review: null, error: err.message };
  }
};

export const updateReview = async (id: string, data: any) => {
  try {
    const review = await db.review.update({
      where: {
        id,
      },
      data,
    });
    return { review, error: null };
  } catch (err: any) {
    return { review: null, error: err.message };
  }
};

export const fetchAllReviews = async () => {
  try {
    const reviews = await db.review.findMany({
      include: {
        street: true,
      },
      orderBy: {
        updatedAt: "desc", 
      },
    });
    return { reviews, error: null };
  } catch (err: any) {
    return { reviews: null, error: err.message };
  }
};
