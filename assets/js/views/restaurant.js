(function(App) {

  App.Views.Restaurant = App.Views.Base.extend({

    initialize: function() {
      this.model.on('change', _.bind(this.render, this));
      $('.about-btn').on('click', _.bind(this.onClickAboutBtn, this));

      $("body").spin();
    },

    render: function() {
      console.log('swag');
      if(!this.tileView) {
        this.tileView = new App.Views.RestaurantTile({ model: this.model });
      }
        this.tileView.$el.detach();
        this.tileView.render().$el.appendTo(this.$el);

      $(".details").dotdotdot({
        after: "a.read-more",
        height: 70
      });

      $("body").spin(false);
    },

    onClickAboutBtn : function (e) {
      e.preventDefault();
      console.log('About Page Popup');
    }

  });

})(window.App);
