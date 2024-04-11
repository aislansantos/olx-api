import { Request, Response } from "express";
import * as AuthService from "@/services/Auth.Services";

export const signin = async (req: Request, res: Response) => {
  const validation = await AuthService.validateSignin(req);

  if (typeof validation === "string") {
    return res.json({ errors: validation });
  }
  if ("status" in validation) {
    if (validation.token) {
      return res.json({ token: validation.token });
    } else {
      return res.json({ errors: validation.msg });
    }
  }
};

export const signup = async (req: Request, res: Response) => {
  const validation = await AuthService.validateSignup(req);

  if (typeof validation === "string") {
    return res.json({ errors: validation });
  }
  if ("status" in validation) {
    if (validation.token) {
      return res.json({ token: validation.token });
    } else {
      return res.json({ errors: validation.msg });
    }
  }
};
