import { Request, Response, NextFunction } from "express";
import User from "@/models/User";

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.token && !req.body.token) {
      return res.json({ notAllowed: true });
    }

    let token: string = "";

    if (typeof token != "string") {
      return res.json({ notAllowed: true });
    }

    if (req.query.token) {
      token = req.query.token;
    }
    if (req.body.token) {
      token = req.body.token;
    }

    if (token == "") {
      return res.json({ notAllowed: true });
    }
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ notAllowed: true });
    }

    return next();
  },
};
