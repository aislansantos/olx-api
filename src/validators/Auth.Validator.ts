import { checkSchema } from "express-validator";

export const AuthValidator = {
  signup: checkSchema({
    name: {
      trim: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Nome precisa ter pelo menos doi caracteres.",
    },
    email: {
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "Email inválido",
    },
    password: {
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Senha precisa de pelo menos 2 caracteres.",
    },
    state: {
        notEmpty: true,
        errorMessage: "Estado não preenchido."
    },
  }),
};
