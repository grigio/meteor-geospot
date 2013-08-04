// permission.js


Meteor.startup(function () {
  // console.log(encode(0.0,0.0));
  /**
   * Rooms restrictions
   * Allow everyone to insert a new room
   * Only admin: update and remove rooms
   */
  Messages.allow({
    // insert: function(userId, doc) {
    //   return true;
    // },
    update: function(userId, docs, fields, modifier) {
      // TODO: Test for admin or current user
      // return fields == 'messages' ;
      return true;
    },
    remove: function(userId, docs) {
      return false;
    }
  });

// 
// Methods
// 
  Meteor.methods({
    coords2hash: function (coords) {
      if (!validCoords(coords[0], coords[1])) {
        return false;
      }
      var data = geohash.encode(coords[0], coords[1]);
      console.log(data);
      return data;
    },
    hash2coords: function (hash) {
      var data = geohash.decode(hash);
      console.log(data);
      return data;
    },
    // TODO: moveTo 'ne', 'se' create and redirect
    adjacents: function (hash) {
      var data = geohash.adjacents(hash);
      console.log(data);
      return data;
    },
    onlineUsers: function (id) {
      // .. do other stuff ..
      console.log('rem on');
      return "buaa";
    },
    onlineTest: function (id) {
      // .. do other stuff ..
      console.log('rem test');
      var fullMessages = Messages.findOne({_id:'torino'}).messages
      Messages.update({_id:"torino"}, { messages: fullMessages.slice(-5) } );
      return "baz";
    }
  });

// Dumbs = new Meteor.Collection("dumbs");


Dumbs.allow({
  update: function(userId, docs, fields, modifier) {
    // TODO: Test for admin or current user
    // return fields == 'messages' ;
    return true;
  }
});



Dumbs.remove({});
  Meteor.default_server.stream_server.register( Meteor.bindEnvironment( function(socket) {
    var intervalID = Meteor.setInterval(function() {
        if (socket.meteor_session) {

            var connection = {
                _id: socket.meteor_session.id,
                username: "guest"+_.random(10,99),
                status_message: ""
            };

            console.log("socket.meteor_session.id "+socket.meteor_session.id)
            socket.id = socket.meteor_session.id;
            Dumbs.insert(connection); 
            Meteor.clearInterval(intervalID);
        }
    }, 1000);

    socket.on('close', Meteor.bindEnvironment(function () {
        console.log("X socket.meteor_session.id "+socket.id)
        Dumbs.remove({
          _id: socket.id
        });
    }, function(e) {
        Meteor._debug("Exception from connection close callback:", e);
    }));
  }, function(e) {
      Meteor._debug("Exception from connection registration callback:", e);
  }));

}); // startup


// Meteor.default_server.stream_server.open_sockets