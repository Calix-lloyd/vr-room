const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const easyrtc = require("open-easyrtc");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Start Express server
const webServer = http.createServer(app);

// Attach Socket.io to the server
const socketServer = socketIo(webServer, { "log level": 1 });

const myIceServers = [
    { "urls": "stun:stun1.l.google.com:19302" },
    { "urls": "stun:stun2.l.google.com:19302" },
];

easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// EasyRTC Authentication
easyrtc.events.on("easyrtcAuth", (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, (err, connectionObj) => {
        if (err) {
            callback(err, connectionObj);
            return;
        }
        callback(err, connectionObj);
    });
});

// Start EasyRTC server
easyrtc.listen(app, socketServer);

// Start listening on the specified port
webServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});