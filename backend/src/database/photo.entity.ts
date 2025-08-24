import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Photo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "longblob" }) // Görseli binary kaydediyoruz
    data!: Buffer;

    @Column()
    mimeType!: string;

    @Column({ default: false })
    isShared!: boolean

    @Column({ default: false })
    shared!: boolean;
}
