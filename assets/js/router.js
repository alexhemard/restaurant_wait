(function(App) {

  App.Router = Backbone.Router.extend({
    routes: {
      "restaurants/:id": "restaurantShow",
      "restaurants": "restaurantIndex",
      "about": "about",
      "*assets": "default"
    },

    // this is a steaming pile of dog poo now

    restaurantIndex: function (page) {
      if(typeof App.dropDownMenu === "undefined"){
        App.dropDownMenu = new App.Views.DropDownMenu({el: '#screw-bootstrap'});
      }

      App.dropDownMenu.render();

      var restaurants = new App.Collections.Restaurant();
      restaurants.listen();
      App.currentView = new App.Views.RestaurantsList({ el: '.content-wrapper', model: restaurants });
      App.doLocation();
    },

    restaurantShow: function (id) {
      restaurant = new App.Models.Restaurant({_id: id})
      restaurant.fetch();
      App.currentView = new App.Views.Restaurant({ el: '.content-wrapper', model: restaurant });
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
