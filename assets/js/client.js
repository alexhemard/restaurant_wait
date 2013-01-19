//= require socket.io
//= require jquery
//= require jquery.validate
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

    init: function() {
      var _this = this;

      $(function() {
        _this.docReady();
      });
    },

    docReady: function() {
      var _this = this;

      this.restaurants = new App.Collections.Restaurant($('.resto-tiles').data('json'));
      this.restoList = new App.Views.RestaurantsList({ el: '.resto-tiles', model: this.restaurants });
      this.restoList.render();
      this.restaurants.listen();

      $(".details").dotdotdot({
        after: "a.read-more",
        height: 70
      });

      this.doLocation();
    },

    doLocation: function() {
      navigator.geolocation.watchPosition(_.bind(this.geoSuccess, this), _.bind(this.geoError, this));
    },

    geoSuccess: function(position) {
      //console.log(position);
      var newCoords = [position.coords.latitude, position.coords.longitude];
      if(position.timestamp > this.coordsUpdated) {
        if(this.coords == null || this.milesFrom(newCoords) >= this.MILES_BEFORE_UPDATE) {
          this.doNewPosition(newCoords, position.timestamp);
        }
      }
      else {
        console.log('WTF');
      }
    },

    geoError: function() {
      console.log("FAILED TO GEOLOCATE - USER DENIED?");
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

      //console.log("Miles: " + miles);
      return miles;

    },

    doNewPosition: function(coords, timestamp) {
      this.coordsUpdated = timestamp;
      this.coords = coords;
      console.log('NEW POSITION');
      console.log(coords);
      this.restoList.sort();
    }

  });

  App.init();

})(window.App);
