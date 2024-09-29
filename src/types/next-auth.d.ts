import { user } from "@prisma/client";
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends Omit<user, "password"> {}
  interface Session {
    user: user & DefaultSession["user"];
  }
  interface JWT extends Omit<user, "password"> {}
}
