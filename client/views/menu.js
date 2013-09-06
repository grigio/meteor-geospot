// from pure-css site ui js

Meteor.startup(function () {

  var menu = document.getElementById('menu'),
      menuLink = document.getElementById('menuLink'),
      layout = document.getElementById('layout');

    toggleClass = function (element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    };
  
});


// highlight the current page
Template.menu.rendered = function() {
  $('.js-'+Meteor.Router.page()).toggleClass('pure-menu-selected');
};

Template.menu.events = {
  'click #menuLink' : function (e) {
    e.preventDefault();
    var active = 'active';
    toggleClass(layout, active);
    toggleClass(menu, active);
  },
  'click .js-link' : function (e, t) { // all js-link
    Meteor.Router.to(e.target.getAttribute('href'));
    _gaq.push(['_trackEvent', 'page', Meteor.Router.page(), Session.get('username')]);
    e.preventDefault();
  }
};
