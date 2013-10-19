Meteor.startup(function (argument) {

(function(body) {
  // Only enable for chromeless window
  // Pro tip: Uncomment this line for testing.
  // if (locationbar.visible) return;

  // Shim matchesSelector
  var matches = body.matchesSelector || body.mozMatchesSelector;

  // Seelctor matches external links, but allows https/http switching
  var selector = "a[href^='http']:not([href*='://" + location.host + "']):not([target='_blank'])";

  // Click event handler
  var handleClickEvent = function(evt) {
    // All the way up
    var element = evt.target;
    while (element && element != body) {
      // Only external links allowed
      if (matches.call(element, selector)) {
        // Add target when no named target given
        var target = element.getAttribute('target');
        if (!target || target.substr(0, 1) == '_') {
          element.setAttribute('target', '_blank');
        }
        return;
      }
      element = element.parentNode;
    }
  }

  // Delegate all clicks on document body
  body.addEventListener('click', handleClickEvent, false);
})(document.body);

});