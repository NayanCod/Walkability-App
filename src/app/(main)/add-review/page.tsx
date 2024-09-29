import ReviewCard from "./_components/review-card";
interface Props {
  searchParams?: {
    rating: string;
    comment: string;
  };
}
const ReviewPage = ({ searchParams }: Props) => {
  const rating = searchParams?.rating
    ? parseInt(searchParams.rating)
    : undefined;
  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-background text-foreground overflow-x-hidden">
      <ReviewCard rating={rating} comment={searchParams?.comment} />
    </div>
  );
};

export default ReviewPage;
