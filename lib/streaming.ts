export type StreamingMeta = {
  service: "spotify" | "apple_music" | "deezer";
  title: string;
  artist: string;
  coverUrl: string | null;
};

function serviceOf(url: string): StreamingMeta["service"] | null {
  const u = url.toLowerCase();
  if (u.includes("spotify.com") || u.includes("spotify:")) return "spotify";
  if (u.includes("music.apple.com") || u.includes("itunes.apple.com")) return "apple_music";
  if (u.includes("deezer.com") || u.includes("deezer.page.link")) return "deezer";
  return null;
}

export async function parseStreamingUrl(url: string): Promise<StreamingMeta | null> {
  const service = serviceOf(url);
  if (!service) return null;

  try {
    if (service === "spotify") {
      const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      const data = await res.json();
      // oEmbed title is "Track by Artist" sometimes; split on " by ".
      const raw = String(data.title || "");
      const [title, artist] = raw.includes(" by ") ? raw.split(" by ", 2) : [raw, ""];
      return { service, title: title.trim() || raw, artist: artist.trim(), coverUrl: data.thumbnail_url || null };
    }

    if (service === "deezer") {
      const m = url.match(/deezer\.com\/(?:\w+\/)?track\/(\d+)/);
      const id = m?.[1];
      if (!id) return null;
      const res = await fetch(`https://api.deezer.com/track/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return {
        service,
        title: String(data.title || ""),
        artist: String(data.artist?.name || ""),
        coverUrl: data.album?.cover_medium || data.album?.cover || null,
      };
    }

    // Apple Music: extract track id from ?i= param.
    const appleUrl = new URL(url);
    const trackId = appleUrl.searchParams.get("i");
    if (!trackId) return null;
    const res = await fetch(`https://itunes.apple.com/lookup?id=${trackId}`);
    if (!res.ok) return null;
    const data = await res.json();
    const r = data.results?.[0];
    if (!r) return null;
    return {
      service,
      title: String(r.trackName || ""),
      artist: String(r.artistName || ""),
      coverUrl: r.artworkUrl100 ? r.artworkUrl100.replace("100x100", "600x600") : null,
    };
  } catch {
    return null;
  }
}
