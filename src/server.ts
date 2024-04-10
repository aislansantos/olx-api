import * as express from "express";
import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  json,
} from "express";
import * as path from "path";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as fileupload from "express-fileupload";
import { mongoConnect } from "@/instances/mongo";
import routes from "@/routes/routes";

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());

server.use(json());

server.use(express.static(path.join(__dirname, "../public")));
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());

server.use(routes);

server.use((req: Request, res: Response) => {
  res.status(404);
  res.json({ error: "Endpoint não encontrado." });
});

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(400); // Bad Request
  console.log(err);
  res.json({ error: "Ocorreu algum erro." });
};
server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log("Rodando na porta 3000");
});
