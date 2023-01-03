import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { ACCESS_TOKEN_SECRET } from "../_utils/configs";

const checkAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authorization = req.headers["authorization"];
      if (!authorization) throw new Error("not authenticated");

      const token = authorization.split(" ")[1];
      verify(token, ACCESS_TOKEN_SECRET);

      console.log("token: ", token);

      return handler(req, res);
    } catch (e) {
      console.log(e);
      res.status(401).send({});
    }
  };
};

export default checkAuth;
