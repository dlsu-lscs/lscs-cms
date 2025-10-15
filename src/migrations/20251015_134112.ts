import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lscs_articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "lscs_articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "lscs_articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "lscs_articles" ADD COLUMN "slug" varchar;
  ALTER TABLE "lscs_articles" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "_lscs_articles_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_lscs_articles_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_lscs_articles_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_lscs_articles_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_lscs_articles_v" ADD COLUMN "version_slug_lock" boolean DEFAULT true;
  ALTER TABLE "lscs_articles" ADD CONSTRAINT "lscs_articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v" ADD CONSTRAINT "_lscs_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lscs_articles_meta_meta_image_idx" ON "lscs_articles" USING btree ("meta_image_id");
  CREATE INDEX "lscs_articles_slug_idx" ON "lscs_articles" USING btree ("slug");
  CREATE INDEX "_lscs_articles_v_version_meta_version_meta_image_idx" ON "_lscs_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_lscs_articles_v_version_version_slug_idx" ON "_lscs_articles_v" USING btree ("version_slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lscs_articles" DROP CONSTRAINT "lscs_articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "_lscs_articles_v" DROP CONSTRAINT "_lscs_articles_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "lscs_articles_meta_meta_image_idx";
  DROP INDEX "lscs_articles_slug_idx";
  DROP INDEX "_lscs_articles_v_version_meta_version_meta_image_idx";
  DROP INDEX "_lscs_articles_v_version_version_slug_idx";
  ALTER TABLE "lscs_articles" DROP COLUMN "meta_title";
  ALTER TABLE "lscs_articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "lscs_articles" DROP COLUMN "meta_description";
  ALTER TABLE "lscs_articles" DROP COLUMN "slug";
  ALTER TABLE "lscs_articles" DROP COLUMN "slug_lock";
  ALTER TABLE "_lscs_articles_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_lscs_articles_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_lscs_articles_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_lscs_articles_v" DROP COLUMN "version_slug";
  ALTER TABLE "_lscs_articles_v" DROP COLUMN "version_slug_lock";`)
}
