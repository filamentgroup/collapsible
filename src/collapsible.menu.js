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
			var $trigger = $collapsible.prev().filter( "." + pluginName + "-trigger" );
			var triggerExpand = pluginName + "-trigger-expand";

			function isMenu(){
				return $collapsible.find( "." + pluginName + "-content" ).css( "position" ) === "absolute";
			}

			function isInViewport(){
				// todo
			}

			// tapout/clickout behavior
			$( document ).bind( "touchstart." + pluginName + " click." + pluginName, function( a ){
				// if the event target is not in the collapsible, and the collapsible is expanded, and it's a menu presentation... collapse it!
				if( !$( a.target ).closest( e.target ).length && !$( a.target ).closest( $trigger ).length && !$collapsible.data( pluginName ).collapsed && isMenu ){
					setTimeout(function(){
						$collapsible.data( pluginName ).collapse();
					});
					a.preventDefault();
				}
			} );

			// hover behavior for collapsibles and triggers relies on the presence of data-collapsible-hover attr
			if( $collapsible.is( "[data-collapsible-hover]" ) ){

				$collapsible
					.add( $trigger )
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

				$collapsible
					.bind( "expand", function(){
						$trigger.addClass( triggerExpand );
					} )
					.bind( "collapse", function(){
						$trigger.removeClass( triggerExpand );
					} );
			}


		}
	} );

})(jQuery, window, document);
