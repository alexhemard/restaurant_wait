(function(App) {

  App.Views.Restaurant = App.Views.Base.extend({

    template: 'restaurants/list',

    initialize: function() {
      this.model.on('change', _.bind(this.render, this));

      App.socket.on('update', _.bind(this.onWaitTimeUpdate, this));

      $("body").spin();
    },

    render: function() {

      if(!this.$restoTiles) {
        this.$el.html(jade.templates[this.template + '.jade']);
        this.$restoTiles = this.$el.find('.resto-tiles');
      }

      if(!this.tileView) {
        this.tileView = new App.Views.RestaurantTile({ model: this.model });
        this.$restoTiles.append(this.tileView.render().$el);
      }

      $("body").spin(false);

      this.tileView.updateWaitTimeDisplay();

      App.dropDownMenu.disableSearch();

      this.$el.find(".pager").hide();

      this.$(".details").dotdotdot({
        after: null,
        height: 108
      });
    },

    onWaitTimeUpdate: function(data) {
      if(data.restaurantId == this.tileView.model.id) {
        this.tileView.model.set({ waitTimes: data.waitTimes, vendorWaitTime: data.vendorWaitTime})
      }
    }

  });

})(window.App);
