// Proxies lyrics lookups to lrclib.net's public API (https://lrclib.net/docs).
// We only ever return plainLyrics — no synced/timed lyrics are used here.
export default async function handler(req, res) {
  const track = (req.query.track || "").toString().trim();
  const artist = (req.query.artist || "").toString().trim();

  if (!track) {
    res.status(400).json({ status: false, message: "Judul lagu kosong." });
    return;
  }

  const params = new URLSearchParams({ track_name: track });
  if (artist) params.set("artist_name", artist);

  try {
    const upstreamRes = await fetch(`https://lrclib.net/api/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        // lrclib asks API consumers to identify themselves via User-Agent.
        "User-Agent": "Vinylo/1.0 (https://ldxvinnn.biz.id)"
      }
    });

    if (!upstreamRes.ok) {
      res.status(502).json({ status: false, message: "Gagal mengambil lirik dari lrclib." });
      return;
    }

    const data = await upstreamRes.json();
    const candidates = Array.isArray(data) ? data : [];

    // Prefer a non-instrumental result that actually has plain lyrics text.
    const match = candidates.find((c) => c && !c.instrumental && c.plainLyrics) || null;

    if (!match) {
      res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");
      res.status(200).json({ status: false, message: "Lirik tidak ditemukan untuk lagu ini." });
      return;
    }

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=172800");
    res.status(200).json({
      status: true,
      lyrics: match.plainLyrics,
      trackName: match.trackName || null,
      artistName: match.artistName || null
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Gagal menghubungi layanan lirik." });
  }
}
