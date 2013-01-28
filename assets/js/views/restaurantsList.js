(function(App) {

  App.Views.RestaurantsList = App.Views.Base.extend({

    events: {
      "click .pager .next": "nextPage",
      "click .pager .previous": "previousPage",
      "click .update-position-btn": "onRefreshLocation"
    },

    template: 'restaurants/list',

    initialize: function() {
      var _this = this;
      this.tileViews = {};
      this.model.on('reset', _.bind(this.render, this));
      $('[data-toggle=changeLocation]').on('click', _.bind(this.toggleLocationChange, this));
      $('#screw-bootstrap li.search-bar').on('click', function (e) {e.stopPropagation();});
      this.listenTo(App, 'search:restaurants', this.search);

      App.socket.on('update', _.bind(this.onWaitTimeUpdate, this));

      this.listenTo(App, "change:gpsCoords", function(e) { _this.toggleLocationChange(e) });

      $("body").spin();
    },

    render: function() {

      App.trigger('show:dropdown');

      this.$el.html(jade.templates[this.template + '.jade']);
      var $restoTiles = this.$el.find('.resto-tiles');
      
      this.model.each(_.bind(function(restaurant) {
        // build tile view if it doesn't exist
        var itemView = this.tileViews[restaurant.id]

        if(!itemView) {
          itemView = this.tileViews[restaurant.id] = new App.Views.RestaurantTile({ model: restaurant });
        }

        itemView.$el.detach();
        itemView.render().$el.appendTo($restoTiles);
        setTimeout(function() { itemView.updateWaitTimeDisplay() }, 1000);

      }, this));

      this.$(".details").dotdotdot({
        after: null,
        height: 108
      });

      this.$(".cuisine-tags").flextext(14);

      $("body").spin(false);
    },

    currentPage: 1,

    // re-sorts the tiles according to the sort order of the model collection
    sort: function() {
      this.model.each(_.bind(function(restaurant) {
        this.tileViews[restaurant.id].$el.detach().appendTo(this.$el);
      }, this));
    },

    toggleLocationChange : function (options) {

      //var firstTime = e.firstTime;
      if(!options.firstTime) {
      
      var $div = $('.location-change-container'),
      newBottom = $div.hasClass('open') ? -50 : 0 ;

      if (newBottom == 0)
        $div.show();

      $div
        .toggleClass('open')
        .animate({'bottom': newBottom+'px'}, 500, function () {
          if (newBottom !== 0) {
            $div.hide();
          }
        });
          
      } else {
        this.updateLocation(options.coords);
      }
    },

    onRefreshLocation: function(e) {
      e.preventDefault();      
      this.updateLocation();
    },

    updateLocation: function(coords,options) {
      if(!coords) coords = App.coords;
      this.model.updateLocation(coords,options);
    },

    search: function(e) {
      this.currentPage = 1;
      this.model.search(e);
    },

    goToPage: function(page) {
      this.model.goToPage(page);
    },

    previousPage: function(e) {
      if (this.currentPage < 1) return;
      this.currentPage -= 1;
      this.goToPage(this.currentPage);
    },

    nextPage: function(e) {
      this.currentPage += 1
      this.goToPage(this.currentPage);
      
    },

    onWaitTimeUpdate: function(data) {
      var restaurant = this.model.get(data.restaurantId);
      if(restaurant) {
        restaurant.set({ waitTimes: data.waitTimes });        
      }
    },

  });

})(window.App);
