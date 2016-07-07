/*
 * Collapsible widget extension: set
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {
	var pluginName = "collapsible";

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "expand." + pluginName, function( e ){
		var setAttr = "data-" + pluginName + "-set";
		var selector = "." + pluginName + "[" + setAttr + "]";
		var $collapsible = $( e.target );
		if( $collapsible.is( selector ) ){
			var value = $collapsible.attr( setAttr );
			var $set = $( "." + pluginName + "-enhanced[" + setAttr + "='" + value + "']" ).filter(function() {
				return this !== $collapsible[0];
			});

			$set.each(function(){
				var thisData = $( this ).data( pluginName );
				if( thisData ){
					thisData.collapse();
				}
			});
			var openItemTop = e.target.getBoundingClientRect().top + ( document.body.scrollY || document.body.scrollTop || document.documentElement.scrollTop );
			// from jquery...
			var scroll =  (function() {
				var prop = 'pageYOffset',
					method = 'scrollTop';
				return window ? (prop in window) ? window[ prop ] :
					window.document.documentElement[ method ] :
					window.document.body[ method ];
			}());

			if( scroll > openItemTop ){
				window.scrollTo( 0, openItemTop );
			}
		}
	});

})(jQuery, window, document);
