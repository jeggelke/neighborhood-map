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
  service.textSearch(request, function(results, status){callback(results, status, i);});
}
var pushLatLngIteration = 0;
function pushLatLng(results, status, i) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // add lat, lng to array for retrieval later
    if (coolPlaces[i].lat === '') {
      coolPlaces[i].lat = results[0].geometry.location.lat();
      coolPlaces[i].lng = results[0].geometry.location.lng();
    }
    pushLatLngIteration += 1;
    // once this loop finishes and lat and lng are stored, run initializeModel
    if (pushLatLngIteration == coolPlaces.length) {initializeModel();}
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
