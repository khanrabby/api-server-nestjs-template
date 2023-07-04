import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { TagEntity } from "./repository/tag.entity";
import { TagDatabase } from "./repository/tag.repository";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagService, TagController, TagDatabase],
  controllers: [TagController],
  exports: [TagController,TagService],
})
export class TagModule {}
