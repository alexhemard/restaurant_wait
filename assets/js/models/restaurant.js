
(function(App) {

  App.Models.WaitTime = App.Models.Base.extend({

  });

  App.Collections.WaitTime = App.Collections.Base.extend({
    model: App.Models.WaitTime
  });

  App.Models.Restaurant = App.Models.Base.extend({

    declareWaitTime: function(optionId) {
      this.collection.socket.emit('waitTime', { restaurant: this.id, option: optionId });
    },

    getWaitTimeCounts: function() {
      var waitTimes = this.get('waitTimes')
        , counts = {
          1: 0,
          2: 0,
          3: 0,
          4: 0
        }
      ;

      _.each(waitTimes, function(waitTime) {
        counts[waitTime.option] += 1;
      });

      _.each(counts, function(count, option) { console.log(count + ' waitTimes for option ' + option)});

      return counts;
    },

    getWaitTimePercents: function() {

      var counts = this.getWaitTimeCounts()
        , total = _.keys(this.get('waitTimes')).length
        , percents = {}
      ;

      _.each(counts, function(count, option) {
        percents[option] = total == 0 ? 0 : (counts[option] / total) * 94;
      });

      return percents;
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
