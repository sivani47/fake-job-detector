CREATE TABLE "predictions" (
	"id" serial PRIMARY KEY,
	"job_title" text NOT NULL,
	"industry" text,
	"location" text,
	"employment_type" text,
	"prediction" text NOT NULL,
	"confidence" real NOT NULL,
	"indicators" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
