import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sgar_units" DROP CONSTRAINT "sgar_units_application_process_id_media_id_fk";
  
  DROP INDEX "sgar_units_application_process_idx";
  ALTER TABLE "sgar_units_executive_board" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "sgar_units_executive_board" ADD COLUMN "telegram_username" varchar;
  ALTER TABLE "sgar_units_committees" ADD COLUMN "requirements" varchar;
  ALTER TABLE "sgar_units" ADD COLUMN "application_process" varchar;
  ALTER TABLE "sgar_units_executive_board" DROP COLUMN "contact";
  ALTER TABLE "sgar_units" DROP COLUMN "application_process_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sgar_units_executive_board" ADD COLUMN "contact" varchar NOT NULL;
  ALTER TABLE "sgar_units" ADD COLUMN "application_process_id" integer;
  ALTER TABLE "sgar_units" ADD CONSTRAINT "sgar_units_application_process_id_media_id_fk" FOREIGN KEY ("application_process_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sgar_units_application_process_idx" ON "sgar_units" USING btree ("application_process_id");
  ALTER TABLE "sgar_units_executive_board" DROP COLUMN "email";
  ALTER TABLE "sgar_units_executive_board" DROP COLUMN "telegram_username";
  ALTER TABLE "sgar_units_committees" DROP COLUMN "requirements";
  ALTER TABLE "sgar_units" DROP COLUMN "application_process";`)
}
