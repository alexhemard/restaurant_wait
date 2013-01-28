(function(App) {

  App.Views.Restaurant = App.Views.Base.extend({

    initialize: function() {
      this.model.on('change', _.bind(this.render, this));
      $("body").spin();
    },

    render: function() {
      console.log('swag');
      if(!this.tileView) {
        this.tileView = new App.Views.RestaurantTile({ model: this.model });
      }
        this.tileView.$el.detach();
        this.tileView.render().$el.appendTo(this.$el);
    },
    
  });

})(window.App);
