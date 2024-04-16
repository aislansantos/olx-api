import { Request, Response } from "express";
import * as UserService from "@/services/User.Service";

export const getState = async (req: Request, res: Response) => {
  // const states = await State.find({});
  const states = await UserService.consultStates();
  console.log(states);

  return res.status(200).json({ states: states });
};

export const info = async (req: Request, res: Response) => {
  const token = req.body.token;

  const user = await UserService.info(token);
  if (user === null || user === undefined) {
    return;
  }

  return res.json({ user });
};

export const editAction = async (req: Request, res: Response) => {
  const data = await UserService.editAction(req);

  if (!data) {
    return res.json({ error: "Ocorreu algum tipo de erro" });
  }

  return res.json({ data });
};
