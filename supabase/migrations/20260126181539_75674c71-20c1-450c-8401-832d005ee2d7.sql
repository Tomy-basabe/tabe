-- Create a secure function to find users by display_id or username for friend requests
CREATE OR REPLACE FUNCTION public.find_user_for_friend_request(identifier text)
RETURNS TABLE(user_id uuid, username text, display_id integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  numeric_id integer;
BEGIN
  -- Try to parse as numeric ID
  BEGIN
    numeric_id := identifier::integer;
  EXCEPTION WHEN OTHERS THEN
    numeric_id := NULL;
  END;
  
  -- Search by display_id if numeric, otherwise by username
  IF numeric_id IS NOT NULL THEN
    RETURN QUERY
    SELECT p.user_id, p.username, p.display_id
    FROM profiles p
    WHERE p.display_id = numeric_id;
  ELSE
    RETURN QUERY
    SELECT p.user_id, p.username, p.display_id
    FROM profiles p
    WHERE LOWER(p.username) = LOWER(identifier);
  END IF;
END;
$$;