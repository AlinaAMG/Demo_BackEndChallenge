const express = require("express");
const socket = require("socket.io");
// App setup 
const app = express();

const server = app.listen(2000, () => {
    console.log("Listening to requests  on post 2000")
})

// Static files

app.use(express.static("public"));

// Socket setup 
const io = socket(server);

io.on("connection",function(socket){
    console.log("made socket connection", socket.id);
    
    // emit the message
    socket.on("chat", function (data) {
        io.sockets.emit("chat", data)
    });
    // broadcasting the message
    socket.on("typing", function (data) {
      socket.broadcast.emit("typing",data)
    })
})