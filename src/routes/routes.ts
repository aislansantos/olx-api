import { Router, Request, Response } from "express";

import * as AuthController from "@/controllers/Auth.Controller";
import * as UserController from "@/controllers/User.controller";
import * as AdsController from "@/controllers/Ads.Controller";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ pong: true });
});

router.get("/states", UserController.getState);

router.post("/user/signin", AuthController.signin);
router.post("/user/signup", AuthController.signup);

router.get("/user/me", UserController.info);
router.put("/user/me", UserController.editAction);

router.get("/categories", AdsController.getCategories);

router.post("/ads/add", AdsController.addAction);
router.get("/ads/list", AdsController.getList);
router.get("/ads/item", AdsController.getItem);
router.post("/ads/:id", AdsController.editAction);

export default router;
