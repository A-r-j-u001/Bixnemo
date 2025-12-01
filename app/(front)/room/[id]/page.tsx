"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
// Dynamically import SimplePeer to avoid SSR issues and potential polyfill clashes during initial load
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// Use dynamic import for simple-peer if needed, or ensuring it runs only on client.
// However, simple-peer imports 'process' immediately. 
// We need to polyfill 'global' and 'process' for the browser environment before import.

if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = require('process');
  (window as any).Buffer = require('buffer').Buffer;
}

import SimplePeer, { Instance } from "simple-peer";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import MeetingAssistant from "@/app/components/MeetingAssistant";

interface RoomProps {
  params: {
    id: string;
  };
}

export default function Room({ params: { id: roomId } }: RoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<{ peerId: string; peer: Instance }[]>([]);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<{ peerId: string; peer: Instance }[]>([]);
  const router = useRouter();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Initialize Socket
    const socketInstance = io({
      path: '/socket.io', // Ensure this matches server config
    });
    setSocket(socketInstance);

    // Get Media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        socketInstance.emit("join-room", roomId, socketInstance.id);

        socketInstance.on("user-connected", (userId: string) => {
          connectToNewUser(userId, currentStream, socketInstance);
        });

        socketInstance.on("user-disconnected", (userId: string) => {
          const peerObj = peersRef.current.find(p => p.peerId === userId);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const newPeers = peersRef.current.filter(p => p.peerId !== userId);
          peersRef.current = newPeers;
          setPeers(newPeers);
        });

        // Listen for signals
        socketInstance.on("offer", (payload: any) => {
          const peer = addPeer(payload.signal, payload.caller, currentStream, socketInstance);
          peersRef.current.push({
            peerId: payload.caller,
            peer,
          })
          setPeers([...peersRef.current]);
        });

        socketInstance.on("answer", (payload: any) => {
          const item = peersRef.current.find(p => p.peerId === payload.caller);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });

        socketInstance.on("ice-candidate", (payload: any) => {
          const item = peersRef.current.find(p => p.peerId === payload.caller);
          if (item) {
            item.peer.signal(payload.candidate);
          }
        });
      });

    return () => {
      socketInstance.disconnect();
      // cleanup stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [roomId]);

  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" }
    // Add TURN servers here for production
  ];

  function connectToNewUser(userId: string, stream: MediaStream, socket: Socket) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
      config: { iceServers }
    });

    peer.on("signal", (signal) => {
      socket.emit("offer", { target: userId, caller: socket.id, signal });
    });

    peer.on("connect", () => {
      console.log("Peer connected!");
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      // Implement retry logic or notify user
    });

    peer.on("stream", (userStream) => {
      // This will be handled in the render loop by looking at peers state
    });

    peersRef.current.push({
      peerId: userId,
      peer,
    });
    setPeers([...peersRef.current]);
  }

  function addPeer(incomingSignal: any, callerId: string, stream: MediaStream, socket: Socket) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
      config: { iceServers }
    });

    peer.on("signal", (signal) => {
      socket.emit("answer", { target: callerId, caller: socket.id, signal });
    });

    peer.on("connect", () => {
      console.log("Peer connected!");
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!stream.getAudioTracks()[0].enabled);
    }
  }

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setIsVideoOff(!stream.getVideoTracks()[0].enabled);
    }
  }

  const leaveCall = () => {
    router.push('/dashboard');
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Meeting Assistant Component */}
      <MeetingAssistant />
      <div className="flex flex-1 flex-wrap items-center justify-center gap-4 p-4">
        {/* User's own video */}
        <div className="relative h-64 w-80 overflow-hidden rounded-lg border-2 border-blue-500 bg-black">
          <video
            playsInline
            muted
            ref={userVideo}
            autoPlay
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 text-sm">You</span>
        </div>

        {/* Peers videos */}
        {peers.map((peerObj, index) => {
          return (
            <VideoCard key={peerObj.peerId} peer={peerObj.peer} />
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 bg-gray-800 p-4">
        <button onClick={toggleMute} className={`rounded-full p-4 ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:opacity-80`}>
          {isMuted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
        </button>
        <button onClick={toggleVideo} className={`rounded-full p-4 ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} hover:opacity-80`}>
          {isVideoOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
        </button>
        <button onClick={leaveCall} className="rounded-full bg-red-600 p-4 hover:bg-red-700">
          <FaPhoneSlash size={20} />
        </button>
      </div>
    </div>
  );
}

const VideoCard = ({ peer }: { peer: Instance }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, [peer]);

  return (
    <div className="relative h-64 w-80 overflow-hidden rounded-lg bg-black">
      <video playsInline autoPlay ref={ref} className="h-full w-full object-cover" />
    </div>
  );
};
