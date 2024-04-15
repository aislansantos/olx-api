import { validationResult, matchedData } from "express-validator";
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { Request } from "express";

import User from "@/models/User";
import Category from "@/models/Category";
import Ads from "@/models/Ads";
import State from "@/models/State";

interface Updates {
  name: string;
  email: string;
  state: string;
  passwordhash: string;
}

export const consultStates = async () => {
  const states = await State.find({});

  return states;
};

export const info = async (token: string) => {
  const user = await User.findOne({ token });
  if (user === null) {
    return;
  }

  const state = await State.findById(user.state);
  if (state === null) {
    return;
  }

  const ads = await Ads.find({ idUser: user._id.toString() });

  const adslist = [];

  for (const i in ads) {
    const cat = await Category.findById(ads[i].category);
    adslist.push({ ...ads[i], category: cat?.slug });
  }

  return {
    name: user.name,
    email: user.email,
    state: state.name,
    ads: adslist,
  };
};

export const editAction = async (dataReq: Request) => {
  const errors = validationResult(dataReq);

  if (!errors.isEmpty()) {
    return { msg: errors.mapped(), status: false };
  }

  const data = matchedData(dataReq);
  const user = await User.findOne({ token: data.token });
  const emailCheck = await User.findOne({ email: data.email });

  if (!user) {
    return false;
  }

  const updates: Updates = {
    name: user.name ? user.name : "",
    email: user.email ? user.email : "",
    state: user.state ? user.state : "",
    passwordhash: user.passwordhash ? user.passwordhash : "",
  };

  if (data.name) {
    updates.name = data.name;
  }
  if (emailCheck) {
    return { msg: "E-mail ja existe" };
  }
  updates.email = data.email;

  if (data.state) {
    if (!mongoose.Types.ObjectId.isValid(data.state)) {
      return { msg: "Código de estado invalido!." };
    }

    const stateCheck = await State.findById(data.state);

    if (!stateCheck) {
      return { msg: "Estado não existe." };
    }
    updates.state = data.state;
  }

  if (data.password) {
    updates.passwordhash = await bcrypt.hash(data.password, 10);
  }

  await User.findOneAndUpdate({ token: data.token }, { $set: updates });

  return;
};
