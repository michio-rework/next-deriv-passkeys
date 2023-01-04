import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkStaleLoginChallenge, getUserCredentials } from "pages/api/_utils";
import { RELYING_PARTY_ID } from "pages/api/_utils/configs";
import Prisma from "utils/initPrisma";

const GetLoginPasskeyOptions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const { email } = req.body;
    const user = await Prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const credentials = await getUserCredentials(user);

    await checkStaleLoginChallenge(user);

    const options = generateAuthenticationOptions({
      allowCredentials: credentials,
      userVerification: "preferred",
      rpID: RELYING_PARTY_ID,
    });

    await Prisma.passkeyLoginChallenge.create({
      data: {
        userId: user.id,
        challenge: options.challenge,
      },
    });
    res.status(200).send(options);
  } else {
    res.status(404).send({});
  }
};

export default GetLoginPasskeyOptions;
