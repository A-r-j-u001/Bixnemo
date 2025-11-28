import express from "express";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId, userId) => {
      console.log(`User ${userId} joining room ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected from room ${roomId}`);
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });

    // Signaling for WebRTC
    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", (payload) => {
      io.to(payload.target).emit("ice-candidate", payload);
    });
    
    // Note sharing events
    socket.on("update-note", ({ roomId, content }) => {
       socket.to(roomId).emit("note-updated", content);
    });
  });

  expressApp.all("*", (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
