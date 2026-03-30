import { useMemo, useState } from "react";

type Page =
  | "landing"
  | "dashboard"
  | "rotations"
  | "contacts"
  | "templates"
  | "directory"
  | "preceptors"
  | "documents";

type Rotation = {
  id: number;
  title: string;
  specialty: string;
  school: string;
  requiredHours: number;
  loggedHours: number;
  startDate: string;
  endDate: string;
  paperworkDueDate: string;
  status: string;
  location: string;
};

type Contact = {
  id: number;
  rotationId: number;
  clinic: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  followUp: string;
  notes: string;
};

type Template = {
  id: number;
  type: string;
  title: string;
  category: string;
  content: string;
};

type SiteListing = {
  id: number;
  clinic: string;
  specialty: string;
  city: string;
  state: string;
  region: string;
  setting: string;
  acceptsStudents: boolean;
  preceptorType: string;
};

type PreceptorLead = {
  id: number;
  name: string;
  credentials: string;
  specialty: string;
  clinic: string;
  city: string;
  state: string;
  email: string;
  acceptingStudents: boolean;
  studentTypes: string;
};

type PaperworkDocument = {
  id: number;
  ownerType: "Student" | "Preceptor";
  ownerName: string;
  category: string;
  fileName: string;
  status: "Uploaded" | "Pending" | "Needs Review";
  dueDate?: string;
};

const SPECIALTIES = [
  "Any Specialty",
  "Primary Care",
  "Family Practice",
  "Internal Medicine",
  "Pediatrics",
  "Women’s Health",
  "OB-GYN",
  "Psychiatry",
  "Urgent Care",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
];

const STATES = [
  "All States",
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const INITIAL_ROTATIONS: Rotation[] = [
  {
    id: 1,
    title: "Women’s Health Clinical Rotation",
    specialty: "Women’s Health",
    school: "[User School]",
    requiredHours: 160,
    loggedHours: 64,
    startDate: "2026-04-01",
    endDate: "2026-06-02",
    paperworkDueDate: "2026-03-31",
    status: "Searching",
    location: "Preferred metro area",
  },
  {
    id: 2,
    title: "Pediatrics Clinical Rotation",
    specialty: "Pediatrics",
    school: "[User School]",
    requiredHours: 160,
    loggedHours: 0,
    startDate: "2026-07-10",
    endDate: "2026-09-01",
    paperworkDueDate: "2026-06-15",
    status: "Planned",
    location: "Regional search area",
  },
  {
    id: 3,
    title: "Family Practice Clinical Rotation",
    specialty: "Family Practice",
    school: "[User School]",
    requiredHours: 150,
    loggedHours: 12,
    startDate: "2026-10-01",
    endDate: "2026-12-01",
    paperworkDueDate: "2026-08-15",
    status: "Searching",
    location: "Anywhere in the United States",
  },
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 1,
    rotationId: 1,
    clinic: "Women’s Health Associates",
    contactName: "Clinical Coordinator",
    role: "Placement Contact",
    email: "students@womenshealthassoc.com",
    phone: "(555) 201-4400",
    status: "Contacted",
    followUp: "2026-03-31",
    notes: "Potential women’s health site for student placement.",
  },
  {
    id: 2,
    rotationId: 1,
    clinic: "Regional OB-GYN Center",
    contactName: "Practice Manager",
    role: "Placement Contact",
    email: "students@regionalobgyn.com",
    phone: "(555) 201-4412",
    status: "Waiting",
    followUp: "2026-04-02",
    notes: "Requested affiliation agreement details and placement requirements.",
  },
  {
    id: 3,
    rotationId: 2,
    clinic: "Pediatric Care Center",
    contactName: "Office Manager",
    role: "Placement Contact",
    email: "students@pediatriccarecenter.com",
    phone: "(555) 201-4425",
    status: "New",
    followUp: "2026-06-18",
    notes: "Potential pediatric placement option.",
  },
  {
    id: 4,
    rotationId: 2,
    clinic: "Kids Plus Pediatrics",
    contactName: "Clinical Coordinator",
    role: "Practice Contact",
    email: "info@kidsplus.com",
    phone: "(412) 521-6511",
    status: "Researching",
    followUp: "2026-06-20",
    notes: "Independent pediatric practice and strong peds placement option.",
  },
  {
    id: 5,
    rotationId: 2,
    clinic: "Community Pediatric Group",
    contactName: "Office Manager",
    role: "Practice Contact",
    email: "students@communitypeds.com",
    phone: "(555) 201-4431",
    status: "Not Contacted",
    followUp: "2026-06-22",
    notes: "Independent pediatric office with multiple locations.",
  },
  {
    id: 6,
    rotationId: 3,
    clinic: "Family Medicine Partners",
    contactName: "Clinical Education Liaison",
    role: "Placement Contact",
    email: "placements@familymedicinepartners.com",
    phone: "(555) 201-4450",
    status: "Researching",
    followUp: "2026-08-18",
    notes: "General family practice option for a broad clinical experience.",
  },
];

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 1,
    type: "Email",
    title: "Cold Outreach Email",
    category: "General",
    content:
      "Hello [Name], my name is [Student Name] and I am a healthcare student at [School]. I am currently seeking a [Specialty] clinical preceptor for [Dates]. My school provides affiliation support and liability coverage. Would your office be open to discussing a possible student placement? Thank you for your time.",
  },
  {
    id: 2,
    type: "Call Script",
    title: "Quick Intro Call",
    category: "General",
    content:
      "Hi, my name is [Student Name]. I am a healthcare student looking for a [Specialty] clinical placement for [Dates]. I wanted to ask whether your practice accepts students and who the best person would be to speak with about preceptorship opportunities.",
  },
  {
    id: 3,
    type: "Voicemail",
    title: "Professional Follow-Up",
    category: "General",
    content:
      "Hello, this is [Student Name], a healthcare student at [School]. I am calling to follow up regarding a possible [Specialty] preceptor opportunity for [Dates]. My callback number is [Phone]. Thank you so much.",
  },
  {
    id: 4,
    type: "Email",
    title: "Pediatrics Rotation Outreach",
    category: "Pediatrics",
    content: `Hello,

My name is [Student Name], and I am a healthcare student at [School] seeking a pediatric clinical rotation. I am available for the required rotation schedule and can travel within my preferred region. My school provides the affiliation agreement and liability coverage.

Would your office accept a student, or could you direct me to the appropriate contact person?

Thank you very much for your time.

[Student Name]`,
  },
  {
    id: 5,
    type: "Email",
    title: "Women’s Health Rotation Outreach",
    category: "Women’s Health",
    content: `Hello,

My name is [Student Name], and I am a healthcare student at [School] seeking a women’s health clinical rotation. I am available for the required rotation schedule and can travel within my preferred region. My school provides the affiliation agreement and liability coverage.

I would appreciate any information regarding student placement opportunities or the best contact person.

Thank you very much for your time.

[Student Name]`,
  },
  {
    id: 6,
    type: "Email",
    title: "General Specialty Outreach",
    category: "Any Specialty",
    content: `Hello,

My name is [Student Name], and I am a healthcare student at [School] seeking a [Specialty] clinical rotation. I am reaching out to ask whether your office accepts students for clinical training and whether there may be availability during my required rotation period.

My school provides the affiliation agreement and liability coverage. If there is a better contact person for student placements, I would sincerely appreciate their information.

Thank you for your time.

[Student Name]`,
  },
];

