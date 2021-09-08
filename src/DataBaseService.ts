import {
    Connection,
    ConnectionOptions,
    getConnectionManager,
    Repository,
  } from "typeorm";
  import { User } from "./models/user";
  
  export type LazyRepository<T> = () => Repository<T>;
  
  export class DataBaseService {
    public readonly connection: Connection;
  
    public readonly users: LazyRepository<User> = () =>
      this.connection.getRepository(User);
  
    constructor(options: ConnectionOptions) {
      this.connection = getConnectionManager().create(options);
    }
  
    async connect(): Promise<void> {
      await this.connection.connect();
    }
  }
  