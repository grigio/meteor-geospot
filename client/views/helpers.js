Handlebars.registerHelper("formatTime", function(utc) {
  return moment(utc).fromNow(); // INFO: return few secs if utc is nil
});

Handlebars.registerHelper('session',function(input){
  return Session.get(input);
});