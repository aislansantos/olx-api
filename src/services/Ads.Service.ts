import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import * as jimp from "jimp";
import * as fs from "fs";

import Category from "@/models/Category";
import Ads from "@/models/Ads";
import User from "@/models/User";
import { Request } from "express";

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
  newAds.status = "true";
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

  console.log(newAds);

  // const info = await newAds.save();

  // return { id: info.id, status: true };
};
