var coolNeighborhood = 'Brooklyn Heights';

// create global array to be used throughout
var coolPlaces = [];
var map;
var infoWindow;
//var self;
var initializeModel = function(){


var Place = function(data) {
  this.name = ko.observable(data.name);
  this.description = ko.observable(data.description);
  this.dontmiss = ko.observable(data.dontmiss);
  this.rating = ko.observable(data.rating);
  this.tags = ko.observableArray(data.tags);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.visibility = ko.observable(true);
  var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.name,
        map: map,
        draggable: true
    });

    google.maps.event.addListener(marker, 'click', function() {
      makeInfoWindow(this.marker(), this.name(), this.rating(), this.description());
      addStreetView(this.lat(), this.lng());
      map.setCenter({lat: this.lat(), lng: this.lng()});
      }.bind(this));

  this.marker = ko.observable(marker);
};

ViewModel = function() {
  var self = this;
  self.placeList = ko.observableArray([]);
  coolPlaces.forEach(function(placeItem, i){
      self.placeList.push(new Place(placeItem));
  });

  self.currentPlace = ko.observable(this.placeList()[0]);
  self.filteredList = ko.observableArray([]);
  this.filterPlaces = ko.observable();
  self.filterPlaces.subscribe(function(filterParam){
    //remove all markers
    self.placeList().forEach(
      function(place){
        place.marker().setMap(null);
      }
    );
    if (filterParam.length === 0){
      //empty placeList and recreate placeList
      self.placeList([]);
      coolPlaces.forEach(function(placeItem, i){
          self.placeList.push(new Place(placeItem));
      });
    } else {
      coolPlaces.forEach(function(place){
        if ((place.name.toLowerCase().search(filterParam.toLowerCase())>=0))
          {
            //push this location to filteredList if search text is equal to coolPlaces['name']
            self.filteredList.push(new Place(place));
          }
        });
      //empty placeList
      self.placeList([]);
      //fill placeList with filteredList
      self.placeList(self.filteredList());
      //empty filteredList for next search
      self.filteredList([]);
    }
  }, this);

  self.switchPlace = function(){
    makeInfoWindow(this.marker(), this.name(), this.rating(), this.description());
    addStreetView(this.lat(), this.lng());
    self.currentPlace(this);
    map.setCenter({lat: this.lat(), lng: this.lng()});
  };

};
ko.applyBindings(new ViewModel());
// stop user from clicking on locations until everything is loaded
$('#loading-overlay').toggle();
};

// Data is returned from Google Sheet as JSON
function getDataFromSheet(callback){
var spreadsheetUrl = "https://spreadsheets.google.com/feeds/list/1vqi68E7RdQyBpREXh4tTfWQA9P2H00bC2zzQE3vm430/od6/public/values?alt=json";
$.getJSON(spreadsheetUrl, function(data) {
 var entry = data.feed.entry;
 $(entry).each(function(){
   // change comma separated list to array to be added to coolPlaces object
   var tempTagArray = this.gsx$tags.$t.split(', ');
   coolPlaces.push({'name':this.gsx$name.$t, 'tags': tempTagArray, 'description':this.gsx$description.$t, 'rating':this.gsx$rating.$t, 'dontmiss': this.gsx$dontmiss.$t, 'lat': '', 'lng': '', 'visible': true, 'marker': null});
 });
callback();
});
}

// adds panorama street view
function addStreetView (posLat, posLng){
  var panorama = new google.maps.StreetViewPanorama(
      $('#pano')[0], {
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

function initMap(){
map = new google.maps.Map(document.getElementById('map-canvas'), {
  center: {lat: 40.6960105, lng: -73.9932872},
  scrollwheel: false,
  zoom: 15
});

//InfoWindow information
infowindow = new google.maps.InfoWindow();

getDataFromSheet(function() {
    initDataArray();
  });
}

function initDataArray(){
  coolPlaces.forEach(function(e, i){
      queryGooglePlaces(e.name, pushLatLng, i);
  });
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

function centerMarker(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
  }
}

function makeInfoWindow(marker, name, rating, description){
  infoWindow = infoWindow || new google.maps.InfoWindow({content: ''});
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1500);

  var infoWindowText = '<div><strong>' + name + '</strong></div><div>' + description + '</div><div><strong>Rating</strong>: ' + rating + ' out of 10</div><div id="pano"></div>';
      infoWindow.setContent (infoWindowText);
      infoWindow.open(map, marker);
}
