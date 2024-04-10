import { Router } from "express";
import * as ApiController from "@/controllers/Api.Controller";

const routes = Router();

routes.get("/ping", ApiController.ping);

export default routes;
