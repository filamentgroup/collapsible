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

	function radioCheckboxChange( isChecked ) {
		if( isChecked ) {
			this.expand();
		} else {
			this.collapse();
		}
	}

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "click." + pluginName, function( event ){
		var $target;
		var $link = $( event.target ).closest( '[' + attrName + ']' );
		if( $link.length ) {
			if( $link.is( "a[href]" ) ) {
				event.preventDefault();
			}

			$target = $( $link.attr( attrName ) || $link.attr( 'href' ) );
			var component = $target.data( pluginName );
			if( component ) {
				var isRadio = $link.is( "[type='radio']" );
				if( isRadio || $link.is( "[type='checkbox']" ) ) {
					radioCheckboxChange.call( component, $link[ 0 ].checked );

					// bind so that unchecking other radios in the set will also trigger
					$( isRadio ? $( "[name='" + $link.attr( "name" ) + "']" ) : $link ).unbind( "change." + pluginName ).bind( "change." + pluginName, function() {
						radioCheckboxChange.call( component, $link[ 0 ].checked );
					});
				} else {
					component.toggle();
				}
			}
		}
	});

})(jQuery, window, document);
