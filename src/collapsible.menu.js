/*
 * Collapsible widget extension: menu behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName ) ){
			function isMenu(){
				return $( e.target ).find( "." + pluginName + "-content" ).css( "position" ) === "absolute";
			}

			$( e.target )
				.bind( "mouseenter", function(){
					if( isMenu() ){
						$( e.target ).data( "plugin_" + pluginName ).expand();
					}
				} )
				.bind( "mouseleave", function(){
					if( isMenu() ){
						$( e.target ).data( "plugin_" + pluginName ).collapse();
					}
				} );
		}
	} );

})(jQuery, window, document);
