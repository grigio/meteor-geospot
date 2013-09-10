Meteor.startup(function () {
  
  // keep session values after reload
  SessionPersistent = {
    set: function (key, value) {
      Session.set(key, value);
      localStorage.setItem(key, value);
    },

    restore: function (key, defaultValue) {
      if (localStorage[key]) {
        Session.set(key, localStorage[key]);
      } else {
        if (defaultValue !== undefined) {
          SessionPersistent.set(key, defaultValue);
        }
      }
    }
  }

  // restore
  SessionPersistent.restore('username', "user"+Meteor.uuid().slice(0,5));
  SessionPersistent.restore('user-description', "user"+Meteor.uuid().slice(0,5));
  SessionPersistent.restore('default-chat');

  Session.set('home-url', Meteor.Router.homeUrl());
  Session.set('mapview', false);

  r = function (cmd) {
    Meteor.call('exec', cmd);
  }

});