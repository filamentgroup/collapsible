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

        var resetItems = function(){
          $moreBtn.attr( "tabindex", "0" );
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

        $collapsible
        .bind( "mouseover." + pluginName, function( e ){
						if( $collapsible.is( "[data-collapsible-hover]" ) && !$( e.target ).closest( "." + itemMenuClass + ", ." + itemMoreClass ).length ){
							$collapsible.data( pluginName ).collapse();
						}
					} )
          .bind( "collapse", function( e ){
            var $childCollapsibles = $( e.target ).find( "." + pluginName + "-expanded." + itemMenuClass );
            if( $childCollapsibles.length ){
              $childCollapsibles.data( pluginName ).collapse();
            }

          } );
      }
    });

}( typeof global !== "undefined" ? global : this ));
