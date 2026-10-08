export type Language = 'en' | 'id';

export interface Translations {
  nav: {
    about: string;
    works: string;
    capabilities: string;
    milestones: string;
    team: string;
    contact: string;
    inquireBtn: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    locationLabel: string;
    metricsLabels: {
      activeTeam: string;
      historicalNetwork: string;
      yearsDev: string;
      publishedWork: string;
      intellectualProperty: string;
      institutionalPartners: string;
    };
  };
  philosophy: {
    sectionTag: string;
    title: string;
    quoteIndonesian: string;
    quoteTranslation: string;
    leadParagraph: string;
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
  featuredProject: {
    sectionTag: string;
    title: string;
    flagshipBadge: string;
    horrorClarificationBadge: string;
    horrorClarificationText: string;
    description: string;
    culturalNote: string;
    statusLabel: string;
    platformLabel: string;
    yearLabel: string;
    itchCta: string;
    learnMoreCta: string;
    upcomingTag: string;
    upcomingTitle: string;
    upcomingDesc: string;
  };
  capabilities: {
    sectionTag: string;
    title: string;
    subtitle: string;
    items: {
      [key: string]: {
        title: string;
        desc: string;
      };
    };
  };
  milestones: {
    sectionTag: string;
    title: string;
    subtitle: string;
    institutionalTag: string;
    institutionalDesc: string;
    items: {
      p2mw: {
        title: string;
        org: string;
        desc: string;
      };
      investor: {
        title: string;
        org: string;
        desc: string;
      };
      uadFair: {
        title: string;
        org: string;
        desc: string;
      };
      kmiExpo: {
        title: string;
        org: string;
        desc: string;
      };
      gelarKarya: {
        title: string;
        org: string;
        desc: string;
      };
      legalIp: {
        title: string;
        org: string;
        desc: string;
      };
    };
  };
  team: {
    sectionTag: string;
    title: string;
    subtitle: string;
    coreTitle: string;
    coreDesc: string;
    networkTitle: string;
    networkDesc: string;
    disciplinesLabel: string;
    founderNote: string;
  };
  contact: {
    sectionTag: string;
    title: string;
    subtitle: string;
    investorAudienceBadge: string;
    investorAudienceText: string;
    publicAudienceBadge: string;
    publicAudienceText: string;
    emailLabel: string;
    locationLabel: string;
    locationValue: string;
    officialChannelsLabel: string;
    copyEmail: string;
    copiedEmail: string;
    inquiryFormTitle: string;
    formName: string;
    formEmail: string;
    formSubject: string;
    formMessage: string;
    formSubmit: string;
    formNotice: string;
  };
  footer: {
    tagline: string;
    legalNote: string;
    quickLinks: string;
    channels: string;
    allRightsReserved: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: "Philosophy",
      works: "Works",
      capabilities: "Capabilities",
      milestones: "Milestones",
      team: "Studio",
      contact: "Inquiries",
      inquireBtn: "Get in Touch"
    },
    hero: {
      badge: "Game & Interactive Studio · Magelang, Indonesia",
      headline: "Building games, interactive experiences, and technology",
      headlineHighlight: "from Indonesia.",
      description: "Founded in 2024, Merantaw is an independent indie studio creating meaningful digital works across game development, 3D production, and interactive systems while elevating Indonesian culture to international audiences.",
      primaryCta: "Explore Flagship Work",
      secondaryCta: "Studio Capabilities",
      locationLabel: "Based in Magelang, Central Java",
      metricsLabels: {
        activeTeam: "Active Core Members",
        historicalNetwork: "Collaborated Developers",
        yearsDev: "Years of Development",
        publishedWork: "Published Demo Release",
        intellectualProperty: "Intellectual Properties (HKI)",
        institutionalPartners: "Program Affiliations"
      }
    },
    philosophy: {
      sectionTag: "01 / STUDIO PHILOSOPHY",
      title: "Storytelling, Cultural Expression, and Technological Exploration",
      quoteIndonesian: "“Membangun dan berkontribusi dalam komunitas game developer di Indonesia, serta memperkenalkan budaya Indonesia ke mancanegara.”",
      quoteTranslation: "“Building and contributing to Indonesia's game development ecosystem, while introducing Indonesian culture to wider audiences across the globe.”",
      leadParagraph: "Merantaw believes that games and interactive media are more than entertainment—they are potent mediums for storytelling, cultural preservation, experimentation, and technical advancement.",
      pillars: [
        {
          title: "Independent & Creative",
          description: "Driven by artistic autonomy, crafting original interactive experiences with a distinctive creative voice."
        },
        {
          title: "Technical & Experimental",
          description: "Bridging game design with software engineering, R&D, and rapid iterative prototyping."
        },
        {
          title: "Indonesian Heritage to the World",
          description: "Translating authentic Nusantara environments, mythologies, and perspectives into compelling global media."
        }
      ]
    },
    featuredProject: {
      sectionTag: "02 / SELECTED WORK",
      title: "Flagship Interactive Production",
      flagshipBadge: "FLAGSHIP PROJECT",
      horrorClarificationBadge: "BRAND POSITIONING NOTE",
      horrorClarificationText: "While Nusantara: Pasar Bubrah contains atmospheric horror elements, horror is an artistic choice for this specific project and does not define Merantaw as a horror-only studio.",
      description: "An atmospheric interactive experience inspired by Indonesian folklore, authentic environments, and contemporary storytelling. As Merantaw's flagship creative work, it explores cultural immersion and suspense through interactive mechanics.",
      culturalNote: "Currently available as a playable public demo through itch.io, representing Merantaw's dedication to narrative craft and technical execution.",
      statusLabel: "Status",
      platformLabel: "Distribution",
      yearLabel: "Release Year",
      itchCta: "Play Demo on itch.io",
      learnMoreCta: "View Project Specs",
      upcomingTag: "PIPELINE",
      upcomingTitle: "2nd Title Currently in R&D",
      upcomingDesc: "Building on our interactive pipeline, Merantaw is actively researching and prototyping our next standalone production."
    },
    capabilities: {
      sectionTag: "03 / CAPABILITIES & SERVICES",
      title: "Multidisciplinary Engineering & Production",
      subtitle: "From low-level programming to atmospheric 3D world-building, Merantaw operates across eight specialized domains.",
      items: {
        gameDev: {
          title: "Game Development",
          desc: "End-to-end interactive game development spanning gameplay programming, systems design, level architecture, and production."
        },
        softwareDev: {
          title: "Software Development",
          desc: "Engineered tools, runtime software, and technology-oriented systems built for performance and scalability."
        },
        webDev: {
          title: "Web Development",
          desc: "Modern digital experiences, interactive web applications, and high-performance digital platforms."
        },
        mobileDev: {
          title: "Mobile Development",
          desc: "Development and rapid prototyping of responsive mobile applications and intuitive touch-driven experiences."
        },
        threeDProd: {
          title: "3D Production",
          desc: "Comprehensive 3D asset creation, environment modeling, atmospheric lighting, and visual pipeline implementation."
        },
        uiUx: {
          title: "UI / UX Design",
          desc: "Player interface systems, intuitive interaction mechanics, wireframing, and ergonomic digital design."
        },
        rnd: {
          title: "Research & Development",
          desc: "Continuous technical exploration, shader experiments, algorithmic mechanics, and bleeding-edge workflows."
        },
        prototyping: {
          title: "Rapid Prototyping",
          desc: "Fast-paced validation of gameplay mechanics, interaction theories, and software concepts before full-scale production."
        }
      }
    },
    milestones: {
      sectionTag: "04 / MILESTONES & VALIDATION",
      title: "Track Record & Institutional Recognition",
      subtitle: "Merantaw is backed by competitive incubation programs, institutional grants, and legal foundations.",
      institutionalTag: "Institutional Affiliations",
      institutionalDesc: "Program participation and funding support from prominent national academic and ministerial bodies.",
      items: {
        p2mw: {
          title: "Program Pembinaan Mahasiswa Wirausaha (P2MW)",
          org: "Belmawa & Universitas Tidar",
          desc: "Selected recipient of national entrepreneurship incubation and development grant funding totaling Rp10,000,000."
        },
        investor: {
          title: "Private Angel Investment",
          org: "Private Individual Investor",
          desc: "Secured Rp5,000,000 in early-stage growth capital from an individual angel investor supporting creative technology."
        },
        uadFair: {
          title: "UAD Fair 2025 — 3rd Place",
          org: "Creative Industry Category",
          desc: "Awarded 3rd place honors in the national university creative industry competition for innovative interactive digital development."
        },
        kmiExpo: {
          title: "KMI Expo National Showcase",
          org: "Kewirausahaan Mahasiswa Indonesia",
          desc: "Participated and exhibited Merantaw's entrepreneurial game development model on a national stage."
        },
        gelarKarya: {
          title: "Gelar Karya Universitas Tidar",
          org: "Universitas Tidar",
          desc: "Showcased technical projects and interactive demos at the university-wide innovation exhibition."
        },
        legalIp: {
          title: "Intellectual Property & Compliance",
          org: "NIB · NPWP · 4 Registered IPs",
          desc: "Holds 4 registered intellectual property rights (HKI), with verified business registration via NIB & NPWP."
        }
      }
    },
    team: {
      sectionTag: "05 / THE STUDIO",
      title: "Agile, Multidisciplinary Studio",
      subtitle: "Founded in 2024 by Farrel Apriandry, Merantaw combines a dedicated core unit with an adaptable network of creative engineers.",
      coreTitle: "3 Active Core Members",
      coreDesc: "Our compact team structure guarantees nimble iteration, tight creative alignment, and direct technical execution across all project phases.",
      networkTitle: "10 Developers Across History",
      networkDesc: "Over our development journey, Merantaw has collaborated with 10 developers to assemble tailored production teams according to project scale.",
      disciplinesLabel: "Studio Competencies & Disciplines:",
      founderNote: "Founded by Farrel Apriandry in Magelang, Central Java."
    },
    contact: {
      sectionTag: "06 / INQUIRIES & CONTACT",
      title: "Let's Build Something Meaningful",
      subtitle: "Open to strategic collaborations, publishing dialogues, and investment conversations.",
      investorAudienceBadge: "FOR INVESTORS & PARTNERS",
      investorAudienceText: "Seeking opportunities to support independent Indonesian gaming, interactive technology, or co-production ventures? We welcome formal discussions.",
      publicAudienceBadge: "FOR CREATIVES & AUDIENCES",
      publicAudienceText: "Interested in our projects, game community collaborations, or technical exchange? Connect with our team.",
      emailLabel: "Official Studio Email",
      locationLabel: "Headquarters",
      locationValue: "Magelang, Central Java, Indonesia",
      officialChannelsLabel: "Official Platforms",
      copyEmail: "Copy Email",
      copiedEmail: "Copied to clipboard!",
      inquiryFormTitle: "Send an Inquiry",
      formName: "Your Name / Organization",
      formEmail: "Email Address",
      formSubject: "Subject (Collaboration / Investment / General)",
      formMessage: "Tell us about your proposal or inquiry...",
      formSubmit: "Send Message",
      formNotice: "Responses typically sent within 2 business days."
    },
    footer: {
      tagline: "Merantaw is an independent indie game and interactive studio from Magelang, Indonesia.",
      legalNote: "Merantaw operates as an independent studio and has not yet established a formal legal entity (bukan PT/CV). Holds verified NIB, NPWP, and 4 Intellectual Property rights. Domain: merantaw.my.id",
      quickLinks: "Navigation",
      channels: "Official Channels",
      allRightsReserved: "All rights reserved."
    }
  },
  id: {
    nav: {
      about: "Filosofi",
      works: "Karya",
      capabilities: "Kapabilitas",
      milestones: "Pencapaian",
      team: "Studio",
      contact: "Kontak",
      inquireBtn: "Hubungi Kami"
    },
    hero: {
      badge: "Game & Interactive Studio · Magelang, Indonesia",
      headline: "Membangun game, pengalaman interaktif, dan teknologi",
      headlineHighlight: "dari Indonesia.",
      description: "Didirikan pada tahun 2024, Merantaw adalah studio indie independen yang menciptakan karya digital bermakna dalam pengembangan game, produksi 3D, dan sistem interaktif, sekaligus memperkenalkan budaya Indonesia ke kancah mancanegara.",
      primaryCta: "Jelajahi Karya Unggulan",
      secondaryCta: "Kapabilitas Studio",
      locationLabel: "Berbasis di Magelang, Jawa Tengah",
      metricsLabels: {
        activeTeam: "Anggota Tim Aktif",
        historicalNetwork: "Pengembang Berkolaborasi",
        yearsDev: "Tahun Pengembangan",
        publishedWork: "Demo Karya Dirilis",
        intellectualProperty: "Hak Kekayaan Intelektual (HKI)",
        institutionalPartners: "Kemitraan Program"
      }
    },
    philosophy: {
      sectionTag: "01 / FILOSOFI STUDIO",
      title: "Penceritaan, Ekspresi Budaya, dan Eksplorasi Teknologi",
      quoteIndonesian: "“Membangun dan berkontribusi dalam komunitas game developer di Indonesia, serta memperkenalkan budaya Indonesia ke mancanegara.”",
      quoteTranslation: "Falsafah Inti Merantaw — Farrel Apriandry (Founder)",
      leadParagraph: "Merantaw meyakini bahwa game dan media interaktif bukan sekadar hiburan, melainkan medium bagi penceritaan, pelestarian budaya, eksperimentasi artistik, dan pengembangan teknologi.",
      pillars: [
        {
          title: "Independen & Kreatif",
          description: "Digerakkan oleh otonomi artistik untuk merancang karya interaktif orisinal dengan identitas kreatif yang khas."
        },
        {
          title: "Teknis & Eksperimental",
          description: "Memadukan rancangan game dengan rekayasa perangkat lunak, riset & pengembangan (R&D), serta pembuatan prototipe cepat."
        },
        {
          title: "Budaya Indonesia ke Dunia",
          description: "Menerjemahkan lanskap Nusantara, mitologi lokal, dan gagasan kontemporer ke dalam media global yang memikat."
        }
      ]
    },
    featuredProject: {
      sectionTag: "02 / KARYA UNGGULAN",
      title: "Produksi Interaktif Unggulan",
      flagshipBadge: "PROYEK UTAMA",
      horrorClarificationBadge: "CATATAN POSISI BRAND",
      horrorClarificationText: "Meskipun Nusantara: Pasar Bubrah memuat elemen horor atmosferik, genre horor adalah karakteristik khusus dari proyek ini dan tidak mendefinisikan Merantaw sebagai studio horor semata.",
      description: "Sebuah pengalaman interaktif atmosferik yang terinspirasi oleh folklor, lanskap otentik, dan penceritaan kontemporer Indonesia. Sebagai karya kreatif unggulan Merantaw, proyek ini mengeksplorasi imersi budaya dan ketegangan melalui mekanik interaktif.",
      culturalNote: "Saat ini tersedia sebagai demo publik yang dapat dimainkan melalui itch.io, mencerminkan dedikasi Merantaw terhadap narasi dan eksekusi teknis.",
      statusLabel: "Status Rilis",
      platformLabel: "Distribusi",
      yearLabel: "Tahun Rilis",
      itchCta: "Mainkan Demo di itch.io",
      learnMoreCta: "Spesifikasi Proyek",
      upcomingTag: "PIPELINE PENGEMBANGAN",
      upcomingTitle: "Karya Kedua Sedang dalam Tahap R&D",
      upcomingDesc: "Memanfaatkan alur produksi interaktif kami, Merantaw saat ini aktif meneliti dan membuat prototipe untuk judul orisinal berikutnya."
    },
    capabilities: {
      sectionTag: "03 / KAPABILITAS & LAYANAN",
      title: "Rekayasa & Produksi Multidisiplin",
      subtitle: "Dari pemrograman tingkat rendah hingga pembangunan dunia 3D atmosferik, Merantaw beroperasi di delapan domain keahlian.",
      items: {
        gameDev: {
          title: "Pengembangan Game",
          desc: "Pengembangan game interaktif menyeluruh: pemrograman gameplay, desain sistem mekanik, arsitektur level, dan produksi."
        },
        softwareDev: {
          title: "Pengembangan Perangkat Lunak",
          desc: "Pembangunan sistem perangkat lunak, perkakas internal (tools), dan produk berbasis teknologi berkinerja tinggi."
        },
        webDev: {
          title: "Pengembangan Web",
          desc: "Situs web modern, aplikasi web interaktif, dan platform digital berorientasi pengalaman imersif."
        },
        mobileDev: {
          title: "Pengembangan Mobile",
          desc: "Pembuatan aplikasi mobile dan prototipe pengalaman interaktif berbasis sentuhan yang responsif."
        },
        threeDProd: {
          title: "Produksi 3D",
          desc: "Pembuatan aset 3D, pemodelan lingkungan (environment art), pencahayaan atmosferik, dan visual pendukung."
        },
        uiUx: {
          title: "Desain UI / UX",
          desc: "Desain antarmuka pengguna interaktif, sistem ergonomis interaksi pemain, dan sistem desain digital."
        },
        rnd: {
          title: "Riset & Pengembangan (R&D)",
          desc: "Eksplorasi teknis berkelanjutan, eksperimen shader, mekanik algoritma baru, dan alur kerja teknologi mutakhir."
        },
        prototyping: {
          title: "Pembuatan Prototipe Cepat",
          desc: "Validasi kilat untuk ide mekanik permainan, teori interaksi, dan kelayakan sistem sebelum produksi penuh."
        }
      }
    },
    milestones: {
      sectionTag: "04 / PENCAPAIAN & VALIDASI",
      title: "Rekam Jejak & Pengakuan Institusi",
      subtitle: "Merantaw didukung oleh program pembinaan wirausaha kompetitif, pendanaan hibah, dan fondasi legalitas resmi.",
      institutionalTag: "Kemitraan Institusi",
      institutionalDesc: "Partisipasi program dan dukungan pendanaan dari institusi pendidikan tinggi dan kementerian nasional.",
      items: {
        p2mw: {
          title: "Program Pembinaan Mahasiswa Wirausaha (P2MW)",
          org: "Belmawa & Universitas Tidar",
          desc: "Terpilih menerima hibah pendanaan dan program pembinaan wirausaha nasional sebesar Rp10.000.000."
        },
        investor: {
          title: "Pendanaan Investor Privat",
          org: "Private Individual Investor",
          desc: "Menerima pendanaan tahap awal sebesar Rp5.000.000 dari investor privat independen untuk mendukung pertumbuhan studio."
        },
        uadFair: {
          title: "Juara 3 — UAD Fair 2025",
          org: "Kategori Industri Kreatif",
          desc: "Meraih penghargaan Juara 3 dalam kompetisi industri kreatif universitas tingkat nasional atas karya interaktif digital inovatif."
        },
        kmiExpo: {
          title: "Partisipan KMI Expo Nasional",
          org: "Kewirausahaan Mahasiswa Indonesia",
          desc: "Mengikuti pameran kewirausahaan mahasiswa tingkat nasional untuk memperkenalkan model bisnis dan karya game studio Merantaw."
        },
        gelarKarya: {
          title: "Gelar Karya Universitas Tidar",
          org: "Universitas Tidar",
          desc: "Berpartisipasi aktif dalam pameran inovasi dan karya teknologi tingkat universitas."
        },
        legalIp: {
          title: "Kekayaan Intelektual & Legalitas",
          org: "NIB · NPWP · 4 Hak Cipta (HKI)",
          desc: "Memiliki 4 pendaftaran Hak Kekayaan Intelektual (HKI) serta identitas usaha resmi ber-NIB dan ber-NPWP."
        }
      }
    },
    team: {
      sectionTag: "05 / TENTANG STUDIO",
      title: "Studio Lincah & Multidisiplin",
      subtitle: "Didirikan pada 2024 oleh Farrel Apriandry di Magelang, Merantaw menggabungkan inti tim yang lincah dengan jejaring kolaborator berpengalaman.",
      coreTitle: "3 Anggota Tim Aktif",
      coreDesc: "Struktur tim ramping kami memungkinkan kolaborasi erat lintas disiplin kreatif dan teknis dengan fleksibilitas produksi yang tinggi.",
      networkTitle: "10 Pengembang dalam Jejak Sejarah",
      networkDesc: "Sepanjang perjalanannya, Merantaw telah bekerja sama dengan 10 pengembang untuk merakit tim produksi sesuai skala proyek.",
      disciplinesLabel: "Disiplin & Keahlian Studio:",
      founderNote: "Didirikan oleh Farrel Apriandry di Magelang, Jawa Tengah."
    },
    contact: {
      sectionTag: "06 / KONTAK & KOLABORASI",
      title: "Mari Bangun Karya Bersama",
      subtitle: "Terbuka untuk kolaborasi strategis, kemitraan penerbitan (publishing), dan diskusi investasi.",
      investorAudienceBadge: "UNTUK INVESTOR & MITRA",
      investorAudienceText: "Tertarik mendukung karya game mandiri Indonesia, teknologi interaktif, atau proyek bersama? Kami menyambut diskusi profesional.",
      publicAudienceBadge: "UNTUK PUBLIK & KOMUNITAS",
      publicAudienceText: "Ingin mengetahui lebih jauh tentang karya kami, kolaborasi komunitas, atau pertukaran teknis? Hubungi kami.",
      emailLabel: "Email Resmi Studio",
      locationLabel: "Lokasi Studio",
      locationValue: "Magelang, Jawa Tengah, Indonesia",
      officialChannelsLabel: "Kanal Resmi",
      copyEmail: "Salin Email",
      copiedEmail: "Email tersalin!",
      inquiryFormTitle: "Kirim Pesan / Pengajuan",
      formName: "Nama Anda / Organisasi",
      formEmail: "Alamat Email",
      formSubject: "Subjek (Kolaborasi / Investasi / Umum)",
      formMessage: "Tuliskan rincian pesan atau tawaran kolaborasi...",
      formSubmit: "Kirim Pesan",
      formNotice: "Kami merespons pesan kerja sama dalam 1-2 hari kerja."
    },
    footer: {
      tagline: "Merantaw adalah studio indie game dan interaktif independen yang berbasis di Magelang, Indonesia.",
      legalNote: "Merantaw beroperasi sebagai studio independen dan belum berbadan hukum formal (bukan PT/CV). Memiliki NIB, NPWP, dan 4 Hak Kekayaan Intelektual terdaftar. Domain: merantaw.my.id",
      quickLinks: "Navigasi",
      channels: "Kanal Resmi",
      allRightsReserved: "Hak cipta dilindungi undang-undang."
    }
  }
};
