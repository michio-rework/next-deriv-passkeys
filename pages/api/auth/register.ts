// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TAuthResponse } from "types/api.types";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "utils/auth";
import Prisma from "utils/initPrisma";
import { hashPassword } from "../_utils";

const singup = async (
  req: NextApiRequest,
  res: NextApiResponse<TAuthResponse>
) => {
  const { email, password } = req.body;

  //checking if someone have used the email
  const checkIfExist = await Prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (checkIfExist) return res.status(409).send({});

  const hashedPassword = await hashPassword(password);

  const currentUser = await Prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = createRefreshToken(currentUser);
  sendRefreshToken(res, token);

  const accessToken = createAccessToken(currentUser);
  res.send({
    user: {
      id: currentUser.id,
      email: currentUser.email,
    },
    accessToken,
  });
};

export default singup;
