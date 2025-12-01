"use client";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/lib/pusher";
import { useRouter } from "next/navigation";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import MeetingAssistant from "@/app/components/MeetingAssistant";
import SimplePeer, { Instance } from "simple-peer";

// Polyfills for SimplePeer
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = require('process');
  (window as any).Buffer = require('buffer').Buffer;
}

interface RoomProps {
  params: {
    id: string;
  };
}

export default function Room({ params: { id: roomId } }: RoomProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<{ peerId: string; peer: Instance }[]>([]);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<{ peerId: string; peer: Instance }[]>([]);
  const router = useRouter();
  const channelRef = useRef<any>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Get Media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        // Initialize Pusher
        const channel = pusherClient.subscribe(`presence-room-${roomId}`);
        channelRef.current = channel;

        channel.bind("pusher:subscription_succeeded", (members: any) => {
          // Initiate connection to all existing members
          members.each((member: any) => {
            if (member.id !== pusherClient.connection.socket_id) {
              const peer = createPeer(member.id, pusherClient.connection.socket_id, currentStream, channel);
              peersRef.current.push({
                peerId: member.id,
                peer,
              });
              setPeers([...peersRef.current]);
            }
          });
        });

        channel.bind("pusher:member_added", (member: any) => {
          console.log("Member added:", member.id);
          // We wait for them to initiate, or we could initiate. 
          // In this logic, the new joiner (subscription_succeeded) initiates.
        });

        channel.bind("pusher:member_removed", (member: any) => {
          const peerObj = peersRef.current.find(p => p.peerId === member.id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const newPeers = peersRef.current.filter(p => p.peerId !== member.id);
          peersRef.current = newPeers;
          setPeers(newPeers);
        });

        channel.bind("client-signal", (payload: any) => {
          if (payload.target === pusherClient.connection.socket_id) {
            const item = peersRef.current.find(p => p.peerId === payload.caller);
            if (item) {
              // Existing peer (we initiated, getting answer or candidate)
              item.peer.signal(payload.signal);
            } else {
              // New offer coming in (we are the receiver)
              const peer = addPeer(payload.signal, payload.caller, currentStream, channel);
              peersRef.current.push({
                peerId: payload.caller,
                peer,
              });
              setPeers([...peersRef.current]);
            }
          }
        });
      });

    return () => {
      pusherClient.unsubscribe(`presence-room-${roomId}`);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [roomId]);

  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" }
  ];

  function createPeer(userToSignal: string, callerId: string, stream: MediaStream, channel: any) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
      config: { iceServers }
    });

    peer.on("signal", (signal) => {
      channel.trigger("client-signal", { target: userToSignal, caller: callerId, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerId: string, stream: MediaStream, channel: any) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
      config: { iceServers }
    });

    peer.on("signal", (signal) => {
      channel.trigger("client-signal", { target: callerId, caller: pusherClient.connection.socket_id, signal });
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
      <MeetingAssistant />
      <div className="flex flex-1 flex-wrap items-center justify-center gap-4 p-4">
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
