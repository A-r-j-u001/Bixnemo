# Bixnemo - Intelligent Meetings & Memory

![Bixnemo Logo](app/icon.tsx)

Bixnemo is a cutting-edge collaboration platform designed to streamline your meeting experience. It combines secure video conferencing with AI-powered minute generation and a centralized hub for storing and organizing your meeting notes.

## 🚀 Features

-   **Secure Authentication**: Robust user registration and login system using `NextAuth.js` and `bcryptjs` for password hashing.
-   **Unified Login/Signup UI**: A seamless, glassmorphic interface with smooth transitions between Sign In and Sign Up modes.
-   **AI-Powered Minutes**: Automatically generate minutes from your meeting transcripts or uploaded audio files using Google's Gemini AI.
-   **Glassmorphism Design**: A modern, visually stunning UI featuring transparent cards, blur effects, and a dynamic particle background.
-   **Dashboard**: A personalized workspace to manage your meetings, upload recordings, and view past notes.
-   **Real-time Video**: (Planned/In-Progress) Integrated video conferencing capabilities.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
-   **3D Effects**: [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmndrs.assets/react-three-fiber) (Particle Background)
-   **Backend**: Next.js API Routes
-   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/)

## 📂 Project Structure

The project follows a modular structure for better maintainability:

```
APP-Bundel/
├── app/
│   ├── (front)/          # Frontend UI Pages
│   │   ├── dashboard/    # User Dashboard
│   │   ├── login/        # Authentication Page
│   │   ├── room/         # Video Meeting Room
│   │   ├── upload/       # Audio Upload & Processing
│   │   └── page.tsx      # Landing Page
│   ├── api/              # Backend API Routes
│   │   ├── auth/         # NextAuth & Signup APIs
│   │   ├── gemini/       # AI Processing APIs
│   │   ├── notes/        # CRUD for Notes
│   │   └── upload-audio/ # File Upload Handling
│   ├── components/       # Reusable UI Components
│   │   ├── auth/         # Auth Providers
│   │   └── ...
│   ├── lib/              # Utility Libraries
│   │   └── db/           # Database Connection & Models
│   └── ...
└── ...
```

## ⚡ Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB (Local or Atlas URI)
-   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/bixnemo.git
    cd bixnemo/APP-Bundel
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    MONGODB_URI=mongodb://localhost:27017/bixnemo
    NEXTAUTH_SECRET=your_super_secret_key
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
