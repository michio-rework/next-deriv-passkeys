import { TSecureUser } from "./user.type";

export interface ILoginBody {
  email: string;
  password: string;
}

export type TAuthResponse = {
  user?: TSecureUser;
  accessToken?: string;
};
