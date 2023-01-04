import type { NextApiRequest, NextApiResponse } from "next";
import Prisma from "utils/initPrisma";
import {
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import { ORIGIN, RELYING_PARTY_ID } from "pages/api/_utils/configs";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "utils/auth";
import { getUserAuthenticators } from "pages/api/_utils";

const VerifyPasskeyRegister = async (
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
      await Prisma.passkeyRegistrationChallenge.findFirstOrThrow({
        where: {
          userId: user.id,
          active: true,
          verified: false,
        },
      });

    const { challenge } = expectedChallenge;

    const registrationOptions: VerifyRegistrationResponseOpts = {
      credential,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RELYING_PARTY_ID,
    };

    const { verified, registrationInfo } = await verifyRegistrationResponse(
      registrationOptions
    );

    if (verified && registrationInfo) {
      await Prisma.passkeyRegistrationChallenge.update({
        where: { id: expectedChallenge.id },
        data: {
          verified: true,
          active: false,
        },
      });

      await Prisma.passkeyAuthenticator.create({
        data: {
          userId: user.id,
          counter: registrationInfo.counter,
          credentialID: registrationInfo.credentialID,
          credentialPublicKey: registrationInfo.credentialPublicKey,
          attestationFormat: registrationInfo.attestationObject,
          credentialDeviceType: registrationInfo.credentialDeviceType,
          transports: credential.transports,
        },
      });

      const authenticators = await getUserAuthenticators(user);

      const token = createRefreshToken(user);
      sendRefreshToken(res, token);

      const accessToken = createAccessToken(user);

      res.send({
        user: {
          id: user.id,
          email: user.email,
          authenticators: authenticators,
        },
        verified,
        accessToken,
      });
    } else {
      res.status(404).send({});
    }
  } else {
    res.status(404).send({});
  }
};

export default VerifyPasskeyRegister;
