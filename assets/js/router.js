(function(App) {

  App.Router = Backbone.Router.extend({
    routes: {
      "restaurants/:id": "restaurantShow",
      "restaurants": "restaurantIndex",
      "about": "about",
      "*assets": "default"
    },

    restaurantIndex: function (page) {
      console.log(page);
      var restaurants = new App.Collections.Restaurant();
      restaurants.listen();
      App.currentView = new App.Views.RestaurantsList({ el: '.resto-tiles', model: restaurants });
      App.doLocation();
    },

    restaurantShow: function (id) {
      restaurant = new App.Models.Restaurant({_id: id})
      restaurant.fetch();
      App.currentView = new App.Views.Restaurant({ el: '.resto-tiles', model: restaurant });
      restaurant.fetch();
    },

    about: function (id) {
      App.currentView = new App.Views.About({ el: '.content-wrapper'});
      App.currentView.render();
    },

    default: function (page) {
      this.navigate('/restaurants', {trigger: true});
    },    
  });

})(window.App);
