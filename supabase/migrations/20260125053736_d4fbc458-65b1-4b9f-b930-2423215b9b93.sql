-- Drop the grace period trigger since we want to allow manual plant abandonment
DROP TRIGGER IF EXISTS trg_enforce_plant_death_grace_period ON public.user_plants;
DROP FUNCTION IF EXISTS public.enforce_plant_death_grace_period();