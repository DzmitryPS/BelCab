import { ConnectionOptions } from "typeorm";
import { User, Product, Size, Category, SubCategory } from "../models";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "belcabel",
  entities: [User, Product, Size, Category, SubCategory],
  synchronize: true,
};

export default config;