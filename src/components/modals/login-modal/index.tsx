import LoginForm from "@/components/forms/login-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";
import React from "react";

const LoginModal = ({
  open,
  setOpen,
  callbackUrl,
}: {
  open: boolean;
  callbackUrl?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogTitle className="hidden">Login</DialogTitle>
        <LoginForm
          signIn={signIn}
          callbackUrl={callbackUrl}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
