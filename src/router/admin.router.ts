import { Secret } from "jsonwebtoken";
import { DataBaseService, LazyRepository } from "../DataBaseService";
import { User } from "../models";
import {
    ExpressRequest,
    Handler,
    api,
    parseHttp,
    ParsedHttpAndSession,
    ApiRequest,
    verify
} from "../Handler";
import {
    authorized,
    session,
    ValidSessionRequest,
} from "../extensions/session";
import { UserData } from "../types";
import { RequestHandlingError } from "../RequestHandlingError";
import { Record, String, Static, Boolean } from "runtypes";
import { UpdateResult } from "typeorm";

export async function getAllClientsRequest(
    request: ValidSessionRequest,
    users: LazyRepository<User>
): Promise<UserData[]> {
   const allUsers = await users().find();
   return allUsers.map((item) => item.getDataForFront())
}

export function getAllClientsHandler(
    jwtSecret: Secret,
    users: LazyRepository<User>
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await getAllClientsRequest(
                    authorized(session(jwtSecret, parseHttp(localRequest)), true),
                    users
                )
        );
}

export async function getClientByIdRequest(
    request: ParsedHttpAndSession,
    dataBaseService: DataBaseService
): Promise<UserData>{
 const userId = request.params.clientId ?? "";
 const user = await dataBaseService.users().findOne({id: Number(userId)});
 if (user){
     return user.getDataForFront()
 }
 throw new RequestHandlingError("Client not found", 400);
}

export function getClientByIdHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void>{
    return async (request) =>
    api(
      request,
      async (localRequest) =>
        await getClientByIdRequest(
          authorized(session(jwtSecret, parseHttp(localRequest)), true),
          dataBaseService
        )
    );
}

export const clientUpdateTypeRuntype = Record({
    isSubscribed: Boolean
});

export type ClientUpdateType = Static<typeof clientUpdateTypeRuntype>;

export async function updateClientByIdRequest(
    request: ParsedHttpAndSession & ApiRequest<ClientUpdateType>,
    dataBaseService: DataBaseService
): Promise<UpdateResult>{
    const clientId = request.params.clientId ?? "";
 const currentClient = await dataBaseService.users().findOne({id: Number(clientId)});
 if (currentClient) {
  return await dataBaseService
  .users()
  .createQueryBuilder()
  .update(User)
  .set({
      ...currentClient,
      isSubscribed: request.data.isSubscribed
  })
  .where("id = :id", { id: Number(clientId)})
  .execute();
 }
 throw new RequestHandlingError("Client not found", 400);
}

export function updateClientByIdHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService 
): Handler<ExpressRequest, void>{
  return async (request) =>
    api(
      request,
      async (localRequest) =>
        await updateClientByIdRequest(
          verify(
            clientUpdateTypeRuntype,
            authorized(session(jwtSecret, parseHttp(localRequest)))
          ),
          dataBaseService
        )
    );
}