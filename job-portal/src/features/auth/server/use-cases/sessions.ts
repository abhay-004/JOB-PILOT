import crypto from "crypto";
import { getIPAddress } from "./location";
import { headers } from "next/headers";
import { db } from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constant";

//type of createSession
type CreateUserSessionData = {
  userAgent: string;
  ip: string;
  userId: number;
  token: string;
};

//generate session token
const genrateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

//create user session
const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
}: CreateUserSessionData) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const [session] = await db.insert(sessions).values({
    id: hashedToken,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    ip,
    userAgent,
  });

  return session;
};

//main function to create session and set cookies
export const createSessionAndSetCookies = async (userId: number) => {
  const token = genrateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    token,
    userId: userId,
    userAgent: headersList.get("user-agent") || "",
    ip: ip,
  });
};
