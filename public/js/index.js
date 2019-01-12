var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");

  socket.emit("createMessage", {
    from: "pawel@wp.pl",
    text: "this is for you!"
  })
})

socket.on('disconnect', function() {
  console.log("Disconnected from server")
})

socket.on('newMessage', function (message) {
  console.log("New message", message);

})
