"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const TopNavBar = () => {
  return (
    <nav className="flex justify-between p-5 py-3">
      <div></div>
      <div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: "/sign-in",
            });
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default TopNavBar;
