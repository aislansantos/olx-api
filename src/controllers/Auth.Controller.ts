import { Request, Response } from "express";
import * as AuthService from "@/services/Auth.Services";

export const signin = () => {};

export const signup = async (req: Request, res: Response) => {
  const validation = await AuthService.validate(req);

  if (typeof validation === "string") {
    return res.json({ errors: validation });
  } else if ("status" in validation) {
    if (validation.token) {
      return res.json({ token: validation.token });
    } else {
      return res.json({ errors: validation.msg });
    }
  }
};
