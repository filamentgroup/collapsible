/*
 * Collapsible widget extension: set
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "expand", function( e ){
		var pluginName = "collapsible";
		var setAttr = "data-" + pluginName + "-set";
		var selector = "." + pluginName + "[" + setAttr + "]";
		if( $( e.target ).is( selector ) ){
			var value = $( e.target ).attr( setAttr );
			var $set = $( "." + pluginName + "[" + setAttr + "='" + value + "']" ).not( e.target );
			if( $set.length ){
				$set.each(function(){
					$( this ).data( "plugin_" + pluginName ).collapse();
				});
			}
		}
	});

})(jQuery, window, document);
