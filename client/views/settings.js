Template.settings.status = function () {
  return Meteor.status().status;
}

Template.settings.events = {
  'click button.save': function (e, t) {
    _gaq.push(['_trackEvent', 'messages', 'changedname', '']);
    e.preventDefault();

    // save to the client the new user info
    _($("form").children('[name]')).each(function (el) {
      SessionPersistent.set(el.name, el.value);
      console.log(el.name, el.value);
    });

  }
}