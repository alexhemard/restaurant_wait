//= require socket.io
//= require jquery
//= require jquery.validate
//= require bootstrapManifest
//= require underscore
//= require backbone
//= require baseClasses
//= require_tree ./models

// bootstrap hack to stop dropdowns from disappearing on mobile
$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

(function(App) {

  _.extend(App, {

    init: function() {
      var _this = this;

      $(function() {
        _this.docReady();
      });
    },

    docReady: function() {
      this.restaurants = new App.Collections.Restaurant($('.resto-tiles').data('json'));

      this.restaurants.on('change:waitTimes', _.bind(this.updateWaitTimeDisplay, this));
      
      $('.resto-tile').on('click', '.choices a[data-option]', _.bind(this.declareWaitTime, this));

      this.restaurants.listen();
    },

    getRestoTile: function(model) {
      return $('#' + model.id);
    },

    updateWaitTimeDisplay: function(model) {
      var percents = model.getWaitTimePercents()
        , $restoTile = this.getRestoTile(model)
        , $waitTimeBar
      ;

      _.each(percents, function(percent, option) {
        console.log('Setting resto ' + model.id + ' option ' + option + ' bar to ' + percent + '%');
        $waitTimeBar = $restoTile.find('.rating-bar [data-option="' + option + '"]');
        $waitTimeBar.animate({ width: percent + '%' }, function() {
          $waitTimeBar[percent ? 'show' : 'hide']();
        });
      });
    },

    declareWaitTime: function(e) {
      var $button = $(e.currentTarget)
        , optionId = $button.attr('data-option')
        , $restoTile = $button.closest('.resto-tile')
        , restoId = $restoTile.attr('id');
      ;

      e.preventDefault();

      this.restaurants.declareWaitTime(restoId, optionId);
    }

  });

  App.init();

})(window.App);
