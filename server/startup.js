Meteor.startup(function () {
  // background purge chats
  Meteor.setInterval(function (e) {
    purgeChatOld();
    // console.log('tick | '+Date() );
  }, 1 * 3600 * 1000); // 1h
});