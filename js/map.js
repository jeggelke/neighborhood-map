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
