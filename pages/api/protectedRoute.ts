// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import checkAuth from "./_middleware/checkAuthServer";

const protectedRoute = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    //secret data
    res.send("Hey, keep it in secret!");
  }
};

export default checkAuth(protectedRoute);
