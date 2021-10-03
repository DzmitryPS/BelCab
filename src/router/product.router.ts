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
    Number as NumberRT,
    Array
} from "runtypes";
import {
    authorized,
    session
} from "../extensions/session";
import { ProductData } from "../types";
import { RequestHandlingError } from "../RequestHandlingError";
import { Product } from "src/models";

const singleSize = Record({
    number: String,
    sechenye_zyl: String,
    number_of_zyl: NumberRT,
    max_diametr: Optional(NumberRT),
    massa: Optional(NumberRT),
    konstrukcya_zyli: Optional(String)
});

export const productCreateTyperuntype = Record({
    name: String,
    subCategoryId: String,
    image: Optional(String),
    naznachenye: String,
    construcya: String,
    th: String,
    expluatation: String,
    price: NumberRT,
    sizes: Optional(Array(singleSize))
});
export type ProductCreateType = Static<typeof productCreateTyperuntype>;

export async function createProductRequest(
    request: ParsedHttpAndSession & ApiRequest<ProductCreateType>,
    dataBaseService: DataBaseService
): Promise<ProductData> {
    const data = request.data;
    const currentSubCategory = await dataBaseService.subCategories().findOne({ id: Number(data.subCategoryId) });
    if (!currentSubCategory) {
        throw new RequestHandlingError("SubCategory by this id not found", 404);
    }
    const currentProduct: Product = await dataBaseService.products().save({
        name: data.name,
        subCategories: [currentSubCategory],
        image: data.image,
        naznachenye: data.naznachenye,
        construcya: data.construcya,
        th: data.th,
        expluatation: data.expluatation,
        price: data.price
    });

    if (data.sizes) {
        await Promise.all(
            data.sizes.map(async (size) => {
                await dataBaseService.sizes().save({
                    product: currentProduct,
                    number: size.number,
                    sechenye_zyl: size.sechenye_zyl,
                    number_of_zyl: size.number_of_zyl,
                    max_diametr: size.max_diametr,
                    massa: size.massa,
                    konstrukcya_zyli: size.konstrukcya_zyli
                } as any);
            })
        )
    }
    return currentProduct;
}

export function createProductHandler(
    jwtSecret: Secret,
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await createProductRequest(
                    verify(
                        productCreateTyperuntype,
                        authorized(session(jwtSecret, parseHttp(localRequest)), true)
                    ),
                    dataBaseService
                )
        );
}

export async function getProductByIdRequest(
    request: ParsedHttpRequest,
    dataBaseService: DataBaseService
): Promise<ProductData> {
    const productId = request.params.id;

    const product = await dataBaseService.products()
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subCategories", "subCategories")
        .leftJoinAndSelect("product.size", "size")
        .leftJoinAndSelect("subCategories.category", "category")
        .where("product.id = :id", { id: productId })
        .getOne()

    if (!product) {
        throw new RequestHandlingError("Product by this id not found", 404);
    }
    return product
}

export function getProductByIdHandler(
    dataBaseService: DataBaseService
): Handler<ExpressRequest, void> {
    return async (request) =>
        api(
            request,
            async (localRequest) =>
                await getProductByIdRequest(
                    parseHttp(localRequest),
                    dataBaseService
                )
        );
}