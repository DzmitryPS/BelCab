import { Secret } from "jsonwebtoken";
import { LazyRepository } from "../DataBaseService";
import { User } from "../models";
import {
    ExpressRequest,
    Handler,
    api,
    verify,
    ApiRequest
} from "../Handler";;
import { Record, String, Static } from "runtypes";
import { RequestHandlingError } from "../RequestHandlingError";
import { signSession } from "../extensions/session";

const AuthRequestRunType = Record({
    name: String,
    password: String,
});

type AuthRequestType = Static<typeof AuthRequestRunType>;

interface AuthResponse {
    authorized: boolean;
    token?: string;
}

export async function authorizationRequest(
    request: ApiRequest<AuthRequestType>,
    jwtSecret: Secret,
    users: LazyRepository<User>
): Promise<AuthResponse> {
    const { name, password } = request.data;

    const user = await users().findOne({ name });
    if (!user) {
        throw new RequestHandlingError("User with this email not exist", 404);
    }
    if (user.password == password) {
        return {
            authorized: true,
            token: signSession(jwtSecret, { id: user.id, isAdmin: user.isAdmin }),
        };
    }
    throw new RequestHandlingError("wrong password", 400);
}

export function authorizationHandler(
    jwtSecret: Secret,
    users: LazyRepository<User>
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await authorizationRequest(
                    verify(AuthRequestRunType, localRequest),
                    jwtSecret,
                    users
                )
        );
}