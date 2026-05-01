'use server'

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";

export const registerAction = async (data: {
    name: string;
    userName: string;
    email: string;
    password: string;
    role: "applicant" | "employer";
}) => {
    const {name,userName,email,password,role}=data
    await db.insert(users).values({name,userName,email,password,role})
}

