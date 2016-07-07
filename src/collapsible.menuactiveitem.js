/*
 * Collapsible widget extension: active menu item class
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2016 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ( $, window, document ) {

	var headerClass = "collapsible-header";
	var menuActiveClass = "collapsible-menu-active";

	function clearActive( $link ) {
		// remove on link, if header and remove on sibling list items
		$link.removeClass( menuActiveClass )
			.closest( "ul,ol" ).find( "." + menuActiveClass ).removeClass( menuActiveClass );
	}

	$( document ).on( "focusin focusout mouseover mouseout", function( e ) {
		var $link = $( e.target ).closest( "a, ." + headerClass );
		var $collapsible = $link.closest( ".collapsible" );
		if( $link.length && $collapsible.length ) {
			clearActive( $link );
			if( e.type === "focusin" || e.type === "mouseover" ) {
				$link.addClass( menuActiveClass );
			}
		}
	});

})(jQuery, window, document);
