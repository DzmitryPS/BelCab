import { DataBaseService } from "./DataBaseService";
import dotenv from "dotenv";
dotenv.config();

import { WebServer } from "./WebServer";
import dbConfig from "./config/database";

const server = new WebServer();
const dataBaseService = new DataBaseService(dbConfig);

(async () => {
    await dataBaseService.connect();
    server.startServer(parseInt(<string>process.env.PORT) || 7000);
    console.info(
      "Server started on port " + (parseInt(<string>process.env.PORT) || 7000)
    );
  })().catch((error) => {
    console.error(error);
  });