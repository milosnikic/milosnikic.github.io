const KEYS = {
  ALT: "Alt",
  CTRL: "Control",
  SHIFT: "Shift",
  CAPS_LOCK: "CapsLock",
  CMD: "Meta",
  ENTER: "Enter",
  ESC: "Escape",
  BACKSPACE: "Backspace",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
};
const IGNORE_KEYS = [KEYS.SHIFT, KEYS.ESC, KEYS.CAPS_LOCK];

const CURSOR_CHARACTER = "▉";
const HOST = "milos.nikic@localhost";

const BIOGRAPHY_TEXT =
  "Software engineer and technical co-founder with extensive experience in designing, \
developing, and maintaining applications. Responsible for backend, infrastructure, and production \
scalability. Proficient in all phases of the agile software development lifecycle.<br><br>\
Skilled in API design, distributed backend architectures, cloud-native deployments, and clean, \
maintainable code. Deeply involved in the full lifecycle of backend systems — from architectural \
decisions and infrastructure automation to delivering business value for real users.<br><br>\
Experienced in object-oriented programming concepts, design patterns, and developing RESTful services. \
Strong background in relational databases (PostgreSQL, MSSQL) and NoSQL (MongoDB). Proficient in \
writing unit, integration, and API load tests using test-driven development.<br><br>\
Built and scaled production systems across domains including esports, insurance, healthcare, and \
telecommunications. Worked with Django, .NET, Angular, React, AWS, Docker, and Kubernetes.<br><br>\
Co-founder of <a class=\"terminal-link\" target=\"_blank\" href=\"https://metastack.gg\">Metastack</a>, \
an esports SaaS platform used globally by competitive Counter-Strike players.";

const MASTERS_DEGREE_TEXT =
  "<span><strong>Master's degree in Software Engineering and Computer Science from the Faculty of Organizational \
Sciences at Belgrade University</strong> provided me with an extensive \
education in the fields of information systems and technologies. The program covered a wide range of topics, including \
cloud computing, big data analytics, mobile application development, software testing, functional programming paradigm, \
code quality, and the software development lifecycle.<br><br>Throughout the program, I gained hands-on experience in developing \
and implementing software solutions in real-world settings, using cutting-edge technologies and software engineering \
principles.<br><br>I also developed skills in project management, teamwork, and leadership, which have been instrumental in my \
career as a software engineer. Overall, my Master's degree has provided me with the necessary tools and knowledge to \
develop high-quality software solutions that meet business needs and exceed user expectations, while effectively managing \
software projects from inception to deployment.</span>";

const BACHELORS_DEGREE_TEXT =
  "<span><strong>Bachelor's degree in Information Systems and Technologies from the Faculty \
of Organizational Sciences at Belgrade University</strong> has provided me with a comprehensive education in the fields of information \
systems and telecommunications. <br><br>Throughout my studies, I gained the skills and knowledge needed to develop and manage \
complex IT systems and networks, design and implement communication systems, and stay up-to-date with the constantly \
evolving landscape of technology.The program covered a range of topics, including database systems, programming, web \
development, network architecture, communication protocols, and information security. I also learned about the importance \
of understanding organizational structures and processes, and how they relate to information and communication systems.<br><br> \
This foundation has proved invaluable in my career, allowing me to make significant contributions in fields such as \
software development, network administration, IT consulting, and telecommunications. Overall, my Bachelor's degree from \
the Faculty of Organizational Sciences at Belgrade has been instrumental in my professional development and has set me on a path towards success as software engineer.</span>";

const PROJECTS = {
  FOOTBALL_APP_TEXT:
    '<span>Web application built for organizing football matches and building social network of players. Developed using \
    C#, ASP.NET Core, MSSQLServer, Angular.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/FootballApp">Visit repository</a></span>',
  BATTLESHIP_APP_TEXT:
    '<span>Recreation of famous battleship game built using Java, JavaFX, MySQL for desktop. It covers basic concepts of concurrent programming, threads and network programming conepts\
    such as sockets.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/Battleship">Visit repository</a></span>',
  MAGIC_MAP_APP_TEXT:
    '<span>Magic map task made for purpose of Escape room. It was inspired by Harry Potter movie. Developed using arduino nano.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/magic_map">Visit repository</a></span>',
  THERMALSYSTEM_APP_TEXT:
    '<span>Home automation application for controlling thermal system. Developed using arduino esp8266.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/esp8266-thermal-system">Visit repository</a></span>',
  ASCII_ART_APP_TEXT:
    '<span>Console application made for mastering pygame module. Idea is to enable user to insert image and get it\'s ASCII version. \
    Another possibility is to have live capture from your web camera transformed into ASCII art. It was developed using python and pygame library. <br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/ascii-art">Visit repository</a></span>',
  CERBERUS_APP_TEXT:
    '<span>Web application built for statistics information about Balkan CSGO players.\
    Application is gathering information from multiple platforms in order to display relevant information about players.\
    Developed using Python, Django, Redis and React.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/cerberus">Visit repository</a></span>',
  CARVANA_ML_TEXT:
    '<span>Machine learning project which goal is to determine whether a car is a good or bad buy based\
    on a multiple characteristics.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/Carvana">Visit repository</a></span>',
  FAMILY_TREE_TEXT:
    '<span>Family tree visualization tool that renders family relationships in an interactive visual format.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/family_tree">Visit repository</a></span>',
  HL7_SERIALIZER_TEXT:
    '<span>HL7 Serializer implementation in C# for sending clinical information. Handles serialization \
    and deserialization of HL7 protocol messages used in healthcare systems integration.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/HL7Serializer">Visit repository</a></span>',
  ZENCOIN_BLOCKCHAIN_TEXT:
    '<span>Simple blockchain implementation using JavaScript. Demonstrates core blockchain concepts \
    including hashing, proof of work, and chain validation.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/zencoin-blockchain">Visit repository</a></span>',
  ROOM_LIGHTNING_TEXT:
    '<span>Arduino FreeRTOS project for under table lighting. Uses real-time operating system concepts \
    for controlling LED lighting with multiple concurrent tasks.<br><br>\
    <a class="terminal-link" target="_blank" href="https://github.com/milosnikic/room_lightning">Visit repository</a></span>',
};

