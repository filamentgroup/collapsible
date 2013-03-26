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
        expandedClass: pluginName + "-expanded",
        headerClass: pluginName + "-header",
        contentClass: pluginName + "-content",
        expanded: false
    };

    // plugin constructor
    function Plugin(element, options) {
        this.element = element;

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
            
            this.header = this.element.children( 0 );
            this.content = this.header.next();

            this._addAttributes();
            this._bindEvents();
        },

        _addAttributes: function(){
            this.element.addClass( this.options.pluginClass );

            this.header.addClass( this.options.headerClass );

            this.footer.addClass( this.options.contentClass );
        },

        bindEvents: function(){
            var self = this;

            this.element
                .bind( "expand", this.expand )
                .bind( "collapse", this.collapse )
                .bind( "toggle", this.toggle );

            this.header.bind( "click", function(){
                self.element.trigger( "toggle" );
            });
        },

        expanded: true,

        expand: function () {
            this.element.addClass( this.options.expandedClass );
            this.expanded = true;
        },

        collapse: function() {
            this.element.removeClass( this.options.expandedClass );
            this.expanded = false;
        },

        toggle: function(){
            this.element.trigger( this.expanded ? "collapse" : "expand" );
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
