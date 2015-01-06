/*
 * Collapsible widget
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	// Defaults
	var pluginName = "collapsible";
	var idInt = 0;
	// overrideable defaults
	var defaults = {
		pluginClass: pluginName,
		collapsedClass: pluginName + "-collapsed",
		headerClass: pluginName + "-header",
		contentClass: pluginName + "-content",
		enhancedClass: pluginName + "-enhanced",
		instructions: false,
		collapsed: false
	};

	// plugin constructor
	function Plugin(element, options) {
		this.element = $( element );
		var self = this,
			dataOptions = {};

		// Allow data-attr option setting
		if( this.element.is( "[data-config]" ) ){
			for( var option in defaults ){
					if( defaults.hasOwnProperty( option) ){
					var value = self.element.attr( "data-" + option.replace( /[A-Z]/g, function( c ) {
									return "-" + c.toLowerCase();
								}));

					if ( value !== undefined ) {
						if( value === "true" || value === "false" ){
							dataOptions[ option ] = value === "true";
						}
						else {
							dataOptions[ option ] = value;
						}
					}
				}
			}
		}



		this.options = $.extend( {}, defaults, dataOptions, options );

		// allow the collapsedClass to set the option if specified
		if( this.element.is( "." + this.options.collapsedClass ) ){
			this.options.collapsed= true;
		}

		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this.header = this.element.children().eq( 0 );
			this.content = this.header.next();
			this._addAttributes();
			this._bindEvents();
			idInt++;
			this.element.data( pluginName, this );
			this.element.trigger( "init" );
		},

		_addAttributes: function(){
			this.element
				.addClass( this.options.pluginClass )
				.addClass( this.options.enhancedClass );

			this.header.addClass( this.options.headerClass );

			if( this.options.instructions ){
				this.header.attr( "title", this.options.instructions );
			}

			var id = "collapsible-" + idInt;

			this.header.attr( "role", "button" );

			this.header.attr( "aria-haspopup", "true" );

			this.header.attr( "aria-controls", id );

			this.header.attr( "tabindex", "0" );

			this.content.attr( "role", "menu" );

			this.content.addClass( this.options.contentClass );

			this.content.attr( "id", id );
		},

		_bindEvents: function(){
			var self = this;

			this.header
				// use the tappy plugin if it's available
				// tap can't be namespaced yet without special events api: https://github.com/filamentgroup/tappy/issues/22
				.bind( ( window.tappy ? "tap" : "click" ), function( e ){
					self.toggle( e.target );
					e.preventDefault();
				})
				.bind( "keydown." + pluginName, function( e ){
					if( e.which === 13 || e.which === 32 ){
						self.toggle( e.target );
						e.preventDefault();
					}
				});

			// arrow key handling applies to the entire collapsible
			this.element
				.bind( "keydown." + pluginName, function( e ){
					// arrow key behavior: collapsible must be expanded to accept arrow navigation
					if( !self.collapsed ){
						if( e.which === 39 || e.which === 40 ){
							self.arrow( e.target );
							e.preventDefault();
						}
						else if( e.which === 37 || e.which === 38 ){
							self.arrow( e.target, true );
							e.preventDefault();
						}
					}

				});

			if( this.options.collapsed ){
				this.collapse( false );
			}
			else {
				this.expand();
			}
		},

		collapsed: false,

		expand: function ( target ) {
			var self = $( this ).data( pluginName ) || this;
			self.element.removeClass( self.options.collapsedClass );
			self.collapsed = false;
			self.header.attr( "aria-expanded", "true" );
			self.content.attr( "aria-hidden", "false" );
			self.element.trigger( "expand" );
		},

		collapse: function( target ) {
			var self = $( this ).data( pluginName ) || this;
			self.element.addClass( self.options.collapsedClass );
			self.collapsed = true;
			self.header.attr( "aria-expanded", "false" );
			self.content.attr( "aria-hidden", "true" );
			self.element.trigger( "collapse" );
		},

		toggle: function( target ){
			if(  this.collapsed ){
				this.expand( target );
			} else {
				this.collapse( target );
			}
		},

		focusable: "a, input, textarea, select, button, [tabindex='0']",

		// arrow method handles the arrow key navigation, which largely maps to the tab key within the component
		arrow: function( target, back ){
			var self = this;
			// find all focusables in this collapsible content area
			var $focusables = this.content.find( this.focusable );
			// nextTab will be the next element receiving focus from this arrow keydown
			var nextTab;

			// if the keydown target is the header and it's down or right, focus on the first focusable
			if( $( target ).is( this.header ) && !back ){
				nextTab = $focusables[ 0 ];
			}
			else {
				// if it's a backward arrow, reverse the array
				if( back ){
					// this if can go away once https://github.com/filamentgroup/shoestring/issues/80 is fixed
					// check if already an array (shoestring with bug above)
					if( $focusables.reverse ){
						$focusables = $focusables.reverse();
					}
					// otherwisejquery will need a get()
					else {
						$focusables = $( $focusables.get().reverse() );
					}
				}
				// afterTarget becomes true once the target has been passed in the each loop
				var afterTarget = false;
				// loop focusables
				$focusables.each(function( i ){
					// if nextTab isn't defined yet, we're after the target in the loop, and the target appears to be displayed
					// NOTE: the offset checks replaced the following, which tied keyboard behavior to aria state:
						// !$( this ).closest( ".collapsible-collapsed .collapsible-content" ).length
						// unfortunately, we sometimes display visually elements that are still aria-hidden.
						// The current check caters to sighted keyboard users over non-sighted keyboard users. TODO: figure this out.
					if( !nextTab && afterTarget && this.offsetHeight > 0 && this.offsetLeft > -1 ){
						nextTab = this;
					}
					// try to set afterTarget if not already set
					if( !afterTarget ) {
						afterTarget = $( this ).is( target );
					}
				});
			}

			// if we have a next element to send focus to at this point, do that. Otherwise, focus back on header
			if( nextTab ){
				nextTab.focus();
			}
			else {
				// no nextTab? focus back to header
				this.header[ 0 ].focus();
			}
		}

	};

	// lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if ( !$( this ).data( pluginName ) ) {
				new Plugin( this, options );
			}
		});
	};

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "enhance", function( e ){
		var selector = "." + pluginName;
		$( $( e.target ).is( selector ) && e.target ).add( selector, e.target ).filter( selector )[ pluginName ]();
	});

})(jQuery, window, document);
