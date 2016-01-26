/*
 * Collapsible widget extension: proxy to a select element
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2016 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ( $, window, document ) {
	
	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		var $target = $( e.target );
		var attr = "data-" + pluginName + "-selectproxy";
		var $select;
		if( $target.is( "." + pluginName + "[" + attr + "]" ) ){
			$select = $( "#" + $target.attr( attr ) );

			$target.on( "click", "a", function( e ) {
				var $a = $( e.target ).closest( "a" );
				$a.closest( "." + pluginName + "-content" ).prev().filter( "." + pluginName + "-header" ).html( $a.html() );
				$a.closest( "." + pluginName ).data( pluginName ).collapse();
				$select.val( $a.attr( "data-value" ) );
				e.preventDefault();
			});
		}
	});

})(jQuery, window, document);
