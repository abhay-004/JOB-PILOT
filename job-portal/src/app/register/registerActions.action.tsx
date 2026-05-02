'use server'

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import  argon2  from "argon2";

export const registerAction = async (data: {
    name: string;
    userName: string;
    email: string;
    password: string;
    role: "applicant" | "employer";
}) => {

    try {
    const {name,userName,email,password,role}=data
    const hashPassword = await argon2.hash(password)
    await db.insert(users).values({name,userName,email,password:hashPassword,role})
    return {
        status:"success",
        message:"User registered successfully"
    }
     } catch (error) {
        console.log(error)
        return {
            status:"error",
            message:"Something went wrong"
        }
    }
}

