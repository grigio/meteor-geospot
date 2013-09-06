// publish.js

Meteor.publish("messages", function(square_id){
 return Messages.find({_id: square_id} );
});