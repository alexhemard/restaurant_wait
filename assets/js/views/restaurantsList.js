(function(App) {

  App.Views.RestaurantsList = App.Views.Base.extend({

    initialize: function() {
      this.tileViews = {};
      this.model.on('reset', _.bind(this.render, this));
      $('[data-toggle=changeLocation]').on('click', _.bind(this.toggleLocationChange, this));

      $("body").spin();
    },

    render: function() {


      this.model.each(_.bind(function(restaurant) {
        // build tile view if it doesn't exist
        var itemView = this.tileViews[restaurant.id]

        if(!itemView) {
          itemView = this.tileViews[restaurant.id] = new App.Views.RestaurantTile({ model: restaurant });
        }

        itemView.$el.detach();
        itemView.render().$el.appendTo(this.$el);
        setTimeout(function() { itemView.updateWaitTimeDisplay() }, 1000);

      }, this));

      $(".details").dotdotdot({
        after: "a.read-more",
        height: 138
      });

      $(".cuisine-tags").flextext(14);

      $("body").spin(false);
    },

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

      $('.location-change-container')
        .toggleClass('open')
        .animate({'bottom': newBottom+'px'}, 500);

    },

    updateLocation: function(coords,options) {
      this.model.updateLocation(coords,options);
    }

  });

})(window.App);
