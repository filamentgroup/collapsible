/*
 * Collapsible widget extension: menu overlay
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ( w, undefined) {

	// Defaults
	if( typeof require !== "undefined" ){
		var $ = require( "jquery" );
		require( "collapsible.menu" );
	}
	else {
		$ = w.jQuery;
	}

	$( w.document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName + "[data-collapsible-underlay]" ) ){
			var $collapsible = $( e.target );
			var unClass = "collapsible-underlay";
			var htmlClass = "collapsible-underlay-contain";
			var hideClass = unClass + "-hidden";
			var $underlay = $( "<div class='"+ unClass +"'></div>" );

			$( w.document.documentElement ).addClass( htmlClass );

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

})( typeof global !== "undefined" ? global : this );