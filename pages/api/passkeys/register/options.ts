import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  checkStaleRegistrationChallenge,
  getUserCredentials,
} from "pages/api/_utils";
import { RELYING_PARTY_ID, RELYING_PARTY_NAME } from "pages/api/_utils/configs";
import Prisma from "utils/initPrisma";

const GetRegisterPasskeyOptions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const { email } = req.body;
    const user = await Prisma.user.findUnique({
      where: {
        email,
      },
    });

    let options: PublicKeyCredentialCreationOptionsJSON;
    let userId;

    if (user) {
      userId = user.id;
      // User already has an account and wants to add passkeys to it
      await checkStaleRegistrationChallenge(user);
      const credentials = await getUserCredentials(user);
      options = generateRegistrationOptions({
        rpName: RELYING_PARTY_NAME,
        rpID: RELYING_PARTY_ID,
        userID: String(user.id),
        userName: user.email,
        attestationType: "direct",
        authenticatorSelection: {
          userVerification: "preferred",
        },
        excludeCredentials: credentials,
      });
    } else {
      // User want to register with passkeys as password
      const passwordLessUser = await Prisma.user.create({
        data: {
          email,
        },
      });
      userId = passwordLessUser.id;

      options = generateRegistrationOptions({
        rpName: RELYING_PARTY_NAME,
        rpID: RELYING_PARTY_ID,
        userID: String(passwordLessUser.id),
        userName: passwordLessUser.email,
        attestationType: "direct",
        authenticatorSelection: {
          userVerification: "preferred",
        },
      });
    }
    await Prisma.passkeyRegistrationChallenge.create({
      data: {
        userId: userId,
        challenge: options.challenge,
      },
    });
    res.status(200).send(options);
  } else {
    res.status(404).send({});
  }
};

export default GetRegisterPasskeyOptions;
