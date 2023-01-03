import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import cookie from "cookie";
import Prisma from "utils/initPrisma";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "utils/auth";
import { REFRESH_TOKEN_SECRET } from "../_utils/configs";

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
        include: {
          PasskeyAuthenticators: true,
        },
      });

      if (!user) return res.send({ ok: false, accessToken: "" });

      sendRefreshToken(res, createRefreshToken(user));
      const accessToken = createAccessToken(user);

      const userForTheClient = {
        id: user.id,
        email: user.email,
        authenticators: user.PasskeyAuthenticators,
      };
      res.send({ ok: true, user: userForTheClient, accessToken });
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: "" });
    }
  } else {
    res.status(500).send({});
  }
};

export default refreshToken;
