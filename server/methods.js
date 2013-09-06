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
  // FIXME: dangerous but useful to debug commands on the server
  // exec: function (cmd) {
  //   console.log(cmd);
  //   eval(cmd);
  // }
});