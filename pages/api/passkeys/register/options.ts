import type { NextApiRequest, NextApiResponse } from "next";
import Prisma from "utils/initPrisma";
import { User } from "@prisma/client";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PublicKeyCredentialDescriptorFuture } from "@simplewebauthn/typescript-types";

const checkStaleRegistrationChallenge = async (user: User) => {
  // check if we already have a challenge for the user
  // if true change it's active field to false
  const staleChallenge = await Prisma.passkeyRegistrationChallenge.findFirst({
    where: {
      verified: false,
      userId: user.id,
      active: true,
    },
  });

  if (staleChallenge !== null) {
    await Prisma.passkeyRegistrationChallenge.update({
      where: { id: staleChallenge.id },
      data: {
        active: false,
      },
    });
  }
};

const getUserAuthenticators = (user: User) => {
  return Prisma.passkeyAuthenticator.findMany({
    where: {
      userId: user.id,
    },
  });
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

const GetRegisterPasskeyOptions = async (
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

    await checkStaleRegistrationChallenge(user);

    const credentials = await getUserCredentials(user);

    const options = generateRegistrationOptions({
      rpName: "deriv passkeys",
      rpID: "localhost",
      userID: String(user.id),
      userName: user.email,
      attestationType: "direct",
      excludeCredentials: credentials,
    });

    await Prisma.passkeyRegistrationChallenge.create({
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

export default GetRegisterPasskeyOptions;
