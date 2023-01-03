import { PasskeyAuthenticator } from "@prisma/client";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "utils/auth";
import Prisma from "utils/initPrisma";

const VerifyPasskeyLogin = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const { credential, email } = req.body;
    const user = await Prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const expectedChallenge =
      await Prisma.passkeyLoginChallenge.findFirstOrThrow({
        where: {
          userId: user.id,
          active: true,
          verified: false,
        },
      });

    const { challenge } = expectedChallenge;

    const validAuthenticator: PasskeyAuthenticator =
      await Prisma.passkeyAuthenticator.findFirstOrThrow({
        where: {
          userId: user.id,
          credentialID: Buffer.from(credential.id, "base64"),
        },
      });

    const { transports, ...rest } = validAuthenticator;
    const { verified, authenticationInfo } = await verifyAuthenticationResponse(
      {
        credential,
        expectedChallenge: challenge,
        expectedOrigin: "http://localhost:3000",
        expectedRPID: "localhost",
        authenticator: rest,
      }
    );
    if (verified) {
      await Prisma.passkeyLoginChallenge.update({
        where: {
          id: expectedChallenge.id,
        },
        data: {
          verified: true,
          active: false,
        },
      });

      await Prisma.passkeyAuthenticator.update({
        where: {
          id: validAuthenticator.id,
        },
        data: {
          counter: authenticationInfo.newCounter,
        },
      });

      const token = createRefreshToken(user);
      sendRefreshToken(res, token);
      const accessToken = createAccessToken(user);

      const updatedUser = await Prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
        include: {
          PasskeyAuthenticators: true,
        },
      });

      const userForTheClient = {
        id: user.id,
        email: user.email,
        authenticators: updatedUser.PasskeyAuthenticators,
      };
      res.send({ user: userForTheClient, accessToken });
    } else {
      res.status(404).send({});
    }
  }
  res.status(404).send({});
};

export default VerifyPasskeyLogin;
