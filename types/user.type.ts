import { User } from "@prisma/client";

export interface IUser extends User {}
export type TSecureUser = Omit<IUser, "password">;
