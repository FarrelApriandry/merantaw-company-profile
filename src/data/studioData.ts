export interface ProjectData {
  id: string;
  title: string;
  year: string;
  type: string;
  status: string;
  platform: string;
  distributionUrl?: string;
  bannerImage: string;
  thumbnails: string[];
  isFlagship: boolean;
  isInDevelopment?: boolean;
}

export interface CapabilityData {
  number: string;
  id: string;
  icon: string;
  tags: string[];
}

export interface MetricData {
  value: string;
  suffix?: string;
  id: string;
}

export interface MilestoneData {
  id: string;
  year: string;
  type: 'funding' | 'award' | 'expo' | 'compliance';
  highlight?: string;
}

export const studioInfo = {
  name: "Merantaw",
  brandColor: "#192C56",
  foundedYear: 2024,
  location: "Magelang, Indonesia",
  founder: "Farrel Apriandry",
  primaryPositioning: "Game & Interactive Studio",
  legalStatusNote: "Independent Indie Game Studio (NIB & NPWP Registered)",
  domain: "merantaw.my.id",
  officialEmail: "contact@merantaw.my.id",
  channels: {
    itch: "https://merantaw.itch.io",
    github: "https://github.com/merantaw",
    discord: "#",
    instagram: "#",
    youtube: "#",
    tiktok: "#",
    x: "#"
  }
};

export const metricsData: MetricData[] = [
  { value: "3", suffix: "", id: "activeTeam" },
  { value: "10", suffix: "+", id: "historicalNetwork" },
  { value: "2+", suffix: "Yrs", id: "yearsDev" },
  { value: "1", suffix: "", id: "publishedWork" },
  { value: "4", suffix: "", id: "intellectualProperty" },
  { value: "2", suffix: "", id: "institutionalPartners" }
];

export const flagshipProject: ProjectData = {
  id: "pasar-bubrah",
  title: "NUSANTARA: PASAR BUBRAH",
  year: "2025",
  type: "Atmospheric Interactive Game",
  status: "Demo Release",
  platform: "PC / itch.io",
  distributionUrl: "https://merantaw.itch.io/nusantara-pasar-bubrah",
  bannerImage: "/assets/pasar-bubrah-banner.svg",
  thumbnails: [
    "/assets/pasar-bubrah-thumb-1.svg",
    "/assets/pasar-bubrah-thumb-2.svg"
  ],
  isFlagship: true
};

export const upcomingProject: ProjectData = {
  id: "upcoming-02",
  title: "PROJECT 02 (IN DEVELOPMENT)",
  year: "2026",
  type: "Interactive Experience & Game R&D",
  status: "In Development",
  platform: "To Be Announced",
  bannerImage: "/assets/project-upcoming.svg",
  thumbnails: [],
  isFlagship: false,
  isInDevelopment: true
};

export const capabilitiesList: CapabilityData[] = [
  { number: "01", id: "gameDev", icon: "Gamepad2", tags: ["Unreal Engine", "Game Design", "Mechanics", "Level Design"] },
  { number: "02", id: "softwareDev", icon: "Code2", tags: ["Systems Architecture", "Tools Development", "Runtime Engines"] },
  { number: "03", id: "webDev", icon: "Globe2", tags: ["Interactive Web", "High-Performance Sites", "Web Experiences"] },
  { number: "04", id: "mobileDev", icon: "Smartphone", tags: ["Mobile Experiences", "Touch Systems", "Prototyping"] },
  { number: "05", id: "threeDProd", icon: "Box", tags: ["3D Environments", "Asset Modeling", "Lighting & Visuals"] },
  { number: "06", id: "uiUx", icon: "Palette", tags: ["Player UI", "Interaction Design", "Design Systems"] },
  { number: "07", id: "rnd", icon: "Cpu", tags: ["Technical Exploration", "Shader Tech", "Experimental Mechanics"] },
  { number: "08", id: "prototyping", icon: "Compass", tags: ["Rapid Concept Validation", "System Testing", "Interactive Iteration"] }
];

export const teamDisciplines = [
  "Project Management",
  "Game Programming",
  "Game Design",
  "Level Design",
  "3D Production & Art",
  "2D Art & Concept",
  "Music Production & Audio"
];

export const milestonesList: MilestoneData[] = [
  {
    id: "p2mw",
    year: "2024",
    type: "funding",
    highlight: "Rp10.000.000"
  },
  {
    id: "investor",
    year: "2024 - 2025",
    type: "funding",
    highlight: "Rp5.000.000"
  },
  {
    id: "uadFair",
    year: "2025",
    type: "award",
    highlight: "3rd Place Winner"
  },
  {
    id: "kmiExpo",
    year: "2024",
    type: "expo"
  },
  {
    id: "gelarKarya",
    year: "2024",
    type: "expo"
  },
  {
    id: "legalIp",
    year: "2024 - Present",
    type: "compliance",
    highlight: "4 IP / HKI"
  }
];
