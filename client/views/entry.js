emsg = new EventEmitter2();

emsg.on('new-message',function () {
  var uiMsg = document.getElementById('messageEntry');
  var text = uiMsg.value;

  // validate
  if (text.length > 1) {

      var messageHash = {message:text, name:Session.get('username'), ts: new Date()};

      if (Session.get('currentCoords')){
        _gaq.push(['_trackEvent', 'messages', 'newmesscoords', '']);
        messageHash['lat'] = Session.get('currentCoords')[0];
        messageHash['lon'] = Session.get('currentCoords')[1];
        Session.set('currentCoords', undefined);
      }

      var res = Messages.update({_id:Session.get('square_id') },
      {$addToSet:{
        messages: messageHash
      }
      });

      var resg = Messages.update({_id:'global' },
      {$addToSet:{
        messages: messageHash
      }
      });

      _gaq.push(['_trackEvent', 'messages', 'newmessage', '']);
      emsg.emit('new-message-done','success');

  }
  // error
});


emsg.on('new-message-done', function () {
  console.log('mdone');
  var uiMsg = document.getElementById('messageEntry');
  uiMsg.value = '';
})



  Template.localizeMessageButton.events = {
    'click #localizeMessage': function (e,t) {
      e.preventDefault();
      if (!Session.get('currentCoords')) {
        navigator.geolocation.getCurrentPosition(
          function(data){
            Session.set('currentCoords', [data.coords.latitude, data.coords.longitude]);
          },
          // error
          function(){
            alert('Position not available, please enable the geolocalization.');
          }
        );
      } else {
        // wipe coords
        Session.set('currentCoords', undefined);
      }
      
    }
  };

  Template.entry.events = {
    'click #messageBtnSend': function () {
      emsg.emit('new-message');
    },
    'keydown #messageEntry': function (e) {
      if (e.keyCode === 13){
        emsg.emit('new-message');
      }
    }
  };