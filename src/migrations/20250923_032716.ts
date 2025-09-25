import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer', 'none');
  CREATE TYPE "public"."enum_lscs_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lscs_articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'none' NOT NULL,
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
  
  CREATE TABLE "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"picture" varchar,
  	"user_id" integer NOT NULL,
  	"issuer_name" varchar NOT NULL,
  	"scope" varchar,
  	"sub" varchar NOT NULL,
  	"access_token" varchar,
  	"passkey_credential_id" varchar,
  	"passkey_public_key" jsonb,
  	"passkey_counter" numeric,
  	"passkey_transports" jsonb,
  	"passkey_device_type" varchar,
  	"passkey_backed_up" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  
  CREATE TABLE "lscs_article_category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lscs_articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"category_id" integer,
  	"author_id" integer,
  	"featured_image_id" integer,
  	"content" jsonb,
  	"md_content" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lscs_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lscs_articles_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_lscs_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_featured_image_id" integer,
  	"version_content" jsonb,
  	"version_md_content" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lscs_articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_lscs_articles_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "lscs_article_authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"bio" varchar,
  	"avatar_id" integer,
  	"user_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"accounts_id" integer,
  	"media_id" integer,
  	"lscs_article_category_id" integer,
  	"lscs_articles_id" integer,
  	"lscs_article_authors_id" integer
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
  ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_articles" ADD CONSTRAINT "lscs_articles_category_id_lscs_article_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."lscs_article_category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_articles" ADD CONSTRAINT "lscs_articles_author_id_lscs_article_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."lscs_article_authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_articles" ADD CONSTRAINT "lscs_articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_articles_texts" ADD CONSTRAINT "lscs_articles_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lscs_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v" ADD CONSTRAINT "_lscs_articles_v_parent_id_lscs_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lscs_articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v" ADD CONSTRAINT "_lscs_articles_v_version_category_id_lscs_article_category_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."lscs_article_category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v" ADD CONSTRAINT "_lscs_articles_v_version_author_id_lscs_article_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."lscs_article_authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v" ADD CONSTRAINT "_lscs_articles_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lscs_articles_v_texts" ADD CONSTRAINT "_lscs_articles_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lscs_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lscs_article_authors" ADD CONSTRAINT "lscs_article_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lscs_article_authors" ADD CONSTRAINT "lscs_article_authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_article_category_fk" FOREIGN KEY ("lscs_article_category_id") REFERENCES "public"."lscs_article_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_articles_fk" FOREIGN KEY ("lscs_articles_id") REFERENCES "public"."lscs_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lscs_article_authors_fk" FOREIGN KEY ("lscs_article_authors_id") REFERENCES "public"."lscs_article_authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");
  CREATE INDEX "accounts_updated_at_idx" ON "accounts" USING btree ("updated_at");
  CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "lscs_article_category_updated_at_idx" ON "lscs_article_category" USING btree ("updated_at");
  CREATE INDEX "lscs_article_category_created_at_idx" ON "lscs_article_category" USING btree ("created_at");
  CREATE INDEX "lscs_articles_category_idx" ON "lscs_articles" USING btree ("category_id");
  CREATE INDEX "lscs_articles_author_idx" ON "lscs_articles" USING btree ("author_id");
  CREATE INDEX "lscs_articles_featured_image_idx" ON "lscs_articles" USING btree ("featured_image_id");
  CREATE INDEX "lscs_articles_updated_at_idx" ON "lscs_articles" USING btree ("updated_at");
  CREATE INDEX "lscs_articles_created_at_idx" ON "lscs_articles" USING btree ("created_at");
  CREATE INDEX "lscs_articles__status_idx" ON "lscs_articles" USING btree ("_status");
  CREATE INDEX "lscs_articles_texts_order_parent_idx" ON "lscs_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_lscs_articles_v_parent_idx" ON "_lscs_articles_v" USING btree ("parent_id");
  CREATE INDEX "_lscs_articles_v_version_version_category_idx" ON "_lscs_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_lscs_articles_v_version_version_author_idx" ON "_lscs_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_lscs_articles_v_version_version_featured_image_idx" ON "_lscs_articles_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_lscs_articles_v_version_version_updated_at_idx" ON "_lscs_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_lscs_articles_v_version_version_created_at_idx" ON "_lscs_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_lscs_articles_v_version_version__status_idx" ON "_lscs_articles_v" USING btree ("version__status");
  CREATE INDEX "_lscs_articles_v_created_at_idx" ON "_lscs_articles_v" USING btree ("created_at");
  CREATE INDEX "_lscs_articles_v_updated_at_idx" ON "_lscs_articles_v" USING btree ("updated_at");
  CREATE INDEX "_lscs_articles_v_latest_idx" ON "_lscs_articles_v" USING btree ("latest");
  CREATE INDEX "_lscs_articles_v_texts_order_parent_idx" ON "_lscs_articles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "lscs_article_authors_avatar_idx" ON "lscs_article_authors" USING btree ("avatar_id");
  CREATE INDEX "lscs_article_authors_user_idx" ON "lscs_article_authors" USING btree ("user_id");
  CREATE INDEX "lscs_article_authors_updated_at_idx" ON "lscs_article_authors" USING btree ("updated_at");
  CREATE INDEX "lscs_article_authors_created_at_idx" ON "lscs_article_authors" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_article_category_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_article_category_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_articles_id");
  CREATE INDEX "payload_locked_documents_rels_lscs_article_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("lscs_article_authors_id");
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
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "lscs_article_category" CASCADE;
  DROP TABLE "lscs_articles" CASCADE;
  DROP TABLE "lscs_articles_texts" CASCADE;
  DROP TABLE "_lscs_articles_v" CASCADE;
  DROP TABLE "_lscs_articles_v_texts" CASCADE;
  DROP TABLE "lscs_article_authors" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_lscs_articles_status";
  DROP TYPE "public"."enum__lscs_articles_v_version_status";`)
}
