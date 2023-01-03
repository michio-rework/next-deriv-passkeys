// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import cookie from "cookie";
import Prisma from "../../../utils/initPrisma";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../../../utils/auth";

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? "refreshsecret";

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.headers.cookie) return res.send({ ok: false, accessToken: "" });
    const getToken = cookie.parse(req.headers.cookie);
    const token = getToken.refreshToken;

    if (!token) return res.send({ ok: false, accessToken: "" });
    let payload = null;

    try {
      payload = verify(token, REFRESH_TOKEN_SECRET) as { userId: number };

      const user = await Prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) return res.send({ ok: false, accessToken: "" });

      sendRefreshToken(res, createRefreshToken(user));
      const accessToken = createAccessToken(user);

      return res.send({ ok: true, accessToken, user });
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: "" });
    }
  } else {
    res.status(500).send({});
  }
};

export default refreshToken;
