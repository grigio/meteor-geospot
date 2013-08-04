

////////










Template.localizeme.position = function () {
  return Session.get('position');
};

Template.localizeme.home = function () {
  return Meteor.Router.settingsUrl();
}

// Template.localizeme.rendered = function() {
//     var mapOptions = {
//         center: new google.maps.LatLng(-34.397, 150.644),
//         zoom: 8,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };

//     var map = new google.maps.Map(document.getElementById("map-canvas"),
//         mapOptions);   
// }

Template.localizeme.rendered = function() {
        markersArray = [];
        console.log('render');
        // initMap =function ()
        // {
            // body...
            var latlng = new google.maps.LatLng(41, 29);
            var myOptions = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

            // add a click event handler to the map object
            google.maps.event.addListener(map, "click", function(event)
            {
                // place a marker
                placeMarker(event.latLng);

                // display the lat/lng in your form's lat/lng fields
                document.getElementById("latFld").value = event.latLng.lat();
                document.getElementById("lngFld").value = event.latLng.lng();
            });
        // } // init

        // map not defined!!
        placeMarker =function (location) {
            // first remove all markers if there are any
            deleteOverlays();

            var marker = new google.maps.Marker({
                position: location, 
                map: map
            });

            // add marker in markers array
            markersArray.push(marker);

            map.setCenter(location);
        }

        // // Deletes all markers in the array by removing references to them
        deleteOverlays =function () {
            if (markersArray) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
            markersArray.length = 0;
            }
        }


        // initMap();

}



$(document).on('click button#localizeme', function () {
  navigator.geolocation.getCurrentPosition(
    // show coords
    function(data){
      console.log(data.coords.latitude+" "+data.coords.longitude);
      Session.set('position',data.coords.latitude+" "+data.coords.longitude);
    },
    // error
    function(){
      Session.set('position', 'coords not aval, autorize or ch browser')
    });
});