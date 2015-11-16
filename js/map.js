//declare api keys
var googleApiKey = 'AIzaSyCPptS2lsMK0rAcxj3R3urgPO-Sq12gZcw';

//declare neighborhood
var myNeighborhood = 'Brooklyn Heights, Brooklyn, NY';

//map dependencies
var geocoder;
var map;
function initMap(address, callback) {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 40.6960105, lng: -73.9932872},
    scrollwheel: false,
    zoom: 15
  });

  coolPlaces.forEach(function(e, i){
    queryGooglePlaces(e.name, placeMarkers, i);
  })

window.setTimeout(callback,500);

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
      marker.addListener('click', function() {
        var infoContent = coolPlaces[i].name;
        changeInfoWindow(marker, infoContent);
        toggleBounce(marker);
      });
    }
    google.maps.event.addListener(infowindow,'closeclick',function(){
      stopBounces();
    });
}


function changeInfoWindow (marker, content) {
  infowindow.close();
  infowindow.setContent(content);
  toggleBounce(marker);
  infowindow.open(map, marker);
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
