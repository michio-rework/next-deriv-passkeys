import { sign } from "jsonwebtoken";
import cookie from "cookie";
import { TSecureUser } from "../types/user.type";
import { NextApiResponse } from "next";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? "refreshsecret";

export const refreshToken = () => {
  return fetch("/api/token/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const createAccessToken = (user: TSecureUser) => {
  return sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: TSecureUser) => {
  return sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const sendRefreshToken = (res: NextApiResponse, token: string) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  );
};
