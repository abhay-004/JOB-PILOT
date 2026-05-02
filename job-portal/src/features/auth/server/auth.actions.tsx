'use server'

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import  argon2  from "argon2";
import { eq, or } from "drizzle-orm";

export const registerAction = async (data: {
    name: string;
    userName: string;
    email: string;
    password: string;
    role: "applicant" | "employer";
}) => {

    try {
    const {name,userName,email,password,role}=data

    const [user] = await db.select().from(users).where(or(eq(users.email,email),eq(users.userName,userName))) 
    
    if(user){
       if(user.email === email){
        return {
            status: "error",
            message: "Email already exists"
        }
        }
        else if(user.userName === userName){
            return {
                status: "error",
                message: "Username already exists"
            }
       }
    }    
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