const INITIAL_DIRECTORY: SiteListing[] = [
  {
    id: 1,
    clinic: "Sunrise Family Health",
    specialty: "Family Practice",
    city: "Phoenix",
    state: "AZ",
    region: "West",
    setting: "Outpatient Clinic",
    acceptsStudents: true,
    preceptorType: "NP / MD / DO",
  },
  {
    id: 2,
    clinic: "Atlantic Women’s Care",
    specialty: "Women’s Health",
    city: "Miami",
    state: "FL",
    region: "South",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "CNM / NP / MD",
  },
  {
    id: 3,
    clinic: "Metro Pediatrics Group",
    specialty: "Pediatrics",
    city: "Chicago",
    state: "IL",
    region: "Midwest",
    setting: "Outpatient Clinic",
    acceptsStudents: true,
    preceptorType: "PNP / MD / DO",
  },
  {
    id: 4,
    clinic: "Lakeside Internal Medicine",
    specialty: "Internal Medicine",
    city: "Cleveland",
    state: "OH",
    region: "Midwest",
    setting: "Primary Care Office",
    acceptsStudents: true,
    preceptorType: "NP / MD / DO",
  },
  {
    id: 5,
    clinic: "Pacific Urgent Care Network",
    specialty: "Urgent Care",
    city: "Los Angeles",
    state: "CA",
    region: "West",
    setting: "Urgent Care",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 6,
    clinic: "Blue Ridge Behavioral Health",
    specialty: "Psychiatry",
    city: "Charlotte",
    state: "NC",
    region: "South",
    setting: "Behavioral Health Clinic",
    acceptsStudents: true,
    preceptorType: "PMHNP / MD",
  },
  {
    id: 7,
    clinic: "Empire Cardiology Specialists",
    specialty: "Cardiology",
    city: "New York",
    state: "NY",
    region: "Northeast",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 8,
    clinic: "Front Range Community Health",
    specialty: "Primary Care",
    city: "Denver",
    state: "CO",
    region: "West",
    setting: "Community Health Center",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 9,
    clinic: "Garden State Endocrine",
    specialty: "Endocrinology",
    city: "Newark",
    state: "NJ",
    region: "Northeast",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "NP / MD",
  },
  {
    id: 10,
    clinic: "Capital Neurology Associates",
    specialty: "Neurology",
    city: "Richmond",
    state: "VA",
    region: "South",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 11,
    clinic: "Peachtree GI Center",
    specialty: "Gastroenterology",
    city: "Atlanta",
    state: "GA",
    region: "South",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 12,
    clinic: "Texas Ortho Partners",
    specialty: "Orthopedics",
    city: "Dallas",
    state: "TX",
    region: "South",
    setting: "Orthopedic Clinic",
    acceptsStudents: true,
    preceptorType: "NP / PA / MD",
  },
  {
    id: 13,
    clinic: "Keystone Women’s Care",
    specialty: "Women’s Health",
    city: "Pittsburgh",
    state: "PA",
    region: "Northeast",
    setting: "OB-GYN Practice",
    acceptsStudents: true,
    preceptorType: "WHNP / CNM / MD",
  },
  {
    id: 14,
    clinic: "Liberty OB-GYN Group",
    specialty: "Women’s Health",
    city: "Philadelphia",
    state: "PA",
    region: "Northeast",
    setting: "Women’s Health Clinic",
    acceptsStudents: true,
    preceptorType: "WHNP / MD / DO",
  },
  {
    id: 15,
    clinic: "Hudson Women’s Wellness",
    specialty: "Women’s Health",
    city: "Newark",
    state: "NJ",
    region: "Northeast",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "WHNP / CNM / MD",
  },
  {
    id: 16,
    clinic: "Empire Women’s Health Center",
    specialty: "Women’s Health",
    city: "Buffalo",
    state: "NY",
    region: "Northeast",
    setting: "Outpatient Women’s Center",
    acceptsStudents: true,
    preceptorType: "WHNP / MD / DO",
  },
  {
    id: 17,
    clinic: "Coastal Women’s Specialists",
    specialty: "Women’s Health",
    city: "Jacksonville",
    state: "FL",
    region: "South",
    setting: "Specialty Practice",
    acceptsStudents: true,
    preceptorType: "WHNP / CNM / MD",
  },
  {
    id: 18,
    clinic: "Lone Star Women’s Clinic",
    specialty: "Women’s Health",
    city: "Houston",
    state: "TX",
    region: "South",
    setting: "OB-GYN Practice",
    acceptsStudents: true,
    preceptorType: "WHNP / MD / DO",
  },
  {
    id: 19,
    clinic: "Golden State Women’s Health",
    specialty: "Women’s Health",
    city: "San Diego",
    state: "CA",
    region: "West",
    setting: "Women’s Health Clinic",
    acceptsStudents: true,
    preceptorType: "WHNP / CNM / MD",
  },
  {
    id: 20,
    clinic: "Lakeview OB-GYN Associates",
    specialty: "Women’s Health",
    city: "Chicago",
    state: "IL",
    region: "Midwest",
    setting: "OB-GYN Practice",
    acceptsStudents: true,
    preceptorType: "WHNP / MD / DO",
  },
];

