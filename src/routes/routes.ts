import { Router, Request, Response } from "express";

import * as AuthController from "@/controllers/Auth.Controller";
import * as UserController from "@/controllers/User.controller";
import * as AdsController from "@/controllers/Ads.Controller";

import { Auth } from "@/middlewares/Auth.Middleware";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  return res.json({ pong: true });
});

router.get("/states", UserController.getState);

router.post("/user/signin", AuthController.signin);
router.post("/user/signup", AuthController.signup);

router.get("/user/me", Auth.private, UserController.info);
router.put("/user/me", Auth.private, UserController.editAction);

router.get("/categories", AdsController.getCategories);

router.post("/ads/add", Auth.private, AdsController.addAction);
router.get("/ads/list", AdsController.getList);
router.get("/ads/item", AdsController.getItem);
router.post("/ads/:id", Auth.private, AdsController.editAction);

export default router;
