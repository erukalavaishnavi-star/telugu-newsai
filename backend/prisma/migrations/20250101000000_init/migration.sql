-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE "Plan" AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE "Sentiment" AS ENUM ('positive', 'neutral', 'negative');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "org_name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'editor',
    "plan" "Plan" NOT NULL DEFAULT 'free',
    "api_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(500),
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "char_count" INTEGER NOT NULL,
    "sentiment" "Sentiment",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "generated_posts" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "headline" VARCHAR(500),
    "key_facts" JSONB,
    "summary" TEXT,
    "caption_variations" JSONB,
    "facebook_post" TEXT,
    "instagram_caption" TEXT,
    "twitter_post" VARCHAR(280),
    "whatsapp_text" TEXT,
    "youtube_post" TEXT,
    "breaking_alert" TEXT,
    "generation_ms" INTEGER NOT NULL,
    "ai_model" TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "hashtags" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "tag" VARCHAR(100) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "seo_keywords" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "keyword" VARCHAR(150) NOT NULL,

    CONSTRAINT "seo_keywords_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "generation_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'generate',
    "platform" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "hashtags" ADD CONSTRAINT "hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "generated_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_keywords" ADD CONSTRAINT "seo_keywords_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "generated_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "generation_history" ADD CONSTRAINT "generation_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "generation_history" ADD CONSTRAINT "generation_history_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "generated_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
