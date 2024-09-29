import { addReview, fetchAllReviews } from "@/lib/actions/review.action";
import { fetchStreetDetails } from "@/lib/helper/get-street-details";
import { ReviewType } from "@/types/review.type";
import { convertToStreetType } from "@/types/street.type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try{
    const body = await req.json();
  if(!body) return NextResponse.json({ reviews: null, message: "no data passed!"}, { status: 404 });
  console.log(body);
  const notInserted: ReviewType[] = [];
  body.forEach(async (review: ReviewType) => {
    const streetDetails = await fetchStreetDetails({latitude: review.latitude, longitude: review.longitude});
    const convertedStreetDetails = convertToStreetType(streetDetails);
    const res = await addReview(review, convertedStreetDetails);
    if(res.error){
      notInserted.push(review);
    }
  });

  return NextResponse.json({message: "Success", notInserted}, {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: err.message }, {status: 500});
  }
  
}

