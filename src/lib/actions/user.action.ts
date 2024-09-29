"use server";
import bcrypt from "bcryptjs";
import { db } from "../db";

export const signUp = async (
  name: string,
  email: string,
  password: string,
  image = ""
) => {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        image: image,
        forgotPasswordToken: "",
        forgotPasswordTokenExpiry: new Date(),
        verifyToken: "",
        verifyTokenExpiry: new Date(),
      },
    });

    return { user, error: null };
  } catch (err: any) {
    return {
      error: err.message,
      user: null,
    };
  }
};

export const fetchUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return { user, error: null };
  } catch (err: any) {
    return {
      error: err.message,
      user: null,
    };
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const user = await db.user.update({
      where: {
        id,
      },
      data,
    });
    return { user, error: null };
  } catch (err: any) {
    return {
      error: err.message,
      user: null,
    };
  }
};
