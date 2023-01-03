import type { NextApiRequest, NextApiResponse } from "next";
import Prisma from "utils/initPrisma";
import {
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import { ORIGIN, RELYING_PARTY_ID } from "pages/api/_utils/configs";

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

      res.status(200).send({ verified });
    } else {
      res.status(404).send({});
    }
  } else {
    res.status(404).send({});
  }
};

export default VerifyPasskeyRegister;
