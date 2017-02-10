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

	module( "Default", {
		setup: function(){
			$( '#qunit-fixture' ).find( '.collapsible' ).collapsible();
		}
	});

	test( "Global Initialization", function() {
		ok( $( "html" ).is( ".enhanced" ), "Has global initialization class." );
	});

	test( "Initialization", function() {
		ok( $( "#default.collapsible" ).is( ".collapsible-enhanced" ), "Has individual initialization class." );
		ok( $( "#default .collapsible-content" ).not( ":hidden" ).length, "Content is visible by default." );
	});

	test( "Header content order", function() {
		ok( !$( "#outoforder .collapsible-content" ).is( ".collapsible-header" ), "Content can come first in child order, if classes are preset" );
		ok( !$( "#outoforder .collapsible-header" ).is( ".collapsible-content" ), "header can come second in child order, if classes are preset" );
	});

	test( "a11y", function() {
		ok( $( "#default .collapsible-header" ).is( "[tabindex='0']" ), "Tabindex added." );
		ok( $( "#default .collapsible-header" ).is( "[role=button]" ), "Role added." );
	});

	test( "inner button", function() {
		ok( $( "#innerButton .collapsible-header button" ).length, "button exists" );
		ok( $( "#innerButton .collapsible-header button" ).is( "[aria-expanded='false']" ), "aria-expanded attr (false) is on the button" );
		ok( $( "#innerButton .collapsible-header button" ).text() === "Toggle collapsible content", "button content is correct" );
		$( "#innerButton .collapsible-header button" ).trigger( "click" );
		ok( $( "#innerButton .collapsible-header button" ).is( "[aria-expanded='true']" ), "aria-expanded attr (true) is on the button" );
		$( "#innerButton .collapsible-header button" ).trigger( "click" );
		ok( $( "#innerButton .collapsible-header button" ).is( "[aria-expanded='false']" ), "aria-expanded attr (false) is on the button" );
	});

	test( "Click the header", function() {
		$( "#default .collapsible-header" ).trigger( "click" );
		ok( $( "#default .collapsible-content" ).is( ":hidden" ), "Content is hidden after header click." );


		$( "#default .collapsible-header" ).trigger( "click" );
		ok( $( "#default .collapsible-content" ).is( ":visible" ), "Content is visible after header second click." );

	});

	module( "Collapsed Initialization", {
		setup: function(){
			$( '#qunit-fixture' ).find( '.collapsible' ).collapsible();
		}
	});

	test( "Initialization", function() {
		ok( $( "#collapsed .collapsible-content" ).is( ":hidden" ), "Content is hidden by default." );
	});

	test( "Click the header", function() {
		$( "#collapsed .collapsible-header" ).trigger( "click" );
		ok( !$( "#collapsed .collapsible-content" ).is( ":hidden" ), "Content is visible after header click." );

		$( "#collapsed .collapsible-header" ).trigger( "click" );
		ok( $( "#collapsed .collapsible-content" ).is( ":hidden" ), "Content is hidden after header second click." );
	});

	module( "Accordion Plugin", {
		setup: function(){
			$( '#qunit-fixture' ).find( '.collapsible' ).removeData( 'collapsible' ).collapsible();
		}
	});

	test( "Click the header", function() {
		ok( $( "#accordion-c .collapsible-content" ).is( ":hidden" ), "Third unrelated collapsible content initial state." );

		$( "#accordion-a .collapsible-header" ).trigger( "click" );
		ok( !$( "#accordion-a .collapsible-content" ).is( ":hidden" ), "First accordion collapsible content is visible after header click." );
		ok( $( "#accordion-c .collapsible-content" ).is( ":hidden" ), "Third unrelated collapsible content is still hidden after header click." );

		$( "#accordion-b .collapsible-header" ).trigger( "click" );
		ok( !$( "#accordion-b .collapsible-content" ).is( ":hidden" ), "Second accordion collapsible content is visible after header click." );
		ok( $( "#accordion-a .collapsible-content" ).is( ":hidden" ), "First accordion collapsible content is visible after second collapsible header click." );
		ok( $( "#accordion-c .collapsible-content" ).is( ":hidden" ), "Third unrelated collapsible content is still hidden after header click." );
	});

	module( "Tabs Plugin", {
		setup: function(){
			$( '#qunit-fixture' ).find( '.tabnav' ).remove();
			$( '#qunit-fixture' ).find( '.collapsible' ).removeData( 'collapsible' ).collapsible();
		}
	});

	test( "Click the header", function() {
		ok( !$( "#tabs-a .collapsible-content" ).is( ":hidden" ), "Initial state of first tab: visible" );
		ok( $( "#tabs-b .collapsible-content" ).is( ":hidden" ), "Initial state of second tab: hidden" );

		$( "#tabs .tabnav a" ).eq( 1 ).trigger( "click" );
		ok( $( "#tabs-a .collapsible-content" ).is( ":hidden" ), "Initial state of first tab: hidden" );
		ok( !$( "#tabs-b .collapsible-content" ).is( ":hidden" ), "Initial state of second tab: visible" );
	});

	module( "Menu Plugin", {
		setup: function(){
				$( '#qunit-fixture' ).find( '.collapsible' ).collapsible();
		}
	});

	test( "Hover header", function() {
		ok( $( "#menu .collapsible-content" ).is( ":hidden" ), "Menu collapsible content initial state." );

		$( "#menu" ).trigger( "mouseenter" );
		ok( !$( "#menu .collapsible-content" ).is( ":visible" ), "Menu collapsible content visible after mouseenter." );

		$( "#menu" ).trigger( "mouseleave" );
		ok( $( "#menu .collapsible-content" ).is( ":hidden" ), "Menu collapsible content hidden after mouseleave." );
	});
}(jQuery));
