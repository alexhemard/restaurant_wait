(function(App) {

  App.Views.DropDownMenu = App.Views.Base.extend({

    template: 'shared/dropdown',

    render: function() {
      this.$el.html(jade.templates[this.template + '.jade']);
    }

  });

})(window.App);
