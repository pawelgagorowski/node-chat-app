var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
})

socket.on('disconnect', function() {
  console.log("Disconnected from server")
})

socket.on('newMessage', function (message) {
  console.log("New message", message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li)

})

socket.on('newLocationMessage', function (message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My curent location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a)
  $('#messages').append(li)


})

socket.emit('createMessage', {
  from: "Frank",
  text: "Hi"
}, function (data) {
  console.log("Got it", data);
})

$('#message-form').on('submit', function (e) {
  e.preventDefault()

  var messageTextbox = $('[name=message]')

  socket.emit('createMessage', {
    from: "User",
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  })
})
var locationButton = $('#send-location')

locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert("Geolocation not supported by your browser")
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    console.log(position)
  }, function () {
    locationButton.removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location')
  })
})
