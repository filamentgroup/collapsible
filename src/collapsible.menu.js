/*
 * Collapsible widget extension: menu behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName ) ){
			var $collapsible = $( e.target );
			var self = $collapsible.data( pluginName );
			var $trigger = $collapsible.prev().filter( "." + pluginName + "-trigger" );
			var triggerExpand = pluginName + "-trigger-expand";

			// menu behavior (clickout, and optionally hover)
			var isMenu = function(){
				return $collapsible.children( "." + pluginName + "-content" ).css( "position" ) === "absolute" || $collapsible.is( "[data-collapsible-ismenu]" );
			};

			// tapout/clickout behavior
			var targetTop;
			var touchCancel = false;
			$( "body" )
				.bind( "gesturestart." + pluginName, function(){
					touchCancel = true;
				})
				.bind( "mousemove." + pluginName, function(){
					touchCancel = true;
				})
				.bind( "touchstart." + pluginName + " pointerdown." + pluginName + " MSPointerDown." + pluginName, function( a ){
					targetTop = a.target.getBoundingClientRect().top;
				})
				.bind( "focusin." + pluginName + " touchend." + pluginName + " click." + pluginName+ " pointerup." + pluginName + " MSPointerUp." + pluginName, function( a ){
					var atype = a.originalEvent ? a.originalEvent.type : a.type;
					if( atype === "touchend" || atype === "pointerup" || atype === "MSPointerUp" ){
						if( targetTop && Math.abs( targetTop - a.target.getBoundingClientRect().top ) > 5 ){
							touchCancel = true;
						}
					}

					// if the event target is not in the collapsible, and the collapsible is expanded, and it's a menu presentation... collapse it!
					if( !$( a.target ).closest( e.target ).length &&
						!$( a.target ).closest( $trigger ).length &&
						!$collapsible.data( pluginName ).collapsed &&
						isMenu()  &&
						touchCancel === false ){

						setTimeout(function(){
							$collapsible.data( pluginName ).collapse();
						});
						if( $( a.target ).closest( "a,select,input,textarea,button,label" ).length && !$( a.target ).closest( "." + pluginName + "-header" ).length ){
							a.preventDefault();
						}
					}
					setTimeout( function(){
						targetTop = null;
						touchCancel = false;
					}, 200 );
				} );

			// hover behavior for collapsibles and triggers relies on the presence of data-collapsible-hover attr
			// the exclusive hover behavior requires a value of "exclusive"
			var startedByTouch = false;
			var hover = $collapsible.is( "[data-collapsible-hover]" );
			var exclusiveHover = $collapsible.is( "[data-collapsible-hover='exclusive']" );
			var mouseovertimestamp;

			if( hover ){
				if( exclusiveHover ){
					self.header.unbind( "click tap" );
				}

				$collapsible
					.add( $trigger )
					.bind( "touchstart pointerdown MSPointerDown", function( e ){
						// ignore hovers that begin with touch
						var evt = e.originalEvent ? e.originalEvent : e;
						if( ( evt.type === "pointerdown" || evt.type === "MSPointerDown" ) && evt.pointerType && ( evt.pointerType === "mouse" || evt.pointerType === 4 ) ){
							return;
						}

						startedByTouch = true;
					} )
					// mouseover covers child collapsibles in a more friendly way than mouseleave
					.bind( "mouseover." + pluginName, function( e ){
						mouseovertimestamp = new Date().getTime();
						if( !startedByTouch && isMenu() && $( e.target ).closest( self.header ).length ){
							$collapsible.data( pluginName ).expand();
						}
					} )
					.bind( "mouseleave." + pluginName, function(){
						mouseovertimestamp = null;
						if( !startedByTouch && isMenu() && $( e.target ).is( $collapsible ) ){
							$collapsible.data( pluginName ).collapse();
						}
					} )
					// make hover menu header links click-through for mouse, though not for touch
					.bind( "click", function( e ){
						if( !mouseovertimestamp ){
							return;
						}
						var timesincemouseover = new Date().getTime() - mouseovertimestamp;

						if( $( e.target ).is( self.header ) && isMenu() && $( e.target ).is( "a[href]" ) && !startedByTouch && timesincemouseover > 300 ){
							window.location.href = e.target.href;
						}
					} );

				$collapsible
					.bind( "expand", function(){
						$trigger.addClass( triggerExpand );
					} )
					.bind( "collapse", function(){
						$trigger.removeClass( triggerExpand );
					} );
			}



			// add keyboard/arrow handling
			// arrow method handles the arrow key navigation, which largely maps to the tab key within the component
			self.arrow = function( target, back ){

				// find all focusables in this collapsible content area
				var $focusables = this.content.find( this.focusable );
				// nextTab will be the next element receiving focus from this arrow keydown
				var nextTab;

				// if the keydown target is the header and it's down or right, focus on the first focusable
				if( $( target ).is( this.header ) && !back ){
					nextTab = $focusables[ 0 ];
				}
				else {
					// if it's a backward arrow, reverse the array
					if( back ){
						// this if can go away once https://github.com/filamentgroup/shoestring/issues/80 is fixed
						// check if already an array (shoestring with bug above)
						if( $focusables.reverse ){
							$focusables = $focusables.reverse();
						}
						// otherwisejquery will need a get()
						else {
							$focusables = $( $focusables.get().reverse() );
						}
					}
					// afterTarget becomes true once the target has been passed in the each loop
					var afterTarget = false;
					// loop focusables
					$focusables.each(function(){
						// if nextTab isn't defined yet, we're after the target in the loop, and the target appears to be displayed
						// NOTE: the offset checks replaced the following, which tied keyboard behavior to aria state:
							// !$( this ).closest( ".collapsible-collapsed .collapsible-content" ).length
							// unfortunately, we sometimes display visually elements that are still aria-hidden.
							// The current check caters to sighted keyboard users over non-sighted keyboard users. TODO: figure this out.
						if( !nextTab && afterTarget && this.offsetHeight > 0 && this.offsetLeft > -1 ){
							nextTab = this;
						}
						// try to set afterTarget if not already set
						if( !afterTarget ) {
							afterTarget = $( this ).is( target );
						}
					});
				}

				// if we have a next element to send focus to at this point, do that. Otherwise, focus back on header
				if( nextTab ){
					nextTab.focus();
				}
				else {
					// no nextTab? focus back to header
					this.header[ 0 ].focus();
				}
			};

			// bind keydown handlers.
			// arrow key handling applies to the entire collapsible
			self.element
				.bind( "keydown." + pluginName, function( e ){
					// arrow key behavior: collapsible must be expanded to accept arrow navigation
					if( !self.collapsed && isMenu() ){
						if( e.which === 39 || e.which === 40 ){
							self.arrow( e.target );
							e.preventDefault();
						}
						else if( e.which === 37 || e.which === 38 ){
							self.arrow( e.target, true );
							e.preventDefault();
						}
					}
				});





		}
	} );

})(jQuery, window, document);
