// from pure-css site ui js

Meteor.startup(function () {
  
});


// highlight the current page
Template.menu.rendered = function() {
  $('.js-'+Meteor.Router.page()).toggleClass('pure-menu-selected');
};

Template.menu.events = {
  'click #menuLink' : function (e) {
    e.preventDefault();
    $('#menu').toggleClass('active');
    $('#layout').toggleClass('active');
  },
  'click .js-link' : function (e, t) { // all js-link
    Meteor.Router.to(e.target.getAttribute('href'));
    _gaq.push(['_trackEvent', 'page', Meteor.Router.page(), Session.get('username')]);
    e.preventDefault();
  }
};
