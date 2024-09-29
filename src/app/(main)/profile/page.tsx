"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Pencil, Trash2, ClockIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/loading";
import { ReviewType } from "@/types/review.type";
import { fetchReviewByUserId } from "@/lib/actions/review.action";
import { cn } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const router = useRouter();

  const getReviews = async () => {
    if (session?.user.id) {
      const response = await fetchReviewByUserId(session?.user.id);
      if (response.review) {
        setReviews(response.review);
      }
    }
  };

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name);
      setEmail(session.user.email);
      setAvatar(session.user.image);
      getReviews();
      setIsLoading(false);
    } else if (session === null) {
      router.push("/dashboard");
      setIsLoading(false);
    }
  }, [session]);

  const handleReviewDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpdateProfile = async () => {
    // In a real application, this would update the user profile
    if (!session?.user.id) return;
    const res = await updateUser(session?.user.id, { name });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile updated successfully");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div
      className={cn(
        `min-h-screen bg-background text-foreground relative pb-10`,
        {
          "overflow-hidden": isLoading,
        }
      )}
    >
      <div className="w-full pt-10 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
            className="bg-red-500 text-white hover:bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                signOut({
                  callbackUrl: "/dashboard",
                });
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="md:grid md:grid-cols-6 md:gap-6">
          <div className="col-span-2 mb-6 md:mb-0 md:sticky top-0">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatar || ""} alt={name} />
                      <AvatarFallback>
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
                <CardDescription>Manage your street reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {review.street?.displayName}
                        </h3>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/edit-review?reviewId=${review.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit review</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                    {review.photoUrl && (
                      <div className="relative w-full h-40 mb-2">
                        <Image
                          src={review.photoUrl || ""}
                          alt={`Photo of ${review.street?.displayName}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>{formatDate(review.createdAt?.toString())}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
