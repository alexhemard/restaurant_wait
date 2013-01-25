(function(App) {

  App.Views.RestaurantTile = App.Views.Base.extend({

    template: 'restaurants/listItem',

    events: {
      'click .choices a[data-option]': 'onClickWaitTimeButton',
      'click .toggle-graph-btn' : 'onClickToggleGraphBtn'
    },

    initialize: function() {
      this.model.on('change:waitTimes', _.bind(this.updateWaitTimeDisplay, this))
    },

    render: function() {
      var retVal = App.Views.Base.prototype.render.apply(this, arguments);

      $(".details").dotdotdot({
        after: "a.read-more",
        height: 70
      });

      // Load place holder if image does not load
      // (cannot use jquery events because error events do not bubble)
      this.$el.find('.resto-image img').error(function() {
        $(this).attr('src', '/img/large-placeholder.gif');
      });

      return retVal;
    },

    updateWaitTimeDisplay: function() {
      var percents = this.model.getWaitTimePercents()
        , $waitTimeBar
      ;

      _.each(percents, _.bind(function(percent, option) {
        //console.log('Setting resto ' + model.id + ' option ' + option + ' bar to ' + percent + '%');
        $waitTimeBar = this.$('.graph [data-option="' + option + '"]');
        $waitTimeBar.height(percent + '%');
        $waitTimeText = this.$('.time-text');

        var info = this.model.getWaitTimeText();
        $waitTimeText.html(info.name);
        this.$("[data-behavior='wait-color']").attr("class", "wait-color " + info.color);

      }, this));
    },

    onClickWaitTimeButton: function(e) {
      var $button = $(e.currentTarget)
        , optionId = $button.attr('data-option')
      ;

      e.preventDefault();

      this.$('.choices a[data-option]').removeClass('down');
      $button.addClass('down');

      this.model.collection.declareWaitTime(this.model.id, optionId);
    },
    
    onClickToggleGraphBtn : function(e) {
            
      e.preventDefault();
      var $tile = this.$el,
          $button = $(e.currentTarget);

        var showGraph = _.bind(this.showGraph, this),
            hideGraph = _.bind(this.hideGraph, this);


      if ($button.hasClass('closed') ) {  // if graph is hidden
      
        showGraph();      
        
      } else { // if graph is visible
        
        hideGraph();
        
      } //end if/else
      
      this.$('.toggle-graph-btn').toggleClass('open closed');
    }, // end onClickToggleGraphBtn
    
    showGraph : function() {

      this.$('.btn-text').html('Hide Votes'); // change btn text

      // Toggle font awesome icon
      this.$('.toggle-graph-btn i').toggleClass('icon-angle-down icon-angle-up');

      this.$('.details').slideToggle('fast',
         _.bind(
           function () {
              this.$('.graph-wrapper').slideToggle('fast');
            },
          this)
        );
    }, // end showGraph()
    
    hideGraph : function() {
    
      this.$('.graph-wrapper').slideToggle('fast', _.bind(function () {
          
        this.$('.details').slideToggle('fast', _.bind( function () {

          this.$('.btn-text').html('View Votes'); // change btn text back
          
          // Toggle font awesome icon
          this.$('.toggle-graph-btn i').toggleClass('icon-angle-down icon-angle-up');
        
        },this) );      

      },this) );  
      
    } // end hideGraph()
    
  });

})(window.App);
