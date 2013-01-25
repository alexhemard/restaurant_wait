(function(App) {

  App.Views.RestaurantsList = App.Views.Base.extend({

    initialize: function() {
      this.tileViews = {};
      this.model.on('reset', _.bind(this.render, this));
      $('.about-btn').on('click', _.bind(this.onClickAboutBtn, this));

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

      $("body").spin(false);
    },

    // re-sorts the tiles according to the sort order of the model collection
    sort: function() {
      this.model.each(_.bind(function(restaurant) {
        this.tileViews[restaurant.id].$el.detach().appendTo(this.$el);
      }, this));
    },
    
    onClickAboutBtn : function (e) {
      e.preventDefault();
      console.log('About Page Popup');
    }

  });

})(window.App);
