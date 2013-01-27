//= require socket.io
//= require jquery
//= require bootstrapManifest
//= require underscore
//= require backbone
//= require baseClasses
//= require router
//= require_tree ./models
//= require_tree ./views
//= require dotdotdot
//= require flextext
//= require spinner

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

      Backbone.history.start({pushState: true});

      $(function() {
        // holla
      });
    },

    router: new App.Router,

    doLocation: function() {
      this.geoWatchId = navigator.geolocation.watchPosition(_.bind(this.geoSuccess, this), _.bind(this.geoError, this));
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
      this.currentView.updateLocation(this.coords);
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
        this.currentView.updateLocation(this.coords,{});
      }
      else {
        // TODO: After the first time, ask the user if they'd like to update restaurants list
      }
    },

  });

  App.init();

})(window.App);
