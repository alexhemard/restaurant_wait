
(function(App) {

  App.Models.WaitTime = App.Models.Base.extend({

  });

  App.Collections.WaitTime = App.Collections.Base.extend({
    model: App.Models.WaitTime
  });

  App.Models.Restaurant = App.Models.Base.extend({

    url: function() {
      return '/api/restaurants/' + this.id;
    },

    declareWaitTime: function(optionId) {
      App.socket.emit('waitTime', { restaurant: this.id, option: optionId });
    },

    getWaitTimeText: function() {
      var bs = [
        {
          name: "No Wait",
          color: "none"
        },
        {
          name: "15-30min",
          color: "short"
        },
        {
          name: "30-60min",
          color: "long"
        },
        {
          name: "No Seating",
          color: "full"
        },
        {
          name: "No Data",
          color: "no-data"
        }
      ]
      , waitTimes = this.get('waitTimes')
      , vendorWaitTime = this.get('vendorWaitTime')
      , counts = [0,0,0,0]
      ;
      
      // uncomment to test with "no-data"
      //waitTimes = [];

      if(vendorWaitTime) {
        return bs[vendorWaitTime.option-1];
      }
      else {
        _.each(waitTimes, function(waitTime) {
          if(waitTime && waitTime.option) {
            counts[waitTime.option-1] += 1;
          }
        });
        
        var swag = _.zip(counts, [1,2,3,4]);
        
        var basket = _.reduce(swag, function(result, arr) {
          return result + (arr[0] * arr[1]);
        },0);
        
        var total = _.reduce(counts, function(result, count) { return result + count}, 0);
        
        var choice = total == 0 ? 4 : Math.ceil(basket / total) -1;
        
        return bs[Math.ceil(choice)]
      }
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
        if(waitTime && waitTime.option) {
          counts[waitTime.option] += 1;
        }
      });

      return counts;
    },

    getWaitTimePercents: function() {

      //console.log(this.toJSON());

      var counts = this.getWaitTimeCounts()
        , total = _.keys(this.get('waitTimes')).length
        , percents = {}
      ;
      
      var maxCount = _.max(counts);
            
      _.each(counts, function(count, option) {
        percents[option] = total == 0 ? 0 : (counts[option] / maxCount) * 100;
      });

      return percents;
    }
  });

  App.Collections.Restaurant = App.Collections.Base.extend({

    model: App.Models.Restaurant,

    initialize: function() {

    },

    url: function() {
      return '/api/restaurants';
    },

    updateLocation: function(coords) {
      if(!coords) coords = this.lastCoords;

      var fetchOptions = { data: $.param({location: coords.join(',')})};
      this.lastFetchOptions = fetchOptions;

      this.fetch(fetchOptions);

      this.lastCoords = coords;
    },

    search: function(options) {
      if(!options.name) return this.updateLocation();
      var fetchOptions = {
        url: '/api/search',
        data: $.param(options)
      };
      
      this.lastFetchOptions = fetchOptions;

      this.fetch(fetchOptions);
    },

    goToPage: function(page) {
      var fetchOptions = _.clone(this.lastFetchOptions)
      , data;

      if(!(this.lastFetchOptions && parseInt(page))) return;

      if(fetchOptions.data){
        data = $.deparam(fetchOptions.data);
        _.extend(data, {page: parseInt(page)});
        _.extend(fetchOptions, {data: $.param(data)});
      }

      this.lastFetchOptions = fetchOptions;
      this.fetch(fetchOptions);
    },

    comparator: function(a, b) {
      if(App.coords == null) return 0;

      var aData = a.get('tourismBoard');
      var bData = b.get('tourismBoard');

      var aCoords = [aData.latitude, aData.longitude];
      var bCoords = [bData.latitude, bData.longitude];

      var aDistance = App.milesFrom(aCoords);
      var bDistance = App.milesFrom(bCoords);

      return aDistance - bDistance;
    },


  });

})(window.App);
