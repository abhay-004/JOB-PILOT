'use server'

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import  argon2  from "argon2";
import { eq, or } from "drizzle-orm";
import { registerSchema, RegisterUserData } from "../auth.schema";
import { createSessionAndSetCookies } from "./use-cases/sessions";


//For register

export const registerAction = async (data:RegisterUserData) => {

    try {

    const{data:validatedData,error}=registerSchema.safeParse(data)

    if(error)return{status:"error",message:error.issues[0].message}

    const {name,userName,email,password,role}=validatedData

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


type LoginData = {
    email:string,
    password:string
}


//For login

export const loginAction = async(data:LoginData)=>{

    try {
        const {email,password} = data;
        const[user] = await db.select().from(users).where(eq(users.email,email))

        if(!user){
            return {
                status:"error",
                message:"Invalid email or password"
            }
        }

        const isPassMatch  = await argon2.verify(user.password,password)

        if(!isPassMatch){
            return {
                status:"error",
                message:"Invalid email or password"
            }
        }

         await createSessionAndSetCookies(user.id)
        
        return {
            status: "success",
            message: "Logged in successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Something went wrong"
        }
    }
}



