// Make Connection
const socket = io.connect('http://localhost:2000');

// Query DOM
let message = document.getElementById('message');
let handle = document.getElementById('handle');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function () {
  socket.emit('chat', {
    message: message.value,
    handle: handle.value,
  });
});

message.addEventListener('keypress', function () {
  socket.emit('typing', handle.value);
});

// listen for events

socket.on('chat', function (data) {
  feedback.innerHTML = ''; // clear feedback
  output.innerHTML +=
    '<p class = "message"><strong>' + data.handle + ':</strong>' + data.message + '</p>';
});

socket.on('typing', function (data) {
  feedback.innerHTML += '<p><em>' + data + 'is typing a message...</em></p>';
});
