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
			var $collapsible = $( e.target );

			function isMenu(){
				return $collapsible.find( "." + pluginName + "-content" ).css( "position" ) === "absolute";
			}

			// tapout/clickout behavior
			$( document ).bind( "touchstart click", function( a ){
				if( !$( a.target ).closest( e.target ).length && !$collapsible.data( "plugin_" + pluginName ).collapsed && isMenu ){
					setTimeout(function(){
						$collapsible.data( "plugin_" + pluginName ).collapse();
					});
					a.preventDefault();
				}
			} );

			$collapsible
				.bind( "mouseenter", function(){
					if( isMenu() ){
						$collapsible.data( "plugin_" + pluginName ).expand();
					}
				} )
				.bind( "mouseleave", function(){
					if( isMenu() ){
						$collapsible.data( "plugin_" + pluginName ).collapse();
					}
				} );
		}
	} );

})(jQuery, window, document);
