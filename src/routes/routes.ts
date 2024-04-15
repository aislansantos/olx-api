import { Router } from "express";

import * as AuthController from "@/controllers/Auth.Controller";
import * as UserController from "@/controllers/User.controller";
import * as AdsController from "@/controllers/Ads.Controller";

import { Auth } from "@/middlewares/Auth.Middleware";

import { AuthValidator } from "@/validators/Auth.Validator";
import { UserValidator } from "@/validators/User.Validator";

const router = Router();

router.get("/states", UserController.getState);

router.post("/user/signin", AuthValidator.signin, AuthController.signin);
router.post("/user/signup", AuthValidator.signup, AuthController.signup);

router.get("/user/me", Auth.private, UserController.info);
router.put(
  "/user/me",
  UserValidator.editAction,
  Auth.private,
  UserController.editAction,
);

router.get("/categories", AdsController.getCategories);

router.post("/ads/add", Auth.private, AdsController.addAction);
router.get("/ads/list", AdsController.getList);
router.get("/ads/item", AdsController.getItem);
router.post("/ads/:id", Auth.private, AdsController.editAction);

export default router;