const INITIAL_PRECEPTORS: PreceptorLead[] = [
  {
    id: 1,
    name: "Jordan Patel",
    credentials: "FNP-C",
    specialty: "Primary Care",
    clinic: "Front Range Community Health",
    city: "Denver",
    state: "CO",
    email: "jpatel@frch.org",
    acceptingStudents: true,
    studentTypes: "NP, PA, nursing",
  },
  {
    id: 2,
    name: "Taylor Brooks",
    credentials: "DNP, PNP-PC",
    specialty: "Pediatrics",
    clinic: "Metro Pediatrics Group",
    city: "Chicago",
    state: "IL",
    email: "tbrooks@metropeds.org",
    acceptingStudents: true,
    studentTypes: "NP, nursing",
  },
  {
    id: 3,
    name: "Morgan Rivera",
    credentials: "WHNP-BC",
    specialty: "Women’s Health",
    clinic: "Atlantic Women’s Care",
    city: "Miami",
    state: "FL",
    email: "mrivera@atlanticwomenscare.com",
    acceptingStudents: true,
    studentTypes: "NP, PA",
  },
];

const INITIAL_DOCUMENTS: PaperworkDocument[] = [
  {
    id: 1,
    ownerType: "Student",
    ownerName: "Current Student",
    category: "Resume",
    fileName: "student_resume.pdf",
    status: "Uploaded",
  },
  {
    id: 2,
    ownerType: "Student",
    ownerName: "Current Student",
    category: "Immunization Record",
    fileName: "immunizations.pdf",
    status: "Needs Review",
    dueDate: "2026-03-31",
  },
  {
    id: 3,
    ownerType: "Student",
    ownerName: "Current Student",
    category: "Liability Insurance",
    fileName: "liability_coverage.pdf",
    status: "Uploaded",
  },
  {
    id: 4,
    ownerType: "Preceptor",
    ownerName: "Jordan Patel",
    category: "License Verification",
    fileName: "jordan_pat el_license.pdf",
    status: "Uploaded",
  },
  {
    id: 5,
    ownerType: "Preceptor",
    ownerName: "Morgan Rivera",
    category: "CV",
    fileName: "morgan_rivera_cv.pdf",
    status: "Pending",
    dueDate: "2026-04-10",
  },
];

const NAV_ITEMS: Array<{ id: Page; label: string }> = [
  { id: "landing", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "rotations", label: "Rotations" },
  { id: "contacts", label: "Contacts" },
  { id: "templates", label: "Templates" },
  { id: "directory", label: "Find Sites" },
  { id: "preceptors", label: "Preceptors" },
  { id: "documents", label: "Paperwork" },
];

const PIPELINE_STATUSES = [
  "New",
  "Researching",
  "Not Contacted",
  "Contacted",
  "Waiting",
  "Interview",
  "Placed",
  "Declined",
];

function sanitizeProgress(loggedHours: number, requiredHours: number): number {
  if (requiredHours <= 0) return 0;
  return Math.min(100, Math.max(0, (loggedHours / requiredHours) * 100));
}

function filterTemplatesBySpecialty(
  templates: Template[],
  specialty: string,
): Template[] {
  return templates.filter(
    (template) =>
      template.category === "General" ||
      template.category === "Any Specialty" ||
      template.category === specialty,
  );
}

function filterDirectory(
  listings: SiteListing[],
  specialty: string,
  state: string,
  query: string,
): SiteListing[] {
  const normalized = query.trim().toLowerCase();
  return listings.filter((listing) => {
    const specialtyMatch =
      specialty === "Any Specialty" || listing.specialty === specialty;
    const stateMatch = state === "All States" || listing.state === state;
    const queryMatch =
      normalized.length === 0 ||
      listing.clinic.toLowerCase().includes(normalized) ||
      listing.city.toLowerCase().includes(normalized) ||
      listing.specialty.toLowerCase().includes(normalized) ||
      listing.state.toLowerCase().includes(normalized);
    return specialtyMatch && stateMatch && queryMatch;
  });
}

function countAcceptingPreceptors(preceptors: PreceptorLead[]): number {
  return preceptors.filter((preceptor) => preceptor.acceptingStudents).length;
}

function detectStateFromLocation(location: string): string {
  const normalized = location.trim().toLowerCase();

  const stateMap: Record<string, string> = {
    "alabama": "AL",
    "alaska": "AK",
    "arizona": "AZ",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "delaware": "DE",
    "florida": "FL",
    "georgia": "GA",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY",
    "district of columbia": "DC",
    "dc": "DC",
  };

  const abbreviationMatch = STATES.find((state) => {
    if (state === "All States") {
      return false;
    }

    const regex = new RegExp("\b" + state.toLowerCase() + "\b");
    return regex.test(normalized);
  });

  if (abbreviationMatch) {
    return abbreviationMatch;
  }

  for (const [stateName, abbreviation] of Object.entries(stateMap)) {
    if (normalized.includes(stateName)) {
      return abbreviation;
    }
  }

  return "All States";
}

