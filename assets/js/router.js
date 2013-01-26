(function(App) {

  App.Router = Backbone.Router.extend({
    routes: {
      "restaurants": "restaurantIndex",
      "*assets": "default"
    },

    restaurantIndex: function (page) {
      App.restaurantIndex();
    },

    default: function (page) {
      this.navigate('/restaurants', {trigger: true});
    },    
  });

})(window.App);
