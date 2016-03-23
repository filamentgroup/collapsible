/*
 * Collapsible widget extension: external toggle
 * External click targets can toggle a collapsible from outside the collapsible component
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {
	var pluginName = "collapsible";
	var subPluginName = "collapsible-target";
	var attrName = "data-" + subPluginName;
	var dataName = attrName;

	function ExternalToggle( $toggle ) {
		this.$toggle = $toggle;
		this.isLink = this.$toggle.is( "a[href]" );
		this.isSelect = !this.isLink && this.$toggle.is( "select" );
		this.isRadio = !this.isSelect && this.$toggle.is( "[type='radio']" );

		this.$target = $( $toggle.attr( attrName ) || $toggle.attr( 'href' ) );
		this.component = this.$target.data( pluginName );
	}

	ExternalToggle.prototype.getForcedElement = function() {
		if( this.isSelect ) {
			return this.$toggle.find( "option" ).eq( this.$toggle[ 0 ].selectedIndex );
		} else {
			return this.$toggle;
		}
	};

	ExternalToggle.prototype.toggle = function() {
		var $el = this.getForcedElement();
		if( $el.is( "[data-force-expand]" ) ) {
			this.component.expand();
		} else if( $el.is( "[data-force-collapse]" ) ) {
			this.component.collapse();
		} else if( $el.is( "[data-ignore]" ) ) {
		} else {
			this.component.toggle();
		}
	};

	ExternalToggle.prototype.initSelect = function() {
		var self = this;
		if( this.isSelect ) {
			this.$toggle.unbind( "change." + pluginName ).bind( "change." + pluginName, function() {
				self.toggle();
			});
		}
	};

	ExternalToggle.prototype.onclick = function( event ) {
		var self = this;

		if( this.isLink ) {
			event.preventDefault();
			this.toggle();
		} else if( this.isSelect ) {
			// do nothing, element already initialized globally.
		} else if( this.isRadio ) {
			$( "[name='" + this.$toggle.attr( "name" ) + "']" ).unbind( "change." + pluginName ).bind( "change." + pluginName, function() {
				if( self.$toggle[ 0 ].checked ) {
					self.component.expand();
				} else {
					self.component.collapse();
				}
			}).trigger( "change" );
		} else {
			this.toggle();
		}
	};

	function init( $toggle ) {
		var component = $toggle.data( dataName );
		if( !component ) {
			component = new ExternalToggle( $toggle );
			$toggle.data( dataName, component );
		}
		return component;
	}

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "click." + pluginName, function( event ){
		$( event.target ).closest( '[' + attrName + ']' ).each(function() {
			var component = init( $( this ) );
			component.onclick.call( component, event );
		});
	});

	// Global Init
	$( document ).bind( "enhance", function( e ){
		var selector = "select[" + attrName + "]";
		$( $( e.target ).is( selector ) && e.target ).add( selector, e.target ).filter( selector ).each(function() {
			var component = init( $( this ) );
			component.initSelect();
		});
	});

})(jQuery, window, document);
