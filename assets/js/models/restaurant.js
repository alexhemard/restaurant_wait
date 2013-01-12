
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

    getWaitTimeCounts: function() {
      throw 'not implemented';
    }
  });

  App.Collections.Restaurant = App.Collections.Base.extend({

    model: App.Models.Restaurant,

    listen: function() {
      this.socket = io.connect();
      this.socket.on('restaurant', _.bind(this.onRestaurantUpdate, this));
    },

    onRestaurantUpdate: function(data) {
      var restaurant = this.find(data.restaurant._id);
      if(restaurant) restaurant.set(data);
    }
  });

})(window.App);
