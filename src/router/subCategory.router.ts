import {
    Record,
    String,
    Static
} from "runtypes";
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
    authorized,
    session
} from "../extensions/session";
import { Secret } from "jsonwebtoken";
import { DataBaseService } from "../DataBaseService";
import { SubCategoryData } from "../types";
import { RequestHandlingError } from "../RequestHandlingError";
import { DeleteResult } from "typeorm";
import { SubCategory } from "../models";

export const subCategoryCreateTypeRuntype = Record({
    name: String,
    categoryId: String
});

export type SubCategoryCreateType = Static<typeof subCategoryCreateTypeRuntype>

export async function createSubCategoryRequest(
    request: ParsedHttpAndSession & ApiRequest<SubCategoryCreateType>,
    dataBaseService: DataBaseService
): Promise<SubCategoryData> {
    const currentCategory = await dataBaseService.categories().findOne({ id: Number(request.data.categoryId) });

    if (!currentCategory) {
        throw new RequestHandlingError("Category by this id not found", 404);
    }
    return await dataBaseService.subCategories().save({
        name: request.data.name,
        category: currentCategory
    });
}

export function createSubCategoryHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await createSubCategoryRequest(
                    verify(
                        subCategoryCreateTypeRuntype,
                        authorized(session(jwtSecret, parseHttp(localRequest)), true)
                    ),
                    dataBaseService
                )
        );
}

export async function deleteSubCategoryRequest(
    request: ParsedHttpAndSession,
    dataBaseService: DataBaseService
): Promise<DeleteResult> {
    const currentSubCategory = await dataBaseService.subCategories()
        .createQueryBuilder("subcategory")
        .where("subcategory.id = :id", { id: request.params.id })
        .getOne();
    if (!currentSubCategory) {
        throw new RequestHandlingError("SubCategory by this id not found", 404);
    }
    return await dataBaseService
        .subCategories()
        .createQueryBuilder()
        .delete()
        .from(SubCategory)
        .where("id = :id", { id: request.params.id })
        .execute()
}

export function deleteSubCategoryHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await deleteSubCategoryRequest(
                    authorized(session(jwtSecret, parseHttp(localRequest)), true),
                    dataBaseService
                )
        );
}

export async function getSubCategoryByIdRequest(
    request: ParsedHttpRequest,
    dataBaseService: DataBaseService
): Promise<SubCategory> {
    const dataToReturn = await dataBaseService.subCategories()
        .createQueryBuilder("subcategory")
        .leftJoinAndSelect("subcategory.products", "products")
        .where("subcategory.id = :id", { id: request.params.id })
        .getOne();
    if (!dataToReturn) {
        throw new RequestHandlingError("SubCategory by this id not found", 404);
    }
    return dataToReturn;
}

export function getSubCategoryByIdHandler(
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await getSubCategoryByIdRequest(
                    parseHttp(localRequest),
                    dataBaseService
                )
        );
}