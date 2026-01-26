import { useState } from "react";
import { Plus, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import type { DiscordServer } from "@/hooks/useDiscord";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DiscordServerListProps {
  servers: DiscordServer[];
  currentServer: DiscordServer | null;
  onSelectServer: (server: DiscordServer | null) => void;
  onCreateServer: (name: string) => Promise<DiscordServer | null>;
}

export function DiscordServerList({
  servers,
  currentServer,
  onSelectServer,
  onCreateServer,
}: DiscordServerListProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [serverName, setServerName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!serverName.trim()) return;
    setCreating(true);
    const server = await onCreateServer(serverName.trim());
    if (server) {
      onSelectServer(server);
      setServerName("");
      setShowCreate(false);
    }
    setCreating(false);
  };

  return (
    <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto">
      {/* Home button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onSelectServer(null)}
            className={cn(
              "w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200",
              "hover:rounded-[16px] hover:bg-[#5865f2]",
              !currentServer
                ? "bg-[#5865f2] rounded-[16px]"
                : "bg-[#313338]"
            )}
          >
            <DiscordIcon className="w-7 h-7 text-white" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Mensajes Directos</p>
        </TooltipContent>
      </Tooltip>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-[#35363c] rounded-full" />

      {/* Server list */}
      {servers.map((server) => {
        const isActive = currentServer?.id === server.id;
        const initials = server.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <div className="relative group">
                {/* Active indicator */}
                <div
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 rounded-r-full bg-white transition-all",
                    isActive ? "h-10" : "h-0 group-hover:h-5"
                  )}
                />
                <button
                  onClick={() => onSelectServer(server)}
                  className={cn(
                    "w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200 text-white font-semibold",
                    "hover:rounded-[16px]",
                    isActive
                      ? "bg-[#5865f2] rounded-[16px]"
                      : "bg-[#313338] hover:bg-[#5865f2]",
                    server.icon_url && "overflow-hidden"
                  )}
                >
                  {server.icon_url ? (
                    <img
                      src={server.icon_url}
                      alt={server.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{server.name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Add server button */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                className={cn(
                  "w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200",
                  "bg-[#313338] hover:bg-[#23a559] hover:rounded-[16px] text-[#23a559] hover:text-white"
                )}
              >
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Añadir un servidor</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="bg-[#313338] border-none text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Crea tu servidor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-center text-[#b5bac1] text-sm">
              Tu servidor es donde tú y tus amigos pasan el rato. Crea el tuyo y empieza a hablar.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#b5bac1] uppercase">
                Nombre del servidor
              </label>
              <Input
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Mi servidor de estudio"
                className="bg-[#1e1f22] border-none text-white placeholder:text-[#87898c]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={!serverName.trim() || creating}
              className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              {creating ? "Creando..." : "Crear"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
