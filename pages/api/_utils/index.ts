import { User } from "@prisma/client";
import {
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture,
} from "@simplewebauthn/typescript-types";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import Prisma from "utils/initPrisma";

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
};

export const hashPassword = async (password: string) => {
  let salt = crypto.randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
};

export const verifyPasswordWithHash = async (
  password: string,
  hash: string
) => {
  return await argon2.verify(hash, password, hashingConfig);
};

export const getUserAuthenticators = (user: User) => {
  return Prisma.passkeyAuthenticator.findMany({
    where: {
      userId: user.id,
    },
  });
};

export const checkStaleLoginChallenge = async (user: User) => {
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

export const getUserCredentials = async (
  user: User
): Promise<PublicKeyCredentialDescriptorFuture[]> => {
  const authenticators = await getUserAuthenticators(user);

  const credentials: PublicKeyCredentialDescriptorFuture[] = authenticators.map(
    (authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key" as const,
      // Optional
      transports: authenticator.transports as AuthenticatorTransportFuture[],
    })
  );

  return credentials;
};

export const checkStaleRegistrationChallenge = async (user: User) => {
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
