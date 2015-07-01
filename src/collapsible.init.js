;(function ($, window, document, undefined) {
	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "enhance", function( e ){
		var selector = "." + pluginName;

		$( $( e.target ).is( selector ) && e.target )
			.add( selector, e.target )
			.filter( selector )[ pluginName ]();
	});
})(jQuery, window, document);
