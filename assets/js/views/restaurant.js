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
        this.$restoTiles.html(this.tileView.render().$el);
      }
      
      this.tileView.updateWaitTimeDisplay();

      $("body").spin(false);
    },

    onWaitTimeUpdate: function(data) {
      if(data.restaurantId) {
        this.model.set({ waitTimes: data.waitTimes})
      }
    }
    
  });

})(window.App);
