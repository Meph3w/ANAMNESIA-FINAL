-- Seed script to initialize monthly_plan_credits and monthly_usage
-- Run this in your Supabase SQL Editor to set default values for existing profiles

UPDATE public.profiles
SET
  monthly_plan_credits = 0,
  monthly_usage = 0
WHERE
  monthly_plan_credits IS NULL
  OR monthly_usage IS NULL;