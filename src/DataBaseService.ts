import {
  Connection,
  ConnectionOptions,
  getConnectionManager,
  Repository,
} from "typeorm";
import { Product } from "./models/product";
import { Category } from "./models/category";
import { Size } from "./models/size";
import { SubCategory } from "./models/subCategory";
import { User } from "./models/user";

export type LazyRepository<T> = () => Repository<T>;

export class DataBaseService {
  public readonly connection: Connection;

  public readonly users: LazyRepository<User> = () =>
    this.connection.getRepository(User);

  public readonly products: LazyRepository<Product> = () =>
    this.connection.getRepository(Product);

  public readonly sizes: LazyRepository<Size> = () =>
    this.connection.getRepository(Size);

  public readonly categories: LazyRepository<Category> = () =>
    this.connection.getRepository(Category);
  
  public readonly subCategories: LazyRepository<SubCategory> = () =>
    this.connection.getRepository(SubCategory);

  constructor(options: ConnectionOptions) {
    this.connection = getConnectionManager().create(options);
  }

  async connect(): Promise<void> {
    await this.connection.connect();
  }
}
