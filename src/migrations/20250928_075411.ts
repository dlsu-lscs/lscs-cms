import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sgar_clusters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cluster_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "sgar_units" ADD COLUMN "cluster_id" integer;
  ALTER TABLE "sgar_units" ADD COLUMN "org_chart_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sgar_clusters_id" integer;
  CREATE INDEX "sgar_clusters_updated_at_idx" ON "sgar_clusters" USING btree ("updated_at");
  CREATE INDEX "sgar_clusters_created_at_idx" ON "sgar_clusters" USING btree ("created_at");
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_cluster_id_sgar_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."sgar_clusters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_org_chart_id_media_id_fk" FOREIGN KEY ("org_chart_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_clusters_fk" FOREIGN KEY ("sgar_clusters_id") REFERENCES "public"."sgar_clusters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sgar_units_cluster_idx" ON "sgar_units" USING btree ("cluster_id");
  CREATE INDEX "sgar_units_org_chart_idx" ON "sgar_units" USING btree ("org_chart_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_clusters_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_clusters_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sgar_clusters" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sgar_clusters" CASCADE;
  ALTER TABLE "sgar_units" DROP CONSTRAINT "sgar_units_cluster_id_sgar_clusters_id_fk";
  
  ALTER TABLE "sgar_units" DROP CONSTRAINT "sgar_units_org_chart_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sgar_clusters_fk";
  
  DROP INDEX "sgar_units_cluster_idx";
  DROP INDEX "sgar_units_org_chart_idx";
  DROP INDEX "payload_locked_documents_rels_sgar_clusters_id_idx";
  ALTER TABLE "sgar_units" DROP COLUMN "cluster_id";
  ALTER TABLE "sgar_units" DROP COLUMN "org_chart_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sgar_clusters_id";`)
}