export const TEST_CASES = [
  {
    name: "sanitizeProgress caps at 100 percent",
    pass: sanitizeProgress(120, 100) === 100,
  },
  {
    name: "filterTemplatesBySpecialty returns specialty templates",
    pass: filterTemplatesBySpecialty(INITIAL_TEMPLATES, "Pediatrics").some(
      (template) => template.category === "Pediatrics",
    ),
  },
  {
    name: "rotation stores paperwork due date",
    pass: INITIAL_ROTATIONS.every(
      (rotation) =>
        typeof rotation.paperworkDueDate === "string" &&
        rotation.paperworkDueDate.length > 0,
    ),
  },
  {
    name: "all US states plus DC are available in filters",
    pass: STATES.length === 52,
  },
  {
    name: "women’s health listings exist in multiple states",
    pass: filterDirectory(INITIAL_DIRECTORY, "Women’s Health", "All States", "").length >= 8,
  },
  {
    name: "detectStateFromLocation finds state abbreviation from full state name",
    pass: detectStateFromLocation("Philadelphia, Pennsylvania") === "PA",
  },
  {
    name: "detectStateFromLocation finds state abbreviation when embedded in location text",
    pass: detectStateFromLocation("Miami, FL") === "FL",
  },
  {
    name: "initial paperwork includes both student and preceptor uploads",
    pass:
      INITIAL_DOCUMENTS.some((doc) => doc.ownerType === "Student") &&
      INITIAL_DOCUMENTS.some((doc) => doc.ownerType === "Preceptor"),
  },
];

