const KEYS = {
  ALT: "Alt",
  CTRL: "Control",
  SHIFT: "Shift",
  CAPS_LOCK: "CapsLock",
  CMD: "Meta",
  ENTER: "Enter",
  ESC: "Escape",
  BACKSPACE: "Backspace",
};
const IGNORE_KEYS = [KEYS.SHIFT, KEYS.ESC, KEYS.CAPS_LOCK];

const BLINK_CHARACTER = "▉";
const HOST = "milos.nikic@localhost";

const BIOGRAPHY_TEXT =
  "I am a skilled software engineer with 3 years of professional experience in designing, \
developing, and maintaining applications. My expertise spans the entire software development life cycle, including \
requirements gathering, design, coding, testing, deployment, and maintenance. <br><br>Throughout my career, I have \
utilized agile methodology to deliver high-quality results that meet or exceed client expectations. I am well-versed \
in object-oriented programming concepts and design patterns, which has enabled me to create robust, scalable, and \
maintainable software solutions.<br><br>In addition, I have extensive experience in developing RESTful web services \
and integrating external systems with existing architecture. My knowledge of relational databases (MSSQL) and NoSQL (MongoDB) \
has allowed me to design and implement efficient and reliable data storage and retrieval systems.<br><br>\
As a proponent of test-driven development (TDD), I am skilled in writing unit, integration, and API load tests to ensure \
optimal functionality and performance.<br><br>My experience extends to developing modern, scalable web applications \
across a variety of domains, including insurance, medication, banking, sports, and more. I have worked with various front-end \
and back-end technologies, such as Angular, React, Node.js, and Spring.<br><br>I am a motivated and dedicated professional \
who is always eager to broaden my knowledge and skills. I am committed to delivering high-quality work and contributing \
to the success of my team and organization.";

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
};

export {
  IGNORE_KEYS,
  KEYS,
  BLINK_CHARACTER,
  HOST,
  BIOGRAPHY_TEXT,
  MASTERS_DEGREE_TEXT,
  BACHELORS_DEGREE_TEXT,
  PROJECTS,
  COMMANDS,
};
