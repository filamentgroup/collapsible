/* collapsible extension for navbar functionality */
;(function( w ){

    var $ = w.jQuery;
    $( w.document ).bind( "init", function( e ){
  		var pluginName = "collapsible";
      var extName = "navbar";
      var itemClass = extName + "_item";
      var overflowActiveClass = extName + "-overflow";
      var itemMenuClass = itemClass + "-overflow";
      var itemMoreClass = extName + "_more";
      var itemMoreHiddenClass = itemMoreClass + "-nomore";
      var readyClass = extName + "-ready";
  		if( $( e.target ).is( "." + pluginName + "." + extName ) ){
  			var $collapsible = $( e.target );
  			var $navItems = $collapsible.find( "." + itemClass );
        var $moreBtn = $collapsible.find( "." + itemMoreClass );

        $moreBtn.attr( "aria-label", "Toggle more items" );

        var resetItems = function(){
          $moreBtn.removeClass( itemMoreHiddenClass );
          $navItems.removeClass( itemMenuClass );
        };

        var initItems = function(){
          menuNotReady();
          resetItems();
          var startTop = $navItems[ 0 ].offsetTop;

          function menuNotReady(){
            $collapsible.removeClass( readyClass );
          }

          function menuReady(){
            $collapsible.addClass( readyClass );
          }

          function accommodateMoreBtn(){
            if( $moreBtn[ 0 ].offsetTop > startTop ){
              var $notOverflowedMenuItems = $navItems.not( "." + itemMenuClass );
              if( $notOverflowedMenuItems.length ) {
                $notOverflowedMenuItems.last().addClass( itemMenuClass );
                accommodateMoreBtn();
              }
            }
            else {
              var $menuItems = $navItems.filter( "." + itemMenuClass );
              if( $menuItems.length === 0 ){
                $moreBtn.addClass( itemMoreHiddenClass );
                $collapsible.removeClass( overflowActiveClass );
              }
              else{
                $collapsible.addClass( overflowActiveClass );
              }
              menuReady();
            }
          }
          accommodateMoreBtn();

        };

        // init immediately
        initItems();
        // and on window resize
        $( w ).bind( "resize", initItems );
	// and on window load just in case things have shifted
        $( w ).bind( "load", initItems );

        $collapsible
        .bind( "mouseover." + pluginName, function( e ){
						if( $collapsible.is( "[data-collapsible-hover]" ) && !$( e.target ).closest( "." + itemMenuClass + ", ." + itemMoreClass ).length ){
							$collapsible.data( pluginName ).collapse();
						}
					} )
          .bind( "expand", function( e ){
            var $target = $( e.target );
            var $childCollapsibles = $target.find( "." + pluginName + "-expanded." + itemMenuClass );

            if( $( e.target ).is( this ) ){
              $moreBtn.attr( "tabindex", "-1" );
              $collapsible.find( "." + itemMenuClass + " a" ).eq(0).focus();
            }
            else if( !$childCollapsibles.length && !$target.is("." + pluginName + "-expanded." + itemMenuClass) ) {
              $collapsible.data( pluginName ).collapse();
            }
          })
          .bind( "collapse", function( e ){
            var $target = $( e.target );
            var $childCollapsibles = $target.find( "." + pluginName + "-expanded." + itemMenuClass );

            if( $childCollapsibles.length && $target.is("." + pluginName + "-expanded." + itemMenuClass) ) {
              $childCollapsibles.data( pluginName ).collapse();
              $target.data( pluginName ).collapse();
            }
            // restore tabindex
            if( $( e.target ).is( this ) ){
              $moreBtn.attr( "tabindex", "0" );
            }

          } );
      }
    });

}( typeof global !== "undefined" ? global : this ));
