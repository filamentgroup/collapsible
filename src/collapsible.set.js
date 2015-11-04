/*
 * Collapsible widget extension: set
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ( w, undefined ) {
	// Defaults
	if( typeof require !== "undefined" ){
		var $ = require( "jquery" );
		require( "collapsible" );
	}
	else {
		$ = w.jQuery;
	}

	var pluginName = "collapsible";

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( w.document ).bind( "expand." + pluginName, function( e ){
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
			var openItemTop = e.target.getBoundingClientRect().top + ( w.document.body.scrollY || w.document.body.scrollTop || w.document.documentElement.scrollTop );
			// from jquery...
			var scroll =  (function() {
				var prop = 'pageYOffset',
					method = 'scrollTop';
				return w ? (prop in w) ? w[ prop ] :
					w.document.documentElement[ method ] :
					w.document.body[ method ];
			}());

			if( scroll > openItemTop ){
				w.scrollTo( 0, openItemTop );
			}
		}
	});

})( typeof global !== "undefined" ? global : this );