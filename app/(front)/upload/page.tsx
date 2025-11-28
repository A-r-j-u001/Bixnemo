"use client";
import { useState } from "react";
import { FaCloudUploadAlt, FaFileAudio } from "react-icons/fa";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [minutes, setMinutes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMinutes(data.summary);
        
        // Save to DB
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: file.name,
                content: data.summary,
                transcript: "Audio Transcript (Generated via Gemini)",
                source: 'upload'
            })
        });

      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload and process file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white">
      <h1 className="mb-8 text-3xl font-bold">Upload Audio Recording</h1>
      
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 dark:border-gray-600">
          <FaCloudUploadAlt className="mb-4 text-6xl text-gray-400" />
          <p className="mb-2 text-lg">Drag and drop audio file here or click to browse</p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Browse Files
          </label>
          {file && (
            <div className="mt-4 flex items-center text-green-500">
              <FaFileAudio className="mr-2" />
              <span>{file.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Processing (Transcribing & Summarizing)..." : "Generate Minutes"}
        </button>

        {minutes && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Minutes of Meeting:</h2>
            <div className="rounded-lg bg-gray-100 p-6 whitespace-pre-wrap dark:bg-zinc-700">
              {minutes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
