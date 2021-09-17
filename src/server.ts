import { DataBaseService, LazyRepository } from "./DataBaseService";
import dotenv from "dotenv";
dotenv.config();

import { WebServer } from "./WebServer";
import dbConfig from "./config/database";
import { User } from "./models";
import { getAllClientsHandler, getClientByIdHandler, updateClientByIdHandler } from "./router/admin.router";
import { randomBytes } from "crypto";
import { authorizationHandler } from "./router/auth.router";

const server = new WebServer();
const dataBaseService = new DataBaseService(dbConfig);
const jwtSecret = randomBytes(32).toString("hex");

server.addHandler("POST", "/api/auth", authorizationHandler(jwtSecret, dataBaseService.users));

server.addHandler("GET", "/api/admin/clients", getAllClientsHandler(jwtSecret, dataBaseService.users));
server.addHandler("GET", "/api/admin/client/:clientId", getClientByIdHandler(jwtSecret, dataBaseService));
server.addHandler("PATCH", "/api/admin/client/:clientId", updateClientByIdHandler(jwtSecret, dataBaseService));

async function initDedaults(
  users: LazyRepository<User>
): Promise<void> {
  if (!(await users().findOne({ name: "admin" }))) {
    users().save({
      name: "admin",
      email: "admin",
      isAdmin: true,
      password: <string>process.env.ADMINPASSWORD  || "1234"
    });
  }
  return;
}


(async () => {
    await dataBaseService.connect();
    await initDedaults(dataBaseService.users);
    server.startServer(parseInt(<string>process.env.PORT) || 7000);
    console.info(
      "Server started on port " + (parseInt(<string>process.env.PORT) || 7000)
    );
  })().catch((error) => {
    console.error(error);
  });