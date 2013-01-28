(function(App) {

  App.Views.About = App.Views.Base.extend({

    template: 'about/index',

    render: function() {
      this.$el.html(jade.templates[this.template + '.jade']);
      App.trigger('hide:dropdown');
    }

  });

})(window.App);
