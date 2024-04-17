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
  const { ads, total } = await AdsService.getList(req);
  if (!ads) {
    return res.status(404).json({ message: "Nenhum anúncio encontrado" });
  }
  return res.json({ ads, total });
};

export const getItem = async (req: Request, res: Response) => {
  const item = await AdsService.getItem(req);

  if (!item) {
    return res.status(404).json({ message: item});
  }

  return res.json({ item });
};

// export const editAction = async (req: Request, res: Response) => {};
