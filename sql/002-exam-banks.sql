BEGIN;
-- Bank aktif per ujian. Sesi lama tetap menunjuk bank_versions miliknya.
CREATE TABLE IF NOT EXISTS exam_banks (
  exam_id text PRIMARY KEY,
  bank_version text NOT NULL REFERENCES bank_versions(version),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
COMMIT;
