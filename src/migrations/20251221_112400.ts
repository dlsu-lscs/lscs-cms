import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_archerbytes_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__archerbytes_articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "archerbytes_article_category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "archerbytes_articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"featured_image_id" integer,
  	"content" jsonb,
  	"md_content" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"author_id" integer,
  	"category_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_archerbytes_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "archerbytes_articles_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_archerbytes_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_featured_image_id" integer,
  	"version_content" jsonb,
  	"version_md_content" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_author_id" integer,
  	"version_category_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__archerbytes_articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_archerbytes_articles_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "archerbytes_article_category_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "archerbytes_articles_id" integer;
  ALTER TABLE "archerbytes_articles" ADD CONSTRAINT "archerbytes_articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archerbytes_articles" ADD CONSTRAINT "archerbytes_articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archerbytes_articles" ADD CONSTRAINT "archerbytes_articles_author_id_lscs_article_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."lscs_article_authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archerbytes_articles" ADD CONSTRAINT "archerbytes_articles_category_id_archerbytes_article_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."archerbytes_article_category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archerbytes_articles_texts" ADD CONSTRAINT "archerbytes_articles_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."archerbytes_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v" ADD CONSTRAINT "_archerbytes_articles_v_parent_id_archerbytes_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."archerbytes_articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v" ADD CONSTRAINT "_archerbytes_articles_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v" ADD CONSTRAINT "_archerbytes_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v" ADD CONSTRAINT "_archerbytes_articles_v_version_author_id_lscs_article_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."lscs_article_authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v" ADD CONSTRAINT "_archerbytes_articles_v_version_category_id_archerbytes_article_category_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."archerbytes_article_category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archerbytes_articles_v_texts" ADD CONSTRAINT "_archerbytes_articles_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_archerbytes_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "archerbytes_article_category_updated_at_idx" ON "archerbytes_article_category" USING btree ("updated_at");
  CREATE INDEX "archerbytes_article_category_created_at_idx" ON "archerbytes_article_category" USING btree ("created_at");
  CREATE INDEX "archerbytes_articles_featured_image_idx" ON "archerbytes_articles" USING btree ("featured_image_id");
  CREATE INDEX "archerbytes_articles_meta_meta_image_idx" ON "archerbytes_articles" USING btree ("meta_image_id");
  CREATE INDEX "archerbytes_articles_author_idx" ON "archerbytes_articles" USING btree ("author_id");
  CREATE INDEX "archerbytes_articles_category_idx" ON "archerbytes_articles" USING btree ("category_id");
  CREATE INDEX "archerbytes_articles_slug_idx" ON "archerbytes_articles" USING btree ("slug");
  CREATE INDEX "archerbytes_articles_updated_at_idx" ON "archerbytes_articles" USING btree ("updated_at");
  CREATE INDEX "archerbytes_articles_created_at_idx" ON "archerbytes_articles" USING btree ("created_at");
  CREATE INDEX "archerbytes_articles__status_idx" ON "archerbytes_articles" USING btree ("_status");
  CREATE INDEX "archerbytes_articles_texts_order_parent_idx" ON "archerbytes_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_archerbytes_articles_v_parent_idx" ON "_archerbytes_articles_v" USING btree ("parent_id");
  CREATE INDEX "_archerbytes_articles_v_version_version_featured_image_idx" ON "_archerbytes_articles_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_archerbytes_articles_v_version_meta_version_meta_image_idx" ON "_archerbytes_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_archerbytes_articles_v_version_version_author_idx" ON "_archerbytes_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_archerbytes_articles_v_version_version_category_idx" ON "_archerbytes_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_archerbytes_articles_v_version_version_slug_idx" ON "_archerbytes_articles_v" USING btree ("version_slug");
  CREATE INDEX "_archerbytes_articles_v_version_version_updated_at_idx" ON "_archerbytes_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_archerbytes_articles_v_version_version_created_at_idx" ON "_archerbytes_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_archerbytes_articles_v_version_version__status_idx" ON "_archerbytes_articles_v" USING btree ("version__status");
  CREATE INDEX "_archerbytes_articles_v_created_at_idx" ON "_archerbytes_articles_v" USING btree ("created_at");
  CREATE INDEX "_archerbytes_articles_v_updated_at_idx" ON "_archerbytes_articles_v" USING btree ("updated_at");
  CREATE INDEX "_archerbytes_articles_v_latest_idx" ON "_archerbytes_articles_v" USING btree ("latest");
  CREATE INDEX "_archerbytes_articles_v_texts_order_parent_idx" ON "_archerbytes_articles_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archerbytes_article_category_fk" FOREIGN KEY ("archerbytes_article_category_id") REFERENCES "public"."archerbytes_article_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archerbytes_articles_fk" FOREIGN KEY ("archerbytes_articles_id") REFERENCES "public"."archerbytes_articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_archerbytes_article_catego_idx" ON "payload_locked_documents_rels" USING btree ("archerbytes_article_category_id");
  CREATE INDEX "payload_locked_documents_rels_archerbytes_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("archerbytes_articles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "archerbytes_article_category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "archerbytes_articles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "archerbytes_articles_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_archerbytes_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_archerbytes_articles_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "archerbytes_article_category" CASCADE;
  DROP TABLE "archerbytes_articles" CASCADE;
  DROP TABLE "archerbytes_articles_texts" CASCADE;
  DROP TABLE "_archerbytes_articles_v" CASCADE;
  DROP TABLE "_archerbytes_articles_v_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_archerbytes_article_category_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_archerbytes_articles_fk";
  
  DROP INDEX "payload_locked_documents_rels_archerbytes_article_catego_idx";
  DROP INDEX "payload_locked_documents_rels_archerbytes_articles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "archerbytes_article_category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "archerbytes_articles_id";
  DROP TYPE "public"."enum_archerbytes_articles_status";
  DROP TYPE "public"."enum__archerbytes_articles_v_version_status";`)
}
