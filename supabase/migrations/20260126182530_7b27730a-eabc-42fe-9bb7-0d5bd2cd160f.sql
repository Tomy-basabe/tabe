-- Create a secure function to fetch profiles for users in friendships with the current user
CREATE OR REPLACE FUNCTION public.get_friend_profiles(friend_user_ids uuid[])
RETURNS TABLE(user_id uuid, username text, display_id integer, nombre text, avatar_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return profiles for users that are in a friendship with the caller
  RETURN QUERY
  SELECT p.user_id, p.username, p.display_id, p.nombre, p.avatar_url
  FROM profiles p
  WHERE p.user_id = ANY(friend_user_ids)
    AND EXISTS (
      SELECT 1 FROM friendships f
      WHERE (f.requester_id = auth.uid() AND f.addressee_id = p.user_id)
         OR (f.addressee_id = auth.uid() AND f.requester_id = p.user_id)
    );
END;
$$;