import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_domain" AS ENUM('lscs', 'global', 'test');
  ALTER TABLE "users" ADD COLUMN "domain" "enum_users_domain" DEFAULT 'global' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "domain";
  DROP TYPE "public"."enum_users_domain";`)
}
