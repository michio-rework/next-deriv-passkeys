// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import checkAuth from "../../_middleware/checkAuthServer";

const GetRegisterPasskeyOptions = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.send("yooo");
};

export default checkAuth(GetRegisterPasskeyOptions);
