import type { NextApiRequest, NextApiResponse } from "next";
import { PublicKeyCredentialDescriptorFuture } from "@simplewebauthn/typescript-types";
import { User } from "@prisma/client";
import Prisma from "utils/initPrisma";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

const getUserAuthenticators = (user: User) => {
  return Prisma.passkeyAuthenticator.findMany({
    where: {
      userId: user.id,
    },
  });
};

const checkStaleLoginChallenge = async (user: User) => {
  // check if we already have a challenge for the user
  // if true change it's active field to false
  const staleChallenge = await Prisma.passkeyLoginChallenge.findFirst({
    where: {
      verified: false,
      userId: user.id,
      active: true,
    },
  });

  if (staleChallenge !== null) {
    await Prisma.passkeyLoginChallenge.update({
      where: { id: staleChallenge.id },
      data: {
        active: false,
      },
    });
  }
};

const getUserCredentials = async (
  user: User
): Promise<PublicKeyCredentialDescriptorFuture[]> => {
  const authenticators = await getUserAuthenticators(user);

  const credentials: PublicKeyCredentialDescriptorFuture[] = authenticators.map(
    (authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      // transports: authenticator.transports,
    })
  );
  return credentials;
};

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
      userVerification: "discouraged",
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
