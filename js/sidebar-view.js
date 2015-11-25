var coolNeighborhood = 'Brooklyn Heights';

// create global array to be used throughout
var coolPlaces = [];
var initializeModel = function(){


var Place = function(data) {
  var self = this;
  this.name = ko.observable(data.name);
  this.description = ko.observable(data.description);
  this.rating = ko.observable(data.rating);
  this.tags = ko.observableArray(data.tags);
  this.dontmiss = ko.observable(data.dontmiss);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
//  console.log(coolPlaces[0]['lat'])
  var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.name,
        map: map,
        draggable: true
    });

    google.maps.event.addListener(marker, 'click', function() {

      }.bind(this));

  this.marker = ko.observable(marker);
}

var SidebarModel = function() {
	var self = this;
  // create and populate observable array from coolPlaces
  self.placeList = ko.observableArray([]);
	coolPlaces.forEach(function(placeItem, i){
		self.placeList.push(new Place(placeItem));
	})

	self.currentPlace = ko.observable(this.placeList()[0]);

	self.switchPlace = function(){
		self.currentPlace(this);
    self.toggleBounce(this.marker());
    self.changeInfoWindow(this.name(), this.rating(), this.marker(), this.lat(), this.lng());
    queryGooglePlaces(this.name(), centerMarker);
	};

  self.stopBounces = function() {
    this.placeList().forEach(function(e, i) {
      self.placeList()[i].marker().setAnimation(null);
    })
  }

  self.toggleBounce = function(marker) {
    self.stopBounces();
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }

  self.changeInfoWindow = function(name, rating, marker, lat, lng) {
    infowindow.close();
    infowindow.setContent('<h3>' + name + '</h3>My rating: ' + rating + '/10' + '<br><div id="pano"></div>');
    console.log(lat + ', ' + lng);
    infowindow.open(map, marker);
    addStreetView(lat, lng);
  }

  self.filterParameter = ko.observable();

  self.filterPlaces = function(){
    self.placeList([]);
    // Search through object - http://stackoverflow.com/a/5288882/3083666
    $.each(coolPlaces, function(i, v) {
      // use toLowerCase to make filtering easier on user
          if (v.name.toLowerCase().search(new RegExp(self.filterParameter().toLowerCase())) != -1) {
              self.placeList.push(new Place(v));
              coolPlaces[i]['visible'] = true;
              return;
          } else {coolPlaces[i]['visible'] = false;}
      });
      displayFilteredMarkers();
      return true;
    }
}

ko.applyBindings(new SidebarModel())
// stop user from clicking on locations until everything is loaded
$('#loading-overlay').toggle();
}

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
// initMap();
// initMarkers(function() {initializeData();})
callback();
});
};

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

var map;
var infowindow;
function initMap(){
map = new google.maps.Map(document.getElementById('map-canvas'), {
  center: {lat: 40.6960105, lng: -73.9932872},
  scrollwheel: false,
  zoom: 15
});

//InfoWindow information
infowindow = new google.maps.InfoWindow();

getDataFromSheet(function() {initDataArray(function(){consoleLogCallback()})})
}

function initDataArray(callback){
  coolPlaces.forEach(function(e, i){
      queryGooglePlaces(e.name, pushLatLng, i);
  })
}
