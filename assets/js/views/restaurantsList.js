(function(App) {

  App.Views.RestaurantsList = App.Views.Base.extend({

    events: {
      "click .pager .swag-next a": "nextPage",
      "click .pager .swag-previous:not(.disabled) a": "previousPage",
      "click .disabled a": "doNothing",
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

      if(!this.$restoTiles){
        this.$el.html(jade.templates[this.template + '.jade']);
        this.$restoTiles = this.$el.find('.resto-tiles');
      }

      this.$restoTiles.html('');

      this.model.each(_.bind(function(restaurant) {
        // build tile view if it doesn't exist
        var itemView = this.tileViews[restaurant.id];

        if(!itemView) {
          itemView = this.tileViews[restaurant.id] = new App.Views.RestaurantTile({ model: restaurant });
        }

        itemView.$el.detach();
        itemView.render().$el.appendTo(this.$restoTiles);
        setTimeout(function() { itemView.updateWaitTimeDisplay() }, 1000);

      }, this));


      this.$(".cuisine-tags").flextext(14);

      this.$(".details").dotdotdot({
        after: null,
        height: 108
      });

      $("body").spin(false);

      // hacks... forgive me :(
      // need to overhaul pager functionality

      if (this.currentPage == 1)
        this.$el.find(".swag-previous").addClass('disabled');
      else
        this.$el.find(".pager li.disabled").removeClass('disabled');

      if(this.model.length < 9)
        this.$el.find(".pager").hide();
      else
        this.$el.find(".pager").show();
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
        this.updateLocation();
      }
    },

    onRefreshLocation: function(e) {
      e.preventDefault();
      this.updateLocation();
      this.toggleLocationChange();
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
      if (this.currentPage < 1) return;

      this.currentPage = page;
      this.model.goToPage(page);
    },

    previousPage: function(e) {
      this.goToPage(this.currentPage-1);
    },

    nextPage: function(e) {
      this.goToPage(this.currentPage+1);

    },

    doNothing: function(e) {
      e.preventDefault();
    },

    onWaitTimeUpdate: function(data) {
      var tileView = this.tileViews[data.restaurantId];
      if(tileView) {
        tileView.model.set({ waitTimes: _.compact(data.waitTimes), vendorWaitTime: data.vendorWaitTime });
      }
    },

  });

})(window.App);
