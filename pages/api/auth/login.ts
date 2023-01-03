import type { NextApiRequest, NextApiResponse } from "next";
import { TAuthResponse } from "types/api.types";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "utils/auth";
import Prisma from "utils/initPrisma";
import { verifyPasswordWithHash } from "../_utils";

const signin = async (
  req: NextApiRequest,
  res: NextApiResponse<TAuthResponse>
) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const user = await Prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
        include: {
          PasskeyAuthenticators: true,
        },
      });

      if (user.password) {
        const passwordVerified = await verifyPasswordWithHash(
          password,
          user.password
        );
        if (passwordVerified) {
          const token = createRefreshToken(user);
          sendRefreshToken(res, token);
          const accessToken = createAccessToken(user);
          const userForTheClient = {
            id: user.id,
            email: user.email,
            authenticators: user.PasskeyAuthenticators,
          };
          res.send({ user: userForTheClient, accessToken });
        } else {
          res.status(404).send({});
        }
      }
    } catch (error) {
      res.status(404).send({});
    }
  } else {
    res.status(404).send({});
  }
};

export default signin;
