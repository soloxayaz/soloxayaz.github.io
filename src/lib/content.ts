export const site = {
  name: "ayaz@htr-tech",
  display: "THE GREAT AYAZ",
  tagline: "cybersecurity, development, web design.",
  blurb:
    "An independent technology builder exploring cybersecurity, ethical hacking, web development, automation, open-source software, and digital product design.",
  github: "https://github.com/soloxayaz",
  handle: "@soloxayaz",
  formspree: "https://formspree.io/f/mvkgyqbg",
  accounts: [
    { user: "soloxayaz", label: "Ayaz Ahmad", url: "https://github.com/soloxayaz" },
    { user: "htr-tech", label: "Tahmid Rayat", url: "https://github.com/htr-tech" },
  ],
};

/** Rotating status lines under the hero (from the original boot log). */
export const thoughts = [
  "security telemetry online.",
  "github profile fetched: @htr-tech.",
  "environment: linux / termux / web.",
  "primary research: tooling & automation.",
  "public repos: 10+ active toolkits.",
];

export const beliefs = [
  "Code builds the system. Assets measure the journey.",
  "Tools exist for education, awareness and authorized testing only.",
  "Experimentation and practical development belong together.",
  "Interfaces should have Linear and Apple level polish.",
  "Deep security exploration, full-stack development and digital assets, in one place.",
];

export const now = {
  items: [
    ["environment", "Linux / Termux / Web"],
    ["primary research", "Tooling & automation"],
    ["public repos", "10+ active toolkits"],
    ["primary stack", "Python / JS / Linux"],
    ["community", "Open source"],
  ] as [string, string][],
};

export const about = {
  lead: "A technology-focused builder with interests spanning cybersecurity, ethical hacking, web development, automation, open-source software and digital design.",
  body: "His work combines experimentation with practical development, from command-line utilities and security tooling to modern web interfaces and automated systems. All cybersecurity tooling, research projects and code authored by Ayaz is designed exclusively for controlled educational contexts, security awareness, defensive analysis and authorized security testing environments.",
};

export const focus = [
  {
    title: "Security awareness & tooling",
    body: "Educational command-line utilities that simulate credential workflows to demonstrate phishing attack vectors and increase user security awareness.",
    tags: ["Python", "Bash", "Phishing simulation"],
  },
  {
    title: "Linux environments & PRoot",
    body: "Mobile Linux research with Proot-Distro in Termux, enabling full desktop GUI deployments and modular setups on mobile hardware.",
    tags: ["Termux", "Ubuntu GUI", "Linux admin"],
  },
  {
    title: "Reverse engineering & cryptography",
    body: "Code obfuscation methods, Python reverse-engineering techniques, and cryptographic cipher decoders such as Vigenère.",
    tags: ["Obfuscation", "Cryptography", "Decompilation"],
  },
] as const;

export type RoutePath =
  | "/"
  | "/work"
  | "/repos"
  | "/about"
  | "/skills"
  | "/manifesto"
  | "/assets"
  | "/contact"
  | "/void";

export const nav = [
  { id: "work", label: "projects", to: "/work", blurb: "toolkits, utilities and web builds." },
  { id: "repos", label: "repos", to: "/repos", blurb: "every repository, set in type." },
  {
    id: "about",
    label: "about",
    to: "/about",
    blurb: "the builder, focus areas and a snapshot.",
  },
  {
    id: "skills",
    label: "stack",
    to: "/skills",
    blurb: "languages, databases and infrastructure.",
  },
  {
    id: "manifesto",
    label: "ethics",
    to: "/manifesto",
    blurb: "philosophy and ethical disclosure.",
  },
  { id: "assets", label: "assets", to: "/assets", blurb: "portfolio monitor snapshot." },
  {
    id: "contact",
    label: "contact",
    to: "/contact",
    blurb: "security collaboration and open source.",
  },
] as const satisfies readonly { id: string; label: string; to: RoutePath; blurb: string }[];

export const categories = ["all", "tools", "security", "web"] as const;
export type Category = (typeof categories)[number];

