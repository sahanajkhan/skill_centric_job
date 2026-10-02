// mock user skills for MVP testing
export const MOCK_USER_SKILLS = [
  'React', 'JavaScript', 'HTML', 'CSS', 'Node.js'
];

export const MOCK_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    salary: "₹6–10 LPA",
    job_type: "Full-time",
    experience: "0–2 years",
    description: "We are looking for a talented Frontend Developer to join our remote team. You will be responsible for building responsive user interfaces using React and modern CSS. Experience with state management and API integration is required.",
    required_skills: ["React", "JavaScript", "HTML", "CSS", "Git", "TypeScript"],
    matching_skills: ["React", "JavaScript", "HTML", "CSS"],
    missing_skills: ["Git", "TypeScript"],
    match_score: 66,
    sources: [
      { name: "LinkedIn", url: "https://linkedin.com/jobs/view/1" },
      { name: "Indeed", url: "https://indeed.com/viewjob?jk=1" }
    ]
  },
  {
    id: 2,
    title: "React Web Developer",
    company: "InnovateTech",
    location: "Bangalore, India",
    salary: "₹8–12 LPA",
    job_type: "Full-time",
    experience: "1–3 years",
    description: "Join our dynamic team to build scalable web applications. We need a developer with strong React skills, understanding of Node.js for backend BFFs, and a passion for clean code.",
    required_skills: ["React", "JavaScript", "Node.js", "Redux", "CSS"],
    matching_skills: ["React", "JavaScript", "Node.js", "CSS"],
    missing_skills: ["Redux"],
    match_score: 80,
    sources: [
      { name: "Naukri", url: "https://naukri.com/job/2" }
    ]
  },
  {
    id: 3,
    title: "Full Stack Engineer (MERN)",
    company: "Global Solutions",
    location: "Remote",
    salary: "₹12–18 LPA",
    job_type: "Full-time",
    experience: "2–4 years",
    description: "Seeking a full stack engineer proficient in the MERN stack. You will architect and develop end-to-end features.",
    required_skills: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
    matching_skills: ["React", "Node.js", "JavaScript"],
    missing_skills: ["MongoDB", "Express"],
    match_score: 60,
    sources: [
      { name: "LinkedIn", url: "https://linkedin.com/jobs/view/3" },
      { name: "Internshala", url: "https://internshala.com/job/3" }
    ]
  },
  {
    id: 4,
    title: "UI/UX Developer",
    company: "Creative Designs",
    location: "Mumbai, India",
    salary: "₹5–8 LPA",
    job_type: "Hybrid",
    experience: "0–2 years",
    description: "Looking for a developer who has a strong eye for design. You will bridge the gap between graphical design and technical implementation.",
    required_skills: ["HTML", "CSS", "JavaScript", "Figma", "React"],
    matching_skills: ["HTML", "CSS", "JavaScript", "React"],
    missing_skills: ["Figma"],
    match_score: 80,
    sources: [
      { name: "Indeed", url: "https://indeed.com/viewjob?jk=4" },
      { name: "Other", url: "https://creativedesigns.com/careers" }
    ]
  },
  {
    id: 5,
    title: "Backend Node.js Developer",
    company: "ServerScale",
    location: "Remote",
    salary: "₹10–15 LPA",
    job_type: "Full-time",
    experience: "3+ years",
    description: "We need a backend expert to scale our APIs. Must have deep knowledge of Node.js, Express, and PostgreSQL.",
    required_skills: ["Node.js", "Express", "PostgreSQL", "JavaScript", "Docker", "AWS"],
    matching_skills: ["Node.js", "JavaScript"],
    missing_skills: ["Express", "PostgreSQL", "Docker", "AWS"],
    match_score: 33,
    sources: [
      { name: "LinkedIn", url: "https://linkedin.com/jobs/view/5" }
    ]
  },
  {
    id: 6,
    title: "Junior React Native Developer",
    company: "AppWorks",
    location: "Pune, India",
    salary: "₹4–7 LPA",
    job_type: "Full-time",
    experience: "Fresher",
    description: "Start your mobile development career with us. Basic knowledge of React and JavaScript is required.",
    required_skills: ["React Native", "JavaScript", "React", "Firebase"],
    matching_skills: ["JavaScript", "React"],
    missing_skills: ["React Native", "Firebase"],
    match_score: 50,
    sources: [
      { name: "Internshala", url: "https://internshala.com/job/6" }
    ]
  },
  {
    id: 7,
    title: "Software Engineer - Frontend",
    company: "FinTech Pro",
    location: "Gurgaon, India",
    salary: "₹15–22 LPA",
    job_type: "On-site",
    experience: "4–6 years",
    description: "Join our core engineering team to build high-performance financial dashboards.",
    required_skills: ["React", "TypeScript", "Redux", "Jest", "Webpack", "CSS"],
    matching_skills: ["React", "CSS"],
    missing_skills: ["TypeScript", "Redux", "Jest", "Webpack"],
    match_score: 33,
    sources: [
      { name: "Naukri", url: "https://naukri.com/job/7" },
      { name: "LinkedIn", url: "https://linkedin.com/jobs/view/7" }
    ]
  },
  {
    id: 8,
    title: "Frontend Intern",
    company: "Startup Hub",
    location: "Remote",
    salary: "₹15k–25k / month",
    job_type: "Internship",
    experience: "0 years",
    description: "Great opportunity for students to learn real-world web development. HTML, CSS, JS required.",
    required_skills: ["HTML", "CSS", "JavaScript", "React"],
    matching_skills: ["HTML", "CSS", "JavaScript", "React"],
    missing_skills: [],
    match_score: 100,
    sources: [
      { name: "Internshala", url: "https://internshala.com/job/8" }
    ]
  },
  {
    id: 9,
    title: "Web Master / Maintainer",
    company: "Legacy Corp",
    location: "Chennai, India",
    salary: "₹3–5 LPA",
    job_type: "Full-time",
    experience: "1–2 years",
    description: "Maintain and update our existing company websites. Good knowledge of vanilla web technologies needed.",
    required_skills: ["HTML", "CSS", "JavaScript", "PHP", "WordPress"],
    matching_skills: ["HTML", "CSS", "JavaScript"],
    missing_skills: ["PHP", "WordPress"],
    match_score: 60,
    sources: [
      { name: "Indeed", url: "https://indeed.com/viewjob?jk=9" }
    ]
  },
  {
    id: 10,
    title: "Senior Javascript Engineer",
    company: "TechNova",
    location: "Remote",
    salary: "₹20–30 LPA",
    job_type: "Full-time",
    experience: "5+ years",
    description: "We need a JavaScript wizard to lead our frontend architecture.",
    required_skills: ["JavaScript", "TypeScript", "React", "Node.js", "GraphQL", "AWS"],
    matching_skills: ["JavaScript", "React", "Node.js"],
    missing_skills: ["TypeScript", "GraphQL", "AWS"],
    match_score: 50,
    sources: [
      { name: "LinkedIn", url: "https://linkedin.com/jobs/view/10" }
    ]
  }
];

export const SKILL_CATEGORIES = {
  "Programming Languages": ["JavaScript", "Python", "Java", "C++", "Ruby", "PHP", "TypeScript"],
  "Frameworks": ["React", "Angular", "Vue", "Node.js", "Django", "FastAPI", "Spring Boot", "Express"],
  "Databases": ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase"],
  "Tools": ["Git", "Docker", "Kubernetes", "Webpack", "Babel", "Jest"],
  "Cloud": ["AWS", "Azure", "Google Cloud", "Heroku", "Vercel"],
  "Other": ["HTML", "CSS", "Sass", "GraphQL", "REST API", "Linux"]
};
