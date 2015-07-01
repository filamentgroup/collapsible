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

		// prevent double init
		if ( this.element.data( pluginName ) ) {
			return;
		}

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

			if( this.options.collapsed ){
				this._collapse();
			}
			else {
				this._expand();
			}
		},

		collapsed: false,

		// used internally to expand without triggering events (for init)
		_expand: function() {
			this.element.removeClass( this.options.collapsedClass );
			this.collapsed = false;
			this.header.attr( "aria-expanded", "true" );
			this.content.attr( "aria-hidden", "false" );
		},

		expand: function () {
			var self = $( this ).data( pluginName ) || this;
			self._expand();
			self.element.trigger( "expand" );
		},

		// used internally to expand without triggering events (for init)
		_collapse: function() {
			this.element.addClass( this.options.collapsedClass );
			this.collapsed = true;
			this.header.attr( "aria-expanded", "false" );
			this.content.attr( "aria-hidden", "true" );
		},

		collapse: function() {
			var self = $( this ).data( pluginName ) || this;
			self._collapse();
			self.element.trigger( "collapse" );
		},

		toggle: function(){
			if(  this.collapsed ){
				this.expand();
			} else {
				this.collapse();
			}
		},

		focusable: "a, input, textarea, select, button, [tabindex='0']"
	};

	// lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			new Plugin( this, options );
		});
	};
})(jQuery, window, document);
