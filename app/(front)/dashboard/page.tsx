"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { FaVideo, FaFileUpload, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Logo } from "../../components/Logo";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('/api/notes')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotes(data);
        })
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const createMeeting = () => {
    const roomId = uuidv4();
    router.push(`/room/${roomId}`);
  };

  const goToUpload = () => {
    router.push("/upload");
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 bg-white/5 px-8 py-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-white">Bixnemo</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            {session?.user?.image && (
              <img src={session.user.image} alt="Profile" className="h-8 w-8 rounded-full border border-white/20" />
            )}
            <span className="font-medium">{session?.user?.name}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-200 hover:bg-red-500/30 transition-colors"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto p-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold text-white">Welcome back, {session?.user?.name?.split(" ")[0]}!</h2>
          <p className="text-gray-300">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: New Meeting */}
          <div
            onClick={createMeeting}
            className="cursor-pointer transform rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              <FaVideo size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">New Meeting</h3>
            <p className="text-gray-400">Start an instant video conference with real-time AI minutes.</p>
          </div>

          {/* Card 2: Upload Audio */}
          <div
            onClick={goToUpload}
            className="cursor-pointer transform rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
              <FaFileUpload size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">Upload Recording</h3>
            <p className="text-gray-400">Transcribe and summarize pre-recorded audio files.</p>
          </div>

          {/* Card 3: Past Notes */}
          <div
            onClick={() => setShowHistory(!showHistory)}
            className="cursor-pointer transform rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              <FaHistory size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">History</h3>
            <p className="text-gray-400">View your past meetings notes and minutes.</p>
            <span className="mt-4 block text-sm font-semibold text-emerald-400">{notes.length} saved notes</span>
          </div>
        </div>

        {showHistory && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="mb-4 text-2xl font-bold text-white">Your Notes</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {notes.length === 0 ? (
                <p className="text-gray-400">No notes saved yet.</p>
              ) : (
                notes.map(note => (
                  <div key={note._id} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md">
                    <h4 className="font-bold text-white">{note.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{new Date(note.createdAt).toLocaleString()}</p>
                    <div className="max-h-32 overflow-y-auto text-sm text-gray-300 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {note.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
