import { Server } from "socket.io";
import onSocketConnection from "@/helpers/onSocketConnection";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socketio",
  });
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("New connection", socket.id);
    onSocketConnection(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Socket server started successfully!");
  res.end();
}
