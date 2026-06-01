import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_api_keys_collections_collection" AS ENUM('users', 'accounts', 'media', 'lscs-article-category', 'lscs-articles', 'lscs-article-authors', 'lscs-partners', 'lscs-awards', 'lscs-web-assets', 'archerbytes-article-category', 'archerbytes-articles', 'sgar-units', 'sgar-clusters', 'lscs-testimony');
  CREATE TABLE "api_keys_collections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"collection" "enum_api_keys_collections_collection"
  );
  
  CREATE TABLE "api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "accounts" ADD COLUMN "refresh_token" varchar;
  ALTER TABLE "accounts" ADD COLUMN "expires_in" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "api_keys_id" integer;
  ALTER TABLE "api_keys_collections" ADD CONSTRAINT "api_keys_collections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "api_keys_collections_order_idx" ON "api_keys_collections" USING btree ("_order");
  CREATE INDEX "api_keys_collections_parent_id_idx" ON "api_keys_collections" USING btree ("_parent_id");
  CREATE INDEX "api_keys_updated_at_idx" ON "api_keys" USING btree ("updated_at");
  CREATE INDEX "api_keys_created_at_idx" ON "api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_keys_fk" FOREIGN KEY ("api_keys_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("api_keys_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "api_keys_collections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "api_keys" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "api_keys_collections" CASCADE;
  DROP TABLE "api_keys" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_api_keys_fk";
  
  DROP INDEX "payload_locked_documents_rels_api_keys_id_idx";
  ALTER TABLE "accounts" DROP COLUMN "refresh_token";
  ALTER TABLE "accounts" DROP COLUMN "expires_in";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "api_keys_id";
  DROP TYPE "public"."enum_api_keys_collections_collection";`)
}
