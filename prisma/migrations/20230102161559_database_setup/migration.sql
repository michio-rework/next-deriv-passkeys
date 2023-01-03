-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyRegistrationChallenge" (
    "id" SERIAL NOT NULL,
    "challenge" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasskeyRegistrationChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyLoginChallenge" (
    "id" SERIAL NOT NULL,
    "challenge" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasskeyLoginChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyAuthenticator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialID" BYTEA NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "attestationFormat" BYTEA NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "transports" TEXT[],

    CONSTRAINT "PasskeyAuthenticator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasskeyRegistrationChallenge_challenge_key" ON "PasskeyRegistrationChallenge"("challenge");

-- CreateIndex
CREATE UNIQUE INDEX "PasskeyLoginChallenge_challenge_key" ON "PasskeyLoginChallenge"("challenge");

-- AddForeignKey
ALTER TABLE "PasskeyRegistrationChallenge" ADD CONSTRAINT "PasskeyRegistrationChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasskeyLoginChallenge" ADD CONSTRAINT "PasskeyLoginChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasskeyAuthenticator" ADD CONSTRAINT "PasskeyAuthenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
