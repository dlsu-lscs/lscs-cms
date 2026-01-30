import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "lscs_partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lscs_awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"award_name" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"project_name" varchar NOT NULL,
  	"rank" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lscs_web_assets_about_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "lscs_web_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Website Assets' NOT NULL,
  	"hero_image_id" integer,
  	"who_are_we_image_id" integer,
  	"what_we_do_image1_id" integer,
  	"what_we_do_image2_id" integer,
  	"what_we_do_image3_id" integer,
  	"what_we_do_image4_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lscs_partners_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lscs_awards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lscs_web_assets_id" integer;
  ALTER TABLE "lscs_partners" ADD CONSTRAINT "lscs_partners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets_about_images" ADD CONSTRAINT "lscs_web_assets_about_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets_about_images" ADD CONSTRAINT "lscs_web_assets_about_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lscs_web_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_who_are_we_image_id_media_id_fk" FOREIGN KEY ("who_are_we_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_what_we_do_image1_id_media_id_fk" FOREIGN KEY ("what_we_do_image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_what_we_do_image2_id_media_id_fk" FOREIGN KEY ("what_we_do_image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_what_we_do_image3_id_media_id_fk" FOREIGN KEY ("what_we_do_image3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_web_assets" ADD CONSTRAINT "lscs_web_assets_what_we_do_image4_id_media_id_fk" FOREIGN KEY ("what_we_do_image4_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lscs_partners_image_idx" ON "lscs_partners" USING btree ("image_id");
  CREATE INDEX "lscs_partners_updated_at_idx" ON "lscs_partners" USING btree ("updated_at");
  CREATE INDEX "lscs_partners_created_at_idx" ON "lscs_partners" USING btree ("created_at");
  CREATE INDEX "lscs_awards_updated_at_idx" ON "lscs_awards" USING btree ("updated_at");
  CREATE INDEX "lscs_awards_created_at_idx" ON "lscs_awards" USING btree ("created_at");
  CREATE INDEX "lscs_web_assets_about_images_order_idx" ON "lscs_web_assets_about_images" USING btree ("_order");
  CREATE INDEX "lscs_web_assets_about_images_parent_id_idx" ON "lscs_web_assets_about_images" USING btree ("_parent_id");
  CREATE INDEX "lscs_web_assets_about_images_image_idx" ON "lscs_web_assets_about_images" USING btree ("image_id");
  CREATE INDEX "lscs_web_assets_hero_hero_image_idx" ON "lscs_web_assets" USING btree ("hero_image_id");
  CREATE INDEX "lscs_web_assets_who_are_we_who_are_we_image_idx" ON "lscs_web_assets" USING btree ("who_are_we_image_id");
  CREATE INDEX "lscs_web_assets_what_we_do_what_we_do_image1_idx" ON "lscs_web_assets" USING btree ("what_we_do_image1_id");
  CREATE INDEX "lscs_web_assets_what_we_do_what_we_do_image2_idx" ON "lscs_web_assets" USING btree ("what_we_do_image2_id");
  CREATE INDEX "lscs_web_assets_what_we_do_what_we_do_image3_idx" ON "lscs_web_assets" USING btree ("what_we_do_image3_id");
  CREATE INDEX "lscs_web_assets_what_we_do_what_we_do_image4_idx" ON "lscs_web_assets" USING btree ("what_we_do_image4_id");
  CREATE INDEX "lscs_web_assets_updated_at_idx" ON "lscs_web_assets" USING btree ("updated_at");
  CREATE INDEX "lscs_web_assets_created_at_idx" ON "lscs_web_assets" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_partners_fk" FOREIGN KEY ("lscs_partners_id") REFERENCES "public"."lscs_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_awards_fk" FOREIGN KEY ("lscs_awards_id") REFERENCES "public"."lscs_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_web_assets_fk" FOREIGN KEY ("lscs_web_assets_id") REFERENCES "public"."lscs_web_assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_lscs_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_partners_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_awards_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_web_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_web_assets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lscs_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lscs_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lscs_web_assets_about_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lscs_web_assets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lscs_partners" CASCADE;
  DROP TABLE "lscs_awards" CASCADE;
  DROP TABLE "lscs_web_assets_about_images" CASCADE;
  DROP TABLE "lscs_web_assets" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lscs_partners_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lscs_awards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lscs_web_assets_fk";
  
  DROP INDEX "payload_locked_documents_rels_lscs_partners_id_idx";
  DROP INDEX "payload_locked_documents_rels_lscs_awards_id_idx";
  DROP INDEX "payload_locked_documents_rels_lscs_web_assets_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lscs_partners_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lscs_awards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lscs_web_assets_id";`)
}
