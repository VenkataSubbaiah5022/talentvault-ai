/**
 * Generates 30 realistic fake resumes for TalentVault AI demo.
 * Run: npm run generate:test-data
 */
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  title: string;
  location: string;
  years: number;
  role: string;
  skills: string[];
  summary: string;
  experience: { company: string; role: string; years: string; bullets: string[] }[];
  education: string;
  gapNote?: string;
}

const resumes: ResumeData[] = [
  // 10 Software Engineers
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/arjunmehta-dev",
    github: "github.com/arjunmehta",
    title: "Senior Full Stack Engineer",
    location: "Hyderabad, India",
    years: 7,
    role: "engineer",
    skills: ["react", "node.js", "typescript", "aws", "postgresql", "docker", "rest apis"],
    summary: "Full stack engineer building scalable SaaS products.",
    experience: [
      { company: "Razorpay", role: "Senior Software Engineer", years: "2021–Present", bullets: ["Led React migration serving 2M users", "Built payment webhook system on Node.js"] },
      { company: "Freshworks", role: "Software Engineer", years: "2018–2021", bullets: ["Developed CRM integrations", "Optimized API response times by 40%"] },
    ],
    education: "B.Tech Computer Science, IIT Hyderabad, 2018",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@outlook.com",
    phone: "+91 91234 56789",
    linkedin: "linkedin.com/in/priyasharma-ui",
    github: "github.com/priyasharma",
    title: "Frontend Engineer",
    location: "Bangalore, India",
    years: 4,
    role: "engineer",
    skills: ["react", "next.js", "javascript", "css", "tailwind", "figma"],
    summary: "Frontend specialist focused on design systems and performance.",
    experience: [
      { company: "Swiggy", role: "Frontend Engineer", years: "2022–Present", bullets: ["Built component library used across 5 teams"] },
      { company: "Zoho", role: "Junior Developer", years: "2020–2022", bullets: ["Shipped dashboard features in React"] },
    ],
    education: "B.E. Information Technology, Anna University, 2020",
  },
  {
    name: "James Mitchell",
    email: "j.mitchell@protonmail.com",
    phone: "+1 (415) 555-0192",
    linkedin: "linkedin.com/in/jamesmitchell-dev",
    github: "github.com/jmitchell",
    title: "Staff Software Engineer",
    location: "San Francisco, US",
    years: 12,
    role: "engineer",
    skills: ["python", "go", "kubernetes", "aws", "microservices", "system design"],
    summary: "Staff engineer designing distributed systems at scale.",
    experience: [
      { company: "Stripe", role: "Staff Engineer", years: "2019–Present", bullets: ["Architected fraud detection pipeline"] },
      { company: "Uber", role: "Senior Engineer", years: "2015–2019", bullets: ["Built real-time dispatch services in Go"] },
    ],
    education: "MS Computer Science, Stanford University, 2013",
  },
  {
    name: "Emily Chen",
    email: "emily.chen@gmail.com",
    phone: "+1 (206) 555-0147",
    linkedin: "linkedin.com/in/emilychen",
    title: "Software Engineer II",
    location: "Seattle, US",
    years: 5,
    role: "engineer",
    skills: ["java", "spring boot", "react", "azure", "sql", "agile"],
    summary: "Backend-leaning engineer with full stack experience.",
    experience: [
      { company: "Microsoft", role: "Software Engineer II", years: "2021–Present", bullets: ["Developed Azure portal features"] },
      { company: "Amazon", role: "SDE I", years: "2019–2021", bullets: ["Built inventory management APIs"] },
    ],
    education: "BS Computer Science, University of Washington, 2019",
    gapNote: "Career gap: 6 months travel sabbatical in 2021",
  },
  {
    name: "Lukas Weber",
    email: "lukas.weber@web.de",
    phone: "+49 30 12345678",
    linkedin: "linkedin.com/in/lukasweber",
    github: "github.com/lweber",
    title: "Backend Developer",
    location: "Berlin, Germany",
    years: 6,
    role: "engineer",
    skills: ["node.js", "typescript", "postgresql", "redis", "graphql", "docker"],
    summary: "Backend developer building APIs for fintech startups.",
    experience: [
      { company: "N26", role: "Backend Developer", years: "2020–Present", bullets: ["Built transaction APIs handling 1M daily requests"] },
      { company: "Zalando", role: "Junior Backend Dev", years: "2018–2020", bullets: ["Maintained catalog microservices"] },
    ],
    education: "MSc Computer Science, TU Berlin, 2018",
  },
  {
    name: "Wei Lin",
    email: "wei.lin@email.sg",
    phone: "+65 9123 4567",
    linkedin: "linkedin.com/in/wei-lin-dev",
    github: "github.com/weilin",
    title: "DevOps Engineer",
    location: "Singapore",
    years: 8,
    role: "engineer",
    skills: ["aws", "terraform", "kubernetes", "ci/cd", "python", "monitoring"],
    summary: "DevOps engineer automating cloud infrastructure.",
    experience: [
      { company: "Grab", role: "Senior DevOps Engineer", years: "2020–Present", bullets: ["Reduced deployment time by 60%"] },
      { company: "Shopee", role: "DevOps Engineer", years: "2016–2020", bullets: ["Managed EKS clusters"] },
    ],
    education: "BSc Information Systems, NUS, 2016",
  },
  {
    name: "Rohan Kapoor",
    email: "rohan.k@yahoo.com",
    phone: "+91 99887 76655",
    linkedin: "linkedin.com/in/rohankapoor",
    title: "Junior Software Developer",
    location: "Pune, India",
    years: 2,
    role: "engineer",
    skills: ["python", "django", "javascript", "html", "mysql", "git"],
    summary: "Junior developer eager to grow in web development.",
    experience: [
      { company: "TCS", role: "Junior Developer", years: "2023–Present", bullets: ["Built internal tools in Django"] },
      { company: "Intern — Infosys", role: "Intern", years: "2022", bullets: ["Assisted API testing automation"] },
    ],
    education: "B.Tech IT, Pune University, 2023",
  },
  {
    name: "Sarah Thompson",
    email: "sarah.t@company.co.uk",
    phone: "+44 7700 900123",
    linkedin: "linkedin.com/in/sarahthompson",
    github: "github.com/sthompson",
    title: "Lead Software Engineer",
    location: "London, UK",
    years: 10,
    role: "engineer",
    skills: ["react", "node.js", "aws", "typescript", "team leadership", "mongodb"],
    summary: "Lead engineer mentoring teams and shipping product features.",
    experience: [
      { company: "Monzo", role: "Lead Engineer", years: "2020–Present", bullets: ["Led team of 6 engineers"] },
      { company: "Deliveroo", role: "Senior Engineer", years: "2016–2020", bullets: ["Built order tracking system"] },
    ],
    education: "MEng Computing, Imperial College London, 2015",
  },
  {
    name: "Marcus Johnson",
    email: "marcus.j@live.com",
    phone: "+1 (312) 555-0188",
    linkedin: "linkedin.com/in/marcusjohnson",
    title: "Mobile Engineer",
    location: "Chicago, US",
    years: 5,
    role: "engineer",
    skills: ["react native", "swift", "kotlin", "firebase", "rest apis"],
    summary: "Mobile engineer building cross-platform consumer apps.",
    experience: [
      { company: "Grubhub", role: "Mobile Engineer", years: "2021–Present", bullets: ["Shipped React Native features to 5M users"] },
      { company: "Groupon", role: "Junior Mobile Dev", years: "2019–2021", bullets: ["Maintained iOS app modules"] },
    ],
    education: "BS Software Engineering, UIUC, 2019",
  },
  {
    name: "Ananya Reddy",
    email: "ananya.reddy@gmail.com",
    phone: "+91 87654 32109",
    linkedin: "linkedin.com/in/ananyareddy",
    github: "github.com/ananyareddy",
    title: "Full Stack Developer",
    location: "Chennai, India",
    years: 3,
    role: "engineer",
    skills: ["react", "node.js", "mongodb", "express", "aws", "jest"],
    summary: "Full stack developer building MVPs for startups.",
    experience: [
      { company: "Zoho", role: "Full Stack Developer", years: "2022–Present", bullets: ["Built analytics dashboard"] },
      { company: "Startup — Finly", role: "Intern", years: "2021", bullets: ["Developed payment UI in React"] },
    ],
    education: "B.E. CSE, SRM University, 2022",
  },
  // 5 Designers
  {
    name: "Mia Anderson",
    email: "mia.anderson@design.co",
    phone: "+1 (503) 555-0166",
    linkedin: "linkedin.com/in/miaanderson",
    title: "Senior Product Designer",
    location: "Portland, US",
    years: 8,
    role: "designer",
    skills: ["figma", "user research", "design systems", "prototyping", "accessibility"],
    summary: "Product designer crafting intuitive B2B SaaS experiences.",
    experience: [
      { company: "Notion", role: "Senior Product Designer", years: "2020–Present", bullets: ["Redesigned onboarding flow, +25% activation"] },
      { company: "Airbnb", role: "Product Designer", years: "2016–2020", bullets: ["Led host dashboard redesign"] },
    ],
    education: "BFA Interaction Design, RISD, 2016",
  },
  {
    name: "Oliver Wright",
    email: "oliver.w@mail.uk",
    phone: "+44 7911 123456",
    linkedin: "linkedin.com/in/oliverwright",
    title: "UX Designer",
    location: "Manchester, UK",
    years: 5,
    role: "designer",
    skills: ["figma", "sketch", "user testing", "wireframing", "html", "css"],
    summary: "UX designer focused on research-driven product design.",
    experience: [
      { company: "BBC", role: "UX Designer", years: "2021–Present", bullets: ["Designed iPlayer mobile experience"] },
      { company: "Agency — Made by Many", role: "Junior UX", years: "2019–2021", bullets: ["Client projects for fintech"] },
    ],
    education: "BA Graphic Design, UAL, 2019",
  },
  {
    name: "Sneha Iyer",
    email: "sneha.iyer@outlook.in",
    phone: "+91 98765 11122",
    linkedin: "linkedin.com/in/snehaiyer",
    title: "UI/UX Designer",
    location: "Bangalore, India",
    years: 4,
    role: "designer",
    skills: ["figma", "adobe xd", "illustration", "design systems", "mobile design"],
    summary: "UI designer creating polished mobile-first interfaces.",
    experience: [
      { company: "PhonePe", role: "UI Designer", years: "2022–Present", bullets: ["Designed payment flows for 100M users"] },
      { company: "Byju's", role: "Junior Designer", years: "2020–2022", bullets: ["Created learning app screens"] },
    ],
    education: "B.Des Communication Design, NID, 2020",
  },
  {
    name: "Hannah Mueller",
    email: "h.mueller@web.de",
    phone: "+49 89 9876543",
    linkedin: "linkedin.com/in/hannahmueller",
    title: "Visual Designer",
    location: "Munich, Germany",
    years: 6,
    role: "designer",
    skills: ["figma", "brand design", "typography", "illustrator", "motion design"],
    summary: "Visual designer bridging brand and product design.",
    experience: [
      { company: "SAP", role: "Visual Designer", years: "2020–Present", bullets: ["Established design language for enterprise suite"] },
      { company: "Freelance", role: "Designer", years: "2018–2020", bullets: ["Brand identity for 12 startups"] },
    ],
    education: "BA Visual Communication, HfG Munich, 2018",
    gapNote: "Freelance period 2018–2020 between studies and SAP",
  },
  {
    name: "Daniel Park",
    email: "daniel.park@email.sg",
    phone: "+65 8765 4321",
    linkedin: "linkedin.com/in/danielpark-design",
    title: "Junior UI Designer",
    location: "Singapore",
    years: 2,
    role: "designer",
    skills: ["figma", "prototyping", "user flows", "design thinking"],
    summary: "Junior designer passionate about clean interface design.",
    experience: [
      { company: "Sea Group", role: "Junior UI Designer", years: "2023–Present", bullets: ["Designed Shopee seller tools"] },
      { company: "Intern — Razer", role: "Design Intern", years: "2022", bullets: ["Assisted gaming app UI"] },
    ],
    education: "Diploma Design, LASALLE, 2023",
  },
  // 5 Product Managers
  {
    name: "Rachel Green",
    email: "rachel.green@corp.com",
    phone: "+1 (617) 555-0134",
    linkedin: "linkedin.com/in/rachelgreen-pm",
    title: "Senior Product Manager",
    location: "Boston, US",
    years: 9,
    role: "pm",
    skills: ["product strategy", "roadmapping", "agile", "analytics", "stakeholder management"],
    summary: "Senior PM driving B2B product growth.",
    experience: [
      { company: "HubSpot", role: "Senior PM", years: "2020–Present", bullets: ["Launched CRM automation suite"] },
      { company: "Atlassian", role: "Product Manager", years: "2016–2020", bullets: ["Owned Jira workflow features"] },
    ],
    education: "MBA, Harvard Business School, 2016",
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@company.in",
    phone: "+91 98123 45678",
    linkedin: "linkedin.com/in/vikramsingh-pm",
    title: "Product Manager",
    location: "Delhi, India",
    years: 6,
    role: "pm",
    skills: ["product management", "jira", "sql", "a/b testing", "user stories"],
    summary: "PM shipping consumer fintech products.",
    experience: [
      { company: "Paytm", role: "Product Manager", years: "2021–Present", bullets: ["Led UPI features used by 50M users"] },
      { company: "Flipkart", role: "Associate PM", years: "2018–2021", bullets: ["Managed seller onboarding"] },
    ],
    education: "B.Tech + MBA, IIM Ahmedabad, 2018",
  },
  {
    name: "Thomas Baker",
    email: "t.baker@email.co.uk",
    phone: "+44 20 7946 0958",
    linkedin: "linkedin.com/in/thomasbaker",
    title: "Technical Product Manager",
    location: "London, UK",
    years: 7,
    role: "pm",
    skills: ["technical pm", "api products", "roadmaps", "python", "sql"],
    summary: "Technical PM bridging engineering and business.",
    experience: [
      { company: "Revolut", role: "Technical PM", years: "2019–Present", bullets: ["Owned open banking API product"] },
      { company: "Barclays", role: "Associate PM", years: "2017–2019", bullets: ["Mobile banking features"] },
    ],
    education: "MSc Computer Science, UCL, 2017",
  },
  {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@global.jp",
    phone: "+81 90 1234 5678",
    linkedin: "linkedin.com/in/yukitanaka",
    title: "Associate Product Manager",
    location: "Tokyo, Japan",
    years: 3,
    role: "pm",
    skills: ["product discovery", "figma", "analytics", "scrum", "market research"],
    summary: "APM learning to ship 0-to-1 products.",
    experience: [
      { company: "Rakuten", role: "APM", years: "2022–Present", bullets: ["Launched loyalty program features"] },
      { company: "Mercari", role: "Product Analyst", years: "2021–2022", bullets: ["Supported marketplace growth"] },
    ],
    education: "BA Economics, Waseda University, 2021",
  },
  {
    name: "Laura Fischer",
    email: "laura.fischer@berlin.de",
    phone: "+49 176 1234567",
    linkedin: "linkedin.com/in/laurafischer",
    title: "Product Owner",
    location: "Berlin, Germany",
    years: 5,
    role: "pm",
    skills: ["scrum", "product backlog", "stakeholder management", "confluence", "jira"],
    summary: "Product owner in agile enterprise teams.",
    experience: [
      { company: "Siemens", role: "Product Owner", years: "2020–Present", bullets: ["Owned IoT platform backlog"] },
      { company: "Bosch", role: "Business Analyst", years: "2018–2020", bullets: ["Requirements for smart home"] },
    ],
    education: "MSc Industrial Engineering, RWTH Aachen, 2018",
  },
  // 5 Sales
  {
    name: "Michael Roberts",
    email: "m.roberts@sales.com",
    phone: "+1 (212) 555-0177",
    linkedin: "linkedin.com/in/michaelroberts",
    title: "Enterprise Account Executive",
    location: "New York, US",
    years: 8,
    role: "sales",
    skills: ["enterprise sales", "saas", "negotiation", "crm", "salesforce", "pipeline management"],
    summary: "Enterprise AE closing six-figure SaaS deals.",
    experience: [
      { company: "Salesforce", role: "Account Executive", years: "2020–Present", bullets: ["Exceeded quota 130% for 3 years"] },
      { company: "Oracle", role: "Sales Rep", years: "2016–2020", bullets: ["Sold ERP solutions to mid-market"] },
    ],
    education: "BS Business, NYU Stern, 2016",
  },
  {
    name: "Jessica Walsh",
    email: "jessica.walsh@email.co.uk",
    phone: "+44 7700 900456",
    linkedin: "linkedin.com/in/jessicawalsh",
    title: "Sales Development Representative",
    location: "Birmingham, UK",
    years: 3,
    role: "sales",
    skills: ["outbound sales", "lead generation", "hubspot", "cold calling", "linkedin sales"],
    summary: "SDR generating pipeline for B2B SaaS.",
    experience: [
      { company: "Zendesk", role: "SDR", years: "2022–Present", bullets: ["Booked 40+ meetings per month"] },
      { company: "Sage", role: "Sales Intern", years: "2021", bullets: ["Supported SMB outreach"] },
    ],
    education: "BA Marketing, University of Birmingham, 2021",
  },
  {
    name: "Amit Patel",
    email: "amit.patel@business.in",
    phone: "+91 91234 00011",
    linkedin: "linkedin.com/in/amitpatel-sales",
    title: "Regional Sales Manager",
    location: "Mumbai, India",
    years: 10,
    role: "sales",
    skills: ["b2b sales", "channel sales", "team management", "crm", "forecasting"],
    summary: "Sales manager leading regional enterprise team.",
    experience: [
      { company: "Zoho", role: "Regional Sales Manager", years: "2018–Present", bullets: ["Managed team of 12 reps"] },
      { company: "IBM", role: "Sales Executive", years: "2014–2018", bullets: ["Sold cloud solutions to enterprises"] },
    ],
    education: "MBA Marketing, SP Jain, 2014",
  },
  {
    name: "Christopher Lee",
    email: "chris.lee@corp.sg",
    phone: "+65 9234 5678",
    linkedin: "linkedin.com/in/christopherlee",
    title: "Inside Sales Representative",
    location: "Singapore",
    years: 4,
    role: "sales",
    skills: ["inside sales", "saas", "demo skills", "salesforce", "customer success"],
    summary: "Inside sales rep closing mid-market deals.",
    experience: [
      { company: "Twilio", role: "Inside Sales", years: "2021–Present", bullets: ["$2M ARR closed annually"] },
      { company: "Stripe", role: "Sales Associate", years: "2020–2021", bullets: ["Supported APAC merchant onboarding"] },
    ],
    education: "BBA, SMU Singapore, 2020",
  },
  {
    name: "Nina Hoffmann",
    email: "nina.hoffmann@web.de",
    phone: "+49 30 555 7890",
    linkedin: "linkedin.com/in/ninahoffmann",
    title: "Key Account Manager",
    location: "Frankfurt, Germany",
    years: 7,
    role: "sales",
    skills: ["key account management", "negotiation", "german", "english", "crm"],
    summary: "KAM managing strategic enterprise accounts.",
    experience: [
      { company: "SAP", role: "Key Account Manager", years: "2019–Present", bullets: ["Retained €5M portfolio"] },
      { company: "Siemens", role: "Sales Specialist", years: "2017–2019", bullets: ["Grew territory 20% YoY"] },
    ],
    education: "MSc Business, Frankfurt School, 2017",
  },
  // 5 Operations
  {
    name: "David Kim",
    email: "david.kim@ops.com",
    phone: "+1 (408) 555-0155",
    linkedin: "linkedin.com/in/davidkim-ops",
    title: "Operations Manager",
    location: "San Jose, US",
    years: 9,
    role: "operations",
    skills: ["operations management", "process improvement", "lean", "sql", "excel", "vendor management"],
    summary: "Ops manager optimizing supply chain and fulfillment.",
    experience: [
      { company: "Apple", role: "Operations Manager", years: "2019–Present", bullets: ["Reduced logistics costs 15%"] },
      { company: "Flex", role: "Ops Analyst", years: "2015–2019", bullets: ["Managed vendor SLAs"] },
    ],
    education: "BS Industrial Engineering, Georgia Tech, 2015",
  },
  {
    name: "Fatima Hassan",
    email: "fatima.hassan@email.ae",
    phone: "+971 50 123 4567",
    linkedin: "linkedin.com/in/fatimahassan",
    title: "Business Operations Analyst",
    location: "Dubai, UAE",
    years: 4,
    role: "operations",
    skills: ["data analysis", "excel", "sql", "process mapping", "project coordination"],
    summary: "Ops analyst improving business processes.",
    experience: [
      { company: "Careem", role: "Ops Analyst", years: "2021–Present", bullets: ["Automated reporting dashboards"] },
      { company: "Deloitte", role: "Analyst", years: "2020–2021", bullets: ["Consulting for retail clients"] },
    ],
    education: "BBA, American University of Sharjah, 2020",
  },
  {
    name: "George Taylor",
    email: "george.taylor@mail.uk",
    phone: "+44 161 496 0123",
    linkedin: "linkedin.com/in/georgetaylor",
    title: "Head of Operations",
    location: "Leeds, UK",
    years: 12,
    role: "operations",
    skills: ["operations leadership", "p&l management", "logistics", "team building", "kpi tracking"],
    summary: "Head of ops scaling e-commerce fulfillment.",
    experience: [
      { company: "ASOS", role: "Head of Operations", years: "2018–Present", bullets: ["Scaled warehouse capacity 3x"] },
      { company: "Next", role: "Ops Manager", years: "2012–2018", bullets: ["Led distribution center team"] },
    ],
    education: "MBA, Manchester Business School, 2012",
  },
  {
    name: "Kavitha Nair",
    email: "kavitha.nair@company.in",
    phone: "+91 94444 55666",
    linkedin: "linkedin.com/in/kavithanair",
    title: "Operations Coordinator",
    location: "Kochi, India",
    years: 3,
    role: "operations",
    skills: ["coordination", "scheduling", "inventory", "erp", "communication"],
    summary: "Ops coordinator supporting manufacturing workflows.",
    experience: [
      { company: "Tata Motors", role: "Ops Coordinator", years: "2022–Present", bullets: ["Coordinated production schedules"] },
      { company: "Maruti Suzuki", role: "Trainee", years: "2021", bullets: ["Inventory tracking support"] },
    ],
    education: "B.Tech Mechanical, CUSAT, 2021",
  },
  {
    name: "Sophie Martin",
    email: "sophie.martin@email.fr",
    phone: "+33 6 12 34 56 78",
    linkedin: "linkedin.com/in/sophiemartin",
    title: "Supply Chain Analyst",
    location: "Paris, France",
    years: 5,
    role: "operations",
    skills: ["supply chain", "sap", "forecasting", "excel", "data analysis"],
    summary: "Supply chain analyst optimizing inventory levels.",
    experience: [
      { company: "L'Oréal", role: "Supply Chain Analyst", years: "2020–Present", bullets: ["Reduced stockouts 22%"] },
      { company: "Carrefour", role: "Junior Analyst", years: "2019–2020", bullets: ["Demand planning support"] },
    ],
    education: "MSc Supply Chain, ESCP Business School, 2019",
  },
];

