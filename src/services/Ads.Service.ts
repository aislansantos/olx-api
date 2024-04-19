import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import * as jimp from "jimp";

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
  title?: { $regex: string; $options: string };
  category?: string;
  state?: string;
}

interface Updates {
  title?: string;
  price?: number;
  priceNegotiable?: boolean;
  status?: boolean;
  description?: string;
  category?: string;
  images?: object;
}

const addImage = async (buffer: Buffer) => {
  const newName = `${uuidv4()}.jpg`;
  const directory = "./public/media";

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

  const types = ["image/jpeg", "image/jpg", "image/png"];

  if (dataAds.files && dataAds.files.img) {
    const imgFiles = Array.isArray(dataAds.files.img)
      ? dataAds.files.img
      : [dataAds.files.img];
    for (const imgFile of imgFiles) {
      if (types.includes(imgFile.mimetype)) {
        const url = await addImage(imgFile.data);
        newAds.images.push({ url, default: false });
      } else {
        return {
          msg: "Formato de imagem inválido, anuncio não salvo",
          status: false,
        };
      }
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
  let { other = false } = dataGetItem.query;
  other = other === "true" ? true : false;

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

  //other para pegar mais anuncios daquele usuario
  const others = [];
  if (other) {
    const otherData = await Ads.find({
      status: true,
      idUser: ads.idUser,
    }).exec();

    for (const i in otherData) {
      if (otherData[i]._id.toString() != ads._id.toString()) {
        let image = `${process.env.BASE}/media/default.jpg`;

        const defaultImg = otherData[i].images.find((e) => e.default);

        if (defaultImg) {
          image = `${process.env.BASE}/media/${defaultImg.url}`;
        }

        others.push({
          id: otherData[i]._id,
          title: otherData[i].title,
          price: otherData[i].price,
          priceNegotiable: otherData[i].priceNegotiable,
          image,
        });
      }
    }
  }

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
    others,
  };
};

export const editAction = async (dataItemEdit: Request) => {
  const { id } = dataItemEdit.params;
  const { title, status, priceneg, desc, cat, images, token } =
    dataItemEdit.body;
  let { price } = dataItemEdit.body;
  let priceNumber = 0;

  if (id.length < 12) {
    return { msg: "ID inválido", status: false };
  }

  const ads = await Ads.findById(id).exec();
  if (!ads) {
    return { msg: "Anúncio inexistente", status: false };
  }

  const user = await User.findOne({ token }).exec();

  if (user?._id.toString() !== ads.idUser.toString()) {
    return { msg: "Este anúncio não é seu.", status: false };
  }

  const updates: Updates = {};

  if (title) {
    updates.title = title;
  }

  if (price) {
    price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
    priceNumber = parseFloat(price);
    console.log(priceNumber);

    updates.price = priceNumber;
  }

  if (priceneg) {
    updates.priceNegotiable = priceneg;
  }

  if (status) {
    updates.status = status;
  }

  if (desc) {
    updates.description = desc;
  }

  if (cat) {
    const category = await Category.findOne({ slug: cat }).exec();
    if (!category) {
      return { msg: "Categoria não existe.", status: false };
    }
    updates.category = category._id.toString();
  }

  if (images) {
    updates.images = images;
  }

  await Ads.findByIdAndUpdate(id, { $set: updates });

  if (dataItemEdit.files && dataItemEdit.files.img) {
    const itemEdit = await Ads.findById(id);
    const types = ["image/jpeg", "image/jpg", "image/png"];
    if (itemEdit) {
      const imgFiles = Array.isArray(dataItemEdit.files.img)
        ? dataItemEdit.files.img
        : [dataItemEdit.files.img];
      for (const i in imgFiles) {
        if (types.includes(imgFiles[i].mimetype)) {
          const url = await addImage(imgFiles[i].data);

          itemEdit.images.push({
            url,
            default: false,
          });
        } else {
          return {
            msg: "Formato de imagem inválido, anuncio não salvo",
            status: false,
          };
        }
      }

      itemEdit.save();
    }
  }
  // TODO: novas imagens

  return { msg: "Ads Alterado", status: true };
};
