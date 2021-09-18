import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { SizeData } from "../types";

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  number!: number;

  @Column({ nullable: false })
  sechenye_zyl!: number;

  @Column({ nullable: false })
  number_of_zyl!: number;

  @Column({ nullable: false })
  max_diametr!: number;

  @Column({ nullable: false })
  massa!: number;

  @Column({ nullable: false })
  konstrukcya_zyli!: string;

  getDataForFront(): SizeData {
    return {
      id: this.id,
      number: this.number,
      sechenye_zyl: this.sechenye_zyl,
      number_of_zyl: this.number_of_zyl,
      max_diametr: this.max_diametr,
      massa: this.massa,
      konstrukcya_zyli: this.konstrukcya_zyli
    };
  }
}