  Handlebars.registerHelper("formatTime", function(utc) {
    return moment(utc).fromNow(); // (calculate value here)
  });

  // Messages = Meteor.subscribe('messages', Session.get('square_id'));



  /**
   *  Autorun
   *  Check for changes on the messages publish
   */
  Meteor.autorun(function() {
    Meteor.subscribe('messages', Session.get('square_id') );
    Meteor.subscribe('dumbs' );
  });

  Template.messages.messages = function () {
    // var curRoom = Messages.findOne({_id:Session.get('square_id')} );
    var curRoom = Messages.findOne({_id:Session.get('square_id')} );

    if (curRoom != undefined){
      //  if (curRoom.messages > 5){
      //    Messages.update({_id:"myhash"}, { $pop: {messages: 3} });
      // }
      console.log("resm:" + curRoom.messages.length);
      return curRoom.messages;
    } else { // TODO: DUPL
      // Messages.insert({_id:Session.get('square'), messages: [] });
      return false;
    }
  };

  //dumbs
   Template.onlineUsers.onlineUsers = function () {
    var dumbs = Dumbs.find({});
    if (dumbs != undefined){
      //  if (curRoom.messages > 5){
      //    Messages.update({_id:"myhash"}, { $pop: {messages: 3} });
      // }
      console.log("dumbs:" + dumbs);
      return dumbs;
      // return [{_sid:"siddd",_cid:"cidd"}]
    } else { // TODO: DUPL
      return false;
    }
  };