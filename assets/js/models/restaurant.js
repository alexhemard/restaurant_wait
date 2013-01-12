
(function(App) {

  App.Models.WaitTime = App.Models.Base.extend({

  });

  App.Collections.WaitTime = App.Collections.Base.extend({
    model: App.Models.WaitTime
  });

  App.Models.Restaurant = App.Models.Base.extend({

    initialize: function() {
      this.subcollection('waitTimes', 'WaitTime', 'restaurant');
    },

    updateWaitTimes: function(waitTimes) {
      this.waitTimes.noisyReset(waitTimes);
    },

    declareWaitTime: function(optionId) {
      this.collection.socket.emit('waitTime', { restaurant: this.id, option: optionId });
    },

    getWaitTimePercents: function() {
      console.log('RETURNING FAKE PERCENTS');

      return {
        1: 5,
        2: 25,
        3: 40,
        4: 30
      };
    }
  });

  App.Collections.Restaurant = App.Collections.Base.extend({

    model: App.Models.Restaurant,

    listen: function() {
      this.socket = io.connect();
      this.socket.on('restaurant', _.bind(this.onRestaurantUpdate, this));
    },

    onRestaurantUpdate: function(data) {
      console.log(data);
      var restaurant = this.get(data._id);
      if(restaurant) {
        restaurant.set(data);
        console.log('Updated restaurant ' + restaurant.id);
      }
      else console.log('Tried to update non-existent restaurant ' + data.restaurant._id);
    },

    declareWaitTime: function(restaurantId, optionId) {
      var restaurant = this.get(restaurantId);
      if(restaurant) {
        restaurant.declareWaitTime(optionId);
        console.log('Declared wait time ' + optionId + ' for restaurant ' + restaurantId);
      }
      else console.log('Tried to declare wait time ' + optionId + ' for non-existent restaurant ' + restaurantId);
    },
  });

})(window.App);
