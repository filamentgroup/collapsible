/*
 * Toggle widget
 * https://github.com/filamentgroup/toggle
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {
    
    // Defaults
    var pluginName = "collapsible";
    // overrideable defaults
    var defaults = {
        pluginClass: pluginName,
        collapsedClass: pluginName + "-collapsed",
        headerClass: pluginName + "-header",
        contentClass: pluginName + "-content",
        instructions: "Interact to toggle content",
        collapsed: true
    };

    // plugin constructor
    function Plugin(element, options) {
        this.element = $( element );
        var self = this,
            dataOptions = {};

        // Allow data-attr option setting
        if( this.element.is( "[data-config]" ) ){
            $.each( defaults, function( option ) {

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
            });
        }

        this.options = $.extend( {}, defaults, dataOptions, options );
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
        },

        _addAttributes: function(){
            this.element.addClass( this.options.pluginClass );

            this.header.addClass( this.options.headerClass );

            this.header.attr( "title", this.options.instructions );

            this.header.attr( "role", "button" );

            this.header.attr( "aria-expanded", "true" );

            this.header.attr( "tabindex", "0" );

            this.content.addClass( this.options.contentClass );
        },

        _bindEvents: function(){
            var self = this;

            this.element
                .on( "expand", this.expand )
                .on( "collapse", this.collapse )
                .on( "toggle", this.toggle );

            this.header
                .on( "mouseup", function(){
                    self.element.trigger( "toggle" );
                })
                .on( "keyup", function( e ){
                    if( e.which === 13 || e.which === 32 ){ 
                        self.element.trigger( "toggle" );
                    }
                });

            if( this.options.collapsed ){
                this.collapse();
            }
        },

        collapsed: false,

        expand: function () {
            var self = $.data( this, "plugin_" + pluginName ) || this;
            self.element.removeClass( self.options.collapsedClass );
            self.collapsed = false;
            self.header.attr( "aria-expanded", "true" );
        },

        collapse: function() {
            var self = $.data( this, "plugin_" + pluginName ) || this;
            self.element.addClass( self.options.collapsedClass );
            self.collapsed = true;
            self.header.attr( "aria-expanded", "false" );
        },

        toggle: function(){
            var self = $.data( this, "plugin_" + pluginName );
            self.element.trigger( self.collapsed ? "expand" : "collapse" );
        }
    };

    // lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
    
    // Simple auto-init by selector that runs when the dom is ready. Use if desirable.
    $(function(){
        $( "." + pluginName )[ pluginName ]();
    });

})(jQuery, window, document);
