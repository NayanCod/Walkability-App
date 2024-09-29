"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoaderIcon, Star } from "lucide-react";
import { ReviewType } from "@/types/review.type";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchReviewById, updateReview } from "@/lib/actions/review.action";
import { toast } from "sonner";
import Loading from "@/components/common/loading";
import dynamic from "next/dynamic";

const Map = dynamic(
  async () => (await import("../../dashboard/_components/map")).default,
  { ssr: false }
);

interface Props {
  reviewId: string;
}

export default function ReviewCard({ reviewId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<ReviewType>();
  const [isFetching, setIsFetching] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState<{
    rating: number;
    comment: string;
    photoUrl: string | null;
  }>({
    rating: 0,
    comment: "",
    photoUrl: null,
  });

  const pathname = usePathname();
  const router = useRouter();

  const handleRating = (value: number) => {
    setReviewFormData({ ...reviewFormData, rating: value });
  };

  const getReviews = async () => {
    setIsFetching(true);
    const response = await fetchReviewById(reviewId);
    if (response.review) {
      console.log(response.review);
      
      setReview(response.review);
      setReviewFormData({
        rating: response.review.rating || 0,
        comment: response.review.comment || "",
        photoUrl: response.review.photoUrl || "",
      });
    }
    setIsFetching(false);
  };

  useEffect(() => {
    getReviews();
  }, [reviewId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewFormData({
          ...reviewFormData,
          photoUrl: reader.result as string,
        });
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoOption = (isCamera: boolean) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    // If isCamera is true, it will directly open the camera
    if (isCamera) {
      input.capture = "environment";
    }

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        handlePhotoUpload({ target } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!review) return;
    e.preventDefault();
    setIsLoading(true);

    const res = await updateReview(review.id, reviewFormData);
    if (res.error) {
      toast.error(res.error);
    }

    setReviewFormData({
      rating: 0,
      comment: "",
      photoUrl: "",
    });
    setIsLoading(false);
    router.push("/profile");
    toast.success("Review is updated successfully");
  };

  if (!review) {
    return <Loading />;
  }

  return (
    <div className="w-[90%] max-h-screen py-5 md:w-1/2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Street Review</h1>
        {/* <div className="text-muted-foreground">
          {review.street?.displayName}
        </div> */}
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Location</Label>
            <div className="h-[300px] rounded-md overflow-hidden">
              {!isFetching ? (
                review &&
                review.street && (
                  <Map
                    streets={[]}
                    street={review.street}
                    center={
                      location
                        ? [review?.latitude, review?.longitude]
                        : undefined
                    }
                    height="100%"
                    // setLocation={setLocation}
                    zoom={20}
                  />
                )
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <LoaderIcon className="h-10 w-10 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {review.street?.displayName}
            </p>
          </div>
          {/* upload photo */}
          <div>
            <Label htmlFor="photo">Street Photo</Label>
            {/* <div className="flex items-center space-x-2 mt-2">
                <Button type="button" className="lg:hidden sm:block flex gap-1 items-center" onClick={() => handlePhotoOption(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <p>Take Photo</p>
                </Button>
                <p className="text-gray-500 lg:hidden"></p>
                <Button type="button" className="flex gap-1 items-center" onClick={() => handlePhotoOption(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p>Choose from Gallery</p>
                </Button>
            </div> */}
            {/* {
              photoPreview ? (
                <img
                src={photoPreview}
                alt="Street preview"
                className="mt-2 max-w-full h-40 object-cover rounded-md"
              />
              ): (
                review.photoUrl && (
                  <img
                src={review.photoUrl}
                alt="Street preview"
                className="mt-2 max-w-full h-40 object-cover rounded-md"
              />
                )
              )
            } */}
            {review.photoUrl && (
              <img
                src={review.photoUrl}
                alt="Street preview"
                className="mt-2 max-w-full h-40 object-cover rounded-md"
              />
            )}
            {/* {photoPreview && (
              <img
                src={photoPreview}
                alt="Street preview"
                className="mt-2 max-w-full h-40 object-cover rounded-md"
              />
            )} */}
          </div>
          {/* Review Rating */}
          <div>
            <Label>Rate Your Experience</Label>
            <div className="flex items-center mt-1 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 mr-1.5 cursor-pointer ${
                    star <= reviewFormData.rating
                      ? "text-yellow-400 fill-current"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea
              id="comment"
              placeholder="Write your review here..."
              value={reviewFormData.comment}
              onChange={(e) =>
                setReviewFormData({
                  ...reviewFormData,
                  comment: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>

          <div className="md:flex lg:flex xl:flex hidden gap-2">
            <Button
              type="button"
              variant={"outline"}
              className="w-full"
              disabled={isLoading}
              asChild
            >
              <Link href="/profile">
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Cancel
              </Link>
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Edit Review
            </Button>
          </div>
          <div className="md:hidden lg:hidden xl:hidden flex gap-2 mt-4 fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md z-10">
            <Button
              type="button"
              variant={"outline"}
              className="w-full"
              disabled={isLoading}
              asChild
            >
              <Link href="/profile">
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Cancel
              </Link>
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Edit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
