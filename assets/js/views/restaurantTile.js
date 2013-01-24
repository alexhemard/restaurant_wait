(function(App) {

  App.Views.RestaurantTile = App.Views.Base.extend({

    template: 'restaurants/listItem',

    events: {
      'error .resto-image img': 'onImageError',
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
      
      var $tile = $('#'+this.model.id);
      

			if ($(e.currentTarget).hasClass('closed') ) {  // if graph is hidden
			
			  $(e.currentTarget).find('.btn-text').html('Hide Votes'); // change btn text

        // Toggle font awesome icon
        $tile.find('.toggle-graph-btn i').toggleClass('icon-angle-down icon-angle-up');


	      $tile.find('.details').slideToggle('fast', function () {
		      $tile.find('.graph-wrapper').slideToggle('fast');
	      });
	      
      } else { // if graph is visible 
      
	      $tile.find('.graph-wrapper').slideToggle('fast', function () {

		      $tile.find('.details').slideToggle('fast', function () {

    			  $(e.currentTarget).find('.btn-text').html('View Votes'); // change btn text back
  		      
            // Toggle font awesome icon
            $tile.find('.toggle-graph-btn i').toggleClass('icon-angle-down icon-angle-up');
  		      
		      });      

	      });  
	      
      } //end if/else
      
      $tile.find('.toggle-graph-btn').toggleClass('open closed');
    }
    
  });

})(window.App);
