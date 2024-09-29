import { Review } from "@prisma/client";
import { StreetType } from "./street.type";

export interface ReviewType extends Omit<Review, "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
  street?: StreetType;
}

export const convertToReviewType = (review: any) => {
  const convertedReview: ReviewType = {
    id: review.id,
    streetId: review.streetId,
    userId: review.userId || null,
    rating: review.rating,
    comment: review.comment || null,
    photoUrl: review.photoUrl || null,
    videoUrl: review.videoUrl || null,
    latitude: review.latitude,
    longitude: review.longitude,
    isReported: review.isReported,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
  return convertedReview;
};
