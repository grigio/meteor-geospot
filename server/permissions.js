// permission.js

Meteor.startup(function () {
  Messages.allow({
    update: function(userId, docs, fields, modifier) {
      return true;
    },
    remove: function(userId, docs) {
      return false;
    }
  });
  Messages.deny({
    // Enrich messages arrived from the client
    insert: function(userId, doc) {   
      Messages.update({_id:doc._id},{$set:{createdAt: new Date()}}); // broken?
     return false;
    },
    update: function(userId, doc) {
      Messages.update({_id:doc._id},{$set:{updatedAt: new Date()}});
      // console.log('doc:'+JSON.stringify(doc));
      return false;
    }
  });
});