//= require socket.io
//= require jquery
//= require bootstrapManifest
//= require underscore
//= require backbone
//= require baseClasses
//= require_tree ./models
//= require_tree ./views
//= require dotdotdot

// bootstrap hack to stop dropdowns from disappearing on mobile
$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

(function(App) {

  _.extend(App, {

    coords: null,
    coordsUpdated: 0,
    MILES_BEFORE_UPDATE: 0.25,
    d: [29.950226, -90.081102],

    init: function() {
      var _this = this;

      $(function() {
        _this.docReady();
      });
    },

    docReady: function() {
      this.restaurants = new App.Collections.Restaurant();
      this.restaurants.listen();
      this.restoList = new App.Views.RestaurantsList({ el: '.resto-tiles', model: this.restaurants });
      this.doLocation();
    },

    doLocation: function() {
      navigator.geolocation.watchPosition(_.bind(this.geoSuccess, this), _.bind(this.geoError, this));
    },

    geoSuccess: function(position) {
      var newCoords = [position.coords.latitude, position.coords.longitude];

      if(position.timestamp > this.coordsUpdated) {
        if(this.coords == null || this.milesFrom(newCoords) >= this.MILES_BEFORE_UPDATE) {
          this.doNewPosition(newCoords, position.timestamp);
        }
      }
    },

    geoError: function() {
      this.coords = this.SUPERDOME_COORDS;
      this.updateRestaurants(); // proceed with no location
    },

    milesFrom: function(pair) {
      var radians = function(degrees) { return degrees * Math.PI/180; }
        , lat1 = radians(pair[0])
        , lon1 = radians(pair[1])
        , lat2 = radians(this.coords[0])
        , lon2 = radians(this.coords[1])
        , dlat = lat2 - lat1
        , dlon = lon2 - lon1
        , a = Math.pow(Math.sin(dlat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2), 2)
        , greatCircle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        , multiplier = 3961 // mean radius of the earth (miles) at 39 degrees from the equator
        , miles = greatCircle * multiplier
      ;
      return miles;
    },

    doNewPosition: function(coords, timestamp) {
      var firstTime = this.coords == null;

      this.coordsUpdated = timestamp;
      this.coords = coords;

      if(firstTime) {
        // The first time, we automatically update (because there are no restaurants on-screen yet)
        this.updateRestaurants();
      }
      else {
        // TODO: After the first time, ask the user if they'd like to update restaurants list
      }
    },

    updateRestaurants: function() {
      this.restaurants.updateLocation(this.coords);
    },

  });

  App.init();

})(window.App);
