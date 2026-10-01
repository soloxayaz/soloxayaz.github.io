/** Repositories for soloxayaz and htr-tech: static snapshot + live GitHub merge. */
export type Repo = {
  owner: string;
  name: string;
  desc: string;
  lang: string | null;
  stars: number;
  archived?: boolean;
  fork?: boolean;
  url: string;
  pushed?: string;
};

export const owners = ["soloxayaz", "htr-tech"] as const;
export const ownerLabels: Record<string, string> = {
  soloxayaz: "Ayaz Ahmad",
  "htr-tech": "Tahmid Rayat",
};

const r = (
  owner: string,
  name: string,
  desc: string,
  lang: string | null,
  stars = 0,
  extra: Partial<Repo> = {},
): Repo => ({ owner, name, desc, lang, stars, url: `https://github.com/${owner}/${name}`, ...extra });

/** Snapshot of what was visible at build time. The page refreshes it from GitHub in the browser. */
export const staticRepos: Repo[] = [
  r("soloxayaz", "ayaz-terminal", "A lightweight terminal utility for Termux and Linux.", "Python", 1),
  r("soloxayaz", "airgorah", "A WiFi security auditing software mainly based on aircrack-ng tools suite.", "Rust", 0, { fork: true }),
  r("soloxayaz", "soloxayaz.github.io", "Personal cybersecurity website and digital lab.", "HTML"),
  r("soloxayaz", "soloxayaz", "GitHub profile README.", null),
  r("soloxayaz", "soloxayaz-apex", "SOLOXAYAZ // APEX. One Console. Every Surface. Zero Noise.", "Python"),
  r("soloxayaz", "htr-tech", "SOLOXAYAZ // APEX. One Console. Every Surface. Zero Noise.", "HTML"),
  r("htr-tech", "zphisher", "An automated phishing tool with 30+ templates, made for educational purposes only.", "HTML", 16900),
  r("modded-ubuntu", "modded-ubuntu", "Run Ubuntu GUI on your Termux with many features.", "Shell", 1200),
  r("hax0rtahm1d", "Reverse-Engineering", "Reverse-engineered tools, count 119.", "Python", 547),
  r("htr-tech", "PyObfuscate", "Simple Python code obfuscator. Supports python2 and python3.", "Python", 180),
  r("htr-tech", "Vigenere-Decoder", "Decode or brute-force Vigenere cipher text using the flag format.", "Python", 42),
  r("htr-tech", "0xTwin", "Twin-Hex cipher encoder and decoder.", "Python", 23),
  r("htr-tech", "public.repo", "Collection of codes.", "Shell", 54),
  r("htr-tech", "htr-tech", "GitHub profile README.", null, 212),
  r("htr-tech", "host", "Temporarily host files from your device.", null),
  r("htr-tech", "fake-mailer", "Mail sender script.", "Python", 315, { archived: true }),
  r("htr-tech", "GithubStat", "A simple GitHub user statistics meter based on the GitHub API.", "Python", 18),
  r("htr-tech", "SPA-AI-Practise", "A minimalist single page app in vanilla JS and CSS, built solely with AI.", "JavaScript", 5),
  r("htr-tech", "monad", "Random userscripts and contracts.", "JavaScript", 6, { archived: true }),
  r("htr-tech", "nexphisher", "Terminal tool for Linux and Termux.", null, 0, { archived: true }),
  r("htr-tech", "track-ip", "", null, 0, { archived: true }),
  r("htr-tech", "haxorbd", "", null),
  r("htr-tech", "pakcrack", "", null),
  r("htr-tech", "afgcrack", "", null),
  r("htr-tech", "indocrack", "", null),
  r("htr-tech", "termux-login", "Termux login security tool.", null),
  r("htr-tech", "termux-shell", "", null),
  r("htr-tech", "unfollow-plus", "Instagram unfollower bot written in bash.", "Shell"),
  r("htr-tech", "bash2mp4", "", null),
];

type ApiRepo = {
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  archived: boolean;
  fork: boolean;
  html_url: string;
  pushed_at: string | null;
};

const keyOf = (x: Repo) => `${x.owner}/${x.name}`.toLowerCase();

/** Fetch every public repo for the given users, then merge over the snapshot. */
export async function loadLiveRepos(signal: AbortSignal): Promise<Repo[]> {
  const live: Repo[] = [];
  for (const user of owners) {
    for (let page = 1; page <= 4; page++) {
      const res = await fetch(
        `https://api.github.com/users/${user}/repos?per_page=100&page=${page}&sort=pushed`,
        { signal, headers: { Accept: "application/vnd.github+json" } },
      );
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      const rows = (await res.json()) as ApiRepo[];
      for (const x of rows) {
        live.push({
          owner: x.owner.login,
          name: x.name,
          desc: x.description ?? "",
          lang: x.language,
          stars: x.stargazers_count,
          archived: x.archived,
          fork: x.fork,
          url: x.html_url,
          pushed: x.pushed_at ?? undefined,
        });
      }
      if (rows.length < 100) break;
    }
  }
  const liveKeys = new Set(live.map(keyOf));
  // Keep snapshot entries that the user endpoint can't see (organisation repos).
  return [...live, ...staticRepos.filter((s) => !liveKeys.has(keyOf(s)))];
}
