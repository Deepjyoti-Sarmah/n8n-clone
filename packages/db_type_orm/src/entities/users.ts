import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ length: 32 })
  name!: string;

  @Column({ type: String })
  password!: string;
}
