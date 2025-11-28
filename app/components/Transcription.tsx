"use client";
import { useEffect, useState, useRef } from "react";

interface TranscriptionProps {
  onTranscriptUpdate: (text: string) => void;
  isRecording: boolean;
}

export default function Transcription({ onTranscriptUpdate, isRecording }: TranscriptionProps) {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const newText = finalTranscript + interimTranscript;
      setTranscript((prev) => finalTranscript ? prev + " " + finalTranscript : prev);
      onTranscriptUpdate(finalTranscript);
    };

    recognitionRef.current = recognition;
  }, [onTranscriptUpdate]);

  useEffect(() => {
    if (isRecording && recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch(e) {
            // ignore if already started
        }
    } else if (!isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
    }
  }, [isRecording]);

  return (
    <div className="mt-4 max-h-40 overflow-y-auto rounded bg-gray-100 p-2 text-black">
      <h3 className="text-xs font-bold uppercase text-gray-500">Live Transcript</h3>
      <p className="text-sm">{transcript}</p>
    </div>
  );
}
