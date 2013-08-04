function d (e) {
  JSON.stringify(e);
}


if (Meteor.isClient) {

 ////////// Helpers for in-place editing //////////
  
  // Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };
  
  // Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};
  
    return function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  };

  Template.entry.events = {};

  Template.entry.events[okcancel_events('#messageBox')] = make_okcancel_handler({
    ok: function (text, event) {
      var nameEntry = document.getElementById('name')

      // var ts = moment().unix() * 1000
      var ts = moment.utc().format();
      // Messages.insert({name: nameEntry.value, message: text, time: ts})

      // var res = Messages.update({_id:"myhash"},
      var res = Messages.update({_id:Session.get('square_id') },
      {$addToSet:{
        messages:{message:text, name:nameEntry.value, ts:ts }
      }
      });

      // del
      // if (curRoom && curRoom.messages > 5){
      // }
        // Messages.update({_id:"myhash"}, { $pop: {messages: -10} });


      console.log("res:" + res);

      // document.cookie = "username="+nameEntry.value
      localStorage.setItem("username",nameEntry.value)
      event.target.value = ""

      // console.log('press '+nameEntry.value)
      // console.log( geohash.encode(38.897, -77.035) );
    }
  });


  Meteor.startup(function () {
    if ('chat' == Session.get('page')){
      var nameEntry = document.getElementById('name')
      nameEntry.value = localStorage.getItem('username')
    }

      // HACK: sid isn't ready yet :(
      setTimeout(function() {
        var sid = Meteor.default_connection._lastSessionId

        Dumbs.update({_id:sid },
          {$set:{
            username: localStorage.getItem('username'),
            status_message: localStorage.getItem('status_message')
          }
        });
          console.log('inviato '+localStorage.getItem('username'))

      }, 2000);

    console.log( geohash.encode(38.897, -77.035) );
    console.log( "M:" +moment().format() );

    
  });
}

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }
