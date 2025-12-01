"use client";
import { useState, useEffect } from "react";
import Transcription from "./Transcription";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function MeetingAssistant() {
    const [isRecording, setIsRecording] = useState(false);
    const [fullTranscript, setFullTranscript] = useState("");
    const [minutes, setMinutes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleTranscriptUpdate = (newText: string) => {
        if (newText) {
            setFullTranscript(prev => prev + " " + newText);
        }
    };

    const generateMinutes = async () => {
        if (!fullTranscript) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/ai/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: fullTranscript })
            });
            const data = await response.json();
            setMinutes(data.summary);

            // Save to DB
            await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: "Live Meeting Note",
                    content: data.summary,
                    transcript: fullTranscript,
                    source: 'live'
                })
            });

        } catch (error) {
            console.error("Error generating minutes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 right-4 w-80 rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Meeting Assistant</h2>
                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`rounded px-3 py-1 text-xs font-bold text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>

            <Transcription isRecording={isRecording} onTranscriptUpdate={handleTranscriptUpdate} />

            <div className="mt-4">
                <button
                    onClick={generateMinutes}
                    disabled={!fullTranscript || isLoading}
                    className="w-full rounded bg-purple-600 py-2 text-white disabled:opacity-50"
                >
                    {isLoading ? "Generating..." : "Generate Minutes"}
                </button>
            </div>

            {minutes && (
                <div className="mt-4 max-h-60 overflow-y-auto rounded border border-gray-200 p-2 text-sm text-gray-700">
                    <h3 className="font-bold">Minutes of Meeting:</h3>
                    <div className="whitespace-pre-wrap">{minutes}</div>
                </div>
            )}
        </div>
    );
}
