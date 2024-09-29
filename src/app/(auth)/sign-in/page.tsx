"use client";
import LoginForm from "@/components/forms/login-form";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/dashboard");
    // return (
    //   <>
    //     Signed in as {session.user?.email} <br />
    //     Signed in Id as {session.user?.id} <br />
    //     <button onClick={() => signOut()}>Sign out</button>
    //   </>
    // );
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoginForm
        signIn={signIn}
        error={props.searchParams?.error}
        callbackUrl={props.searchParams?.callbackUrl}
      />
    </div>
  );
};

export default SignInPage;
