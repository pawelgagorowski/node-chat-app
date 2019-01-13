var socket = io();

function scrollToBottom() {
  // Selectors
  var messages = $('#messages')
  var newMessage = messages.children('li:last-child')

  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', function () {
  console.log("Connected to server");
})

socket.on('disconnect', function() {
  console.log("Disconnected from server")
})

socket.on('newMessage', function (message) {
  // var formattedTime = moment(message.createdAt).format('h:mm a')

  var template = $('#message-template').html()
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: message.createdAt,
    timeStamp: moment(message.createdAt).fromNow()
  })
  $('#messages').append(html);
  scrollToBottom();

  // var li = $('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // $('#messages').append(li)

})

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('+-h:mm a')
  var template = $('#location-message-template').html()
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })

   $('#messages').append(html)
   scrollToBottom();
  // var li = $('<li></li>');
  // var a = $('<a target="_blank">My curent location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a)
  // $('#messages').append(li)


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

function updateTimeStamps(){
  let loop = document.getElementById("messages").getElementsByClassName("message").length;
  for(let i=0; i<loop; i++){
    let timeStamp = document.getElementById("messages").getElementsByClassName("message")[i].getAttribute("data-timestamp")
    // console.log(typeof timeStamp)
    // console.log(timeStamp)
    // console.log(new Date(Number(timeStamp)))
    // console.log(moment(new Date(Number(timeStamp))).isValid());
    document.getElementById("messages").getElementsByClassName("message")[i].getElementsByClassName("timestamp")[0].textContent = moment(new Date(Number(timeStamp))).fromNow();
    // console.log(moment(new Date(Number(timeStamp))).fromNow())
  }
  console.log('TimeStamps updated');
};

setInterval(updateTimeStamps, 60000);
