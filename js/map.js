//declare api keys
var googleApiKey = 'AIzaSyCPptS2lsMK0rAcxj3R3urgPO-Sq12gZcw';
var streetApiKey = 'AIzaSyCfGdY1eZFJXRi5T-18TrfKrSVjN9k9LOc';

//declare neighborhood
var myNeighborhood = 'Brooklyn Heights, Brooklyn, NY';

//map dependencies
var geocoder;
var map;
function initMap(address) {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 40.6960105, lng: -73.9932872},
    scrollwheel: false,
    zoom: 15
  });
}

function initMarkers(callback){
  coolPlaces.forEach(function(e, i){
    queryGooglePlaces(e.name, placeMarkers, i);
  })

window.setTimeout(callback,1000);
}

function queryGooglePlaces(placeName, functionToRun, i){
  var service = new google.maps.places.PlacesService(map);
  var request = {
    query: placeName
  };
  service.textSearch(request, function(results, status){functionToRun(results, status, i)});
}
var infowindow;
function placeMarkers(results, status, i) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // add lat, lng to array for retrieval later
    if (coolPlaces[i].lat == "") {
      coolPlaces[i]['lat'] = results[0].geometry.location.lat();
      coolPlaces[i]['lng'] = results[0].geometry.location.lng();
    }
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: coolPlaces[i]['lat'], lng: coolPlaces[i]['lng']}
      });
      coolPlaces[i]['marker'] = marker;
      infowindow = new google.maps.InfoWindow();
      var placeLatLng = coolPlaces[i]['lat'] + ', ' + coolPlaces[i]['lng'];
      var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + placeLatLng + '&key=' + streetApiKey;
      var streetViewDiv = '<img src="' + streetViewUrl + '">';
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
}

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

function changeInfoWindow (marker, name, rating, lat, lng) {
  infowindow.close();
  infowindow.setContent('<h3>' + name + '</h3>My rating: ' + rating + '/10' + '<br><div id="pano"></div>');
  toggleBounce(marker);
  infowindow.open(map, marker);
  addStreetView(lat, lng);
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

function stopBounces() {
  coolPlaces.forEach(function(e, i) {
    coolPlaces[i]['marker'].setAnimation(null);
  })
}

function toggleBounce(e) {
    stopBounces();
    e.setAnimation(google.maps.Animation.BOUNCE);
}

//escape to close infowindow
$(document).keyup(function(e){
    if(e.which == 27){
        infowindow.close();
        stopBounces();
    }
});
