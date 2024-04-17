import { Request, Response } from "express";
import * as AdsService from "@/services/Ads.Service";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await AdsService.getCategories();

  return res.json({ categories });
};

export const addAction = async (req: Request, res: Response) => {
  const ads = await AdsService.addAction(req);

  if (ads?.status === false) {
    return res.json({ error: ads.msg });
  }

  return res.json({ ads });
};

export const getList = async (req: Request, res: Response) => {
  const listAds = await AdsService.getList(req);
  if (!listAds) {
    return;
  }
  return res.json({ listAds });
};

// export const getItem = async (req: Request, res: Response) => {};

// export const editAction = async (req: Request, res: Response) => {};
