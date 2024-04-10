import { Request, Response } from "express";
import State from "@/models/State";

export const getState = async (req: Request, res: Response) => {
  const states = await State.find({});
  return res.status(200).json({ states });
};

export const info = async (req: Request, res: Response) => {};

export const editAction = async (req: Request, res: Response) => {};
