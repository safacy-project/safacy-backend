const socket = require("socket.io");
const { SOCKET_MESSAGE } = require("../constants");

const server = (server) => {
  const io = socket(server, {
    cors: { origin: "*" },
  });

  io.on("connect", (socket) => {
    console.log(SOCKET_MESSAGE.CONNECTED);

    socket.on("join", (roomName) => {
      socket.join(roomName);
    });

    socket.on("leave", (roomName) => {
      socket.leave(roomName);
    });

    socket.on("position", (position) => {
      io.emit("myposition", position.data);
    });

    socket.on("safacyBot", (message) => {
      io.emit("safacyMsg", message);
    });
  });

  io.on("disconnect", (reason) => {
    console.log(SOCKET_MESSAGE.DISCONNECTED);
  });
};

module.exports = server;
