import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "lscs_testimony" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"testimony" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"id_number" varchar NOT NULL,
  	"position" varchar,
  	"committee" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_archerbytes_article_category_fk";
  
  DROP INDEX "lscs_articles_texts_order_parent_idx";
  DROP INDEX "_lscs_articles_v_texts_order_parent_idx";
  DROP INDEX "archerbytes_articles_texts_order_parent_idx";
  DROP INDEX "_archerbytes_articles_v_texts_order_parent_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lscs_testimony_id" integer;
  ALTER TABLE "lscs_testimony" ADD CONSTRAINT "lscs_testimony_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lscs_testimony_image_idx" ON "lscs_testimony" USING btree ("image_id");
  CREATE INDEX "lscs_testimony_updated_at_idx" ON "lscs_testimony" USING btree ("updated_at");
  CREATE INDEX "lscs_testimony_created_at_idx" ON "lscs_testimony" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archerbytes_article_categor_fk" FOREIGN KEY ("archerbytes_article_category_id") REFERENCES "public"."archerbytes_article_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_testimony_fk" FOREIGN KEY ("lscs_testimony_id") REFERENCES "public"."lscs_testimony"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lscs_articles_texts_order_parent" ON "lscs_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_lscs_articles_v_texts_order_parent" ON "_lscs_articles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "archerbytes_articles_texts_order_parent" ON "archerbytes_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_archerbytes_articles_v_texts_order_parent" ON "_archerbytes_articles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_testimony_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_testimony_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lscs_testimony" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lscs_testimony" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_archerbytes_article_categor_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lscs_testimony_fk";
  
  DROP INDEX "lscs_articles_texts_order_parent";
  DROP INDEX "_lscs_articles_v_texts_order_parent";
  DROP INDEX "archerbytes_articles_texts_order_parent";
  DROP INDEX "_archerbytes_articles_v_texts_order_parent";
  DROP INDEX "payload_locked_documents_rels_lscs_testimony_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archerbytes_article_category_fk" FOREIGN KEY ("archerbytes_article_category_id") REFERENCES "public"."archerbytes_article_category"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lscs_articles_texts_order_parent_idx" ON "lscs_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_lscs_articles_v_texts_order_parent_idx" ON "_lscs_articles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "archerbytes_articles_texts_order_parent_idx" ON "archerbytes_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_archerbytes_articles_v_texts_order_parent_idx" ON "_archerbytes_articles_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lscs_testimony_id";`)
}
