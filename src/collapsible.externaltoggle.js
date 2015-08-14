/*
 * Collapsible widget extension: external toggle
 * External click targets can toggle a collapsible from outside the collapsible component
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {
	var pluginName = "collapsible";
	var attrName = 'data-collapsible-target';

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "click." + pluginName, function( event ){
		var $target;
		var $link = $( event.target ).closest( '[' + attrName + ']' );
		if( $link.length ) {
			event.preventDefault();

			$target = $( $link.attr( attrName ) || $link.attr( 'href' ) );
			var component = $target.data( pluginName );
			if( component ) {
				component.toggle();
			}
		}
	});

})(jQuery, window, document);
