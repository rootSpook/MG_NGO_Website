import { BylawItem, ReportItem, IbanDataItem, ContactDetailsItem, BoardMemberItem, SupporterItem, ManagedPageItem,} from "@/types/adminPanel";

export const mockBylaws: BylawItem[] = [
  {
    id: "bylaw-1",
    date: "2024-01-10",
    title: "Main Statute — Amendment 2024",
    version: "v3.2",
    type: "PDF",
    uploadedBy: "Admin",
    status: "active",
    fileUrl: "#",
  },
  {
    id: "bylaw-2",
    date: "2022-03-15",
    title: "Internal Regulations",
    version: "v2.1",
    type: "PDF",
    uploadedBy: "Admin",
    status: "active",
    fileUrl: "#",
  },
  {
    id: "bylaw-3",
    date: "2020-07-01",
    title: "Main Statute — Original",
    version: "v1.0",
    type: "PDF",
    uploadedBy: "Admin",
    status: "archived",
    fileUrl: "#",
  },
  {
    id: "bylaw-4",
    date: "2019-11-05",
    title: "Founding Charter",
    version: "v1.0",
    type: "PDF",
    uploadedBy: "Admin",
    status: "archived",
    fileUrl: "#",
  },
];

export const mockReports: ReportItem[] = [
  {
    id: "report-1",
    year: "2023",
    title: "Annual Activity Report 2023",
    category: "Annual",
    fileSize: "4.2 MB",
    uploadDate: "2024-01-05",
    status: "published",
    fileType: "PDF",
    uploadedBy: "Admin",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "report-2",
    year: "2023",
    title: "Financial Transparency Report 2023",
    category: "Financial",
    fileSize: "2.8 MB",
    uploadDate: "2024-01-05",
    status: "published",
    fileType: "PDF",
    uploadedBy: "Admin",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "report-3",
    year: "2022",
    title: "Annual Activity Report 2022",
    category: "Annual",
    fileSize: "3.9 MB",
    uploadDate: "2023-02-10",
    status: "published",
    fileType: "PDF",
    uploadedBy: "Admin",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "report-4",
    year: "2022",
    title: "Board Meeting Minutes 2022",
    category: "Meeting",
    fileSize: "1.2 MB",
    uploadDate: "2023-01-20",
    status: "archived",
    fileType: "DOCX",
    uploadedBy: "Admin",
    fileUrl: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx",
  },
  {
    id: "report-5",
    year: "2021",
    title: "Annual Activity Report 2021",
    category: "Annual",
    fileSize: "3.5 MB",
    uploadDate: "2022-03-01",
    status: "archived",
    fileType: "PDF",
    uploadedBy: "Admin",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

export const mockIbanData: IbanDataItem = {
  ibanNumber: "TR00 0000 0000 0000 0000 0000 00",
  bankName: "Türkiye İş Bankası",
  accountHolderName: "Myasthenia Gravis Yaşam Derneği",
  branchName: "Kadıköy Branch",
  bicSwiftCode: "ISBKTRISXXX",
  currency: "Turkish Lira (TRY)",
  accountType: "Savings Account",
};

export const mockContactDetails: ContactDetailsItem = {
    address: "Bağdat Caddesi No:123, Kadıköy, Istanbul",
    city: "Istanbul",
    postalCode: "34710",
    phoneNumber: "+90 (212) 555 01 23",
    emailAddress: "info@mgdernegi.org",
    facebook: "https://facebook.com/mgdernegi",
    instagram: "https://instagram.com/mgdernegi",
    twitter: "https://twitter.com/mgdernegi",
    linkedin: "https://linkedin.com/company/mgdernegi",
    youtube: "https://youtube.com/@mgdernegi",
  };

  export const mockBoardMembers: BoardMemberItem[] = [
    {
      id: "board-1",
      fullName: "Prof. Dr. Ahmet Yılmaz",
      roleTitle: "Chairman",
      period: "2022–Present",
      specialization: "Neurology",
    },
    {
      id: "board-2",
      fullName: "Dr. Elif Kaya",
      roleTitle: "Vice Chairman",
      period: "2022–Present",
      specialization: "Internal Medicine",
    },
    {
      id: "board-3",
      fullName: "Mehmet Demir",
      roleTitle: "Secretary General",
      period: "2020–Present",
      specialization: "Administration",
    },
    {
      id: "board-4",
      fullName: "Ayşe Arslan",
      roleTitle: "Treasurer",
      period: "2022–Present",
      specialization: "Finance",
    },
    {
      id: "board-5",
      fullName: "Dr. Fatih Çelik",
      roleTitle: "Board Member",
      period: "2020–2024",
      specialization: "Immunology",
    },
    {
      id: "board-6",
      fullName: "Zeynep Şahin",
      roleTitle: "Board Member",
      period: "2022–Present",
      specialization: "Patient Advocacy",
    },
];

export const mockSupporters: SupporterItem[] = [
    {
      id: "supporter-1",
      name: "Türk Nöroloji Derneği",
      category: "Medical Association",
      since: "2020-01-01",
      description: "Türkiye genelinde nöroloji alanında faaliyet gösterir.",
    },
    {
      id: "supporter-2",
      name: "Sağlık Bakanlığı",
      category: "Government Partner",
      since: "2018-05-10",
    },
    {
      id: "supporter-3",
      name: "Boğaziçi Üniversitesi",
      category: "Academic Partner",
      since: "2021-09-01",
    },
  ];

  export const mockManagedPages: ManagedPageItem[] = [
    {
      id: "home",
      name: "Ana Sayfa",
      type: "page",
      status: "published",
      updatedAt: "2025-08-12",
      sections: [
        {
          id: "banner",
          label: "Banner",
          editorTitle: "Ana Sayfa Slider 1",
          content:
            "Myasthenia Gravis ile yaşayan milyonlarca insan için farkındalık oluşturma zamanı. Bu özel ay boyunca, hastalığa dair doğru bilgiyi yaymayı, güç vermeyi ve topluluk olarak dayanışmayı artırmayı hedefliyoruz.",
          imageUrl:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop",
        },
        {
          id: "intro",
          label: "Tanıtım Metni",
          editorTitle: "Myasthenia Gravis Yaşam Derneği Nedir?",
          content:
            "Myasthenia Gravis hastaları ve yakınlarına yönelik farkındalık oluşturmak, doğru bilgi sağlamak ve destekleyici bir topluluk oluşturmak amacıyla kurulmuş bir sivil toplum kuruluşuyuz.",
        },
      ],
    },
    {
      id: "about",
      name: "Hakkımızda",
      type: "page",
      status: "published",
      updatedAt: "2025-07-30",
      sections: [
        {
          id: "about-main",
          label: "Hakkımızda İçeriği",
          editorTitle: "Dernek Hakkında",
          content:
            "Derneğimiz, Myasthenia Gravis konusunda farkındalık yaratmak ve hastalara destek olmak amacıyla çalışmalar yürütmektedir.",
        },
      ],
    },
    {
      id: "contact",
      name: "İletişim",
      type: "page",
      status: "published",
      updatedAt: "2024-11-02",
      sections: [
        {
          id: "contact-main",
          label: "İletişim İçeriği",
          editorTitle: "Bize Ulaşın",
          content: "Sorularınız için bizimle iletişime geçebilirsiniz.",
        },
      ],
    },
    {
      id: "donate",
      name: "Bağış Yap",
      type: "donation",
      status: "draft",
      updatedAt: "2026-05-02",
      sections: [
        {
          id: "donation-main",
          label: "Bağış İçeriği",
          editorTitle: "Bağış Yap",
          content:
            "Destekleriniz, derneğimizin farkındalık ve destek çalışmalarına katkı sağlar.",
        },
      ],
    },
    {
      id: "blogs",
      name: "Bloglar",
      type: "page",
      status: "not-added",
      updatedAt: "-",
      sections: [
        {
          id: "blogs-main",
          label: "Blog Sayfası",
          editorTitle: "Bloglar",
          content: "Blog yazılarının listelendiği sayfa.",
        },
      ],
    },
    {
      id: "reports",
      name: "Raporlar",
      type: "page",
      status: "not-added",
      updatedAt: "-",
      sections: [
        {
          id: "reports-main",
          label: "Raporlar Sayfası",
          editorTitle: "Raporlar",
          content: "Dernek raporlarının listelendiği sayfa.",
        },
      ],
    },
    {
      id: "media",
      name: "Medya",
      type: "page",
      status: "not-added",
      updatedAt: "2023-01-22",
      sections: [
        {
          id: "media-main",
          label: "Medya Sayfası",
          editorTitle: "Medya",
          content: "Galeri ve medya içeriklerinin listelendiği sayfa.",
        },
      ],
    },
    {
      id: "newsletter",
      name: "Aylık Bülten",
      type: "page",
      status: "not-added",
      updatedAt: "2026-02-28",
      sections: [
        {
          id: "newsletter-main",
          label: "Bülten Sayfası",
          editorTitle: "Aylık Bülten",
          content: "Aylık bülten içerikleri burada yer alır.",
        },
      ],
    },
  ];