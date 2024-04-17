import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import * as jimp from "jimp";
import * as fs from "fs";

import Category from "@/models/Category";
import Ads from "@/models/Ads";
import User from "@/models/User";
import State from "@/models/State";
import { Request } from "express";
import mongoose from "mongoose";

interface Categories {
  name: string;
  slug: string;
  img: string;
}

interface RequestData {
  title: string;
  price: string;
  priceneg: string;
  desc: string;
  cat: string;
  token: string;
  image: string[];
}

interface Filters {
  status: boolean;
  title?: { $regex: string; $options: string }; // Tornamos title opcional
  category?: string;
  state?: string;
}

const addImage = async (buffer: Buffer) => {
  const newName = `${uuidv4()}.jpg`;
  const directory = "./public/media";

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const tmpImg = await jimp.read(buffer);
  tmpImg.cover(500, 500).quality(80).write(`${directory}/${newName}`);
  return newName;
};

export const getCategories = async () => {
  const cats = await Category.find().lean();

  const categories: Categories[] = [];

  for (const i in cats) {
    categories.push({
      ...cats[i],
      img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`,
    });
  }

  return categories;
};

export const addAction = async (dataAds: Request) => {
  const { title, priceneg, desc, cat, token }: RequestData = dataAds.body;
  let { price }: RequestData = dataAds.body;
  let priceNumber: number = 0;
  const user = await User.findOne({ token }).exec();

  const idUser = user?._id.toString();

  if (typeof idUser !== "string") {
    return {
      msg: "User errado",
      status: false,
    };
  }

  if (!title || !cat) {
    return {
      msg: "Faltaou titulo e/ou categoria, campos obrigatórios",
      status: false,
    };
  }

  if (price) {
    price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
    priceNumber = parseFloat(price);
  }

  const newAds = new Ads();
  newAds.status = true;
  newAds.idUser = idUser;
  newAds.state = user?.state ?? "";
  newAds.dateCreated = new Date();
  newAds.title = title;
  newAds.category = cat;
  newAds.price = priceNumber;
  newAds.priceNegotiable = priceneg == "true" ? true : false;
  newAds.description = desc;
  newAds.views = 0;

  if (dataAds.files && dataAds.files.img) {
    const imgFiles = Array.isArray(dataAds.files.img)
      ? dataAds.files.img
      : [dataAds.files.img];
    for (const imgFile of imgFiles) {
      const url = imgFile.data;
      const imageName = await addImage(url);
      newAds.images.push({ url: imageName, default: false });
    }
  }

  if (newAds.images.length > 0) {
    newAds.images[0].default = true;
  }

  const info = await newAds.save();

  return { id: info.id, status: true };
};

export const getList = async (dataReq: Request) => {
  const { sort = "asc", offset = 0, limit = 8, q, cat, state } = dataReq.query;
  const filters: Filters = { status: true };
  let total = 0;

  if (q && typeof q === "string") {
    filters.title = { $regex: q, $options: "i" };
  }

  if (cat && typeof cat === "string") {
    const c = await Category.findOne({ slug: cat }).exec();

    if (c) {
      filters.category = c._id.toString();
    }
  }
  if (state && typeof state === "string") {
    const s = await State.findOne({ name: state.toUpperCase() }).exec();
    if (s) {
      filters.state = s._id.toString();
    }
  }

  const adsTotal = await Ads.find(filters).exec();
  total = adsTotal.length;

  const adsData = await Ads.find(filters)
    .sort({ dateCreated: sort == "desc" ? -1 : 1 })
    .skip(parseInt(String(offset)))
    .limit(parseInt(String(limit)))
    .exec();

  const ads = [];
  for (const i in adsData) {
    let image;
    const defaultImg = adsData[i].images.find((e) => e.default);
    if (defaultImg) {
      image = `${process.env.BASE}/media/${defaultImg.url}`;
    } else {
      image = `${process.env.BASE}/media/default.jpg`;
    }

    ads.push({
      id: adsData[i]._id,
      title: adsData[i].title,
      price: adsData[i].price,
      priceNegotiable: adsData[i].priceNegotiable,
      image,
    });
  }
  return { ads, total };
};

export const getItem = async (dataGetItem: Request) => {
  const { id } = dataGetItem.query;
  // let { other = false } = dataGetItem.query;
  // other = other === "true" ? true : false;

  if (!id) {
    return "falta id do produto";
  }
  if (!mongoose.isValidObjectId(id)) {
    return "ID de formato inválido";
  }
  const ads = await Ads.findById(id);

  if (!ads) {
    return "Produto não encontrado.";
  }

  ads.views++;
  await ads.save();

  const images = [];

  for (const i in ads.images) {
    images.push(`${process.env.BASE}/media/${ads.images[i].url}`);
  }

  const category = await Category.findById(ads.category).exec();
  const userInfo = await User.findById(ads.idUser).exec();
  const stateInfo = await State.findById(ads.state).exec();

  return {
    id: ads._id,
    title: ads.title,
    price: ads.price,
    priceNegotiable: ads.priceNegotiable,
    description: ads.description,
    dateCreated: ads.dateCreated,
    views: ads.views,
    images,
    category,
    userInfo: {
      name: userInfo?.name,
      email: userInfo?.email,
    },
    stateName: stateInfo?.name,
  };
};
