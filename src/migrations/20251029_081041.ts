import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "domain" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "domain" SET DEFAULT 'global'::text;
  DROP TYPE "public"."enum_users_domain";
  CREATE TYPE "public"."enum_users_domain" AS ENUM('lscs', 'global');
  ALTER TABLE "users" ALTER COLUMN "domain" SET DEFAULT 'global'::"public"."enum_users_domain";
  ALTER TABLE "users" ALTER COLUMN "domain" SET DATA TYPE "public"."enum_users_domain" USING "domain"::"public"."enum_users_domain";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_domain" ADD VALUE 'test';`)
}
