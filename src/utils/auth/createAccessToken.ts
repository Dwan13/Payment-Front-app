import { v4 as uuidv4 } from 'uuid';
import redis from './redis';
import { cookies } from 'next/headers';

export const createAccessToken = async (email: string, password: string) => {
  const cookiesStore = cookies();

  // Generate a unique token
  const accessToken = uuidv4();
  
  // Set the token to expire in 24 hours
  const expiresIn = 60 * 60 * 24;

  // Store the token in Redis with an expiry time
  await redis.set(`token:${accessToken}`, email, 'EX', expiresIn);

  // Set the token expiration date
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Set the access token as a cookie
  cookiesStore.set("accessToken", accessToken, {
    path: "/",
    expires: expiresAt,
    httpOnly: true,
    sameSite: "strict",
  });

  return accessToken;
};
