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
					if( e.which === 39 || e.which === 40 ){
						self.arrow( e.target );
						e.preventDefault();
					}
					else if( e.which === 37 || e.which === 38 ){
						self.arrow( e.target, true );
						e.preventDefault();
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
			var $focusables = $( this.content ).find( this.focusable );
			var next;

			// collapsible must be expanded to accept arrow navigation
			if( !this.collapsed ){
				if( $( target ).is( this.header ) && !back ){
					next = $focusables[ 0 ];
				}
				else {
					$focusables.each(function( i ){
						var sibIndex = back ?  i - 1 : i + 1;
						if( $( this ).is( target ) && $focusables[ sibIndex ] ){
							next = $focusables[ sibIndex ];
						}
					});
				}

				if( next ){
					next.focus();
				}
				else {
					this.header.focus();
				}
			}
		}

	};

	// lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if ( !$( this ).data( pluginName ) ) {
				$( this ).data( pluginName, new Plugin( this, options ));
			}
		});
	};

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "enhance", function( e ){
		var selector = "." + pluginName;
		$( $( e.target ).is( selector ) && e.target ).add( selector, e.target ).filter( selector )[ pluginName ]();
	});

})(jQuery, window, document);