function resumeText(r: ResumeData): string {
  const lines = [
    r.name,
    r.title,
  `${r.email} | ${r.phone} | ${r.location}`,
    r.linkedin,
    ...(r.github ? [r.github] : []),
    "",
    "PROFESSIONAL SUMMARY",
    r.summary,
    "",
    "SKILLS",
    r.skills.join(", "),
    "",
    "EXPERIENCE",
    ...r.experience.flatMap((e) => [
      `${e.role} — ${e.company} (${e.years})`,
      ...e.bullets.map((b) => `• ${b}`),
      "",
    ]),
    "EDUCATION",
    r.education,
  ];
  if (r.gapNote) lines.push("", "NOTE", r.gapNote);
  return lines.join("\n");
}

function writePdf(filePath: string, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    text.split("\n").forEach((line) => doc.text(line));
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function writeDocx(filePath: string, text: string): Promise<void> {
  const children = text.split("\n").map((line) => {
    if (line === line.toUpperCase() && line.length > 3 && !line.includes("@")) {
      return new Paragraph({
        text: line,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      });
    }
    if (line === resumes.find((r) => r.name === text.split("\n")[0])?.name) {
      return new Paragraph({
        children: [new TextRun({ text: line, bold: true, size: 32 })],
        spacing: { after: 100 },
      });
    }
    return new Paragraph({ text: line, spacing: { after: 80 } });
  });

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
}

async function main() {
  const outDir = path.join(process.cwd(), "test-data", "resumes");
  fs.mkdirSync(outDir, { recursive: true });

  let pdfCount = 0;
  let docxCount = 0;

  for (let i = 0; i < resumes.length; i++) {
    const r = resumes[i];
    const slug = r.name.toLowerCase().replace(/\s+/g, "-");
    const text = resumeText(r);
    const usePdf = i % 2 === 0;

    if (usePdf) {
      await writePdf(path.join(outDir, `${slug}.pdf`), text);
      pdfCount++;
    } else {
      await writeDocx(path.join(outDir, `${slug}.docx`), text);
      docxCount++;
    }
  }

  console.log(`Generated ${resumes.length} resumes in ${outDir}`);
  console.log(`  PDF: ${pdfCount}, DOCX: ${docxCount}`);
}

main().catch(console.error);
