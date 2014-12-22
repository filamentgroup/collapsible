/*
 * Collapsible widget extension: menu overlay
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName + "[data-collapsible-underlay]" ) ){
			var $collapsible = $( e.target );
			var unClass = "collapsible-underlay";
			var htmlClass = "collapsible-underlay-contain";
			var hideClass = unClass + "-hidden";
			var $underlay = $( "<div class='"+ unClass +"'></div>" );

			$( document.documentElement ).addClass( htmlClass );

			if( $collapsible.is( "." + pluginName + "-collapsed" ) ){
				$underlay.addClass( hideClass );
			}

			$collapsible
				.bind( "expand", function(){
					$underlay.removeClass( hideClass );
				} )
				.bind( "collapse", function(){
					$underlay.addClass( hideClass );
				} );

			$underlay.prependTo( $collapsible.parent() );
		}
	} );

})(jQuery, window, document);