const EXPERIENCE = {
  METASTACK_TEXT:
    '<span><strong>Metastack — Co-Founder & Core Backend Engineer</strong><br><br>\
    Co-architected an esports SaaS platform used globally by competitive and casual Counter-Strike players. \
    Metastack provides a unified space to create, organize, and explore strategic game knowledge.<br><br>\
    • Co-architected backend and API design using Django & Django REST Framework<br>\
    • Optimized PostgreSQL queries with profilers and implemented caching for high-traffic routes<br>\
    • Built async workflows for image processing and background tasks<br>\
    • Designed multi-tenant, team-based subscription model with fine-grained access control<br>\
    • AWS infrastructure design, containerized deployments, CI/CD automation (Jenkins)<br>\
    • Implemented observability and monitoring with CloudWatch metrics<br>\
    • Event-driven communication using RabbitMQ, real-time collaboration via WebSockets<br>\
    • Established strategic partnerships with GRID, Faceit/ESEA leagues, and CSMoney<br><br>\
    Technologies: Django, DRF, PostgreSQL, AWS, Docker, Jenkins, RabbitMQ, WebSockets<br><br>\
    <a class="terminal-link" target="_blank" href="https://metastack.gg">Visit Metastack</a></span>',
  VORTEX_WEST_TEXT:
    '<span><strong>Vortex West — Software Developer (July 2022 - Present)</strong><br>Belgrade, Serbia<br><br>\
    <em>Health clinics application</em> — Web solution for clinics located in United States, enhancing \
    the workflow for over 200 affiliates. The platform enables affiliates to personalize their \
    applications, arrange patient visits, and showcase various clinic services.<br><br>\
    • Developed advanced RESTful APIs and Django plugins, tailored specifically for selected affiliates<br>\
    • Isolated time-consuming tasks from request-response cycle by utilizing message queues<br>\
    • Contributed to the development of CI/CD, optimization of Docker images, and deployment processes<br><br>\
    Technologies: Django, DRF, PostgreSQL, React, Docker</span>',
  TNATION_TEXT:
    '<span><strong>TNation — C# Backend Developer (Oct 2019 – July 2022)</strong><br>Belgrade, Serbia<br><br>\
    <em>1. Wiener Client Portal</em> — Application for customers to look through, pay and open new insurance policies.<br><br>\
    • Developed solution from scratch — creating the architecture, database and coding both frontend and backend<br>\
    • Created PowerShell script for fully automated application deployment to IIS<br>\
    • Successfully integrated Nestpay payment gateway for paying insurance policy installments<br><br>\
    Technologies: .NET Core, C#, Entity Framework, Dapper, WebApi, MSSQL, Angular<br><br>\
    <em>2. Optical store and hospital software</em> — Web solution for hospitals and optical stores for \
    making appointments, creating purchase orders, and keeping medical records of patients.<br><br>\
    • Worked on both backend and frontend part of the application<br>\
    • Created stored procedures, database entities, jobs, reports in SSRS<br>\
    • Handled various external systems integrations via APIs<br>\
    • Managed IIS, server certificates and application deployment with Jenkins<br><br>\
    Technologies: .NET Framework, Entity Framework, MSSQL, SSRS, AngularJS</span>',
  THINGS_SOLVER_TEXT:
    '<span><strong>Things Solver — Data Analyst, Internship (Apr – July 2019)</strong><br>Belgrade, Serbia<br><br>\
    <em>A1 Group</em> — Creating solution for predicting base station failure possibility.<br><br>\
    • Data preprocessing on real dataset from telecommunications industry<br>\
    • Managed to label top 5 critical base stations based on previously determined most important KPIs<br>\
    • Identified anomalous behavior in performances of telecommunications network using Autoencoders<br><br>\
    Technologies: Python, Autoencoders, Data Analysis</span>',
};

const COMMANDS = {
  ls: { shortDescription: "Used to list content of directory" },
  cd: { shortDescription: "Used to change directory" },
  pwd: { shortDescription: "Prints path of current working directory" },
  clear: { shortDescription: "Clears current terminal window" },
  cat: { shortDescription: "Displays content of the file specified" },
  history: { shortDescription: "Displays all previously called commands" },
  help: {
    shortDescription: "Displays all possible commands with their description",
  },
  theme: { shortDescription: "Allows user to set preferred theme" },
  exit: { shortDescription: "Closes browser's page" },
};

export {
  IGNORE_KEYS,
  KEYS,
  CURSOR_CHARACTER,
  HOST,
  BIOGRAPHY_TEXT,
  MASTERS_DEGREE_TEXT,
  BACHELORS_DEGREE_TEXT,
  PROJECTS,
  EXPERIENCE,
  COMMANDS,
};
