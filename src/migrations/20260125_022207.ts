import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sgar_units_committees_position_status" AS ENUM('open', 'closed');
  CREATE TABLE "sgar_units_executive_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telegram_username" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "sgar_units_committees_position" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position_name" varchar NOT NULL,
  	"status" "enum_sgar_units_committees_position_status" NOT NULL
  );
  
  CREATE TABLE "sgar_units_committees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"committee_name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"requirements" varchar
  );
  
  CREATE TABLE "sgar_units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"cluster_id" integer,
  	"description" varchar NOT NULL,
  	"form_link" varchar NOT NULL,
  	"logo_id" integer,
  	"main_pub_id" integer,
  	"org_chart_id" integer,
  	"application_process" varchar,
  	"application_timeline" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_clusters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cluster_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sgar_units_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sgar_clusters_id" integer;
  ALTER TABLE "sgar_units_executive_board" ADD CONSTRAINT "sgar_units_executive_board_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_units_executive_board" ADD CONSTRAINT "sgar_units_executive_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sgar_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sgar_units_committees_position" ADD CONSTRAINT "sgar_units_committees_position_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sgar_units_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sgar_units_committees" ADD CONSTRAINT "sgar_units_committees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sgar_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_cluster_id_sgar_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."sgar_clusters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_main_pub_id_media_id_fk" FOREIGN KEY ("main_pub_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_org_chart_id_media_id_fk" FOREIGN KEY ("org_chart_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sgar_units_executive_board_order_idx" ON "sgar_units_executive_board" USING btree ("_order");
  CREATE INDEX "sgar_units_executive_board_parent_id_idx" ON "sgar_units_executive_board" USING btree ("_parent_id");
  CREATE INDEX "sgar_units_executive_board_photo_idx" ON "sgar_units_executive_board" USING btree ("photo_id");
  CREATE INDEX "sgar_units_committees_position_order_idx" ON "sgar_units_committees_position" USING btree ("_order");
  CREATE INDEX "sgar_units_committees_position_parent_id_idx" ON "sgar_units_committees_position" USING btree ("_parent_id");
  CREATE INDEX "sgar_units_committees_order_idx" ON "sgar_units_committees" USING btree ("_order");
  CREATE INDEX "sgar_units_committees_parent_id_idx" ON "sgar_units_committees" USING btree ("_parent_id");
  CREATE INDEX "sgar_units_cluster_idx" ON "sgar_units" USING btree ("cluster_id");
  CREATE INDEX "sgar_units_logo_idx" ON "sgar_units" USING btree ("logo_id");
  CREATE INDEX "sgar_units_main_pub_idx" ON "sgar_units" USING btree ("main_pub_id");
  CREATE INDEX "sgar_units_org_chart_idx" ON "sgar_units" USING btree ("org_chart_id");
  CREATE INDEX "sgar_units_updated_at_idx" ON "sgar_units" USING btree ("updated_at");
  CREATE INDEX "sgar_units_created_at_idx" ON "sgar_units" USING btree ("created_at");
  CREATE INDEX "sgar_clusters_updated_at_idx" ON "sgar_clusters" USING btree ("updated_at");
  CREATE INDEX "sgar_clusters_created_at_idx" ON "sgar_clusters" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_units_fk" FOREIGN KEY ("sgar_units_id") REFERENCES "public"."sgar_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_clusters_fk" FOREIGN KEY ("sgar_clusters_id") REFERENCES "public"."sgar_clusters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sgar_units_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_units_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_clusters_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_clusters_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sgar_units_executive_board" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sgar_units_committees_position" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sgar_units_committees" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sgar_units" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sgar_clusters" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sgar_units_executive_board" CASCADE;
  DROP TABLE "sgar_units_committees_position" CASCADE;
  DROP TABLE "sgar_units_committees" CASCADE;
  DROP TABLE "sgar_units" CASCADE;
  DROP TABLE "sgar_clusters" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sgar_units_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sgar_clusters_fk";
  
  DROP INDEX "payload_locked_documents_rels_sgar_units_id_idx";
  DROP INDEX "payload_locked_documents_rels_sgar_clusters_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sgar_units_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sgar_clusters_id";
  DROP TYPE "public"."enum_sgar_units_committees_position_status";`)
}
