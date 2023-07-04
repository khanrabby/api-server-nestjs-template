import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "tags" })
export class TagEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: "userId" })
  public userId: string;

  @Column({ name: "companyId" })
  public companyId: string;

  @Column({ name: "title" })
  public title: string;

  @Column({ name: "status" })
  public status: Boolean;

  @Column({ name: "count", default: 0 })
  public count?: number;

  @Column({ type: "timestamp", name: "createdAt" })
  public createdAt: Date;
}
