import { useState, useRef, useEffect } from "react";
import { Hash, Users, Send, AtSign, PlusCircle, Gift, Sticker, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiscordChannel, DiscordMessage, DiscordServerMember } from "@/hooks/useDiscord";
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

interface DiscordTextChannelProps {
  channel: DiscordChannel;
  messages: DiscordMessage[];
  onSendMessage: (content: string) => void;
  showMembers: boolean;
  onToggleMembers: () => void;
  members: DiscordServerMember[];
}

export function DiscordTextChannel({
  channel,
  messages,
  onSendMessage,
  showMembers,
  onToggleMembers,
  members,
}: DiscordTextChannelProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Hoy a las ${format(date, "HH:mm")}`;
    }
    if (isYesterday(date)) {
      return `Ayer a las ${format(date, "HH:mm")}`;
    }
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = format(new Date(msg.created_at), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {} as Record<string, DiscordMessage[]>);

  return (
    <div className="flex-1 flex">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#1f2023] bg-[#313338]">
          <div className="flex items-center gap-2">
            <Hash className="w-6 h-6 text-[#80848e]" />
            <span className="font-semibold text-white">{channel.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleMembers}
              className={cn(
                "text-[#b5bac1] hover:text-[#dbdee1]",
                showMembers && "text-white"
              )}
            >
              <Users className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {/* Welcome message */}
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
                <Hash className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido a #{channel.name}!
              </h2>
              <p className="text-[#949ba4]">
                Este es el comienzo del canal #{channel.name}.
              </p>
            </div>

            {/* Messages grouped by date */}
            {Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-[#3f4147]" />
                  <span className="text-xs text-[#949ba4] font-medium">
                    {isToday(new Date(date))
                      ? "Hoy"
                      : isYesterday(new Date(date))
                      ? "Ayer"
                      : format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </span>
                  <div className="flex-1 h-px bg-[#3f4147]" />
                </div>

                {/* Messages */}
                {dayMessages.map((msg, idx) => {
                  const prevMsg = idx > 0 ? dayMessages[idx - 1] : null;
                  const showAvatar =
                    !prevMsg ||
                    prevMsg.user_id !== msg.user_id ||
                    new Date(msg.created_at).getTime() -
                      new Date(prevMsg.created_at).getTime() >
                      300000;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "group hover:bg-[#2e3035] px-2 py-0.5 -mx-2 rounded",
                        showAvatar && "mt-4"
                      )}
                    >
                      {showAvatar ? (
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10 mt-0.5">
                            <AvatarImage src={msg.profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-[#5865f2] text-white">
                              {(msg.profile?.nombre || msg.profile?.username || "U")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-white hover:underline cursor-pointer">
                                {msg.profile?.nombre || msg.profile?.username || "Usuario"}
                              </span>
                              <span className="text-xs text-[#949ba4]">
                                {formatMessageDate(msg.created_at)}
                              </span>
                            </div>
                            <p className="text-[#dbdee1] break-words">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-10 flex items-center justify-center">
                            <span className="text-[10px] text-[#949ba4] opacity-0 group-hover:opacity-100">
                              {format(new Date(msg.created_at), "HH:mm")}
                            </span>
                          </div>
                          <p className="text-[#dbdee1] break-words">{msg.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-4 bg-[#383a40] rounded-lg px-4">
            <button className="text-[#b5bac1] hover:text-[#dbdee1]">
              <PlusCircle className="w-6 h-6" />
            </button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Enviar mensaje en #${channel.name}`}
              className="flex-1 bg-transparent border-none text-[#dbdee1] placeholder:text-[#6d6f78] focus-visible:ring-0"
            />
            <div className="flex items-center gap-2">
              <button className="text-[#b5bac1] hover:text-[#dbdee1]">
                <Gift className="w-6 h-6" />
              </button>
              <button className="text-[#b5bac1] hover:text-[#dbdee1]">
                <Sticker className="w-6 h-6" />
              </button>
              <button className="text-[#b5bac1] hover:text-[#dbdee1]">
                <Smile className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members sidebar */}
      {showMembers && (
        <div className="w-60 bg-[#2b2d31] border-l border-[#1f2023]">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-[#949ba4] uppercase mb-2">
              Miembros — {members.length}
            </h3>
            <div className="space-y-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-[#5865f2] text-white text-sm">
                        {(member.profile?.nombre || member.profile?.username || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2b2d31] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#23a559] rounded-full" />
                    </div>
                  </div>
                  <span className="text-[#949ba4] hover:text-white truncate">
                    {member.profile?.nombre || member.profile?.username || "Usuario"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
