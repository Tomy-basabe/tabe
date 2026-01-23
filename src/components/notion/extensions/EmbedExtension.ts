import { Node, mergeAttributes } from "@tiptap/core";

export interface EmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (options: { src: string; type?: string }) => ReturnType;
    };
  }
}

// Detect embed type from URL
export function detectEmbedType(url: string): { type: string; embedUrl: string } | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Twitter/X
  const twitterMatch = url.match(
    /(?:twitter\.com|x\.com)\/(?:\w+)\/status\/(\d+)/
  );
  if (twitterMatch) {
    return {
      type: "twitter",
      embedUrl: url,
    };
  }

  // Spotify Track
  const spotifyTrackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyTrackMatch) {
    return {
      type: "spotify",
      embedUrl: `https://open.spotify.com/embed/track/${spotifyTrackMatch[1]}`,
    };
  }

  // Spotify Playlist
  const spotifyPlaylistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (spotifyPlaylistMatch) {
    return {
      type: "spotify",
      embedUrl: `https://open.spotify.com/embed/playlist/${spotifyPlaylistMatch[1]}`,
    };
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return {
      type: "loom",
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }

  // Figma
  const figmaMatch = url.match(/figma\.com\/(file|proto)\/([a-zA-Z0-9]+)/);
  if (figmaMatch) {
    return {
      type: "figma",
      embedUrl: `https://www.figma.com/embed?embed_host=notion&url=${encodeURIComponent(url)}`,
    };
  }

  // Google Maps
  const mapsMatch = url.match(/google\.com\/maps/);
  if (mapsMatch) {
    return {
      type: "maps",
      embedUrl: url.replace("/maps/", "/maps/embed?pb="),
    };
  }

  // CodePen
  const codepenMatch = url.match(/codepen\.io\/([^\/]+)\/pen\/([a-zA-Z0-9]+)/);
  if (codepenMatch) {
    return {
      type: "codepen",
      embedUrl: `https://codepen.io/${codepenMatch[1]}/embed/${codepenMatch[2]}?default-tab=result`,
    };
  }

  // Generic iframe (for other URLs)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return {
      type: "generic",
      embedUrl: url,
    };
  }

  return null;
}

export const Embed = Node.create<EmbedOptions>({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      embedUrl: {
        default: null,
      },
      type: {
        default: "generic",
      },
      aspectRatio: {
        default: "16/9",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, embedUrl, type, aspectRatio } = HTMLAttributes;
    
    // For Twitter, we render a special container
    if (type === "twitter") {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, {
          "data-type": "embed",
          "data-embed-type": type,
          class: "embed-container embed-twitter",
        }),
        [
          "blockquote",
          {
            class: "twitter-tweet",
            "data-dnt": "true",
          },
          [
            "a",
            {
              href: src,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            "Ver tweet en Twitter/X →",
          ],
        ],
      ];
    }

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "embed",
        "data-embed-type": type,
        class: `embed-container embed-${type}`,
        style: `aspect-ratio: ${aspectRatio};`,
      }),
      [
        "iframe",
        {
          src: embedUrl || src,
          frameborder: "0",
          allowfullscreen: "true",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          style: "width: 100%; height: 100%; border-radius: 0.5rem;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          const detected = detectEmbedType(options.src);
          if (!detected) return false;

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              embedUrl: detected.embedUrl,
              type: detected.type,
              aspectRatio: detected.type === "spotify" ? "80/21" : "16/9",
            },
          });
        },
    };
  },
});
