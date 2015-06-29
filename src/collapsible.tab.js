/*
 * Collapsible widget extension: tabs behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		var $collapsible = $( e.target );
		var $tabContainer = $collapsible.parent();

		if( $collapsible.is( "." + pluginName ) && $tabContainer.is( ".tabs" ) ){
			var self = $collapsible.data( pluginName );

			self.createTabNav = function( tab ) {
				var $tabnav = $( "<nav class='tabnav'></nav>" );
				$tabnav.append( tab );
				$tabContainer.prepend( $tabnav );
			};

			self.createTab = function(){
				this.$tab = $( "<a href='#'>" + this.header[0].innerHTML + "</a>" );

				var self = this;
				var $tabNav = $tabContainer.find( ".tabnav" );

				this.header.remove();

				this.$tab.bind( window.tappy ? "tap" : "click", function( e ){
					e.preventDefault();
					e.stopPropagation();

					self.toggle();
				});

				if( $tabNav.length === 0 ) {
					this.createTabNav( this.$tab );
				} else {
					$tabNav.append( this.$tab );
				}
			};

			self.createTab( $collapsible );
		}
	});

})(jQuery, window, document);
