-- Create Discord-like server system

-- Servers table (Discord servers/guilds)
CREATE TABLE public.discord_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_url TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Server members table
CREATE TABLE public.discord_server_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES public.discord_servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(server_id, user_id)
);

-- Channels table (text and voice channels)
CREATE TABLE public.discord_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES public.discord_servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text', -- 'text' or 'voice'
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table for text channels
CREATE TABLE public.discord_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.discord_channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Voice channel participants (who is in voice channels)
CREATE TABLE public.discord_voice_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.discord_channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    is_muted BOOLEAN NOT NULL DEFAULT false,
    is_deafened BOOLEAN NOT NULL DEFAULT false,
    is_camera_on BOOLEAN NOT NULL DEFAULT false,
    is_screen_sharing BOOLEAN NOT NULL DEFAULT false,
    is_speaking BOOLEAN NOT NULL DEFAULT false,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(channel_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.discord_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_voice_participants ENABLE ROW LEVEL SECURITY;

-- Function to check if user is member of server
CREATE OR REPLACE FUNCTION public.is_server_member(server_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM discord_server_members
        WHERE discord_server_members.server_id = is_server_member.server_id
        AND discord_server_members.user_id = is_server_member.user_id
    );
$$;

-- RLS Policies for discord_servers
CREATE POLICY "Users can view servers they are members of"
ON public.discord_servers FOR SELECT
USING (is_server_member(id, auth.uid()));

CREATE POLICY "Users can create servers"
ON public.discord_servers FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their servers"
ON public.discord_servers FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their servers"
ON public.discord_servers FOR DELETE
USING (auth.uid() = owner_id);

-- RLS Policies for discord_server_members
CREATE POLICY "Members can view other members in their servers"
ON public.discord_server_members FOR SELECT
USING (is_server_member(server_id, auth.uid()));

CREATE POLICY "Server owners/admins can add members"
ON public.discord_server_members FOR INSERT
WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM discord_server_members dsm
        WHERE dsm.server_id = discord_server_members.server_id
        AND dsm.user_id = auth.uid()
        AND dsm.role IN ('owner', 'admin')
    )
);

CREATE POLICY "Users can leave servers"
ON public.discord_server_members FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for discord_channels
CREATE POLICY "Members can view channels in their servers"
ON public.discord_channels FOR SELECT
USING (is_server_member(server_id, auth.uid()));

CREATE POLICY "Server owners can create channels"
ON public.discord_channels FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM discord_servers
        WHERE id = server_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Server owners can update channels"
ON public.discord_channels FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM discord_servers
        WHERE id = server_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Server owners can delete channels"
ON public.discord_channels FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM discord_servers
        WHERE id = server_id AND owner_id = auth.uid()
    )
);

-- RLS Policies for discord_messages
CREATE POLICY "Members can view messages in their server channels"
ON public.discord_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM discord_channels dc
        WHERE dc.id = channel_id
        AND is_server_member(dc.server_id, auth.uid())
    )
);

CREATE POLICY "Members can send messages"
ON public.discord_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM discord_channels dc
        WHERE dc.id = channel_id
        AND is_server_member(dc.server_id, auth.uid())
    )
);

CREATE POLICY "Users can update their own messages"
ON public.discord_messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.discord_messages FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for discord_voice_participants
CREATE POLICY "Members can view voice participants"
ON public.discord_voice_participants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM discord_channels dc
        WHERE dc.id = channel_id
        AND is_server_member(dc.server_id, auth.uid())
    )
);

CREATE POLICY "Members can join voice channels"
ON public.discord_voice_participants FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM discord_channels dc
        WHERE dc.id = channel_id
        AND dc.type = 'voice'
        AND is_server_member(dc.server_id, auth.uid())
    )
);

CREATE POLICY "Users can update their own voice state"
ON public.discord_voice_participants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave voice channels"
ON public.discord_voice_participants FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for messages and voice participants
ALTER PUBLICATION supabase_realtime ADD TABLE public.discord_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discord_voice_participants;

-- Trigger for updated_at
CREATE TRIGGER update_discord_servers_updated_at
BEFORE UPDATE ON public.discord_servers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discord_channels_updated_at
BEFORE UPDATE ON public.discord_channels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discord_messages_updated_at
BEFORE UPDATE ON public.discord_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();