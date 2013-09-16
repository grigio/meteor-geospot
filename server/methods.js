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

  activeGeohashes: function () {
    var arr=[];
    var objs=Messages.find({$nor: [
            {messages: {$exists: false}},
            {messages: {$size: 0}}
        ]}).fetch();
    _.each(objs, function (obj) {
      if (obj.messages)
        arr.push(obj._id);
    });
    return arr;
  },
  // dangerous but useful to debug commands on the server
  exec: function (cmd) {
    if (process.env.APP_ENV === 'development') {  // NODE_ENV
      // Future = Npm.require('fibers/future');
      // var fut = new Future();


          // Return the results
          console.log("input: "+cmd);
          // var vm = Npm.require('vm');

          var output = undefined;

          // var script = vm.createScript('output = '+cmd);
          eval('output = '+cmd);



        // Meteor.setTimeout(function() {
           console.log('output: '+output);
          // fut['return'](output);

         // }, 3 * 1000);

      // Wait for async to finish before returning
      // the result
      // return fut.wait();
      return output;
      
    }
  }
});