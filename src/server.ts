import { DataBaseService, LazyRepository } from "./DataBaseService";
import dotenv from "dotenv";
dotenv.config();

import { WebServer } from "./WebServer";
import dbConfig from "./config/database";
import { User } from "./models";
import { randomBytes } from "crypto";
import { authorizationHandler } from "./router/auth.router";
import { createCategoryHandler, deleteCategoryHandler, getAllCategoriesHandler } from "./router/category.router";
import { createSubCategoryHandler, deleteSubCategoryHandler, getSubCategoryByIdHandler } from "./router/subCategory.router";
import { createProductHandler, getProductByIdHandler } from "./router/product.router";

const server = new WebServer();
const dataBaseService = new DataBaseService(dbConfig);
const jwtSecret = randomBytes(32).toString("hex");

server.addHandler("POST", "/api/auth", authorizationHandler(jwtSecret, dataBaseService.users));

server.addHandler("POST", "/api/admin/category", createCategoryHandler(jwtSecret, dataBaseService));
server.addHandler("DELETE", "/api/admin/category/:id", deleteCategoryHandler(jwtSecret, dataBaseService));
server.addHandler("GET", "/api/categories", getAllCategoriesHandler(dataBaseService));
//category by id with products

server.addHandler("POST", "/api/admin/subcategory", createSubCategoryHandler(jwtSecret, dataBaseService));
server.addHandler("DELETE", "/api/admin/subcategory/:id", deleteSubCategoryHandler(jwtSecret, dataBaseService));
server.addHandler("GET", "/api/subcategory/:id", getSubCategoryByIdHandler(dataBaseService));

server.addHandler("POST", "/api/admin/product", createProductHandler(jwtSecret, dataBaseService));
server.addHandler("GET", "/api/product/:id", getProductByIdHandler(dataBaseService));

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
    server.startServer(parseInt(<string>process.env.PORT) || 5000);
    console.info(
      "Server started on port " + (parseInt(<string>process.env.PORT) || 5000)
    );
  })().catch((error) => {
    console.error(error);
  });