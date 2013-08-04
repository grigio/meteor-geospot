// publish.js


/**
 *  Publish the rooms.messages collection
 */
Meteor.publish("messages", function(square_id){
 return Messages.find({_id: square_id}, {messages:{$slice: -5}} );
});

Meteor.publish("dumbs", function(){
  return Dumbs.find({});
});