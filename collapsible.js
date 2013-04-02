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
        collapsed: true
    };

    // plugin constructor
    function Plugin(element, options) {
        this.element = $( element );

        // Allow data-attr option setting
        if( this.element.is( "[data-config]" ) ){
            var dataOptions = {};
            for( var i in defaults ){
                if( defaults.hasOwnProperty( i ) && ( typeof( defaults[ i ] === "string" ) ) || typeof( defaults[ i ] === "number" ) || typeof( defaults[ i ] === "boolean" ) ){
                    var dataOption = elem.attr( i.replace( /[A-Z]/g, function( c ) {
                            return "-" + c.toLowerCase();
                        }));

                    if( typeof( dataOption ) === "string" || typeof( dataOption ) === "number" ){
                        dataOptions[ i ] = dataOption;
                    }
                    else if( typeof( dataOption ) === "boolean" ){
                        dataOptions[ i ] = dataOption === "true";
                    }
                }
            }
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

            this.content.addClass( this.options.contentClass );
        },

        _bindEvents: function(){
            var self = this;

            this.element
                .bind( "expand", this.expand )
                .bind( "collapse", this.collapse )
                .bind( "toggle", this.toggle );

            this.header.bind( "click", function(){
                self.element.trigger( "toggle" );
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
        },

        collapse: function() {
            var self = $.data( this, "plugin_" + pluginName ) || this;
            self.element.addClass( self.options.collapsedClass );
            self.collapsed = true;
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
