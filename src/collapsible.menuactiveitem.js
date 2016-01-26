/*
 * Collapsible widget extension: active menu item class
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2016 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ( $, window, document ) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName ) ){
			var $collapsible = $( e.target );
			var self = $collapsible.data( pluginName );
			var menuActiveClass = pluginName + "-menu-active";

			self.clearActive = function() {
				this.element.find( "." + menuActiveClass ).removeClass( menuActiveClass );
			};

			self.content.find( "a" ).add( self.header )
				.bind( "focus mouseover", function( e ) {
					self.clearActive();

					$( e.target ).closest( "a,." + self.options.headerClass ).addClass( menuActiveClass );
				})
				.bind( "blur mouseout", function() {
					self.clearActive();
				});
		}
	} );

})(jQuery, window, document);