export default function ClinicalFlowWebsite() {
  const [page, setPage] = useState<Page>("landing");
  const [selectedRotation, setSelectedRotation] = useState<number>(1);
  const [rotations, setRotations] = useState<Rotation[]>(INITIAL_ROTATIONS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [templates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [directory] = useState<SiteListing[]>(INITIAL_DIRECTORY);
  const [preceptors, setPreceptors] = useState<PreceptorLead[]>(INITIAL_PRECEPTORS);
  const [documents, setDocuments] = useState<PaperworkDocument[]>(INITIAL_DOCUMENTS);
  const [searchSpecialty, setSearchSpecialty] = useState<string>("Any Specialty");
  const [searchState, setSearchState] = useState<string>("All States");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rotationForm, setRotationForm] = useState({
    title: "Custom Clinical Rotation",
    specialty: "Primary Care",
    school: "[User School]",
    requiredHours: "150",
    startDate: "2026-10-01",
    endDate: "2026-12-01",
    paperworkDueDate: "2026-08-15",
    location: "Anywhere in the United States",
  });
  const [preceptorForm, setPreceptorForm] = useState({
    name: "",
    credentials: "NP / PA / MD / DO / CNM",
    specialty: "Any Specialty",
    clinic: "",
    city: "",
    state: "PA",
    email: "",
    studentTypes: "NP, PA, nursing",
  });
  const [studentDocumentForm, setStudentDocumentForm] = useState({
    ownerName: "Current Student",
    category: "Resume",
    fileName: "",
    dueDate: "",
  });
  const [preceptorDocumentForm, setPreceptorDocumentForm] = useState({
    ownerName: "",
    category: "License Verification",
    fileName: "",
    dueDate: "",
  });

  const currentRotation = useMemo<Rotation>(() => {
    return (
      rotations.find((rotation) => rotation.id === selectedRotation) ??
      rotations[0]
    );
  }, [rotations, selectedRotation]);

  const filteredContacts = useMemo<Contact[]>(() => {
    return contacts.filter((contact) => contact.rotationId === currentRotation.id);
  }, [contacts, currentRotation.id]);

  const totalOutstanding = useMemo<number>(() => {
    return filteredContacts.filter(
      (contact) => contact.status !== "Placed" && contact.status !== "Declined",
    ).length;
  }, [filteredContacts]);

  const filteredTemplates = useMemo<Template[]>(() => {
    return filterTemplatesBySpecialty(templates, currentRotation.specialty);
  }, [templates, currentRotation.specialty]);

  const filteredDirectory = useMemo<SiteListing[]>(() => {
    return filterDirectory(directory, searchSpecialty, searchState, searchQuery);
  }, [directory, searchQuery, searchSpecialty, searchState]);

  const activePreceptorCount = useMemo<number>(() => {
    return countAcceptingPreceptors(preceptors);
  }, [preceptors]);

  const studentDocuments = useMemo(
    () => documents.filter((document) => document.ownerType === "Student"),
    [documents],
  );

  const preceptorDocuments = useMemo(
    () => documents.filter((document) => document.ownerType === "Preceptor"),
    [documents],
  );

  const autoSelectedState = useMemo<string>(() => {
    return detectStateFromLocation(currentRotation.location);
  }, [currentRotation.location]);

  const addSampleRotation = () => {
    const nextId = rotations.length + 1;
    const requiredHours = Number.parseInt(rotationForm.requiredHours, 10);
    const newRotation: Rotation = {
      id: nextId,
      title: rotationForm.title || `Custom Clinical Rotation ${nextId}`,
      specialty: rotationForm.specialty || "Primary Care",
      school: rotationForm.school || "[User School]",
      requiredHours: Number.isFinite(requiredHours) ? requiredHours : 0,
      loggedHours: 0,
      startDate: rotationForm.startDate,
      endDate: rotationForm.endDate,
      paperworkDueDate: rotationForm.paperworkDueDate,
      status: "Planned",
      location: rotationForm.location || "Anywhere in the United States",
    };

    setRotations((prev) => [...prev, newRotation]);
    setSelectedRotation(nextId);
    setPage("rotations");
  };

  const addSampleContact = () => {
    const nextId = contacts.length + 1;
    const specialtyLabel =
      currentRotation.specialty === "Women’s Health"
        ? "OB-GYN"
        : currentRotation.specialty;

    setContacts((prev) => [
      ...prev,
      {
        id: nextId,
        rotationId: currentRotation.id,
        clinic: `${specialtyLabel} Community Clinic`,
        contactName: "Rachel Morgan",
        role: "Office Manager",
        email: "rmorgan@clinic.org",
        phone: "(412) 555-0199",
        status: "New",
        followUp: "2026-04-05",
        notes: "Added from networking list.",
      },
    ]);
    setPage("contacts");
  };

  const addInterestedPreceptor = () => {
    const nextId = preceptors.length + 1;
    const submittedName = preceptorForm.name || "Interested Preceptor";

    setPreceptors((prev) => [
      ...prev,
      {
        id: nextId,
        name: submittedName,
        credentials: preceptorForm.credentials || "NP / PA / MD",
        specialty: preceptorForm.specialty || "Any Specialty",
        clinic: preceptorForm.clinic || "Practice Submitted via Website",
        city: preceptorForm.city || "User City",
        state: preceptorForm.state || "PA",
        email: preceptorForm.email || "preceptor@example.com",
        acceptingStudents: true,
        studentTypes: preceptorForm.studentTypes || "NP, PA, nursing",
      },
    ]);

    setDocuments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ownerType: "Preceptor",
        ownerName: submittedName,
        category: "License Verification",
        fileName: "upload_preceptor_license.pdf",
        status: "Pending",
      },
    ]);

    setPreceptorForm({
      name: "",
      credentials: "NP / PA / MD / DO / CNM",
      specialty: "Any Specialty",
      clinic: "",
      city: "",
      state: "PA",
      email: "",
      studentTypes: "NP, PA, nursing",
    });
  };

  const addStudentDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ownerType: "Student",
        ownerName: studentDocumentForm.ownerName || "Current Student",
        category: studentDocumentForm.category,
        fileName: studentDocumentForm.fileName || "uploaded_student_document.pdf",
        status: "Uploaded",
        dueDate: studentDocumentForm.dueDate || undefined,
      },
    ]);

    setStudentDocumentForm({
      ownerName: "Current Student",
      category: "Resume",
      fileName: "",
      dueDate: "",
    });
  };

  const addPreceptorDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ownerType: "Preceptor",
        ownerName: preceptorDocumentForm.ownerName || "Interested Preceptor",
        category: preceptorDocumentForm.category,
        fileName: preceptorDocumentForm.fileName || "uploaded_preceptor_document.pdf",
        status: "Uploaded",
        dueDate: preceptorDocumentForm.dueDate || undefined,
      },
    ]);

    setPreceptorDocumentForm({
      ownerName: "",
      category: "License Verification",
      fileName: "",
      dueDate: "",
    });
  };

  const resetDirectoryFilters = () => {
    setSearchSpecialty("Any Specialty");
    setSearchState("All States");
    setSearchQuery("");
  };

  const openDirectoryForRotation = () => {
    const detectedState = detectStateFromLocation(currentRotation.location);
    setSearchSpecialty(currentRotation.specialty);
    setSearchState(detectedState);
    setSearchQuery("");
    setPage("directory");
  };

  const logoMark = (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="clinicalFlowGradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <path
          d="M16 2L27 8.5V23.5L16 30L5 23.5V8.5L16 2Z"
          fill="url(#clinicalFlowGradient)"
        />
        <path
          d="M16 8C12.1 8 9 11.1 9 15C9 18.9 12.1 22 16 22C19.9 22 23 18.9 23 15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21.5 9.5L23.5 15L18 14"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 11H17.5V14H20.5V17H17.5V20H14.5V17H11.5V14H14.5V11Z"
          fill="white"
        />
      </svg>
    </div>
  );

  const progressPercent = sanitizeProgress(
    currentRotation.loggedHours,
    currentRotation.requiredHours,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <button
            onClick={() => setPage("landing")}
            className="flex items-center gap-3 text-left"
          >
            {logoMark}
            <div>
              <p className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-lg font-bold text-transparent">ClinicalFlow</p>
              <p className="text-xs text-slate-500">Preceptor search, organized</p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  page === item.id
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-2xl px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 md:block">
              Sign In
            </button>
            <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 font-medium text-white shadow-lg shadow-emerald-100 transition hover:scale-[1.02]">
              Start Free Trial · $20/week after trial
            </button>
          </div>
        </div>
      </header>

      {page === "landing" && (
        <main>
          <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                  Nationwide platform for healthcare students and preceptors
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  Find clinical rotations anywhere in the United States
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  ClinicalFlow helps students search for sites by specialty and state,
                  track hours needed, start and stop dates, paperwork deadlines, manage
                  outreach, and connect with preceptors who want students.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={openDirectoryForRotation}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 text-white shadow-lg shadow-emerald-100 transition hover:scale-[1.02]"
                  >
                    Search Clinical Sites
                  </button>
                  <button
                    onClick={() => setPage("preceptors")}
                    className="rounded-2xl border border-slate-300 bg-white px-6 py-3 shadow-sm transition hover:scale-[1.02]"
                  >
                    Join as a Preceptor
                  </button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    { value: `${directory.length}+`, label: "nationwide site leads" },
                    { value: `${activePreceptorCount}+`, label: "interested preceptors" },
                    { value: `${SPECIALTIES.length - 1}+`, label: "specialties supported" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                    >
                      <p className="text-3xl font-bold">{item.value}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-slate-200">
                <div className="rounded-[28px] bg-slate-50 p-5 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Live preview</p>
                      <h2 className="text-2xl font-semibold">Nationwide site finder</h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      All specialties
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {[
                      { label: "States", value: STATES.length - 1 },
                      { label: "Listings", value: directory.length },
                      { label: "Preceptors", value: activePreceptorCount },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                      >
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-2 text-3xl font-bold">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-3">
                    {directory.slice(0, 3).map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{listing.clinic}</p>
                            <p className="text-sm text-slate-500">
                              {listing.specialty} · {listing.city}, {listing.state}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {listing.preceptorType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Core features
                </p>
                <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                  Built for any clinical specialty, any school, any state
                </h2>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-4">
                {[
                  {
                    title: "Track Rotation Requirements",
                    desc: "Add hours needed, paperwork due date, start date, and stop date for every rotation.",
                    icon: "🗓️",
                  },
                  {
                    title: "Search Nationwide",
                    desc: "Search clinical sites all over the United States by specialty, state, city, and setting.",
                    icon: "🗺️",
                  },
                  {
                    title: "Manage Outreach",
                    desc: "Track contacts, follow-ups, and outcomes in one organized pipeline.",
                    icon: "📇",
                  },
                  {
                    title: "Preceptor Sign-Up",
                    desc: "Allow preceptors who are interested in students to submit their information directly on the website.",
                    icon: "🤝",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200"
                  >
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:pb-24">
            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-sm md:p-12">
              <h2 className="text-3xl font-bold md:text-5xl">
                Start with the MVP. Support every specialty.
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-slate-200">
                The first version should let students find rotations across the country,
                track required dates and hours, and let interested preceptors raise their hand.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  "Student tools: rotations, hours, deadlines, outreach",
                  "Search tools: specialty, state, and clinic directory",
                  "Supply tools: preceptor interest form and listing board",
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-4">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {page !== "landing" && (
        <main className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              { label: "Active Rotations", value: rotations.length },
              { label: "Current Contacts", value: filteredContacts.length },
              { label: "Required Hours", value: currentRotation.requiredHours },
              { label: "Interested Preceptors", value: activePreceptorCount },
              { label: "Paperwork Files", value: documents.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {rotations.map((rotation) => (
              <button
                key={rotation.id}
                onClick={() => {
                  setSelectedRotation(rotation.id);
                  const detectedState = detectStateFromLocation(rotation.location);
                  setSearchSpecialty(rotation.specialty);
                  setSearchState(detectedState);
                }}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  currentRotation.id === rotation.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {rotation.specialty}
              </button>
            ))}
          </div>

          {page === "dashboard" && (
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Overview
                </p>
                <h1 className="mt-2 text-3xl font-bold">{currentRotation.title}</h1>
                <p className="mt-2 text-slate-600">
                  Track rotation requirements, search for placements nationwide, and
                  manage outreach in one place.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["School", currentRotation.school],
                    ["Location preference", currentRotation.location],
                    ["Start Date", currentRotation.startDate],
                    ["Stop Date", currentRotation.endDate],
                    ["Paperwork Due", currentRotation.paperworkDueDate],
                    ["Status", currentRotation.status],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                    >
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Hours progress</p>
                      <p className="text-2xl font-bold">
                        {currentRotation.loggedHours} / {currentRotation.requiredHours}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      {Math.round(progressPercent)}% complete
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </p>
                  <div className="mt-4 grid gap-3">
                    <button
                      onClick={addSampleRotation}
                      className="rounded-2xl bg-slate-900 px-4 py-3 text-left font-medium text-white transition hover:scale-[1.01]"
                    >
                      + Create new rotation
                    </button>
                    <button
                      onClick={openDirectoryForRotation}
                      className="rounded-2xl bg-slate-100 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-200"
                    >
                      Search clinical sites for this rotation
                    </button>
                    <button
                      onClick={() => setPage("preceptors")}
                      className="rounded-2xl bg-slate-100 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-200"
                    >
                      View interested preceptors
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Upcoming follow-ups
                  </p>
                  <div className="mt-4 space-y-3">
                    {filteredContacts.slice(0, 4).map((contact) => (
                      <div
                        key={contact.id}
                        className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                      >
                        <p className="font-medium">{contact.clinic}</p>
                        <p className="text-sm text-slate-500">{contact.contactName}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          Follow-up: {contact.followUp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {page === "rotations" && (
            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Create rotation
                </p>
                <h1 className="mt-2 text-3xl font-bold">Rotation setup page</h1>
                <p className="mt-2 text-slate-600">
                  Students can add hours needed, paperwork due date, start date,
                  stop date, specialty, school, and preferred location for every rotation.
                </p>

                <div className="mt-6 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Rotation title</span>
                    <input
                      value={rotationForm.title}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Specialty</span>
                    <select
                      value={rotationForm.specialty}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, specialty: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {SPECIALTIES.filter((item) => item !== "Any Specialty").map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">School</span>
                    <input
                      value={rotationForm.school}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, school: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Hours needed</span>
                    <input
                      value={rotationForm.requiredHours}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, requiredHours: e.target.value }))}
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Start date</span>
                    <input
                      type="date"
                      value={rotationForm.startDate}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Stop date</span>
                    <input
                      type="date"
                      value={rotationForm.endDate}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Paperwork due date</span>
                    <input
                      type="date"
                      value={rotationForm.paperworkDueDate}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, paperworkDueDate: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Preferred location</span>
                    <input
                      value={rotationForm.location}
                      onChange={(e) => setRotationForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Anywhere in the United States"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={addSampleRotation}
                    className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:scale-[1.02]"
                  >
                    Save new rotation
                  </button>
                  <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-medium transition hover:scale-[1.02]">
                    Duplicate template
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  All rotations
                </p>
                <div className="mt-4 space-y-4">
                  {rotations.map((rotation) => (
                    <button
                      key={rotation.id}
                      onClick={() => {
                  setSelectedRotation(rotation.id);
                  const detectedState = detectStateFromLocation(rotation.location);
                  setSearchSpecialty(rotation.specialty);
                  setSearchState(detectedState);
                }}
                      className={`w-full rounded-[24px] p-5 text-left transition ring-1 ${
                        currentRotation.id === rotation.id
                          ? "bg-slate-900 text-white ring-slate-900"
                          : "bg-slate-50 text-slate-900 ring-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{rotation.title}</p>
                          <p
                            className={
                              currentRotation.id === rotation.id
                                ? "text-slate-300"
                                : "text-slate-500"
                            }
                          >
                            {rotation.school} · {rotation.location}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            currentRotation.id === rotation.id
                              ? "bg-white text-slate-900"
                              : "bg-white text-slate-700"
                          }`}
                        >
                          {rotation.status}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Specialty
                          </p>
                          <p>{rotation.specialty}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Hours
                          </p>
                          <p>
                            {rotation.loggedHours}/{rotation.requiredHours}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Start / Stop
                          </p>
                          <p>{rotation.startDate} → {rotation.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Paperwork due
                          </p>
                          <p>{rotation.paperworkDueDate}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {page === "contacts" && (
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Manage contacts
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                      Clinic and preceptor contacts
                    </h1>
                  </div>
                  <button
                    onClick={addSampleContact}
                    className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:scale-[1.02]"
                  >
                    + Add contact
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                  Loaded specialty contacts for {currentRotation.specialty}. Students can
                  use these sample leads and replace them with their own search results.
                </div>

                <div className="mt-6 space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="rounded-[24px] border border-slate-200 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{contact.clinic}</p>
                          <p className="text-slate-500">
                            {contact.contactName} · {contact.role}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {contact.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Email
                          </p>
                          <p className="mt-1 break-all font-medium">{contact.email}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Phone
                          </p>
                          <p className="mt-1 font-medium">{contact.phone}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Follow-up date
                          </p>
                          <p className="mt-1 font-medium">{contact.followUp}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Rotation
                          </p>
                          <p className="mt-1 font-medium">{currentRotation.specialty}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Notes
                        </p>
                        <p className="mt-1 text-slate-700">{contact.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Pipeline
                  </p>
                  <div className="mt-4 grid gap-3">
                    {PIPELINE_STATUSES.map((status) => {
                      const count = filteredContacts.filter(
                        (contact) => contact.status === status,
                      ).length;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                        >
                          <span>{status}</span>
                          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Why this page matters
                  </p>
                  <p className="mt-3 leading-7 text-slate-600">
                    This is where the value becomes obvious. Students can finally stop
                    using spreadsheets, notes apps, texts, and random email drafts to
                    track who they contacted.
                  </p>
                </div>
              </div>
            </section>
          )}

          {page === "templates" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Outreach templates
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                  Email, call, and voicemail scripts
                </h1>
                <p className="mt-2 text-slate-600">
                  These templates help students reach out faster and sound professional
                  without starting from scratch.
                </p>

                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
                  Showing templates for {currentRotation.specialty} plus general
                  outreach scripts that any student can customize.
                </div>

                <div className="mt-6 space-y-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-[24px] border border-slate-200 p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{template.title}</p>
                          <p className="text-sm text-slate-500">
                            {template.type} · {template.category}
                          </p>
                        </div>
                        <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                          Use template
                        </button>
                      </div>
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="whitespace-pre-line leading-7 text-slate-700">
                          {template.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Template builder
                  </p>
                  <div className="mt-4 grid gap-4">
                    {[
                      ["Template name", `${currentRotation.specialty} follow-up`],
                      ["Template type", "Email"],
                      ["Specialty", currentRotation.specialty],
                    ].map(([label, value]) => (
                      <label key={label} className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                          {label}
                        </span>
                        <input
                          readOnly
                          value={value}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        />
                      </label>
                    ))}
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Message body
                      </span>
                      <textarea
                        readOnly
                        value={`Hello [Name], I wanted to follow up regarding a possible ${currentRotation.specialty} clinical placement for my upcoming rotation. I would be grateful for the chance to speak with the appropriate contact person about availability.`}
                        rows={7}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <button className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:scale-[1.02]">
                      Save template
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Monetization
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Free plan: 3 saved templates",
                      "Pro plan: $20/week with unlimited templates",
                      "Pro plan: $20/week includes national site search and exports",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {page === "directory" && (
            <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Search filters
                </p>
                <h1 className="mt-2 text-3xl font-bold">Find clinical sites nationwide</h1>
                <p className="mt-2 text-slate-600">
                  Search for any clinical specialty by state, city, clinic name, or keyword — not just pediatrics and women’s health.
                </p>
                <div className="mt-6 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Specialty
                    </span>
                    <select
                      value={searchSpecialty}
                      onChange={(e) => setSearchSpecialty(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {SPECIALTIES.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Search by state
                    </span>
                    <select
                      value={searchState}
                      onChange={(e) => setSearchState(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Search city, state, clinic, or specialty
                    </span>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try Dallas, family practice, Miami, psychiatry..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-sm text-slate-600">
                    Results update instantly. When students search from a rotation, the state filter auto-selects from the rotation location whenever possible.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "All States",
                      "PA",
                      "FL",
                      "TX",
                      "CA",
                      "NY",
                    ].map((state) => (
                      <button
                        key={state}
                        onClick={() => setSearchState(state)}
                        className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                          searchState === state
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={resetDirectoryFilters}
                    className="mt-4 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Results
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{filteredDirectory.length} clinical sites found</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Current state filter: <span className="font-semibold text-slate-700">{searchState}</span>
                      {searchState !== "All States" && (
                        <span className="ml-2 text-slate-400">Auto-selected from rotation location</span>
                      )}
                    </p>
                  </div>
                  <button className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">
                    Save search
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {filteredDirectory.length === 0 && (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-lg font-semibold text-slate-800">No clinical sites found</p>
                      <p className="mt-2 text-slate-600">
                        Try another state, clear the search box, or reset all filters.
                      </p>
                    </div>
                  )}
                  {filteredDirectory.map((listing) => (
                    <div key={listing.id} className="rounded-[24px] border border-slate-200 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{listing.clinic}</p>
                          <p className="text-slate-500">
                            {listing.specialty} · {listing.city}, {listing.state} · {listing.setting}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {listing.preceptorType}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Region</p>
                          <p className="mt-1 font-medium">{listing.region}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Students</p>
                          <p className="mt-1 font-medium">{listing.acceptsStudents ? "Accepts students" : "Ask first"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Best fit</p>
                          <p className="mt-1 font-medium">{listing.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {page === "preceptors" && (
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Preceptor interest form
                </p>
                <h1 className="mt-2 text-3xl font-bold">Let preceptors join the platform</h1>
                <p className="mt-2 text-slate-600">
                  Preceptors who are interested can submit their information so students can discover them.
                </p>
                <div className="mt-6 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                    <input
                      value={preceptorForm.name}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Credentials</span>
                    <input
                      value={preceptorForm.credentials}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, credentials: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Specialty</span>
                    <select
                      value={preceptorForm.specialty}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, specialty: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {SPECIALTIES.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Clinic or organization</span>
                    <input
                      value={preceptorForm.clinic}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, clinic: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">City</span>
                    <input
                      value={preceptorForm.city}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">State</span>
                    <select
                      value={preceptorForm.state}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {STATES.filter((state) => state !== "All States").map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                    <input
                      value={preceptorForm.email}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Student types accepted</span>
                    <input
                      value={preceptorForm.studentTypes}
                      onChange={(e) => setPreceptorForm((prev) => ({ ...prev, studentTypes: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </label>
                  <button
                    onClick={addInterestedPreceptor}
                    className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:scale-[1.02]"
                  >
                    Submit preceptor interest
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Interested preceptors
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{activePreceptorCount} active preceptors</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Accepting students
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {preceptors.map((preceptor) => (
                    <div key={preceptor.id} className="rounded-[24px] border border-slate-200 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{preceptor.name}</p>
                          <p className="text-slate-500">
                            {preceptor.credentials} · {preceptor.specialty}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {preceptor.studentTypes}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Clinic</p>
                          <p className="mt-1 font-medium">{preceptor.clinic}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Location</p>
                          <p className="mt-1 font-medium">{preceptor.city}, {preceptor.state}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                          <p className="mt-1 break-all font-medium">{preceptor.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {page === "documents" && (
            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Student paperwork upload
                  </p>
                  <h1 className="mt-2 text-3xl font-bold">Upload paperwork needed for rotation approval</h1>
                  <div className="mt-6 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Student name</span>
                      <input
                        value={studentDocumentForm.ownerName}
                        onChange={(e) => setStudentDocumentForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Document category</span>
                      <select
                        value={studentDocumentForm.category}
                        onChange={(e) => setStudentDocumentForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        {[
                          "Resume",
                          "Immunization Record",
                          "Background Check",
                          "Liability Insurance",
                          "BLS / ACLS",
                          "Affiliation Form",
                        ].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">File name</span>
                      <input
                        value={studentDocumentForm.fileName}
                        onChange={(e) => setStudentDocumentForm((prev) => ({ ...prev, fileName: e.target.value }))}
                        placeholder="example: student_resume.pdf"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
                      <input
                        type="date"
                        value={studentDocumentForm.dueDate}
                        onChange={(e) => setStudentDocumentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <button
                      onClick={addStudentDocument}
                      className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:scale-[1.02]"
                    >
                      Upload student paperwork
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Preceptor paperwork upload
                  </p>
                  <p className="mt-2 text-slate-600">
                    Give preceptors room to upload documents such as licenses, CVs, agreements, and onboarding forms.
                  </p>
                  <div className="mt-6 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Preceptor name</span>
                      <input
                        value={preceptorDocumentForm.ownerName}
                        onChange={(e) => setPreceptorDocumentForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Document category</span>
                      <select
                        value={preceptorDocumentForm.category}
                        onChange={(e) => setPreceptorDocumentForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        {[
                          "License Verification",
                          "CV",
                          "Board Certification",
                          "Practice Agreement",
                          "Onboarding Packet",
                        ].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">File name</span>
                      <input
                        value={preceptorDocumentForm.fileName}
                        onChange={(e) => setPreceptorDocumentForm((prev) => ({ ...prev, fileName: e.target.value }))}
                        placeholder="example: license_verification.pdf"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
                      <input
                        type="date"
                        value={preceptorDocumentForm.dueDate}
                        onChange={(e) => setPreceptorDocumentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </label>
                    <button
                      onClick={addPreceptorDocument}
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3 font-medium text-white shadow-lg shadow-emerald-100 transition hover:scale-[1.02]"
                    >
                      Upload preceptor paperwork
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Paperwork vault
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{documents.length} files tracked</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Shared student + preceptor documents
                  </span>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Student files</p>
                  <div className="space-y-3">
                    {studentDocuments.map((document) => (
                      <div key={document.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{document.fileName}</p>
                            <p className="text-sm text-slate-500">{document.category} · {document.ownerName}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {document.status}
                          </span>
                        </div>
                        {document.dueDate && (
                          <p className="mt-2 text-sm text-slate-600">Due: {document.dueDate}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Preceptor files</p>
                  <div className="space-y-3">
                    {preceptorDocuments.map((document) => (
                      <div key={document.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{document.fileName}</p>
                            <p className="text-sm text-slate-500">{document.category} · {document.ownerName}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {document.status}
                          </span>
                        </div>
                        {document.dueDate && (
                          <p className="mt-2 text-sm text-slate-600">Due: {document.dueDate}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 text-sm text-slate-500 md:flex-row md:px-10">
          <div className="flex items-center gap-3">
            {logoMark}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text font-semibold text-transparent">ClinicalFlow</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              Contact
            </a>
          </div>
          <p>© 2026 ClinicalFlow. MVP demo.</p>
        </div>
      </footer>
    </div>
  );
}
