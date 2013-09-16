  Meteor.autorun(function() {
      Meteor.call('activeGeohashes',function (err,data) {
        // console.log(data);
        activeGeohashes = data;
      });
    Meteor.subscribe('messages', 'global' );
  });

Template.home.rendered = function() {
  markersArray = [];

    var mapCenter = new google.maps.LatLng(45.0,7.5);
    var myOptions = {
      zoom: 2,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // FIXME: error in 1st render & duplication with localize
      map = new google.maps.Map(document.getElementById("maphome"), myOptions);
      // HACK: very dirty data not ready
      Meteor.setTimeout(function () {

        // add geolocalized messages
        if (typeof activeGeohashes !== "undefined"){
          _(activeGeohashes).each(function (gh) {
            var geo = geohash.decode(gh);
            var el = {
              lat: geo[0], lon:geo[1], ghash:gh
            };

            // FIX: bad coords
            //console.log('a-'+el.lon+" "+el.lat);
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(el.lat, el.lon),
              draggable: false,
              map: map
            });

            // infowindow
            var infowindow = new google.maps.InfoWindow({
                content: '<div style="text-align:left;"><b><i class="icon-user"> </i>Chat Area</b><br><a href="/s/'+el.ghash+'">Go to this chat!</a><br><small></small></div>'
            });
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });

            markersArray.push(marker);
            
            // var markerCluster = new MarkerClusterer(map, markers);
          });

          map.setCenter(mapCenter);

          var markerCluster = new MarkerClusterer(map, markersArray);

        }

      }, 2000); // fucking dirty timeout
}