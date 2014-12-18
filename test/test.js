(function($) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/

	module( "Global", {
		setup: function(){
				$( '#qunit-fixture' ).find( '.collapsible' ).collapsible();
		}
	});

	test( "Initialization", function() {
		ok( $( "html" ).is( ".enhanced" ), "Has global initialization class." );
		ok( $( ".collapsible" ).is( ".collapsible-enhanced" ), "Has individual initialization class." );
		ok( $( ".collapsible-content" ).not( ":hidden" ).length, "Content is visible by default." );
	});

	test( "Click the header", function() {
		$( ".collapsible-header" ).trigger( "click" );

		ok( $( ".collapsible-content" ).is( ":hidden" ), "Content is hidden after header click." );
	});

}(jQuery));
