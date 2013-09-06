  Meteor.autorun(function() {
    Meteor.subscribe('messages', 'global' );
  });

Template.home.rendered = function() {
  curRoomG = Messages.findOne({_id:'global'} );

  markersArray = [];

    var mapCenter = new google.maps.LatLng(45.0,7.5);
    var myOptions = {
      zoom: 2,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // FIXME: error in 1st render & duplication with localize
      map = new google.maps.Map(document.getElementById("maphome"), myOptions);

      // add geolocalized messages
      if (typeof curRoomG !== "undefined"){
        _(curRoomG.messages).each(function (el) {
          if (typeof el.lat !== 'undefined') {
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(el.lat, el.lon),
              draggable: false,
              map: map
            });

            // infowindow
            var infowindow = new google.maps.InfoWindow({
                content: '<div style="text-align:left;"><b><i class="icon-user"> </i> '+el.name+'</b><br>'+el.message+'<br><small>'+moment(el.ts).fromNow()+'</small></div>'
            });
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });

            markersArray.push(marker);
          }
          // var markerCluster = new MarkerClusterer(map, markers);
          map.setCenter(mapCenter);
        });

        var markerCluster = new MarkerClusterer(map, markersArray);

      }
}