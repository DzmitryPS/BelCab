import { Secret } from "jsonwebtoken";
import { DataBaseService } from "../DataBaseService";
import {
    ExpressRequest,
    Handler,
    api,
    parseHttp,
    verify,
    ApiRequest,
    ParsedHttpAndSession,
    ParsedHttpRequest,
} from "../Handler";
import {
    Record,
    String,
    Static,
    Optional,
} from "runtypes";
import { CategoryData } from "../types";
import {
    authorized,
    session
} from "../extensions/session";
import { DeleteResult } from "typeorm";
import { RequestHandlingError } from "../RequestHandlingError";
import { Category } from "../models";

export const categoryCreateTypeRuntype = Record({
    name: Optional(String)
});
export type CategoryCreateType = Static<typeof categoryCreateTypeRuntype>

export async function createCategoryRequest(
    request: ParsedHttpAndSession & ApiRequest<CategoryCreateType>,
    dataBaseService: DataBaseService
): Promise<CategoryData> {

    return await dataBaseService.categories().save({
        name: request.data.name
    });
}

export function createCategoryHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await createCategoryRequest(
                    verify(
                        categoryCreateTypeRuntype,
                        authorized(session(jwtSecret, parseHttp(localRequest)), true)
                    ),
                    dataBaseService
                )
        );
}

export async function deleteCategoryRequest(
    request: ParsedHttpAndSession,
    dataBaseService: DataBaseService
): Promise<DeleteResult> {
    const currentCategory = await dataBaseService.categories()
        .createQueryBuilder("category")
        .where("category.id = :id", { id: request.params.id })
        .getOne();
    if (!currentCategory) {
        throw new RequestHandlingError("Category by this id not found", 404);
    }
    return await dataBaseService
        .categories()
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where("id = :id", { id: request.params.id })
        .execute()
}

export function deleteCategoryHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await deleteCategoryRequest(
                    authorized(session(jwtSecret, parseHttp(localRequest)), true),
                    dataBaseService
                )
        );
}

export async function getAllCategoriesRequest(
    request: ParsedHttpRequest,
    dataBaseService: DataBaseService
): Promise<Category[]> {
    const categories = await dataBaseService.categories()
        .createQueryBuilder("category")
        .leftJoinAndSelect("category.subCategories", "subCategories")
        .getMany()
    return categories
}

export function getAllCategoriesHandler(
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await getAllCategoriesRequest(
                    parseHttp(localRequest),
                    dataBaseService
                )
        );
}