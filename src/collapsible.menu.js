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

			function isInViewport(){
				// todo
			}

			// tapout/clickout behavior
			$( document ).bind( "touchstart." + pluginName + " click." + pluginName, function( a ){
				// if the event target is not in the collapsible, and the collapsible is expanded, and it's a menu presentation... collapse it!
				if( !$( a.target ).closest( e.target ).length && !$collapsible.data( pluginName ).collapsed && isMenu ){
					setTimeout(function(){
						$collapsible.data( pluginName ).collapse();
					});
					a.preventDefault();
				}
			} );

			$collapsible
				.bind( "mouseenter." + pluginName, function(){
					if( isMenu() ){
						$collapsible.data( pluginName ).expand();
					}
				} )
				.bind( "mouseleave." + pluginName, function(){
					if( isMenu() ){
						$collapsible.data( pluginName ).collapse();
					}
				} );
		}
	} );

})(jQuery, window, document);
