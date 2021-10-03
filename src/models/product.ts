import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany
} from "typeorm";
import { SubCategory } from ".";
import { ProductData } from "../types";
import { Size } from "./size";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

    @ManyToMany(() => SubCategory, subcategory => subcategory.products)
    subCategories!: SubCategory[];

    @Column({ nullable: true })
    image?: string;

    @Column({ nullable: false })
    naznachenye!: string;

    @Column({ nullable: false })
    construcya!: string;

    @Column({ nullable: false })
    th!: string;

    @Column({ nullable: false })
    expluatation!: string;

    @Column({ nullable: false })
    price!: number;

    @OneToMany(() => Size, size => size.product, {nullable: true})
    size?: Size[];

    getDataForFront(): ProductData {
        return {
            id: this.id,
            name: this.name,
            subCategories: this.subCategories,
            image: this.image,
            naznachenye: this.naznachenye,
            construcya: this.construcya,
            th: this.th,
            expluatation: this.expluatation,
            size: this.size?.map((item) => item.getDataForFront())
        };
    }
}