import { useState } from "react";
import { useDiscord } from "@/hooks/useDiscord";
import { DiscordServerList } from "@/components/discord/DiscordServerList";
import { DiscordChannelSidebar } from "@/components/discord/DiscordChannelSidebar";
import { DiscordTextChannel } from "@/components/discord/DiscordTextChannel";
import { DiscordVoiceChannel } from "@/components/discord/DiscordVoiceChannel";
import { DiscordVoiceBar } from "@/components/discord/DiscordVoiceBar";
import { cn } from "@/lib/utils";

export default function Discord() {
  const discord = useDiscord();
  const [showMembers, setShowMembers] = useState(true);

  return (
    <div className="h-screen flex bg-[#313338] overflow-hidden">
      {/* Server list - Discord style vertical bar */}
      <DiscordServerList
        servers={discord.servers}
        currentServer={discord.currentServer}
        onSelectServer={discord.setCurrentServer}
        onCreateServer={discord.createServer}
      />

      {/* Channel sidebar */}
      {discord.currentServer && (
        <DiscordChannelSidebar
          server={discord.currentServer}
          channels={discord.channels}
          currentChannel={discord.currentChannel}
          members={discord.members}
          voiceParticipants={discord.voiceParticipants}
          speakingUsers={discord.speakingUsers}
          onSelectChannel={(channel) => {
            if (channel.type === "voice") {
              if (discord.inVoiceChannel && discord.currentChannel?.id === channel.id) {
                // Already in this channel
                return;
              }
              if (discord.inVoiceChannel) {
                discord.leaveVoiceChannel();
              }
              discord.joinVoiceChannel(channel);
            } else {
              discord.setCurrentChannel(channel);
            }
          }}
          onCreateChannel={discord.createChannel}
          onDeleteChannel={discord.deleteChannel}
          inVoiceChannel={discord.inVoiceChannel}
          currentVoiceChannel={discord.inVoiceChannel ? discord.currentChannel : null}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {discord.currentChannel ? (
          discord.currentChannel.type === "text" ? (
            <DiscordTextChannel
              channel={discord.currentChannel}
              messages={discord.messages}
              onSendMessage={discord.sendMessage}
              showMembers={showMembers}
              onToggleMembers={() => setShowMembers(!showMembers)}
              members={discord.members}
            />
          ) : (
            <DiscordVoiceChannel
              channel={discord.currentChannel}
              participants={discord.voiceParticipants}
              localStream={discord.localStream}
              remoteStreams={discord.remoteStreams}
              speakingUsers={discord.speakingUsers}
              isVideoEnabled={discord.isVideoEnabled}
              isAudioEnabled={discord.isAudioEnabled}
              isScreenSharing={discord.isScreenSharing}
            />
          )
        ) : discord.currentServer ? (
          <div className="flex-1 flex items-center justify-center text-[#949ba4]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">¡Bienvenido a {discord.currentServer.name}!</h2>
              <p>Selecciona un canal para comenzar</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#949ba4]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Discord</h2>
              <p>Selecciona o crea un servidor para comenzar</p>
            </div>
          </div>
        )}

        {/* Voice control bar - shows when in voice channel */}
        {discord.inVoiceChannel && (
          <DiscordVoiceBar
            channel={discord.currentChannel}
            isAudioEnabled={discord.isAudioEnabled}
            isVideoEnabled={discord.isVideoEnabled}
            isScreenSharing={discord.isScreenSharing}
            onToggleAudio={discord.toggleAudio}
            onToggleVideo={discord.toggleVideo}
            onToggleScreenShare={() => {
              if (discord.isScreenSharing) {
                discord.stopScreenShare();
              } else {
                discord.startScreenShare();
              }
            }}
            onLeave={discord.leaveVoiceChannel}
          />
        )}
      </div>
    </div>
  );
}
