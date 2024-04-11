import { Request, Response, NextFunction } from "express";
import User from "@/models/User";

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.token && !req.body.token) {
      return res.json({ notAllowed: true });
    }

    let token: string = "";

    if (typeof req.query.token === "string") {
      token = req.query.token;
    }
    if (typeof req.body.token === "string") {
      token = req.body.token;
    }

    if (token === "") {
      return res.json({ notAllowed: true });
    }
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ notAllowed: true });
    }

    return next();
  },
};
