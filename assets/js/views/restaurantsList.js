(function(App) {

  App.Views.RestaurantsList = App.Views.Base.extend({

    events: {
      "click .pager .next": "nextPage",
      "click .pager .previous": "previousPage"
    },

    template: 'restaurants/list',

    initialize: function() {
      this.tileViews = {};
      this.model.on('reset', _.bind(this.render, this));
      $('[data-toggle=changeLocation]').on('click', _.bind(this.toggleLocationChange, this));
      $('#screw-bootstrap li.search-bar').on('click', function (e) {e.stopPropagation();});
      this.listenTo(App, 'search:restaurants', this.search);

      App.socket.on('update', _.bind(this.onWaitTimeUpdate, this));

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

    toggleLocationChange : function (e) {

      e.preventDefault();

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

    },

    updateLocation: function(coords,options) {
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
      console.log("sup");
      if (this.currentPage < 1) return;
      this.currentPage -= 1;
      this.goToPage(this.currentPage);
    },

    nextPage: function(e) {
      console.log("sup");
      this.currentPage += 1
      this.goToPage(this.currentPage);
      
    },

    onWaitTimeUpdate: function(data) {
      var restaurant = this.model.get(data.restaurantId);
      console.log(restaurant);
      console.log(data.waitTimes);
      if(restaurant) {
        restaurant.set({ waitTimes: data.waitTimes });        
      }
    },

  });

})(window.App);
