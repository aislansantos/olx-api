import { validationResult, matchedData } from "express-validator";
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import User from "@/models/User";
import State from "@/models/State";

export const validateSignin = async (reqValidation: Request) => {
  const errors = validationResult(reqValidation);

  if (!errors.isEmpty()) {
    return { msg: errors.mapped(), status: false };
  }

  const data = matchedData(reqValidation);

  // Verificando se email existe
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return { msg: "E-mail e/ou senha errados.", status: false };
  }

  // Conferindo se o hash da senha bate
  const match = await bcrypt.compare(data.password, user.passwordhash);
  if (!match) {
    return { msg: "E-mail e/ou senha errados.", status: false };
  }

  const payload = (Date.now() + Math.random()).toString();
  const token = await bcrypt.hash(payload, 10);

  user.token = token;
  await user.save();

  return { token, email: data.email, status: true };
};

export const validateSignup = async (reqValidation: Request) => {
  const errors = validationResult(reqValidation);

  if (!errors.isEmpty()) {
    return { msg: errors.mapped(), status: false };
  }

  const data = matchedData(reqValidation);

  // Verificando se email existe cadastrado
  const user = await User.findOne({
    email: data.email,
  });
  if (user) {
    return { msg: "E-mail já cadastrador.", status: false };
  }

  // Verficando se state realmente existe no cadastro
  if (mongoose.Types.ObjectId.isValid(data.state)) {
    const stateItem = await State.findById(data.state);
    if (!stateItem) {
      return { msg: "Estado não cadastrado.", status: false };
    }
  } else {
    return { msg: "Cógido de estado invalido.", status: false };
  }

  //Processo de criar o has da senha
  const passwordhash = await bcrypt.hash(data.password, 10);

  const payload = (Date.now() + Math.random()).toString();
  const token = await bcrypt.hash(payload, 10);

  const newUser = new User({
    name: data.name,
    email: data.email,
    passwordhash: passwordhash,
    token,
    state: data.state,
  });

  await newUser.save();

  return { token, status: true };
};
