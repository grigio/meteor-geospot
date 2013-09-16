Meteor.methods({
  createChat: function(ghash) {
    check(ghash, String);
    try {
      Messages.insert({_id: ghash, messages:[] });
      // TODO: get localname via gmaps
    } catch (err) {
      // probably the chat exist
    }
  },
  purgeChatOld: function () {
    purgeChatOld();
  },
  // dangerous but useful to debug commands on the server
  exec: function (cmd) {
    if (process.env.APP_ENV === 'development') {
      console.log(cmd);
      eval(cmd);
    }
  }
});