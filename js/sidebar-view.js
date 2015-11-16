var coolNeighborhood = 'Brooklyn Heights';

var coolPlaces = [];

var initializeData = function(){
var Place = function(data) {
  var self = this;
  this.name = ko.observable(data.name);
  this.description = ko.observable(data.description);
  this.rating = ko.observable(data.rating);
  this.tags = ko.observableArray(data.tags);
  this.marker = ko.observable(data.marker);
  this.dontmiss = ko.observable(data.dontmiss);
}

var SidebarModel = function() {
	var self = this;
	self.placeList = ko.observableArray([]);

	coolPlaces.forEach(function(placeItem, i){
		self.placeList.push(new Place(placeItem));
	})

	self.currentPlace = ko.observable(this.placeList()[0]);

	self.switchPlace = function(){
		self.currentPlace(this);
    queryGooglePlaces(this.name(), centerMarker);
    var infoContent = this.name();
    changeInfoWindow(this.marker(), infoContent);
    toggleBounce(this.marker());
	};

  self.filterParameter = ko.observable();

  self.filterPlaces = function(){
    self.placeList([]);
    // Search through object - http://stackoverflow.com/a/5288882/3083666
    $.each(coolPlaces, function(i, v) {
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
window.setTimeout(function(){$('#loading-overlay').toggle()}, 2000)
}

var spreadsheetUrl = "https://spreadsheets.google.com/feeds/list/1vqi68E7RdQyBpREXh4tTfWQA9P2H00bC2zzQE3vm430/od6/public/values?alt=json";
$.getJSON(spreadsheetUrl, function(data) {
 var entry = data.feed.entry;
 $(entry).each(function(){
   var tempTagArray = this.gsx$tags.$t.split(', ');
   coolPlaces.push({'name':this.gsx$name.$t, 'tags': tempTagArray, 'description':this.gsx$description.$t, 'rating':this.gsx$rating.$t, 'dontmiss': this.gsx$dontmiss.$t, 'lat': '', 'lng': '', 'visible': true, 'marker': null});
 });

 initMap(myNeighborhood, function() {initializeData();});
});
