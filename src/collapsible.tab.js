/*
 * Collapsible widget extension: tabs behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document) {

	var pluginName = "collapsible";
	var activeTabClass = "tab-active";
	var defaultAttrs = {
		"tabindex": "-1",
		"aria-selected": false
	};
	var uniqueIdPrefix = pluginName + "-id-";
	var counter = 0;

	function deactivateTab( $tabHeader ) {
		$tabHeader.removeClass( activeTabClass ).attr( defaultAttrs );
	}

	function activateTab( $tabHeader ) {
		$tabHeader.addClass( activeTabClass ).attr({
			"aria-selected": "true"
		}).removeAttr( "tabindex" );
	}

	$( document ).bind( "init", function( e ){
		var $collapsible = $( e.target ).closest( "." + pluginName );
		var $tabContainer = $collapsible.parent();
		var $tabNav = $tabContainer.find( ".tabnav" );
		var self;
		var id;
		var linkId;

		if( $collapsible.is( "." + pluginName ) && $tabContainer.is( ".tabs" ) ){
			self = $collapsible.data( pluginName );
			id = self.content.attr( "id" );

			$tabNav.find( "[aria-controls=" + id + "]" ).remove();

			if( !id ) {
				id = uniqueIdPrefix + ( ++counter );
				self.content.attr( "id", id );
			}

			linkId = id + "-link";

			var attrs = {
				"id": linkId,
				"aria-controls": id,
				"role": "tab"
			};

			for( var j in defaultAttrs ) {
				attrs[ j ] = defaultAttrs[ j ];
			}

			self.$tabHeaderListItem = $( "<li>" ).attr( "role", "presentation" );
			self.$tabHeader = $( "<a href='#" + id + "'>" + self.header[0].innerHTML + "</a>" ).attr( attrs );
			self.header.css( 'display', 'none' );
			self.content.attr({
				"aria-labelledby": linkId
			});

			self.$tabHeader.bind( "click", function( e ){
				e.preventDefault();
				e.stopPropagation();

				if( self.$tabHeader.is( '.' + activeTabClass ) ) {
					deactivateTab( self.$tabHeader );
				} else {
					deactivateTab( $tabContainer.find( '.' + activeTabClass ) );
					activateTab( self.$tabHeader );
				}

				self.toggle();
			}).bind( "keydown", function( e ){
				var $activeTab = $tabNav.find( "." + activeTabClass );
				var direction;

				// arrow key behavior
				if( e.which === 39 ) { // forward
					direction = "next";
				} else if( e.which === 37 ) { // back
					direction = "prev";
				}

				if( direction ) {
					$activeTab.parent()[ direction ]().find( "a" ).trigger( "click" ).focus();
					e.preventDefault();
				}
			});

			if( !$tabNav.length ) {
				$tabNav = $( "<ul class='tabnav' role='tablist'></nav>" );
				$tabContainer.prepend( $tabNav );
			}

			if( !self.collapsed ) {
				activateTab( self.$tabHeader );
				self._expand();
			}

			$tabNav.append( self.$tabHeaderListItem.append( self.$tabHeader ) );
		}
	});

})(jQuery, window, document);
