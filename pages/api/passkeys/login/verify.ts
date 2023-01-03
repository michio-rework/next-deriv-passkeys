// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

const Logout = (req: NextApiRequest, res: NextApiResponse) => {
  res.send("yooo");
};

export default Logout;
