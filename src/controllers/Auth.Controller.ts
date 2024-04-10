import { Request, Response } from "express";

export const signin = (req: Request, res: Response) => {
  res.json({ pong: true });
};
export const signup = (req: Request, res: Response) => {
  res.json({ pong: true });
};
