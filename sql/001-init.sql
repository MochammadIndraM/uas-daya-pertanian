BEGIN;
CREATE TABLE IF NOT EXISTS bank_versions (
  version text PRIMARY KEY,
  questions jsonb NOT NULL CHECK (jsonb_array_length(questions) = 50),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY,
  exam_id text NOT NULL,
  full_name text NOT NULL,
  nim varchar(25) NOT NULL,
  group_name char(1) NOT NULL CHECK (group_name IN ('A','B','C')),
  bank_version text NOT NULL REFERENCES bank_versions(version),
  question_ids jsonb NOT NULL CHECK (jsonb_array_length(question_ids) = 25),
  started_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  deadline_at timestamptz NOT NULL DEFAULT clock_timestamp() + interval '30 minutes',
  reset_events jsonb NOT NULL DEFAULT '[]',
  last_reset_at timestamptz,
  CHECK (deadline_at > started_at)
);
-- V4 mengizinkan percobaan baru dengan NIM sama. Unik per NIM masih keputusan terbuka.
CREATE INDEX IF NOT EXISTS attempts_exam_idx ON attempts(exam_id);
CREATE TABLE IF NOT EXISTS results (
  attempt_id uuid PRIMARY KEY REFERENCES attempts(id),
  correct_count integer NOT NULL CHECK (correct_count BETWEEN 0 AND 25),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  answers jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
COMMIT;
