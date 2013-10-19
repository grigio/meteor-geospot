  
  installApp = function () {
    // Install app
    if (navigator.mozApps) {
        var checkIfInstalled = navigator.mozApps.getSelf();
        checkIfInstalled.onsuccess = function () {
            if (checkIfInstalled.result) {
                // ok
            }
            else {
                var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
                // install.className = "show-install";
                // install.onclick = function () {
                var installApp = navigator.mozApps.install(manifestURL);
                installApp.onsuccess = function(data) {
                    // install.style.display = "none";
                    alert('Open it from the homescreen');
                };
                installApp.onerror = function() {
                    alert("Install failed\n\n:" + installApp.error.name);
                };
            }
        };
    }
    else {
        console.log("Open Web Apps not supported");
    }
  }

  cleanMarkers = function () {
    if (markersArrayh) {
      for (i in markersArrayh) {
        markersArrayh[i].setMap(null);
      }
    markersArrayh.length = 0;
    }
  }

  placeMarkers = function () {
  // add geolocalized messages
    if (Session.get('activeGeohashes')) {
      _(Session.get('activeGeohashes')).each(function (gh) {
        var geo = geohash.decode(gh);
        var el = {
          lat: geo[0], lon:geo[1], ghash:gh };

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

        markersArrayh.push(marker);
      });
     var markerCluster = new MarkerClusterer(map, markersArrayh);
    }
  }

  Meteor.autorun(function() {
  });


Template.home.rendered = function() {
  // installApp();
  markersArrayh = [];

    var mapCenter = new google.maps.LatLng(45.0,7.5);
    var myOptions = {
      zoom: 2,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // FIXME: error in 1st render & duplication with localize
    map = new google.maps.Map(document.getElementById("maphome"), myOptions);

    // just to ensure gmap is loaded
    Meteor.setTimeout(function () {
      // body...
      Meteor.call('activeGeohashes',function (err,data) {
        // console.log(data);
        Session.set('activeGeohashes', data);
        // cleanMarkers();
        placeMarkers();
      });
    }, 3000);

}