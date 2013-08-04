// router.js


Template.body.helpers({
  layoutName: function() {
   return Meteor.Router.page();
  }
});

chat = function(id) {
  // if id valid load chan else not_found
  console.log(id);
  Session.set('square_id', id);
  if (Messages.findOne({_id:id})){
    return 'chat';
  } else {
    return 'not_found';
  }
  // Session.set('square_id', id);
  // return 'chat';
}

Meteor.Router.add({
  '/':         Meteor.Router.to('/home'),
  '/home':     'home',
  '/localizeme': 'localizeme',
  '/s/:id':     chat,
  '/m/:id':    'map',
  '/settings': 'settings',
  '/layout': 'layoutStub',

  '*': 'not_found'
});