
#### Welcome to Retro-Sphere!

Retro-Sphere: A Dynamic Sprint Review Experience
Retro-Sphere is an innovative platform designed to make sprint retrospectives more engaging, interactive, and insightful. It helps development teams reflect on their recent sprints in a fun and collaborative environment.

In Retro-Sphere, team members can:

Share their emotions: Select from five mood emojis that reflect their feelings about the sprint, making it easy to visualize team sentiment at a glance.
Provide feedback: Share thoughts on what went well, what could be improved, and ideas on what the team should start or stop doing in future sprints.
Leave appreciation: Acknowledge colleagues' efforts with positive feedback and encouragement, fostering a supportive and motivated team culture.
Real-time interaction: With WebSocket integration, team members can instantly see each other's inputs and share feedback during live retrospectives.
Retro-Sphere streamlines the sprint review process, bringing teams closer together while helping them continuously improve their processes. Whether for remote or in-person teams, it creates an inclusive space to reflect, discuss, and grow together.





client/
├── public/               # Static assets like images, favicon, etc.
├── src/
│   ├── assets/           # Images, fonts, and other assets
│   ├── components/       # Reusable components (e.g., EmojiPicker, FeedbackForm)
│   ├── contexts/         # React context for state management
│   ├── hooks/            # Custom hooks (e.g., useWebSocket)
│   ├── layouts/          # Layout components (e.g., Header, Footer)
│   ├── pages/            # Page components (e.g., Home, Dashboard)
│   ├── services/         # API service files for interacting with the backend
│   ├── styles/           # Global styles or Material UI theme
│   ├── types/            # TypeScript interfaces and types
│   ├── utils/            # Utility functions (e.g., date formatters)
│   ├── App.tsx           # Main app component
│   ├── index.tsx          # Entry point for the React application
│   ├── router.tsx        # React Router configuration
│   └── vite-env.d.ts     # Vite environment types
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts


server/
├── src/
│   ├── controllers/      # Route handlers (e.g., feedbackController.ts)
│   ├── middlewares/      # Middleware (e.g., error handling, validation)
│   ├── models/           # Database models or schemas (e.g., Feedback.ts)
│   ├── routes/           # Route definitions (e.g., feedbackRoutes.ts)
│   ├── services/         # Business logic (e.g., WebSocket handling, data processing)
│   ├── utils/            # Utility functions (e.g., logger, constants)
│   ├── websockets/       # WebSocket server and handlers
│   ├── app.ts            # Express app setup
│   ├── server.ts         # Entry point for starting the server
│   └── config/           # Configuration files (e.g., env, database)
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
└── .gitignore            # Ignored files and folders
