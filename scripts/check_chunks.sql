-- scripts/check_chunks.sql
-- Run this in your Supabase SQL editor to verify top-3 chunks returned by the RPC

-- 1. Obtain an embedding vector (e.g., via console.log of `userEmbedding` in your server code).
-- 2. Paste the array of floats below, replacing the placeholder values.

SELECT *
FROM match_document_chunks(
  ARRAY[
    -- e.g.: 0.123, 0.456, 0.789, ... (paste your actual embedding numbers here)
  ]::float8[],
  3  -- number of matching chunks to retrieve
);