import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Product } from ".";
import { SizeData } from "../types";

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, product => product.size)
  product!: Product

  @Column({ nullable: false })
  number!: number;

  @Column({ nullable: false })
  sechenye_zyl!: number;

  @Column({ nullable: false })
  number_of_zyl!: number;

  @Column({ nullable: true })
  max_diametr?: number;

  @Column({ nullable: true })
  massa?: number;

  @Column({ nullable: true })
  konstrukcya_zyli?: string;

  getDataForFront(): SizeData {
    return {
      id: this.id,
      product: this.product,
      number: this.number,
      sechenye_zyl: this.sechenye_zyl,
      number_of_zyl: this.number_of_zyl,
      max_diametr: this.max_diametr,
      massa: this.massa,
      konstrukcya_zyli: this.konstrukcya_zyli
    };
  }
}