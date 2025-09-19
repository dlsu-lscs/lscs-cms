import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_sgar_positions_status" AS ENUM('open', 'closed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'viewer' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"cover_image_id" integer,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_name" varchar NOT NULL,
  	"acronym" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"form_link" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_exec_board" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL,
  	"full_name" varchar NOT NULL,
  	"contact" varchar NOT NULL,
  	"photo_id" integer,
  	"position_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sgar_unit_id" integer NOT NULL,
  	"logo_id" integer,
  	"main_pub_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_positions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"position" varchar NOT NULL,
  	"status" "enum_sgar_positions_status" NOT NULL,
  	"application_process" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"committee_name" varchar NOT NULL,
  	"unit_id" integer NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sgar_committees_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sgar_positions_id" integer
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"sgar_units_id" integer,
  	"sgar_exec_board_id" integer,
  	"sgar_media_id" integer,
  	"sgar_positions_id" integer,
  	"sgar_committees_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_exec_board" ADD CONSTRAINT "sgar_exec_board_unit_id_sgar_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."sgar_units"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_exec_board" ADD CONSTRAINT "sgar_exec_board_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_exec_board" ADD CONSTRAINT "sgar_exec_board_position_id_sgar_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."sgar_positions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_media" ADD CONSTRAINT "sgar_media_sgar_unit_id_sgar_units_id_fk" FOREIGN KEY ("sgar_unit_id") REFERENCES "public"."sgar_units"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_media" ADD CONSTRAINT "sgar_media_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_media" ADD CONSTRAINT "sgar_media_main_pub_id_media_id_fk" FOREIGN KEY ("main_pub_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_committees" ADD CONSTRAINT "sgar_committees_unit_id_sgar_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."sgar_units"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sgar_committees_rels" ADD CONSTRAINT "sgar_committees_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sgar_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sgar_committees_rels" ADD CONSTRAINT "sgar_committees_rels_sgar_positions_fk" FOREIGN KEY ("sgar_positions_id") REFERENCES "public"."sgar_positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_units_fk" FOREIGN KEY ("sgar_units_id") REFERENCES "public"."sgar_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_exec_board_fk" FOREIGN KEY ("sgar_exec_board_id") REFERENCES "public"."sgar_exec_board"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_media_fk" FOREIGN KEY ("sgar_media_id") REFERENCES "public"."sgar_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_positions_fk" FOREIGN KEY ("sgar_positions_id") REFERENCES "public"."sgar_positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sgar_committees_fk" FOREIGN KEY ("sgar_committees_id") REFERENCES "public"."sgar_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "sgar_units_updated_at_idx" ON "sgar_units" USING btree ("updated_at");
  CREATE INDEX "sgar_units_created_at_idx" ON "sgar_units" USING btree ("created_at");
  CREATE INDEX "sgar_exec_board_unit_idx" ON "sgar_exec_board" USING btree ("unit_id");
  CREATE INDEX "sgar_exec_board_photo_idx" ON "sgar_exec_board" USING btree ("photo_id");
  CREATE INDEX "sgar_exec_board_position_idx" ON "sgar_exec_board" USING btree ("position_id");
  CREATE INDEX "sgar_exec_board_updated_at_idx" ON "sgar_exec_board" USING btree ("updated_at");
  CREATE INDEX "sgar_exec_board_created_at_idx" ON "sgar_exec_board" USING btree ("created_at");
  CREATE UNIQUE INDEX "sgar_media_sgar_unit_idx" ON "sgar_media" USING btree ("sgar_unit_id");
  CREATE INDEX "sgar_media_logo_idx" ON "sgar_media" USING btree ("logo_id");
  CREATE INDEX "sgar_media_main_pub_idx" ON "sgar_media" USING btree ("main_pub_id");
  CREATE INDEX "sgar_media_updated_at_idx" ON "sgar_media" USING btree ("updated_at");
  CREATE INDEX "sgar_media_created_at_idx" ON "sgar_media" USING btree ("created_at");
  CREATE INDEX "sgar_positions_updated_at_idx" ON "sgar_positions" USING btree ("updated_at");
  CREATE INDEX "sgar_positions_created_at_idx" ON "sgar_positions" USING btree ("created_at");
  CREATE INDEX "sgar_committees_unit_idx" ON "sgar_committees" USING btree ("unit_id");
  CREATE INDEX "sgar_committees_updated_at_idx" ON "sgar_committees" USING btree ("updated_at");
  CREATE INDEX "sgar_committees_created_at_idx" ON "sgar_committees" USING btree ("created_at");
  CREATE INDEX "sgar_committees_rels_order_idx" ON "sgar_committees_rels" USING btree ("order");
  CREATE INDEX "sgar_committees_rels_parent_idx" ON "sgar_committees_rels" USING btree ("parent_id");
  CREATE INDEX "sgar_committees_rels_path_idx" ON "sgar_committees_rels" USING btree ("path");
  CREATE INDEX "sgar_committees_rels_sgar_positions_id_idx" ON "sgar_committees_rels" USING btree ("sgar_positions_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_units_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_units_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_exec_board_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_exec_board_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_media_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_media_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_positions_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_positions_id");
  CREATE INDEX "payload_locked_documents_rels_sgar_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("sgar_committees_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "sgar_units" CASCADE;
  DROP TABLE "sgar_exec_board" CASCADE;
  DROP TABLE "sgar_media" CASCADE;
  DROP TABLE "sgar_positions" CASCADE;
  DROP TABLE "sgar_committees" CASCADE;
  DROP TABLE "sgar_committees_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_sgar_positions_status";`)
}
