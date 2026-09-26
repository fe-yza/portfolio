export const projects = [
  {
    id: "bco",
    route: "/work/bco",
    title: "Builders Collective Ottawa (BCO)",
    type: "Community",
    category: "Co-founder",
    summary:
      "Co-founded and grew Ottawa's 500+ member community of coders, designers, founders and marketers shipping real products together.",
    variant: "sky",
    image: "/hero/bco-collage-transparent.png",
  },
  {
    id: "1",
    route: "/work/focusup",
    title: "FocusUp",
    type: "Mobile App (iOS)",
    category: "Personal Project",
    summary:
      "A focus-session app that turns productivity into a habit you actually want to keep.",
    variant: "sky",
    image: "/hero/focusup-frames-icon.png",
    screens: [
      {
        src: "/hero/focusup-frames-1.png",
        alt: "FocusUp intention screen — What are you focusing on today?",
      },
      {
        src: "/hero/focusup-frames-2.png",
        alt: "FocusUp home screen — Hi, Feyza, with today's activity and task list",
      },
      {
        src: "/hero/focusup-frames-3.png",
        alt: "FocusUp new session setup — choose task and duration",
      },
      {
        src: "/hero/focusup-frames-4.png",
        alt: "FocusUp active focus session timer",
      },
      {
        src: "/hero/focusup-frames-5.png",
        alt: "FocusUp session complete screen with streak and stats",
      },
    ],
    problem:
      "People don't struggle to find productivity apps — they struggle to stick with them. Most focus/timer apps are either too rigid (a plain countdown with no context) or too gamified (streaks and badges that feel more like pressure than motivation). FocusUp set out to answer: what does a focus session look like when it feels supportive rather than demanding?",
    process: [
      "Defined the core loop first: set an intention → configure the session → focus → reflect on completion, so every screen maps to one of these four moments.",
      "Designed session setup to ask only two real decisions — what you're working on and how long — with 25/50/90-min presets, so starting a session takes seconds, not a form to fill out.",
      "Chose a dark, focused palette of deep blues and purples on purpose — calm during a session, not stimulating or distracting.",
      "Kept “Today's Activity” and the task list visible in the background of a session, so progress is never out of sight just because you're deep in one timer.",
      "Closed the loop with a completion screen that acknowledges time focused, tasks done, and streak — before nudging the next action, rather than just ending abruptly.",
    ],
    myRole:
      "Solo — owned the project end to end: concept, user flow, wireframes, visual design, and prototyping.",
    outcome:
      "A personal project built to explore how a productivity tool can feel encouraging rather than transactional — currently a design concept, not yet shipped.",
  },
  {
    id: "sitesignal",
    route: "/work/sitesignal",
    title: "SiteSignal",
    type: "Web App",
    category: "Personal Project",
    summary:
      "An SEO audit platform that crawls your site and turns the findings into a prioritized list of what to fix first.",
    variant: "duo",
    image: "/hero/sitesignal-cover.png",
    imageFit: "cover",
  },
  {
    id: "2",
    route: "/work/student-budgeting",
    title: "Student Budgeting App",
    type: "Mobile App (iOS)",
    category: "Personal Project",
    summary:
      "A banking dashboard rebuilt around how students actually spend and save.",
    variant: "sky",
    image: "/hero/scotiabankicon.png",
  },
  {
    id: "3",
    tag: "[CASE_STUDY_PLACEHOLDER_3]",
    title: "Project Name — Mobile App",
    type: "Mobile App",
    summary: "Built a design system from scratch that unified three product surfaces.",
    variant: "duo",
    problem:
      "Placeholder: describe the core user or business problem this project set out to solve.",
    process:
      "Placeholder: outline the research, ideation, and iteration process — interviews, flows, wireframes, testing.",
    myRole:
      "Placeholder: describe your specific responsibilities and contributions on the team.",
    outcome:
      "Placeholder: describe the shipped outcome and the measurable impact it had.",
  },
  {
    id: "4",
    tag: "[CASE_STUDY_PLACEHOLDER_4]",
    title: "Project Name — Website",
    type: "Website",
    summary: "Rebuilt a marketing site with a component library that shipped features 3x faster.",
    variant: "mint",
    problem:
      "Placeholder: describe the core user or business problem this project set out to solve.",
    process:
      "Placeholder: outline the research, ideation, and iteration process — interviews, flows, wireframes, testing.",
    myRole:
      "Placeholder: describe your specific responsibilities and contributions on the team.",
    outcome:
      "Placeholder: describe the shipped outcome and the measurable impact it had.",
  },
]

export const getProject = (id) => projects.find((p) => p.id === id)
