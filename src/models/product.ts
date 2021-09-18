import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn
} from "typeorm";
import { ProductData } from "../types";
import { Size } from "./size";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

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

    @OneToOne(() => Size)
    @JoinColumn()
    size!: Size;

    getDataForFront(): ProductData {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            naznachenye: this.naznachenye,
            construcya: this.construcya,
            th: this.th,
            expluatation: this.expluatation,
            size: this.size.getDataForFront()
        };
    }
}