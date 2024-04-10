import { Request, Response } from "express";

export const getState = (req: Request, res: Response) => {
  res.json({ pong: true });
};
export const info = (req: Request, res: Response) => {
  res.json({ pong: true });
};
export const editAction = (req: Request, res: Response) => {
  res.json({ pong: true });
};
