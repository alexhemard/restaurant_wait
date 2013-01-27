(function(App) {

  App.Views.DropDownMenu = App.Views.Base.extend({

    template: 'shared/dropdown',

    events: {
      "keyup .search-query": "handleSearch"
    },

    initialize: function() {
      var _this = this;
      _this.listenTo(App, "hide:dropdown", function() { _this.$el.hide() });
      _this.listenTo(App, "show:dropdown", function() { _this.$el.show() });
    },


    render: function() {
      this.$el.html(jade.templates[this.template + '.jade']);
    },

    handleSearch: function(e) {
      console.log({ name: $(e.target).val() });
      App.trigger('search:restaurants', { name: $(e.target).val() });
    }

  });

})(window.App);
