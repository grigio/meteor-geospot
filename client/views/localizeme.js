// Deletes all markers in the array by removing references to them
		deleteOverlays =function () {
			if (markersArray) {
				for (i in markersArray) {
					markersArray[i].setMap(null);
				}
			markersArray.length = 0;
			}
		}

		placeMarker =function (lat, lon) {
			// first remove all markers if there are any
			var location = new google.maps.LatLng(lat, lon);
			// deleteOverlays();

			marker = new google.maps.Marker({
				position: location,
				draggable: true,
				map: map
			});

			markersArray.push(marker);

      google.maps.event.addListener(marker, 'dragend', function(ev) {
				_gaq.push(['_trackEvent', 'localization', 'dragmarker', '']);
				em.emit('new-coords', ev.latLng.lat(), ev.latLng.lng());
      });

			map.setCenter(location);
		}

placeSquare = function (sGeohash) { // zoom 5
	var cePoint = geohash.decode(geohash.neighbors(sGeohash).c);
	var nwPoint = geohash.decode(geohash.neighbors(sGeohash).nw);
	var sePoint = geohash.decode(geohash.neighbors(sGeohash).se);

	deleteOverlays();

	placeMarker(cePoint[0],cePoint[1]);

	var location = new google.maps.LatLng(cePoint[0], cePoint[1]);
	var nwCoord = new google.maps.LatLng( cePoint[0]+(nwPoint[0]-cePoint[0])/2.0, cePoint[1]+(nwPoint[1]-cePoint[1])/2.0 );
	var seCoord = new google.maps.LatLng( cePoint[0]+(sePoint[0]-cePoint[0])/2.0, cePoint[1]+(sePoint[1]-cePoint[1])/2.0 );

	var rectangle = new google.maps.Rectangle();
	var rectOptions = {
			map: map,
	    strokeColor : "#FF0000",
	    fillColor : "#FF0000",
	    strokeOpacity : 0.8,
	    strokeWeight : 2,
	    fillOpacity : 0.2
	};
	rectangle.setOptions(rectOptions);

	// var c = Math.cos(position.lat()* Math.PI / 180);
	rectangle.setBounds(new google.maps.LatLngBounds(nwCoord,seCoord) );

	markersArray.push(rectangle);

	map.setCenter(location);
}

// EventEmitter for Localize me
em = new EventEmitter2();

em.on('map-ready', function () {
	console.log('map-ready');
	placeSquare( Session.get('default-chat') );
});

em.on('new-coords', function(lat, lon) {
	SessionPersistent.set('default-chat', geohash.encode(lat, lon, 5) );
	placeMarker(lat, lon);
	var newChat = Session.get('default-chat');
	placeSquare( newChat );
	// try to init the chat on the server
	Meteor.call('createChat', newChat );
});

Template.mapCanvas.rendered = function() {

		markersArray = [];

			var latlng = new google.maps.LatLng(45.0, 7.5);
			var myOptions = {
				zoom: 10,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
			em.emit('map-ready');

		// map not defined!!
		placeMarkerOld =function (location) {
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

}

Template.mapInfo.events = {
  'click #localizeme' : function (e) {
		e.preventDefault();
		_gaq.push(['_trackEvent', 'localization', 'trylocalize', '']);
	  navigator.geolocation.getCurrentPosition(
			function(data){
				em.emit('new-coords', data.coords.latitude, data.coords.longitude);
				_gaq.push(['_trackEvent', 'localization', 'successlocalize', '']);
			},
			// error
			function(){
				_gaq.push(['_trackEvent', 'localization', 'faillocalize', '']);
			  alert('Position not available, please enable the geolocalization.');
			}
		);
  }
};