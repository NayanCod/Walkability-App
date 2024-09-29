import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

type Props = {
  signIn: any;
  callbackUrl?: string;
  error?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginForm({
  signIn,
  error,
  callbackUrl,
  setOpen,
}: Props) {
  const router = useRouter();
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 pb-4">{error}</p>}
        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              signIn("google", { callbackUrl: callbackUrl || "/dashboard" })
            }
          >
            Login with Google
          </Button>
          <div className="flex items-center justify-around">
            <Separator className="w-[45%]" />
            <span>or</span>
            <Separator className="w-[45%]" />
          </div>
          <Button
            type="button"
            variant={"outline"}
            className="w-full"
            onClick={() => {
              localStorage.setItem("userType", "guest");
              router.push(callbackUrl || "/dashboard");
              if (setOpen) {
                setOpen(false);
              }
            }}
          >
            Continue as Guest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
