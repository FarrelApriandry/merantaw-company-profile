/**
 * Seed initial CMS content from the existing hardcoded site data.
 * Run: bun run db:seed  (uses DATABASE_URL_UNPOOLED from .env.local)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("Missing DATABASE_URL_UNPOOLED");

const sql = neon(url);
const db = drizzle(sql, { schema });

async function main() {
  const now = new Date();

  // ---- Projects: flagship Pasar Bubrah + pipeline teaser ----
  await db.insert(schema.projects).values([
    {
      id: "pasar-bubrah",
      status: "flagship",
      year: "2025",
      platform: "PC / itch.io",
      distributionUrl: "https://merantawid.itch.io/nusantara-pasar-bubrah",
      bannerKey: null,
      sortOrder: 1,
      isFlagship: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "project-02-rnd",
      status: "pipeline",
      year: "2026",
      platform: "To Be Announced",
      distributionUrl: null,
      bannerKey: null,
      sortOrder: 2,
      isFlagship: false,
      createdAt: now,
      updatedAt: now,
    },
  ]).onConflictDoNothing();

  await db.insert(schema.projectI18n).values([
    {
      projectId: "pasar-bubrah", lang: "en",
      title: "NUSANTARA: PASAR BUBRAH",
      typeLabel: "Atmospheric Interactive Game",
      description: "An atmospheric interactive experience inspired by Indonesian folklore, authentic environments, and contemporary storytelling. As Merantaw's flagship creative work, it explores cultural immersion and suspense through interactive mechanics.",
      culturalNote: "Currently available as a playable public demo through itch.io, representing Merantaw's dedication to narrative craft and technical execution.",
    },
    {
      projectId: "pasar-bubrah", lang: "id",
      title: "NUSANTARA: PASAR BUBRAH",
      typeLabel: "Game Interaktif Atmosferik",
      description: "Sebuah pengalaman interaktif atmosferik yang terinspirasi oleh folklor, lanskap otentik, dan penceritaan kontemporer Indonesia. Sebagai karya kreatif unggulan Merantaw, proyek ini mengeksplorasi imersi budaya dan ketegangan melalui mekanik interaktif.",
      culturalNote: "Saat ini tersedia sebagai demo publik yang dapat dimainkan melalui itch.io, mencerminkan dedikasi Merantaw terhadap narasi dan eksekusi teknis.",
    },
    {
      projectId: "project-02-rnd", lang: "en",
      title: "2nd Title Currently in R&D",
      typeLabel: "Interactive Experience & Game R&D",
      description: "Building on our interactive pipeline, Merantaw is actively researching and prototyping our next standalone production.",
      culturalNote: "",
    },
    {
      projectId: "project-02-rnd", lang: "id",
      title: "Karya Kedua Sedang dalam Tahap R&D",
      typeLabel: "Pengalaman Interaktif & R&D Game",
      description: "Memanfaatkan alur produksi interaktif kami, Merantaw saat ini aktif meneliti dan membuat prototipe untuk judul orisinal berikutnya.",
      culturalNote: "",
    },
  ]).onConflictDoNothing();

  // ---- Milestones (6 existing cards) ----
  const milestones: Array<{
    id: string; yearLabel: string; kind: string; badgeText: string; sortOrder: number;
    en: { title: string; org: string; description: string };
    id_: { title: string; org: string; description: string };
  }> = [
    {
      id: "p2mw", yearLabel: "2025", kind: "grant", badgeText: "Rp 10.000.000", sortOrder: 1,
      en: { title: "Program Pembinaan Mahasiswa Wirausaha (P2MW)", org: "Belmawa & Universitas Tidar", description: "Selected recipient of national entrepreneurship incubation and development grant funding totaling Rp10,000,000." },
      id_: { title: "Program Pembinaan Mahasiswa Wirausaha (P2MW)", org: "Belmawa & Universitas Tidar", description: "Terpilih menerima hibah pendanaan dan program pembinaan wirausaha nasional sebesar Rp10.000.000." },
    },
    {
      id: "investor", yearLabel: "2026", kind: "angel", badgeText: "Rp 5.000.000", sortOrder: 2,
      en: { title: "Private Angel Investment", org: "Private Individual Investor", description: "Secured Rp5,000,000 in early-stage growth capital from an individual angel investor supporting creative technology." },
      id_: { title: "Pendanaan Investor Privat", org: "Private Individual Investor", description: "Menerima pendanaan tahap awal sebesar Rp5.000.000 dari investor privat independen untuk mendukung pertumbuhan studio." },
    },
    {
      id: "uad-fair", yearLabel: "2025", kind: "competition", badgeText: "3rd Place Winner", sortOrder: 3,
      en: { title: "UAD Fair 2025 — 3rd Place", org: "Creative Industry Category", description: "Awarded 3rd place honors in the national university creative industry competition for innovative interactive digital development." },
      id_: { title: "Juara 3 — UAD Fair 2025", org: "Kategori Industri Kreatif", description: "Meraih penghargaan Juara 3 dalam kompetisi industri kreatif universitas tingkat nasional atas karya interaktif digital inovatif." },
    },
    {
      id: "kmi-expo", yearLabel: "2025", kind: "showcase", badgeText: "Exhibition", sortOrder: 4,
      en: { title: "KMI Expo National Showcase", org: "Kewirausahaan Mahasiswa Indonesia", description: "Participated and exhibited Merantaw's entrepreneurial game development model on a national stage." },
      id_: { title: "Partisipan KMI Expo Nasional", org: "Kewirausahaan Mahasiswa Indonesia", description: "Mengikuti pameran kewirausahaan mahasiswa tingkat nasional untuk memperkenalkan model bisnis dan karya game studio Merantaw." },
    },
    {
      id: "gelar-karya", yearLabel: "2025", kind: "innovation", badgeText: "University Level", sortOrder: 5,
      en: { title: "Gelar Karya Universitas Tidar", org: "Universitas Tidar", description: "Showcased technical projects and interactive demos at the university-wide innovation exhibition." },
      id_: { title: "Gelar Karya Universitas Tidar", org: "Universitas Tidar", description: "Berpartisipasi aktif dalam pameran inovasi dan karya teknologi tingkat universitas." },
    },
    {
      id: "legal-ip", yearLabel: "COMPLIANCE", kind: "compliance", badgeText: "4 Registered IPs", sortOrder: 6,
      en: { title: "Intellectual Property & Compliance", org: "NIB · NPWP · 4 Registered IPs", description: "Holds 4 registered intellectual property rights (HKI), with verified business registration via NIB & NPWP." },
      id_: { title: "Kekayaan Intelektual & Legalitas", org: "NIB · NPWP · 4 Hak Cipta (HKI)", description: "Memiliki 4 pendaftaran Hak Kekayaan Intelektual (HKI) serta identitas usaha resmi ber-NIB dan ber-NPWP." },
    },
  ];

  for (const m of milestones) {
    await db.insert(schema.milestones).values({
      id: m.id, yearLabel: m.yearLabel, kind: m.kind,
      badgeText: m.badgeText, sortOrder: m.sortOrder,
      createdAt: now, updatedAt: now,
    }).onConflictDoNothing();
    await db.insert(schema.milestoneI18n).values([
      { milestoneId: m.id, lang: "en", ...m.en },
      { milestoneId: m.id, lang: "id", title: m.id_.title, org: m.id_.org, description: m.id_.description },
    ]).onConflictDoNothing();
  }

  // ---- Studio facts ----
  await db.insert(schema.studioFacts).values([
    { key: "active_core", value: "3", mode: "manual", note: "Active core members" },
    { key: "network_total", value: "10", mode: "manual", note: "Collaborated developers (historical)" },
    { key: "ip_count", value: "4", mode: "manual", note: "Registered IPs (HKI)" },
    { key: "partners_count", value: "2", mode: "manual", note: "Program affiliations" },
    { key: "founded_year", value: "2024", mode: "manual", note: "Founded year — years-dev auto = now - this" },
    { key: "published_count", value: "1", mode: "auto", note: "Auto: count of published/flagship projects" },
  ]).onConflictDoNothing();

  // ---- Channels ----
  const channels = [
    { key: "email", value: "contact@merantaw.my.id", label: "Official Studio Email", isLink: false, sortOrder: 1 },
    { key: "domain", value: "merantaw.my.id", label: "Domain", isLink: false, sortOrder: 2 },
    { key: "location", value: "Magelang, Central Java, Indonesia", label: "Headquarters", isLink: false, sortOrder: 3 },
    { key: "itch", value: "https://merantawid.itch.io", label: "itch.io", isLink: true, sortOrder: 4 },
    { key: "github", value: "https://github.com/merantaw", label: "GitHub", isLink: true, sortOrder: 5 },
    { key: "discord", value: "Discord (Verified on request)", label: "Discord", isLink: false, sortOrder: 6 },
    { key: "instagram", value: "Instagram (@merantaw)", label: "Instagram", isLink: false, sortOrder: 7 },
  ];
  for (const c of channels) {
    await db.insert(schema.channels).values({ ...c, updatedAt: now }).onConflictDoNothing();
  }

  // ---- Sample news (draft, so homepage stays clean until published) ----
  await db.insert(schema.news).values({
    id: "selamat-datang-di-merantaw",
    status: "draft",
    coverKey: null,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();
  await db.insert(schema.newsI18n).values([
    {
      newsId: "selamat-datang-di-merantaw", lang: "en",
      title: "Welcome to the new Merantaw site",
      excerpt: "Our company profile is now live — explore our flagship work, milestones, and studio story.",
      body: "This is a sample draft post. Publish real news from the admin panel.",
    },
    {
      newsId: "selamat-datang-di-merantaw", lang: "id",
      title: "Selamat datang di situs baru Merantaw",
      excerpt: "Company profile kami sudah live — jelajahi karya unggulan, pencapaian, dan cerita studio.",
      body: "Ini contoh draf. Terbitkan berita asli dari halaman admin.",
    },
  ]).onConflictDoNothing();

  console.log("Seed complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
