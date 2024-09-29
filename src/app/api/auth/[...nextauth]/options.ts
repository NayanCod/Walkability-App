import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUp } from "@/lib/actions/user.action";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (existingUser) {
          return true;
        }
        const res = await signUp(user.name!, user.email!, "", user.image!);
        if (res.error) {
          console.log(res.error);

          return false;
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (existingUser) {
          token.id = existingUser.id;
          token.name = existingUser.name;
          token.isVerified = existingUser.isVerified;
          token.image = existingUser.image;
          return token;
        }
      }
      if (user) {
        token.id = user.id?.toString();
        token.name = user.name;
        token.isVerified = user.isVerified;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        const existingUser = await db.user.findUnique({
          where: {
            id: token.id,
          },
        });

        if (existingUser) {
          session.user.id = existingUser.id;
          session.user.name = existingUser.name;
          session.user.isVerified = existingUser.isVerified;
          session.user.image = existingUser.image;
          return session;
        }
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.isVerified = token.isVerified;
        session.user.image = token.image;
      }
      return session;
    },
  },
};