export type Project = {
  id: string;
  index: string;
  title: string;
  year: string;
  category: Exclude<Category, "all">;
  href: string;
  external?: boolean;
  summary: string;
  pattern: "radial" | "lines" | "grid" | "orbit" | "slash" | "dots" | "wave" | "void";
};

export const projects: Project[] = [
  {
    id: "apex",
    index: "01",
    title: "soloxayaz-apex",
    year: "python",
    category: "tools",
    href: "https://github.com/soloxayaz/soloxayaz-apex",
    external: true,
    summary: "SOLOXAYAZ // APEX. One console, every surface, zero noise.",
    pattern: "radial",
  },
  {
    id: "terminal",
    index: "02",
    title: "ayaz-terminal",
    year: "python",
    category: "tools",
    href: "https://github.com/soloxayaz/ayaz-terminal",
    external: true,
    summary: "A lightweight terminal utility for Termux and Linux.",
    pattern: "grid",
  },
  {
    id: "lab",
    index: "03",
    title: "ayaz cybersecurity lab",
    year: "html",
    category: "web",
    href: "https://soloxayaz.github.io/",
    external: true,
    summary: "A personal cybersecurity-focused website and digital lab.",
    pattern: "lines",
  },
  {
    id: "airgorah",
    index: "04",
    title: "airgorah (fork)",
    year: "rust",
    category: "security",
    href: "https://github.com/soloxayaz/airgorah",
    external: true,
    summary:
      "Forked from martin-olivier/airgorah: WiFi security auditing software built around the aircrack-ng suite, for authorized testing.",
    pattern: "slash",
  },
  {
    id: "assets",
    index: "05",
    title: "asset dashboard",
    year: "web",
    category: "web",
    href: "/assets",
    summary: "A portfolio monitor with a baseline snapshot, holdings and a growth trend.",
    pattern: "wave",
  },
];

export const skillGroups = [
  {
    id: "frontend",
    label: "frontend",
    items: [
      { name: "HTML5 / CSS3", hint: "Expert" },
      { name: "JavaScript ES6+", hint: "Advanced" },
      { name: "React / Next.js", hint: "Intermediate" },
      { name: "Tailwind CSS", hint: "Advanced" },
    ],
  },
  {
    id: "backend",
    label: "backend",
    items: [
      { name: "Python", hint: "Advanced" },
      { name: "Node.js", hint: "Intermediate" },
      { name: "PHP", hint: "Intermediate" },
      { name: "REST APIs", hint: "Advanced" },
    ],
  },
  {
    id: "data",
    label: "databases & baas",
    items: [
      { name: "SQLite", hint: "Intermediate" },
      { name: "Firebase / Firestore", hint: "Advanced" },
      { name: "Supabase", hint: "Intermediate" },
      { name: "JSON data store", hint: "Expert" },
    ],
  },
  {
    id: "infra",
    label: "infrastructure",
    items: [
      { name: "Git & GitHub", hint: "Advanced" },
      { name: "Linux admin", hint: "Advanced" },
      { name: "Termux & PRoot", hint: "Expert" },
      { name: "Cloudflare", hint: "Intermediate" },
    ],
  },
] as const;

export const stats = [
  { value: "10+", label: "active toolkits" },
  { value: "04", label: "focus areas" },
  { value: "Py/JS", label: "primary stack" },
  { value: "OSS", label: "community" },
] as const;

/** Static baseline snapshot, copied from the reference site. Not live prices. */
export const assets = {
  total: "$4,348,861.65",
  inr: "≈ ₹36,11,70,460",
  change: "+2.41%",
  changeNote: "+102,140.20 USDT today",
  largest: "USDT (94.0%)",
  largestNote: "stable liquidity reserve",
  holdings: [
    ["USDT reserve", "4,089,300.16"],
    ["BTC holding", "2.930000 BTC"],
    ["ETH holding", "30.760000 ETH"],
  ] as [string, string][],
  motto: "Code builds the system. Assets measure the journey.",
};
