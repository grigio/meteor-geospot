// expanded message view
expanded = false;


toggleScroll = function (argument) {
  if (document.getElementById('foo').className.indexOf( "overthrow-disabled" ) > -1) {
    expanded = false;
    overthrow.forget();
    $('#foo').removeClass('overthrow-disabled');
    console.log('unexpanded'+expanded);
    Template.messages.rendered();
  } else {
    $('#foo').addClass('overthrow-disabled');
    expanded = true;
    overthrow.set();
    console.log('expanded'+expanded);
    Template.messages.rendered();
  }
}


Template.messages.rendered = function() {

  // scroll to the end the div on every new message
  overthrow.toss(document.getElementById( "foo" ), { top: 10000 });
  if (expanded) 
    $('#foo').attr('style','height:100%;');
  else {
    overthrow.set();
    $('#foo').attr('style', 'height:'+ Math.round(window.screen.availHeight/2.3) +'px;');
  }

  markersArray = [];

    var square_id = Session.get('square_id');
    var latlon = geohash.decode(square_id);
    var mapCenter = new google.maps.LatLng(latlon[0],latlon[1]);
    var myOptions = {
      zoom: 12,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if (Session.get('mapview')){
      map = new google.maps.Map(document.getElementById("mapview"), myOptions);

      // add geolocalized messages
      if (typeof curRoom !== "undefined"){
        _(curRoom.messages).each(function (el) {
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
      }
    } // mapview
}


  /**
   *  Autorun
   *  Check for changes on the messages publish
   */
  Meteor.autorun(function() {
    Meteor.subscribe('messages', Session.get('square_id') );
  });

  Template.messages.events = {
    'click .js-toggle-scroll': function (e) {
      _gaq.push(['_trackEvent', 'messages', 'togglescroll', '']);
      toggleScroll();
      e.preventDefault();
    },
    'click .js-toggle-map': function (e) {
      console.log('toglle map');
      if (Session.get('mapview')){
        _gaq.push(['_trackEvent', 'messages', 'togglemap', '']);
        Session.set('mapview', false);
      } else {
        Session.set('mapview', true);
      }
      e.preventDefault();
    }
  }

  Template.messages.updatedAt = function () {
    if (typeof curRoom !== 'undefined'){
      return curRoom.updatedAt.toTimeString()
    }
  }

  Template.messages.messages = function () {
    curRoom = Messages.findOne({_id:Session.get('square_id')} );

    if (curRoom != undefined){
      Session.set("currRoomSize",curRoom.messages.length);
      return curRoom.messages;
    } else { // TODO: DUPL
      return false;
    }
  };