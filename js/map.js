//declare neighborhood
var myNeighborhood = 'Brooklyn Heights, Brooklyn, NY';

//map dependencies
var geocoder;

function callbackPause(callback){
callback();
}

function queryGooglePlaces(placeName, callback, i, innerCallback){
  var service = new google.maps.places.PlacesService(map);
  var request = {
    query: placeName
  };
  service.textSearch(request, function(results, status){callback(results, status, i)});
}
var pushLatLngIteration = 0;
function pushLatLng(results, status, i) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // add lat, lng to array for retrieval later
    if (coolPlaces[i].lat == "") {
      coolPlaces[i]['lat'] = results[0].geometry.location.lat();
      coolPlaces[i]['lng'] = results[0].geometry.location.lng();
    }
    pushLatLngIteration += 1;
    // once this loop finishes and lat and lng are stored, run initializeModel
    if (pushLatLngIteration == coolPlaces.length) {initializeModel()}
  }


/*
var infowindow;
infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
        map: map,
        position: {lat: coolPlaces[i]['lat'], lng: coolPlaces[i]['lng']}
      });
      coolPlaces[i]['marker'] = marker;
      var placeLatLng = coolPlaces[i]['lat'] + ', ' + coolPlaces[i]['lng'];
      marker.addListener('click', function() {
        changeInfoWindow(marker, coolPlaces[i]['name'], coolPlaces[i]['rating'], coolPlaces[i]['lat'], coolPlaces[i]['lng']);
        toggleBounce(marker);
        $('#place-name').html(coolPlaces[i]['name']);
        $('#place-description').html(coolPlaces[i]['description']);
        $('#place-dont-miss').html(coolPlaces[i]['dontmiss']);
      });
    }

    google.maps.event.addListener(infowindow,'closeclick',function(){
      stopBounces();
    });

*/
}

// adds panorama street view
function addStreetView (posLat, posLng){
  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: {lat:posLat, lng: posLng},
        pov: {
          heading: 34,
          pitch: 10
        },
        addressControl: false,
        linksControl: false,
        panControl: false,
        enableCloseButton: false,
        fullScreenControl: false
      });
  map.setStreetView(panorama);
}

// closes, changes data, and reopens infowindow
function changeInfoWindow (marker, name, rating, lat, lng) {
  infowindow.close();
  infowindow.setContent('<h3>' + name + '</h3>My rating: ' + rating + '/10' + '<br><div id="pano"></div>');
//  infowindow.open(map, marker);
//  addStreetView(lat, lng);
}

function centerMarker(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
  }
}

// Sets the map on all markers in the array.
function displayFilteredMarkers() {
  for (var i = 0; i < coolPlaces.length; i++) {
    if (coolPlaces[i]['visible'] == true) {
      coolPlaces[i]['marker'].setMap(map);
    } else {coolPlaces[i]['marker'].setMap(null);}
  }
}


function toggleBounce(e) {
    e.setAnimation(google.maps.Animation.BOUNCE);
}

//escape to close infowindow
$(document).keyup(function(e){
    if(e.which == 27){
        infowindow.close();
        stopBounces();
    }
});
