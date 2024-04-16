import { Request, Response } from "express";
import * as CategoriesService from "@/services/Ads.Service";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await CategoriesService.getCategories();

  return res.json({ categories });
};

// export const addAction = async (req: Request, res: Response) => {};

// export const getList = async (req: Request, res: Response) => {};

// export const getItem = async (req: Request, res: Response) => {};

// export const editAction = async (req: Request, res: Response) => {};
