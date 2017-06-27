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
		expandedClass: pluginName + "-expanded", // NOTE: don't use this class for showing/hiding collapsible-content. Instead, use it for expanded visual exceptions.
		headerClass: pluginName + "-header",
		contentClass: pluginName + "-content",
		enhancedClass: pluginName + "-enhanced",
		instructions: false,
		innerButton: false, // this wraps the text of the header in a button and transfers the aria info to that button
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
			this.header = this.element.children().filter( "." + this.options.headerClass );
			if( !this.header.length ){
				this.header = this.element.children().eq( 0 );
			}
			this.content = this.element.children().filter( "." + this.options.contentClass );
			if( !this.content.length ){
				this.content = this.header.next();
			}
			if( this.options.innerButton ){
				this.headerHTML = this.header.text();
				this.headerButton = $( "<button></button>" ).append( this.headerHTML );
			}
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

			this._addA11yAttrs();

			this.content.addClass( this.options.contentClass );

		},

		_addA11yAttrs: function(){
			if( this.options.innerButton ){
					this.header.html( '' );
					this.header.append( this.headerButton );
			}
			else {
				this.header.attr( "role", "button" );
				this.header.attr( "tabindex", "0" );
				if( this.options.instructions ){
					this.header.attr( "title", this.options.instructions );
				}
			}
		},

		_removeA11yAttrs: function(){
			if( this.options.innerButton ){
				this.header.html( '' );
				this.header.append( this.headerHTML );
			}
			else {
				this.header.removeAttr( "role" );
				this.header.removeAttr( "tabindex" );
				this.header.removeAttr( "title" );
			}
		},

		_isNonInteractive: function(){
			var computedContent = window.getComputedStyle( this.content[ 0 ], null );
			var computedHeader = window.getComputedStyle( this.header[ 0 ], null );
			if( this.options.innerButton ){
				computedHeader = window.getComputedStyle( this.headerButton[ 0 ], null );
			}
			return computedContent.getPropertyValue( "display" ) !== "none" && computedContent.getPropertyValue( "visibility" ) !== "hidden" && computedHeader.getPropertyValue( "cursor" ) === "default";
		},

		_checkInteractivity: function(){
			if( this._isNonInteractive() ){
				this._removeA11yAttrs();
			}
			else{
				this._addA11yAttrs();
			}
		},


		_bindEvents: function(){
			var self = this;

			this.header
				.bind( ( "click" ), function( e ){
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


			this._checkInteractivity();
			var resizepoll;
			$( window ).bind( "resize", function(){
				if( resizepoll ){
					clearTimeout( resizepoll );
				}
				resizepoll = setTimeout( function(){
					self._checkInteractivity.call( self );
				}, 150 );
			} );
		},

		collapsed: false,

		// used internally to expand without triggering events (for init)
		_expand: function() {
			this.element.removeClass( this.options.collapsedClass );
			this.element.addClass( this.options.expandedClass );
			if( this.options.innerButton ){
				this.headerButton.attr( "aria-expanded", "true" );
			}
			else {
				this.header.attr( "aria-expanded", "true" );
			}
			this.collapsed = false;
		},

		expand: function () {
			var self = $( this ).data( pluginName ) || this;
			self._expand();
			self.element.trigger( "expand" );
		},

		// used internally to expand without triggering events (for init)
		_collapse: function() {
			this.element.addClass( this.options.collapsedClass );
			this.element.removeClass( this.options.expandedClass );
			if( this.options.innerButton ){
				this.headerButton.attr( "aria-expanded", "false" );
			}
			else {
				this.header.attr( "aria-expanded", "false" );
			}
			this.collapsed = true;
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
