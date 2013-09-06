// router.js
Template.body.helpers({
  layoutName: function() {
    window.scrollTo(0,0); // reset previous page scroll position
    return Meteor.Router.page();
  }
});

chat = function(id, label) {
  // if id valid load chan else not_found
  Session.set('square_id', id);
  if (Messages.findOne({_id:id})){
    return 'chat';
  } else {
    return 'not_found';
  }
}

Meteor.Router.add({
  '/':         'home',
  '/home':     'home',
  '/localizeme': 'localizeme',
  '/s/:id':        chat,
  '/s/:id/:label': chat,
  '/settings': 'settings',
  '/layout': 'layoutStub',

  '*': 'not_found'
});