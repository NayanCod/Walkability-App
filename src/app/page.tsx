import TopNavBar from "@/components/common/navbar";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
