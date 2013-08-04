//geo-utils.js

//TODO: refactore geo namespace
validCoords = function(lat, lon) {
  var val = parseFloat(lat);
  if (val != NaN && val <= 90 && val >= -90){
    var val = parseFloat(lon);
    if (val != NaN && val <= 90 && val >= -90)
        return true;
    else
        return false;
  }
  else
      return false;
}