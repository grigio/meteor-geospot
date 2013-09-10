Meteor.startup(function () {

  pastDate = new Date(new Date().setDate(new Date().getDate()-3)); //72h


  purgeChatOld = function (argument) {
    // k=Messages.update({}, {$pull:{messages:{ts:{$lt:pastDate}}}} );
    var objs = Messages.find({},{_id:1}).fetch();
    var arr = [];
    _(objs).each(function (e) {
      arr.push(e._id);
      // console.log(e._id);
      // Messages.update({_id:e._id}, {$pull:{messages:{ts:{$lt:pastDate}}} } );
    });
    Messages.update({_id:{$in:arr}}, {$pull:{messages:{ts:{$lt:pastDate}}}},{multi:true} );
    console.log('----> purged old messages at: '+ new Date() );
  }

  // background purge chats
  Meteor.setInterval(function (e) {
    console.log('> tick | ' + Date() );
    purgeChatOld();
  }, 1 * 3600 * 1000); // 1h
});