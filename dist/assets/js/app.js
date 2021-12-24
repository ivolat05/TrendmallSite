/*
== malihu jquery custom scrollbar plugin == 
Version: 3.1.5 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

(function(factory){
	if(typeof define==="function" && define.amd){
		define(["jquery"],factory);
	}else if(typeof module!=="undefined" && module.exports){
		module.exports=factory;
	}else{
		factory(jQuery,window,document);
	}
}(function($){
(function(init){
	var _rjs=typeof define==="function" && define.amd, /* RequireJS */
		_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
		_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
		_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
	if(!_rjs){
		if(_njs){
			require("jquery-mousewheel")($);
		}else{
			/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
			$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
		}
	}
	init();
}(function(){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
			/*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer, array ([y,x])
				option						default
				-------------------------------------
				snapAmount					null
			*/
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
				/*
				tabindex of the scrollbar buttons
				values: false, integer
					option						default
					-------------------------------------
					tabindex					null
				*/
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			enable/disable document (default) touch-swipe scrolling 
			*/
			documentTouchScroll:true,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: "auto", boolean
				*/
				updateOnImageLoad:"auto",
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
				/*
				extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					extraDraggableSelectors		null
				*/
				/*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
				/*
				auto-update timeout 
				values: integer (milliseconds)
				*/
				autoUpdateTimeout:60
			},
			/* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				Available callbacks: 
					callback					default
					-------------------------------------
					onCreate					null
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onBeforeUpdate				null
					onUpdate					null
				*/
				onTotalScrollOffset:0,
				onTotalScrollBackOffset:0,
				alwaysTriggerOffsets:true
			}
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			liveSelector values: string (selector)
				option						default
				-------------------------------------
				live						false
				liveSelector				null
			*/
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
		/* general plugin classes */
		classes=[
			"mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
			"mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
			"mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
		],
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=_selector.call(this); /* validate selector */
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
				options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType); 
				
				_theme(options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							contentReset:{y:null,x:null}, /* object to check when content resets */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null,
							/* 
							object to check for changes in elements in order to call the update method automatically 
							*/
							poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
						});
						
						var d=$this.data(pluginPfx),o=d.opt,
							/* HTML data attributes */
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						 
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							_theme(o); /* theme-specific options */
						}
						
						_pluginMarkup.call(this); /* add plugin markup */
						
						if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */
						
						$("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el,cb){
				
				var selector=el || _selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */
						
						if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
						if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}
						
						/* css flexbox fix, detect/set max-height */
						mCustomScrollBox.css("max-height","none");
						if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}
						
						_expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",_contentWidth(mCSB_container));
						}
						
						d.overflowed=_overflowed.call(this); /* determine if scrolling is required */
						
						_scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){_setDraggerLength.call(this);}
						
						_scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						_bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								d.contentReset.y=null;
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								d.contentReset.x=null;
							}
						}
						
						/* callbacks: onImageLoad, onSelectorChange, onUpdate */
						if(cb && d){
							if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
								o.callbacks.onImageLoad.call(this);
							}else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
								o.callbacks.onSelectorChange.call(this);
							}else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
								o.callbacks.onUpdate.call(this);
							}
						}
						
						_autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								timeout:60, /* scroll-to delay */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=_to.call(this,to[0],"y");
						to[1]=_to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								_scrollTo($this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								_scrollTo($this,to[1].toString(),methodOptions);
							}
						},methodOptions.timeout);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						_stop($this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx);
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						if(r){_resetContentPosition.call(this);} /* reset content position */
						
						_scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass(classes[3]); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						_resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						_delete(this,"mcs"); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		/* validates selector (if selector is invalid or undefined uses the default one) */
		_selector=function(){
			return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
		},
		/* -------------------- */
		
		
		/* changes options according to theme */
		_theme=function(obj){
			var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
				nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
				disabledScrollButtonsThemes=["minimal","minimal-dark"],
				enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
				scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
			obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
			obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
			obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
			obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
			obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
		},
		/* -------------------- */
		
		
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				_delete(liveTimers,selector);
			}
		},
		/* -------------------- */
		
		
		/* normalizes axis option to valid values: "y", "x", "yx" */
		_findAxis=function(val){
			return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
		},
		/* -------------------- */
		
		
		/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
		_findScrollButtonsType=function(val){
			return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
		},
		/* -------------------- */
		
		
		/* generates plugin markup */
		_pluginMarkup=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
				scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
				wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
				scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
				contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
				autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
				scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
			if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
			if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
			o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
			$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir='"+d.langDir+"' /></div>");
			var mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
				mCSB_container.css("width",_contentWidth(mCSB_container));
			}
			if(o.scrollbarPosition==="outside"){
				if($this.css("position")==="static"){ /* requires elements with non-static position */
					$this.css("position","relative");
				}
				$this.css("overflow","visible");
				mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
			}else{
				mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
				mCSB_container.wrap(contentWrapper);
			}
			_scrollButtons.call(this); /* add scrollbar buttons */
			/* minimum dragger length */
			var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
			mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
		},
		/* -------------------- */
		
		
		/* calculates content width */
		_contentWidth=function(el){
			var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
			return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
		},
		/* -------------------- */
		
		
		/* expands content horizontally */
		_expandContentHorizontally=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
				/* calculate scrollWidth */
				mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
				var w=Math.ceil(mCSB_container[0].scrollWidth);
				if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
					mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
				}else{
					/* 
					wrap content with an infinite width div and set its position to absolute and width to auto. 
					Setting width to auto before calculating the actual width is important! 
					We must let the browser set the width as browser zoom values are impossible to calculate.
					*/
					mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
						.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
						.css({ /* set actual width, original position and un-wrap */
							/* 
							get the exact width (with decimals) and then round-up. 
							Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
							*/
							"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
							"min-width":"100%",
							"position":"relative"
						}).unwrap();
				}
			}
		},
		/* -------------------- */
		
		
		/* adds scrollbar buttons */
		_scrollButtons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
				tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
				btnHTML=[
					"<a href='#' class='"+classes[13]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[14]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[15]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[16]+"' "+tabindex+" />"
				],
				btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
			if(o.scrollButtons.enable){
				mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
			}
		},
		/* -------------------- */
		
		
		/* auto-adjusts scrollbar dragger length */
		_setDraggerLength=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
				l=[
					parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
					parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
				],
				h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
			mCSB_dragger[0].css({
				"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
			}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
			mCSB_dragger[1].css({
				"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
			});
		},
		/* -------------------- */
		
		
		/* calculates scrollbar to content ratio */
		_scrollRatio=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
				ratio=[
					scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
					scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
				];
			d.scrollRatio={y:ratio[0],x:ratio[1]};
		},
		/* -------------------- */
		
		
		/* toggles scrolling classes */
		_onDragClasses=function(el,action,xpnd){
			var expandClass=xpnd ? classes[0]+"_expanded" : "",
				scrollbar=el.closest(".mCSB_scrollTools");
			if(action==="active"){
				el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
				el[0]._draggable=el[0]._draggable ? 0 : 1;
			}else{
				if(!el[0]._draggable){
					if(action==="hide"){
						el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
					}else{
						el.addClass(classes[0]); scrollbar.addClass(classes[1]);
					}
				}
			}
		},
		/* -------------------- */
		
		
		/* checks if content overflows its container to determine if scrolling is required */
		_overflowed=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
				contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
				h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
			if(h>contentHeight){contentHeight=h;}
			if(w>contentWidth){contentWidth=w;}
			return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
		},
		/* -------------------- */
		
		
		/* resets content position to 0 */
		_resetContentPosition=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			_stop($this); /* stop any current scrolling before resetting */
			if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
				mCSB_dragger[0].add(mCSB_container).css("top",0);
				_scrollTo($this,"_resetY");
			}
			if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
				var cx=dx=0;
				if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
					cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
					dx=Math.abs(cx/d.scrollRatio.x);
				}
				mCSB_container.css("left",cx);
				mCSB_dragger[1].css("left",dx);
				_scrollTo($this,"_resetX");
			}
		},
		/* -------------------- */
		
		
		/* binds scrollbar events */
		_bindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
			if(!d.bindEvents){ /* check if events are already bound */
				_draggable.call(this);
				if(o.contentTouchScroll){_contentDraggable.call(this);}
				_selectable.call(this);
				if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
					function _mwt(){
						mousewheelTimeout=setTimeout(function(){
							if(!$.event.special.mousewheel){
								_mwt();
							}else{
								clearTimeout(mousewheelTimeout);
								_mousewheel.call($this[0]);
							}
						},100);
					}
					var mousewheelTimeout;
					_mwt();
				}
				_draggerRail.call(this);
				_wrapperScroll.call(this);
				if(o.advanced.autoScrollOnFocus){_focus.call(this);}
				if(o.scrollButtons.enable){_buttons.call(this);}
				if(o.keyboard.enable){_keyboard.call(this);}
				d.bindEvents=true;
			}
		},
		/* -------------------- */
		
		
		/* unbinds scrollbar events */
		_unbindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				sb=".mCSB_"+d.idx+"_scrollbar",
				sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
			if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
			if(d.bindEvents){ /* check if events are bound */
				/* unbind namespaced events from document/selectors */
				$(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
				sel.each(function(){
					$(this).unbind("."+namespace);
				});
				/* clear and delete timeouts/objects */
				clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
				clearTimeout(d.sequential.step); _delete(d.sequential,"step");
				clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
				d.bindEvents=false;
			}
		},
		/* -------------------- */
		
		
		/* toggles scrollbar visibility */
		_scrollbarVisibility=function(disabled){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
				content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
			if(o.axis!=="x"){
				if(d.overflowed[0] && !disabled){
					scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
					content.removeClass(classes[8]+" "+classes[10]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
						content.removeClass(classes[10]);
					}else{
						scrollbar[0].css("display","none");
						content.addClass(classes[10]);
					}
					content.addClass(classes[8]);
				}
			}
			if(o.axis!=="y"){
				if(d.overflowed[1] && !disabled){
					scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
					content.removeClass(classes[9]+" "+classes[11]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
						content.removeClass(classes[11]);
					}else{
						scrollbar[1].css("display","none");
						content.addClass(classes[11]);
					}
					content.addClass(classes[9]);
				}
			}
			if(!d.overflowed[0] && !d.overflowed[1]){
				$this.addClass(classes[5]);
			}else{
				$this.removeClass(classes[5]);
			}
		},
		/* -------------------- */
		
		
		/* returns input coordinates of pointer, touch and mouse events (relative to document) */
		_coordinates=function(e){
			var t=e.type,o=e.target.ownerDocument!==document && frameElement!==null ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
				io=_canAccessIFrame() && e.target.ownerDocument!==top.document && frameElement!==null ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
			switch(t){
				case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
					return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
					break;
				case "touchstart": case "touchmove": case "touchend":
					var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
						touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
					return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
					break;
				default:
					return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
			}
		},
		/* -------------------- */
		
		
		/* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
		_draggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
				draggable,dragY,dragX,
				rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
				eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
			mCSB_dragger.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				touchActive=true;
				if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
				_iframe.call(mCSB_container,false); /* enable scrollbar dragging over iframes by disabling their events */
				_stop($this);
				draggable=$(this);
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					h=draggable.height()+offset.top,w=draggable.width()+offset.left;
				if(y<h && y>0 && x<w && x>0){
					dragY=y; 
					dragX=x;
				}
				_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
			}).bind("touchmove."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				_drag(dragY,dragX,y,x);
			});
			$(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
				if(draggable){
					var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
					if(dragY===y && dragX===x){return;} /* has it really moved? */
					_drag(dragY,dragX,y,x);
				}
			}).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				if(draggable){
					_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
					draggable=null;
				}
				touchActive=false;
				if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
				_iframe.call(mCSB_container,true); /* enable iframes events */
			});
			function _drag(dragY,dragX,y,x){
				mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
				if(draggable.attr("id")===draggerId[1]){
					var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
				}else{
					var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
				}
				_scrollTo($this,to.toString(),{dir:dir,drag:true});
			}
		},
		/* -------------------- */
		
		
		/* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
		_contentDraggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
				durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
				iframe=mCSB_container.find("iframe"),
				events=[
					"touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
					"touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
					"touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
				],
				touchAction=document.body.style.touchAction!==undefined && document.body.style.touchAction!=="";
			mCSB_container.bind(events[0],function(e){
				_onTouchstart(e);
			}).bind(events[1],function(e){
				_onTouchmove(e);
			});
			mCustomScrollBox.bind(events[0],function(e){
				_onTouchstart2(e);
			}).bind(events[2],function(e){
				_onTouchend(e);
			});
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onTouchstart(e);
								_onTouchstart2(e);
							}).bind(events[1],function(e){
								_onTouchmove(e);
							}).bind(events[2],function(e){
								_onTouchend(e);
							});
						}
					});
				});
			}
			function _onTouchstart(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1; touchDrag=0; docDrag=0; draggable=1;
				$this.removeClass("mCS_touch_action");
				var offset=mCSB_container.offset();
				dragY=_coordinates(e)[0]-offset.top;
				dragX=_coordinates(e)[1]-offset.left;
				touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
			}
			function _onTouchmove(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				if(!o.documentTouchScroll){e.preventDefault();} 
				e.stopImmediatePropagation();
				if(docDrag && !touchDrag){return;}
				if(draggable){
					runningTime=_getTime();
					var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
						easing="mcsLinearOut";
					touchMoveY.push(y);
					touchMoveX.push(x);
					touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
					if(d.overflowed[0]){
						var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
					}
					if(d.overflowed[1]){
						var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
					}
					if(prevent || preventX){ /* prevent native document scrolling */
						if(!touchAction){e.preventDefault();} 
						touchDrag=1;
					}else{
						docDrag=1;
						$this.addClass("mCS_touch_action");
					}
					if(touchAction){e.preventDefault();} 
					amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
					mCSB_container[0].idleTimer=250;
					if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
					if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
				}
			}
			function _onTouchstart2(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1;
				e.stopImmediatePropagation();
				_stop($this);
				startTime=_getTime();
				var offset=mCustomScrollBox.offset();
				touchStartY=_coordinates(e)[0]-offset.top;
				touchStartX=_coordinates(e)[1]-offset.left;
				touchMoveY=[]; touchMoveX=[];
			}
			function _onTouchend(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				draggable=0;
				e.stopImmediatePropagation();
				touchDrag=0; docDrag=0;
				endTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				if((endTime-runningTime)>30){return;}
				speed=1000/(endTime-startTime);
				var easing="mcsEaseOut",slow=speed<2.5,
					diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
				distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
				var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
				speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
				var a=[
					Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
					Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
				];
				amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
				durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
				var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
				amount[0]=absDistance[0]>md ? amount[0] : 0;
				amount[1]=absDistance[1]>md ? amount[1] : 0;
				if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
				if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
			}
			function _m(ds,s){
				var r=[s*1.5,s*2,s/1.5,s/2];
				if(ds>90){
					return s>4 ? r[0] : r[3];
				}else if(ds>60){
					return s>3 ? r[3] : r[2];
				}else if(ds>30){
					return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
				}else{
					return s>8 ? s : r[3];
				}
			}
			function _drag(amount,dur,easing,dir,overwrite,drag){
				if(!amount){return;}
				_scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
			}
		},
		/* -------------------- */
		
		
		/* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
		_selectable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				action;
			mCSB_container.bind("mousedown."+namespace,function(e){
				if(touchable){return;}
				if(!action){action=1; touchActive=true;}
			}).add(document).bind("mousemove."+namespace,function(e){
				if(!touchable && action && _sel()){
					var offset=mCSB_container.offset(),
						y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
					if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
						if(seq.step){_seq("off",null,"stepped");}
					}else{
						if(o.axis!=="x" && d.overflowed[0]){
							if(y<0){
								_seq("on",38);
							}else if(y>wrapper.height()){
								_seq("on",40);
							}
						}
						if(o.axis!=="y" && d.overflowed[1]){
							if(x<0){
								_seq("on",37);
							}else if(x>wrapper.width()){
								_seq("on",39);
							}
						}
					}
				}
			}).bind("mouseup."+namespace+" dragend."+namespace,function(e){
				if(touchable){return;}
				if(action){action=0; _seq("off",null);}
				touchActive=false;
			});
			function _sel(){
				return 	window.getSelection ? window.getSelection().toString() : 
						document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
			}
			function _seq(a,c,s){
				seq.type=s && action ? "stepped" : "stepless";
				seq.scrollAmount=10;
				_sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
			}
		},
		/* -------------------- */
		
		
		/* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
		_mousewheel=function(){
			if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
								_onMousewheel(e,delta);
							});
						}
					});
				});
			}
			mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
				_onMousewheel(e,delta);
			});
			function _onMousewheel(e,delta){
				_stop($this);
				if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
				var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
					dur=o.scrollInertia;
				if(o.axis==="x" || o.mouseWheel.axis==="x"){
					var dir="x",
						px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
						draggerPos=mCSB_dragger[1][0].offsetLeft,
						limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						dlt=o.mouseWheel.axis==="y" ? (e.deltaY || delta) : e.deltaX;
				}else{
					var dir="y",
						px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
						draggerPos=mCSB_dragger[0][0].offsetTop,
						limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						dlt=e.deltaY || delta;
				}
				if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
				if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
				if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
				if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				if(e.deltaFactor<5 && !o.mouseWheel.normalizeDelta){
					//very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
					amount=e.deltaFactor; dur=17;
				}
				_scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
			}
		},
		/* -------------------- */
		
		
		/* checks if iframe can be accessed */
		_canAccessIFrameCache=new Object(),
		_canAccessIFrame=function(iframe){
		    var result=false,cacheKey=false,html=null;
		    if(iframe===undefined){
				cacheKey="#empty";
		    }else if($(iframe).attr("id")!==undefined){
				cacheKey=$(iframe).attr("id");
		    }
			if(cacheKey!==false && _canAccessIFrameCache[cacheKey]!==undefined){
				return _canAccessIFrameCache[cacheKey];
			}
			if(!iframe){
				try{
					var doc=top.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}else{
				try{
					var doc=iframe.contentDocument || iframe.contentWindow.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}
			if(cacheKey!==false){_canAccessIFrameCache[cacheKey]=result;}
			return result;
		},
		/* -------------------- */
		
		
		/* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
		_iframe=function(evt){
			var el=this.find("iframe");
			if(!el.length){return;} /* check if content contains iframes */
			var val=!evt ? "none" : "auto";
			el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
		},
		/* -------------------- */
		
		
		/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
		_disableMousewheel=function(el,target){
			var tag=target.nodeName.toLowerCase(),
				tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
				/* elements that require focus */
				focusTags=["select","textarea"];
			return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
		},
		/* -------------------- */
		
		
		/* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
		_draggerRail=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
				clickable;
			mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				touchActive=true;
				if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
			}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				touchActive=false;
			}).bind("click."+namespace,function(e){
				if(!clickable){return;}
				clickable=0;
				if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
					_stop($this);
					var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
					if(el.parent(".mCSB_scrollTools_horizontal").length>0){
						if(!d.overflowed[1]){return;}
						var dir="x",
							clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
					}else{
						if(!d.overflowed[0]){return;}
						var dir="y",
							clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
					}
					_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
		_focus=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent();
			mCSB_container.bind("focusin."+namespace,function(e){
				var el=$(document.activeElement),
					nested=mCSB_container.find(".mCustomScrollBox").length,
					dur=0;
				if(!el.is(o.advanced.autoScrollOnFocus)){return;}
				_stop($this);
				clearTimeout($this[0]._focusTimeout);
				$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
				$this[0]._focusTimeout=setTimeout(function(){
					var	to=[_childPos(el)[0],_childPos(el)[1]],
						contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
						isVisible=[
							(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
							(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
						],
						overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
					if(o.axis!=="x" && !isVisible[0]){
						_scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
					if(o.axis!=="y" && !isVisible[1]){
						_scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
				},$this[0]._focusTimer);
			});
		},
		/* -------------------- */
		
		
		/* sets content wrapper scrollTop/scrollLeft always to 0 */
		_wrapperScroll=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				wrapper=$("#mCSB_"+d.idx+"_container").parent();
			wrapper.bind("scroll."+namespace,function(e){
				if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
					$(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
		_buttons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				sel=".mCSB_"+d.idx+"_scrollbar",
				btn=$(sel+">a");
			btn.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				var btnClass=$(this).attr("class");
				seq.type=o.scrollButtons.scrollType;
				switch(e.type){
					case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
						if(seq.type==="stepped"){return;}
						touchActive=true;
						d.tweenRunning=false;
						_seq("on",btnClass);
						break;
					case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
					case "mouseout": case "pointerout": case "MSPointerOut":
						if(seq.type==="stepped"){return;}
						touchActive=false;
						if(seq.dir){_seq("off",btnClass);}
						break;
					case "click":
						if(seq.type!=="stepped" || d.tweenRunning){return;}
						_seq("on",btnClass);
						break;
				}
				function _seq(a,c){
					seq.scrollAmount=o.scrollButtons.scrollAmount;
					_sequentialScroll($this,a,c);
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
		_keyboard=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
				iframe=mCSB_container.find("iframe"),
				events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onKeyboard(e);
							});
						}
					});
				});
			}
			mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
				_onKeyboard(e);
			});
			function _onKeyboard(e){
				switch(e.type){
					case "blur":
						if(d.tweenRunning && seq.dir){_seq("off",null);}
						break;
					case "keydown": case "keyup":
						var code=e.keyCode ? e.keyCode : e.which,action="on";
						if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
							/* up (38), down (40), left (37), right (39) arrows */
							if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
							if(e.type==="keyup"){action="off";}
							if(!$(document.activeElement).is(editables)){
								e.preventDefault();
								e.stopImmediatePropagation();
								_seq(action,code);
							}
						}else if(code===33 || code===34){
							/* PgUp (33), PgDn (34) */
							if(d.overflowed[0] || d.overflowed[1]){
								e.preventDefault();
								e.stopImmediatePropagation();
							}
							if(e.type==="keyup"){
								_stop($this);
								var keyboardDir=code===34 ? -1 : 1;
								if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
									var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
								}else{
									var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
								}
								_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
							}
						}else if(code===35 || code===36){
							/* End (35), Home (36) */
							if(!$(document.activeElement).is(editables)){
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
									}else{
										var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
									}
									_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}
						}
						break;
				}
				function _seq(a,c){
					seq.type=o.keyboard.scrollType;
					seq.scrollAmount=o.keyboard.scrollAmount;
					if(seq.type==="stepped" && d.tweenRunning){return;}
					_sequentialScroll($this,a,c);
				}
			}
		},
		/* -------------------- */
		
		
		/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
		_sequentialScroll=function(el,action,trigger,e,s){
			var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				once=seq.type==="stepped" ? true : false,
				steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
				steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
			switch(action){
				case "on":
					seq.dir=[
						(trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
						(trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
					];
					_stop(el);
					if(_isNumeric(trigger) && seq.type==="stepped"){return;}
					_on(once);
					break;
				case "off":
					_off();
					if(once || (d.tweenRunning && seq.dir)){
						_on(true);
					}
					break;
			}
			
			/* starts sequence */
			function _on(once){
				if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
				var c=seq.type!=="stepped", /* continuous scrolling */
					t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
					m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
					contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
					ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
					amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
					px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
					to=seq.scrollAmount!=="auto" ? px : amount,
					easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
					onComplete=!once ? false : true;
				if(once && t<17){
					to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
				}
				_scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
				if(once){
					seq.dir=false;
					return;
				}
				clearTimeout(seq.step);
				seq.step=setTimeout(function(){
					_on();
				},t);
			}
			/* stops sequence */
			function _off(){
				clearTimeout(seq.step);
				_delete(seq,"step");
				_stop(el);
			}
		},
		/* -------------------- */
		
		
		/* returns a yx array from value */
		_arr=function(val){
			var o=$(this).data(pluginPfx).opt,vals=[];
			if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
			/* check if value is object or array, its length and create an array with yx values */
			if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
				vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
				vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
			}else{ /* array value (e.g. [100,100]) */
				vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
			}
			/* check if array values are anonymous functions */
			if(typeof vals[0]==="function"){vals[0]=vals[0]();}
			if(typeof vals[1]==="function"){vals[1]=vals[1]();}
			return vals;
		},
		/* -------------------- */
		
		
		/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
		_to=function(val,dir){
			if(val==null || typeof val=="undefined"){return;}
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				t=typeof val;
			if(!dir){dir=o.axis==="x" ? "x" : "y";}
			var contentLength=dir==="x" ? mCSB_container.outerWidth(false)-wrapper.width() : mCSB_container.outerHeight(false)-wrapper.height(),
				contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
				cssProp=dir==="x" ? "left" : "top";
			switch(t){
				case "function": /* this currently is not used. Consider removing it */
					return val();
					break;
				case "object": /* js/jquery object */
					var obj=val.jquery ? val : $(val);
					if(!obj.length){return;}
					return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
					break;
				case "string": case "number":
					if(_isNumeric(val)){ /* numeric value */
						return Math.abs(val);
					}else if(val.indexOf("%")!==-1){ /* percentage value */
						return Math.abs(contentLength*parseInt(val)/100);
					}else if(val.indexOf("-=")!==-1){ /* decrease value */
						return Math.abs(contentPos-parseInt(val.split("-=")[1]));
					}else if(val.indexOf("+=")!==-1){ /* inrease value */
						var p=(contentPos+parseInt(val.split("+=")[1]));
						return p>=0 ? 0 : Math.abs(p);
					}else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
						return Math.abs(val.split("px")[0]);
					}else{
						if(val==="top" || val==="left"){ /* special strings */
							return 0;
						}else if(val==="bottom"){
							return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
						}else if(val==="right"){
							return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
						}else if(val==="first" || val==="last"){
							var obj=mCSB_container.find(":"+val);
							return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
						}else{
							if($(val).length){ /* jquery selector */
								return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
							}else{ /* other values (e.g. "100em") */
								mCSB_container.css(cssProp,val);
								methods.update.call(null,$this[0]);
								return;
							}
						}
					}
					break;
			}
		},
		/* -------------------- */
		
		
		/* calls the update method automatically */
		_autoUpdate=function(rem){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(rem){
				/* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
				clearTimeout(mCSB_container[0].autoUpdate);
				_delete(mCSB_container[0],"autoUpdate");
				return;
			}
			upd();
			function upd(){
				clearTimeout(mCSB_container[0].autoUpdate);
				if($this.parents("html").length===0){
					/* check element in dom tree */
					$this=null;
					return;
				}
				mCSB_container[0].autoUpdate=setTimeout(function(){
					/* update on specific selector(s) length and size change */
					if(o.advanced.updateOnSelectorChange){
						d.poll.change.n=sizesSum();
						if(d.poll.change.n!==d.poll.change.o){
							d.poll.change.o=d.poll.change.n;
							doUpd(3);
							return;
						}
					}
					/* update on main element and scrollbar size changes */
					if(o.advanced.updateOnContentResize){
						d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
						if(d.poll.size.n!==d.poll.size.o){
							d.poll.size.o=d.poll.size.n;
							doUpd(1);
							return;
						}
					}
					/* update on image load */
					if(o.advanced.updateOnImageLoad){
						if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
							d.poll.img.n=mCSB_container.find("img").length;
							if(d.poll.img.n!==d.poll.img.o){
								d.poll.img.o=d.poll.img.n;
								mCSB_container.find("img").each(function(){
									imgLoader(this);
								});
								return;
							}
						}
					}
					if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
				},o.advanced.autoUpdateTimeout);
			}
			/* a tiny image loader */
			function imgLoader(el){
				if($(el).hasClass(classes[2])){doUpd(); return;}
				var img=new Image();
				function createDelegate(contextObject,delegateMethod){
					return function(){return delegateMethod.apply(contextObject,arguments);}
				}
				function imgOnLoad(){
					this.onload=null;
					$(el).addClass(classes[2]);
					doUpd(2);
				}
				img.onload=createDelegate(img,imgOnLoad);
				img.src=el.src;
			}
			/* returns the total height and width sum of all elements matching the selector */
			function sizesSum(){
				if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
				var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
				if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
				return total;
			}
			/* calls the update method */
			function doUpd(cb){
				clearTimeout(mCSB_container[0].autoUpdate);
				methods.update.call(null,$this[0],cb);
			}
		},
		/* -------------------- */
		
		
		/* snaps scrolling to a multiple of a pixels number */
		_snapAmount=function(to,amount,offset){
			return (Math.round(to/amount)*amount-offset); 
		},
		/* -------------------- */
		
		
		/* stops content and scrollbar animations */
		_stop=function(el){
			var d=el.data(pluginPfx),
				sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
			sel.each(function(){
				_stopTween.call(this);
			});
		},
		/* -------------------- */
		
		
		/* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
		_scrollTo=function(el,to,options){
			var d=el.data(pluginPfx),o=d.opt,
				defaults={
					trigger:"internal",
					dir:"y",
					scrollEasing:"mcsEaseOut",
					drag:false,
					dur:o.scrollInertia,
					overwrite:"all",
					callbacks:true,
					onStart:true,
					onUpdate:true,
					onComplete:true
				},
				options=$.extend(defaults,options),
				dur=[options.dur,(options.drag ? 0 : options.dur)],
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
				totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
			d.trigger=options.trigger;
			if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
				$(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
				wrapper.scrollTop(0).scrollLeft(0);
			}
			if(to==="_resetY" && !d.contentReset.y){
				/* callbacks: onOverflowYNone */
				if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
				d.contentReset.y=1;
			}
			if(to==="_resetX" && !d.contentReset.x){
				/* callbacks: onOverflowXNone */
				if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
				d.contentReset.x=1;
			}
			if(to==="_resetY" || to==="_resetX"){return;}
			if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
				/* callbacks: onOverflowY */
				if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
				d.contentReset.x=null;
			}
			if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
				/* callbacks: onOverflowX */
				if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
				d.contentReset.x=null;
			}
			if(o.snapAmount){ /* scrolling snapping */
				var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
				to=_snapAmount(to,snapAmount,o.snapOffset);
			}
			switch(options.dir){
				case "x":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
						property="left",
						contentPos=mCSB_container[0].offsetLeft,
						limit=[
							mCustomScrollBox.width()-mCSB_container.outerWidth(false),
							mCSB_dragger.parent().width()-mCSB_dragger.width()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
						tso=totalScrollOffsets[1],
						tsbo=totalScrollBackOffsets[1],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
					break;
				case "y":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
						property="top",
						contentPos=mCSB_container[0].offsetTop,
						limit=[
							mCustomScrollBox.height()-mCSB_container.outerHeight(false),
							mCSB_dragger.parent().height()-mCSB_dragger.height()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
						tso=totalScrollOffsets[0],
						tsbo=totalScrollBackOffsets[0],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
					break;
			}
			if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
				scrollTo=[0,0];
			}else if(scrollTo[1]>=limit[1]){
				scrollTo=[limit[0],limit[1]];
			}else{
				scrollTo[0]=-scrollTo[0];
			}
			if(!el[0].mcs){
				_mcs();  /* init mcs object (once) to make it available before callbacks */
				if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
			}
			clearTimeout(mCSB_container[0].onCompleteTimeout);
			_tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
			if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
			_tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
				onStart:function(){
					if(options.callbacks && options.onStart && !d.tweenRunning){
						/* callbacks: onScrollStart */
						if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
						d.tweenRunning=true;
						_onDragClasses(mCSB_dragger);
						d.cbOffsets=_cbOffsets();
					}
				},onUpdate:function(){
					if(options.callbacks && options.onUpdate){
						/* callbacks: whileScrolling */
						if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
					}
				},onComplete:function(){
					if(options.callbacks && options.onComplete){
						if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
						var t=mCSB_container[0].idleTimer || 0;
						mCSB_container[0].onCompleteTimeout=setTimeout(function(){
							/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
							if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
							if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
							if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
							d.tweenRunning=false;
							mCSB_container[0].idleTimer=0;
							_onDragClasses(mCSB_dragger,"hide");
						},t);
					}
				}
			});
			/* checks if callback function exists */
			function _cb(cb){
				return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
			}
			/* checks whether callback offsets always trigger */
			function _cbOffsets(){
				return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
			}
			/* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
			function _mcs(){
				var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
					dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
					cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
					pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
				el[0].mcs={
					content:mCSB_container, /* original content wrapper as jquery object */
					top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
					topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
					direction:options.dir
				};
				/* 
				this refers to the original element containing the scrollbar(s)
				usage: this.mcs.top, this.mcs.leftPct etc. 
				*/
			}
		},
		/* -------------------- */
		
		
		/* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
		_tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
				startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			tobj.stop=0;
			if(overwrite!=="none"){_cancelTween();}
			_startTween();
			function _step(){
				if(tobj.stop){return;}
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=tobj.time){
					tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
					if(tobj.time<progress+1){tobj.time=progress+1;}
				}
				if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
					elStyle[prop]=Math.round(tobj.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				tobj.time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				tobj.id=_request(_step);
			}
			function _cancelTween(){
				if(tobj.id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(tobj.id);
				}else{window.cancelAnimationFrame(tobj.id);}
				tobj.id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear": case "mcsLinear":
						return c*t/d + b;
						break;
					case "mcsLinearOut":
						t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeInOutSmooth":
						t/=d/2;
						if(t<1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeInOutStrong":
						t/=d/2;
						if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
						t--;
						return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
						break;
					case "easeInOut": case "mcsEaseInOut":
						t/=d/2;
						if(t<1) return c/2*t*t*t + b;
						t-=2;
						return c/2*(t*t*t + 2) + b;
						break;
					case "easeOutSmooth":
						t/=d; t--;
						return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutStrong":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "easeOut": case "mcsEaseOut": default:
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
			}
		},
		/* -------------------- */
		
		
		/* returns current time */
		_getTime=function(){
			if(window.performance && window.performance.now){
				return window.performance.now();
			}else{
				if(window.performance && window.performance.webkitNow){
					return window.performance.webkitNow();
				}else{
					if(Date.now){return Date.now();}else{return new Date().getTime();}
				}
			}
		},
		/* -------------------- */
		
		
		/* stops a tween */
		_stopTween=function(){
			var el=this;
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var props=["top","left"];
			for(var i=0; i<props.length; i++){
				var prop=props[i];
				if(el._mTween[prop].id){
					if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
					}else{window.cancelAnimationFrame(el._mTween[prop].id);}
					el._mTween[prop].id=null;
					el._mTween[prop].stop=1;
				}
			}
		},
		/* -------------------- */
		
		
		/* deletes a property (avoiding the exception thrown by IE) */
		_delete=function(c,m){
			try{delete c[m];}catch(e){c[m]=null;}
		},
		/* -------------------- */
		
		
		/* detects left mouse button */
		_mouseBtnLeft=function(e){
			return !(e.which && e.which!==1);
		},
		/* -------------------- */
		
		
		/* detects if pointer type event is touch */
		_pointerTouch=function(e){
			var t=e.originalEvent.pointerType;
			return !(t && t!=="touch" && t!==2);
		},
		/* -------------------- */
		
		
		/* checks if value is numeric */
		_isNumeric=function(val){
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		/* -------------------- */
		
		
		/* returns element position according to content */
		_childPos=function(el){
			var p=el.parents(".mCSB_container");
			return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
		},
		/* -------------------- */
		
		
		/* checks if browser tab is hidden/inactive via Page Visibility API */
		_isTabHidden=function(){
			var prop=_getHiddenProp();
			if(!prop) return false;
			return document[prop];
			function _getHiddenProp(){
				var pfx=["webkit","moz","ms","o"];
				if("hidden" in document) return "hidden"; //natively supported
				for(var i=0; i<pfx.length; i++){ //prefixed
				    if((pfx[i]+"Hidden") in document) 
				        return pfx[i]+"Hidden";
				}
				return null; //not supported
			}
		};
		/* -------------------- */
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).bind("load",function(){
		
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
		
		/* extend jQuery expressions */
		$.extend($.expr[":"],{
			/* checks if element is within scrollable viewport */
			mcsInView:$.expr[":"].mcsInView || function(el){
				var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
				if(!content.length){return;}
				wrapper=content.parent();
				cPos=[content[0].offsetTop,content[0].offsetLeft];
				return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) && 
						cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
			},
			/* checks if element or part of element is in view of scrollable viewport */
			mcsInSight:$.expr[":"].mcsInSight || function(el,i,m){
				var $el=$(el),elD,content=$el.parents(".mCSB_container"),wrapperView,pos,wrapperViewPct,
					pctVals=m[3]==="exact" ? [[1,0],[1,0]] : [[0.9,0.1],[0.6,0.4]];
				if(!content.length){return;}
				elD=[$el.outerHeight(false),$el.outerWidth(false)];
				pos=[content[0].offsetTop+_childPos($el)[0],content[0].offsetLeft+_childPos($el)[1]];
				wrapperView=[content.parent()[0].offsetHeight,content.parent()[0].offsetWidth];
				wrapperViewPct=[elD[0]<wrapperView[0] ? pctVals[0] : pctVals[1],elD[1]<wrapperView[1] ? pctVals[0] : pctVals[1]];
				return 	pos[0]-(wrapperView[0]*wrapperViewPct[0][0])<0 && pos[0]+elD[0]-(wrapperView[0]*wrapperViewPct[0][1])>=0 && 
						pos[1]-(wrapperView[1]*wrapperViewPct[1][0])<0 && pos[1]+elD[1]-(wrapperView[1]*wrapperViewPct[1][1])>=0;
			},
			/* checks if element is overflowed having visible scrollbar(s) */
			mcsOverflow:$.expr[":"].mcsOverflow || function(el){
				var d=$(el).data(pluginPfx);
				if(!d){return;}
				return d.overflowed[0] || d.overflowed[1];
			}
		});
	
	});

}))}));
/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b})},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++)if(j[a]&&C[a]===p(a))return;g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];);return a}function r(a){for(;--a>=0&&!j[a];);return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++)if(j[c]){if(!(n>d&&j[c].test(C[d])))break;C[c]=C[d],C[d]=p(d),d=q(d)}z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++)if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e)))break;c=e}}function u(){var a=B.val(),b=B.caret();if(o&&o.length&&o.length>a.length){for(A(!0);b.begin>0&&!j[b.begin-1];)b.begin--;if(0===b.begin)for(;b.begin<l&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else B.caret(e);i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++)j[c]&&(C[c]=p(c))}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++)if(j[b]){for(C[b]=p(b);d++<e.length;)if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break}if(d>e.length){y(b+1,n);break}}else C[b]===e.charAt(d)&&d++,k>b&&(f=b);return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){B.get(0)===document.activeElement&&(z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a))},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});
// Magnific Popup v1.1.0 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=inline+image+ajax+iframe+gallery+retina+imagezoom
(function(a){typeof define=="function"&&define.amd?define(["jquery"],a):typeof exports=="object"?a(require("jquery")):a(window.jQuery||window.Zepto)})(function(a){var b="Close",c="BeforeClose",d="AfterClose",e="BeforeAppend",f="MarkupParse",g="Open",h="Change",i="mfp",j="."+i,k="mfp-ready",l="mfp-removing",m="mfp-prevent-close",n,o=function(){},p=!!window.jQuery,q,r=a(window),s,t,u,v,w=function(a,b){n.ev.on(i+a+j,b)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(b,c){n.ev.triggerHandler(i+b,c),n.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),n.st.callbacks[b]&&n.st.callbacks[b].apply(n,a.isArray(c)?c:[c]))},z=function(b){if(b!==v||!n.currTemplate.closeBtn)n.currTemplate.closeBtn=a(n.st.closeMarkup.replace("%title%",n.st.tClose)),v=b;return n.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(n=new o,n.init(),a.magnificPopup.instance=n)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(a.transition!==undefined)return!0;while(b.length)if(b.pop()+"Transition"in a)return!0;return!1};o.prototype={constructor:o,init:function(){var b=navigator.appVersion;n.isLowIE=n.isIE8=document.all&&!document.addEventListener,n.isAndroid=/android/gi.test(b),n.isIOS=/iphone|ipad|ipod/gi.test(b),n.supportsTransition=B(),n.probablyMobile=n.isAndroid||n.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),s=a(document),n.popupsCache={}},open:function(b){var c;if(b.isObj===!1){n.items=b.items.toArray(),n.index=0;var d=b.items,e;for(c=0;c<d.length;c++){e=d[c],e.parsed&&(e=e.el[0]);if(e===b.el[0]){n.index=c;break}}}else n.items=a.isArray(b.items)?b.items:[b.items],n.index=b.index||0;if(n.isOpen){n.updateItemHTML();return}n.types=[],u="",b.mainEl&&b.mainEl.length?n.ev=b.mainEl.eq(0):n.ev=s,b.key?(n.popupsCache[b.key]||(n.popupsCache[b.key]={}),n.currTemplate=n.popupsCache[b.key]):n.currTemplate={},n.st=a.extend(!0,{},a.magnificPopup.defaults,b),n.fixedContentPos=n.st.fixedContentPos==="auto"?!n.probablyMobile:n.st.fixedContentPos,n.st.modal&&(n.st.closeOnContentClick=!1,n.st.closeOnBgClick=!1,n.st.showCloseBtn=!1,n.st.enableEscapeKey=!1),n.bgOverlay||(n.bgOverlay=x("bg").on("click"+j,function(){n.close()}),n.wrap=x("wrap").attr("tabindex",-1).on("click"+j,function(a){n._checkIfClose(a.target)&&n.close()}),n.container=x("container",n.wrap)),n.contentContainer=x("content"),n.st.preloader&&(n.preloader=x("preloader",n.container,n.st.tLoading));var h=a.magnificPopup.modules;for(c=0;c<h.length;c++){var i=h[c];i=i.charAt(0).toUpperCase()+i.slice(1),n["init"+i].call(n)}y("BeforeOpen"),n.st.showCloseBtn&&(n.st.closeBtnInside?(w(f,function(a,b,c,d){c.close_replaceWith=z(d.type)}),u+=" mfp-close-btn-in"):n.wrap.append(z())),n.st.alignTop&&(u+=" mfp-align-top"),n.fixedContentPos?n.wrap.css({overflow:n.st.overflowY,overflowX:"hidden",overflowY:n.st.overflowY}):n.wrap.css({top:r.scrollTop(),position:"absolute"}),(n.st.fixedBgPos===!1||n.st.fixedBgPos==="auto"&&!n.fixedContentPos)&&n.bgOverlay.css({height:s.height(),position:"absolute"}),n.st.enableEscapeKey&&s.on("keyup"+j,function(a){a.keyCode===27&&n.close()}),r.on("resize"+j,function(){n.updateSize()}),n.st.closeOnContentClick||(u+=" mfp-auto-cursor"),u&&n.wrap.addClass(u);var l=n.wH=r.height(),m={};if(n.fixedContentPos&&n._hasScrollBar(l)){var o=n._getScrollbarSize();o&&(m.marginRight=o)}n.fixedContentPos&&(n.isIE7?a("body, html").css("overflow","hidden"):m.overflow="hidden");var p=n.st.mainClass;return n.isIE7&&(p+=" mfp-ie7"),p&&n._addClassToMFP(p),n.updateItemHTML(),y("BuildControls"),a("html").css(m),n.bgOverlay.add(n.wrap).prependTo(n.st.prependTo||a(document.body)),n._lastFocusedEl=document.activeElement,setTimeout(function(){n.content?(n._addClassToMFP(k),n._setFocus()):n.bgOverlay.addClass(k),s.on("focusin"+j,n._onFocusIn)},16),n.isOpen=!0,n.updateSize(l),y(g),b},close:function(){if(!n.isOpen)return;y(c),n.isOpen=!1,n.st.removalDelay&&!n.isLowIE&&n.supportsTransition?(n._addClassToMFP(l),setTimeout(function(){n._close()},n.st.removalDelay)):n._close()},_close:function(){y(b);var c=l+" "+k+" ";n.bgOverlay.detach(),n.wrap.detach(),n.container.empty(),n.st.mainClass&&(c+=n.st.mainClass+" "),n._removeClassFromMFP(c);if(n.fixedContentPos){var e={marginRight:""};n.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}s.off("keyup"+j+" focusin"+j),n.ev.off(j),n.wrap.attr("class","mfp-wrap").removeAttr("style"),n.bgOverlay.attr("class","mfp-bg"),n.container.attr("class","mfp-container"),n.st.showCloseBtn&&(!n.st.closeBtnInside||n.currTemplate[n.currItem.type]===!0)&&n.currTemplate.closeBtn&&n.currTemplate.closeBtn.detach(),n.st.autoFocusLast&&n._lastFocusedEl&&a(n._lastFocusedEl).focus(),n.currItem=null,n.content=null,n.currTemplate=null,n.prevHeight=0,y(d)},updateSize:function(a){if(n.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;n.wrap.css("height",c),n.wH=c}else n.wH=a||r.height();n.fixedContentPos||n.wrap.css("height",n.wH),y("Resize")},updateItemHTML:function(){var b=n.items[n.index];n.contentContainer.detach(),n.content&&n.content.detach(),b.parsed||(b=n.parseEl(n.index));var c=b.type;y("BeforeChange",[n.currItem?n.currItem.type:"",c]),n.currItem=b;if(!n.currTemplate[c]){var d=n.st[c]?n.st[c].markup:!1;y("FirstMarkupParse",d),d?n.currTemplate[c]=a(d):n.currTemplate[c]=!0}t&&t!==b.type&&n.container.removeClass("mfp-"+t+"-holder");var e=n["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,n.currTemplate[c]);n.appendContent(e,c),b.preloaded=!0,y(h,b),t=b.type,n.container.prepend(n.contentContainer),y("AfterChange")},appendContent:function(a,b){n.content=a,a?n.st.showCloseBtn&&n.st.closeBtnInside&&n.currTemplate[b]===!0?n.content.find(".mfp-close").length||n.content.append(z()):n.content=a:n.content="",y(e),n.container.addClass("mfp-"+b+"-holder"),n.contentContainer.append(n.content)},parseEl:function(b){var c=n.items[b],d;c.tagName?c={el:a(c)}:(d=c.type,c={data:c,src:c.src});if(c.el){var e=n.types;for(var f=0;f<e.length;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||n.st.type||"inline",c.index=b,c.parsed=!0,n.items[b]=c,y("ElementParse",c),n.items[b]},addGroup:function(a,b){var c=function(c){c.mfpEl=this,n._openClick(c,a,b)};b||(b={});var d="click.magnificPopup";b.mainEl=a,b.items?(b.isObj=!0,a.off(d).on(d,c)):(b.isObj=!1,b.delegate?a.off(d).on(d,b.delegate,c):(b.items=a,a.off(d).on(d,c)))},_openClick:function(b,c,d){var e=d.midClick!==undefined?d.midClick:a.magnificPopup.defaults.midClick;if(!e&&(b.which===2||b.ctrlKey||b.metaKey||b.altKey||b.shiftKey))return;var f=d.disableOn!==undefined?d.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(n))return!0}else if(r.width()<f)return!0;b.type&&(b.preventDefault(),n.isOpen&&b.stopPropagation()),d.el=a(b.mfpEl),d.delegate&&(d.items=c.find(d.delegate)),n.open(d)},updateStatus:function(a,b){if(n.preloader){q!==a&&n.container.removeClass("mfp-s-"+q),!b&&a==="loading"&&(b=n.st.tLoading);var c={status:a,text:b};y("UpdateStatus",c),a=c.status,b=c.text,n.preloader.html(b),n.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),n.container.addClass("mfp-s-"+a),q=a}},_checkIfClose:function(b){if(a(b).hasClass(m))return;var c=n.st.closeOnContentClick,d=n.st.closeOnBgClick;if(c&&d)return!0;if(!n.content||a(b).hasClass("mfp-close")||n.preloader&&b===n.preloader[0])return!0;if(b!==n.content[0]&&!a.contains(n.content[0],b)){if(d&&a.contains(document,b))return!0}else if(c)return!0;return!1},_addClassToMFP:function(a){n.bgOverlay.addClass(a),n.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),n.wrap.removeClass(a)},_hasScrollBar:function(a){return(n.isIE7?s.height():document.body.scrollHeight)>(a||r.height())},_setFocus:function(){(n.st.focus?n.content.find(n.st.focus).eq(0):n.wrap).focus()},_onFocusIn:function(b){if(b.target!==n.wrap[0]&&!a.contains(n.wrap[0],b.target))return n._setFocus(),!1},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(f,[b,c,d]),a.each(c,function(c,d){if(d===undefined||d===!1)return!0;e=c.split("_");if(e.length>1){var f=b.find(j+"-"+e[0]);if(f.length>0){var g=e[1];g==="replaceWith"?f[0]!==d[0]&&f.replaceWith(d):g==="img"?f.is("img")?f.attr("src",d):f.replaceWith(a("<img>").attr("src",d).attr("class",f.attr("class"))):f.attr(e[1],d)}}else b.find(j+"-"+c).html(d)})},_getScrollbarSize:function(){if(n.scrollbarSize===undefined){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),n.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return n.scrollbarSize}},a.magnificPopup={instance:null,proto:o.prototype,modules:[],open:function(b,c){return A(),b?b=a.extend(!0,{},b):b={},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},a.fn.magnificPopup=function(b){A();var c=a(this);if(typeof b=="string")if(b==="open"){var d,e=p?c.data("magnificPopup"):c[0].magnificPopup,f=parseInt(arguments[1],10)||0;e.items?d=e.items[f]:(d=c,e.delegate&&(d=d.find(e.delegate)),d=d.eq(f)),n._openClick({mfpEl:d},c,e)}else n.isOpen&&n[b].apply(n,Array.prototype.slice.call(arguments,1));else b=a.extend(!0,{},b),p?c.data("magnificPopup",b):c[0].magnificPopup=b,n.addGroup(c,b);return c};var C="inline",D,E,F,G=function(){F&&(E.after(F.addClass(D)).detach(),F=null)};a.magnificPopup.registerModule(C,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){n.types.push(C),w(b+"."+C,function(){G()})},getInline:function(b,c){G();if(b.src){var d=n.st.inline,e=a(b.src);if(e.length){var f=e[0].parentNode;f&&f.tagName&&(E||(D=d.hiddenClass,E=x(D),D="mfp-"+D),F=e.after(E).detach().removeClass(D)),n.updateStatus("ready")}else n.updateStatus("error",d.tNotFound),e=a("<div>");return b.inlineElement=e,e}return n.updateStatus("ready"),n._parseMarkup(c,{},b),c}}});var H="ajax",I,J=function(){I&&a(document.body).removeClass(I)},K=function(){J(),n.req&&n.req.abort()};a.magnificPopup.registerModule(H,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){n.types.push(H),I=n.st.ajax.cursor,w(b+"."+H,K),w("BeforeChange."+H,K)},getAjax:function(b){I&&a(document.body).addClass(I),n.updateStatus("loading");var c=a.extend({url:b.src,success:function(c,d,e){var f={data:c,xhr:e};y("ParseAjax",f),n.appendContent(a(f.data),H),b.finished=!0,J(),n._setFocus(),setTimeout(function(){n.wrap.addClass(k)},16),n.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),b.finished=b.loadError=!0,n.updateStatus("error",n.st.ajax.tError.replace("%url%",b.src))}},n.st.ajax.settings);return n.req=a.ajax(c),""}}});var L,M=function(b){if(b.data&&b.data.title!==undefined)return b.data.title;var c=n.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(n,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=n.st.image,d=".image";n.types.push("image"),w(g+d,function(){n.currItem.type==="image"&&c.cursor&&a(document.body).addClass(c.cursor)}),w(b+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),r.off("resize"+j)}),w("Resize"+d,n.resizeImage),n.isLowIE&&w("AfterChange",n.resizeImage)},resizeImage:function(){var a=n.currItem;if(!a||!a.img)return;if(n.st.image.verticalFit){var b=0;n.isLowIE&&(b=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",n.wH-b)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(n.content&&n.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){L&&clearInterval(L),L=setInterval(function(){if(c.naturalWidth>0){n._onImageHasSize(a);return}b>200&&clearInterval(L),b++,b===3?d(10):b===40?d(50):b===100&&d(500)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("ready")),b.hasSize=!0,b.loaded=!0,y("ImageLoadComplete")):(d++,d<200?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=n.st.image,h=c.find(".mfp-img");if(h.length){var i=document.createElement("img");i.className="mfp-img",b.el&&b.el.find("img").length&&(i.alt=b.el.find("img").attr("alt")),b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone()),i=b.img[0],i.naturalWidth>0?b.hasSize=!0:i.width||(b.hasSize=!1)}return n._parseMarkup(c,{title:M(b),img_replaceWith:b.img},b),n.resizeImage(),b.hasSize?(L&&clearInterval(L),b.loadError?(c.addClass("mfp-loading"),n.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),n.updateStatus("ready")),c):(n.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),n.findImageSize(b)),c)}}});var N,O=function(){return N===undefined&&(N=document.createElement("p").style.MozTransform!==undefined),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a=n.st.zoom,d=".zoom",e;if(!a.enabled||!n.supportsTransition)return;var f=a.duration,g=function(b){var c=b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+a.duration/1e3+"s "+a.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,c.css(e),c},h=function(){n.content.css("visibility","visible")},i,j;w("BuildControls"+d,function(){if(n._allowZoom()){clearTimeout(i),n.content.css("visibility","hidden"),e=n._getItemToZoom();if(!e){h();return}j=g(e),j.css(n._getOffset()),n.wrap.append(j),i=setTimeout(function(){j.css(n._getOffset(!0)),i=setTimeout(function(){h(),setTimeout(function(){j.remove(),e=j=null,y("ZoomAnimationEnded")},16)},f)},16)}}),w(c+d,function(){if(n._allowZoom()){clearTimeout(i),n.st.removalDelay=f;if(!e){e=n._getItemToZoom();if(!e)return;j=g(e)}j.css(n._getOffset(!0)),n.wrap.append(j),n.content.css("visibility","hidden"),setTimeout(function(){j.css(n._getOffset())},16)}}),w(b+d,function(){n._allowZoom()&&(h(),j&&j.remove(),e=null)})},_allowZoom:function(){return n.currItem.type==="image"},_getItemToZoom:function(){return n.currItem.hasSize?n.currItem.img:!1},_getOffset:function(b){var c;b?c=n.currItem.img:c=n.st.zoom.opener(n.currItem.el||n.currItem);var d=c.offset(),e=parseInt(c.css("padding-top"),10),f=parseInt(c.css("padding-bottom"),10);d.top-=a(window).scrollTop()-e;var g={width:c.width(),height:(p?c.innerHeight():c[0].offsetHeight)-f-e};return O()?g["-moz-transform"]=g.transform="translate("+d.left+"px,"+d.top+"px)":(g.left=d.left,g.top=d.top),g}}});var P="iframe",Q="//about:blank",R=function(a){if(n.currTemplate[P]){var b=n.currTemplate[P].find("iframe");b.length&&(a||(b[0].src=Q),n.isIE8&&b.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){n.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(b+"."+P,function(){R()})},getIframe:function(b,c){var d=b.src,e=n.st.iframe;a.each(e.patterns,function(){if(d.indexOf(this.index)>-1)return this.id&&(typeof this.id=="string"?d=d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):d=this.id.call(this,d)),d=this.src.replace("%id%",d),!1});var f={};return e.srcAction&&(f[e.srcAction]=d),n._parseMarkup(c,f,b),n.updateStatus("ready"),c}}});var S=function(a){var b=n.items.length;return a>b-1?a-b:a<0?b+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=n.st.gallery,d=".mfp-gallery";n.direction=!0;if(!c||!c.enabled)return!1;u+=" mfp-gallery",w(g+d,function(){c.navigateByImgClick&&n.wrap.on("click"+d,".mfp-img",function(){if(n.items.length>1)return n.next(),!1}),s.on("keydown"+d,function(a){a.keyCode===37?n.prev():a.keyCode===39&&n.next()})}),w("UpdateStatus"+d,function(a,b){b.text&&(b.text=T(b.text,n.currItem.index,n.items.length))}),w(f+d,function(a,b,d,e){var f=n.items.length;d.counter=f>1?T(c.tCounter,e.index,f):""}),w("BuildControls"+d,function(){if(n.items.length>1&&c.arrows&&!n.arrowLeft){var b=c.arrowMarkup,d=n.arrowLeft=a(b.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(m),e=n.arrowRight=a(b.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(m);d.click(function(){n.prev()}),e.click(function(){n.next()}),n.container.append(d.add(e))}}),w(h+d,function(){n._preloadTimeout&&clearTimeout(n._preloadTimeout),n._preloadTimeout=setTimeout(function(){n.preloadNearbyImages(),n._preloadTimeout=null},16)}),w(b+d,function(){s.off(d),n.wrap.off("click"+d),n.arrowRight=n.arrowLeft=null})},next:function(){n.direction=!0,n.index=S(n.index+1),n.updateItemHTML()},prev:function(){n.direction=!1,n.index=S(n.index-1),n.updateItemHTML()},goTo:function(a){n.direction=a>=n.index,n.index=a,n.updateItemHTML()},preloadNearbyImages:function(){var a=n.st.gallery.preload,b=Math.min(a[0],n.items.length),c=Math.min(a[1],n.items.length),d;for(d=1;d<=(n.direction?c:b);d++)n._preloadItem(n.index+d);for(d=1;d<=(n.direction?b:c);d++)n._preloadItem(n.index-d)},_preloadItem:function(b){b=S(b);if(n.items[b].preloaded)return;var c=n.items[b];c.parsed||(c=n.parseEl(b)),y("LazyLoad",c),c.type==="image"&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0,y("LazyLoadError",c)}).attr("src",c.src)),c.preloaded=!0}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=n.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(w("ImageHasSize."+U,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),w("ElementParse."+U,function(c,d){d.src=a.replaceSrc(d,b)}))}}}}),A()})
!function(t,e,i){!function(){var s,a,n,h="2.2.3",o="datepicker",r=".datepicker-here",c=!1,d='<div class="datepicker"><i class="datepicker--pointer"></i><nav class="datepicker--nav"></nav><div class="datepicker--content"></div></div>',l={classes:"",inline:!1,language:"ru",startDate:new Date,firstDay:"",weekends:[6,0],dateFormat:"",altField:"",altFieldDateFormat:"@",toggleSelected:!0,keyboardNav:!0,position:"bottom left",offset:12,view:"days",minView:"days",showOtherMonths:!0,selectOtherMonths:!0,moveToOtherMonthsOnSelect:!0,showOtherYears:!0,selectOtherYears:!0,moveToOtherYearsOnSelect:!0,minDate:"",maxDate:"",disableNavWhenOutOfRange:!0,multipleDates:!1,multipleDatesSeparator:",",range:!1,todayButton:!1,clearButton:!1,showEvent:"focus",autoClose:!1,monthsField:"monthsShort",prevHtml:'<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',nextHtml:'<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',navTitles:{days:"MM, <i>yyyy</i>",months:"yyyy",years:"yyyy1 - yyyy2"},timepicker:!1,onlyTimepicker:!1,dateTimeSeparator:" ",timeFormat:"",minHours:0,maxHours:24,minMinutes:0,maxMinutes:59,hoursStep:1,minutesStep:1,onSelect:"",onShow:"",onHide:"",onChangeMonth:"",onChangeYear:"",onChangeDecade:"",onChangeView:"",onRenderCell:""},u={ctrlRight:[17,39],ctrlUp:[17,38],ctrlLeft:[17,37],ctrlDown:[17,40],shiftRight:[16,39],shiftUp:[16,38],shiftLeft:[16,37],shiftDown:[16,40],altUp:[18,38],altRight:[18,39],altLeft:[18,37],altDown:[18,40],ctrlShiftUp:[16,17,38]},m=function(t,a){this.el=t,this.$el=e(t),this.opts=e.extend(!0,{},l,a,this.$el.data()),s==i&&(s=e("body")),this.opts.startDate||(this.opts.startDate=new Date),"INPUT"==this.el.nodeName&&(this.elIsInput=!0),this.opts.altField&&(this.$altField="string"==typeof this.opts.altField?e(this.opts.altField):this.opts.altField),this.inited=!1,this.visible=!1,this.silent=!1,this.currentDate=this.opts.startDate,this.currentView=this.opts.view,this._createShortCuts(),this.selectedDates=[],this.views={},this.keys=[],this.minRange="",this.maxRange="",this._prevOnSelectValue="",this.init()};n=m,n.prototype={VERSION:h,viewIndexes:["days","months","years"],init:function(){c||this.opts.inline||!this.elIsInput||this._buildDatepickersContainer(),this._buildBaseHtml(),this._defineLocale(this.opts.language),this._syncWithMinMaxDates(),this.elIsInput&&(this.opts.inline||(this._setPositionClasses(this.opts.position),this._bindEvents()),this.opts.keyboardNav&&!this.opts.onlyTimepicker&&this._bindKeyboardEvents(),this.$datepicker.on("mousedown",this._onMouseDownDatepicker.bind(this)),this.$datepicker.on("mouseup",this._onMouseUpDatepicker.bind(this))),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.timepicker&&(this.timepicker=new e.fn.datepicker.Timepicker(this,this.opts),this._bindTimepickerEvents()),this.opts.onlyTimepicker&&this.$datepicker.addClass("-only-timepicker-"),this.views[this.currentView]=new e.fn.datepicker.Body(this,this.currentView,this.opts),this.views[this.currentView].show(),this.nav=new e.fn.datepicker.Navigation(this,this.opts),this.view=this.currentView,this.$el.on("clickCell.adp",this._onClickCell.bind(this)),this.$datepicker.on("mouseenter",".datepicker--cell",this._onMouseEnterCell.bind(this)),this.$datepicker.on("mouseleave",".datepicker--cell",this._onMouseLeaveCell.bind(this)),this.inited=!0},_createShortCuts:function(){this.minDate=this.opts.minDate?this.opts.minDate:new Date(-86399999136e5),this.maxDate=this.opts.maxDate?this.opts.maxDate:new Date(86399999136e5)},_bindEvents:function(){this.$el.on(this.opts.showEvent+".adp",this._onShowEvent.bind(this)),this.$el.on("mouseup.adp",this._onMouseUpEl.bind(this)),this.$el.on("blur.adp",this._onBlur.bind(this)),this.$el.on("keyup.adp",this._onKeyUpGeneral.bind(this)),e(t).on("resize.adp",this._onResize.bind(this)),e("body").on("mouseup.adp",this._onMouseUpBody.bind(this))},_bindKeyboardEvents:function(){this.$el.on("keydown.adp",this._onKeyDown.bind(this)),this.$el.on("keyup.adp",this._onKeyUp.bind(this)),this.$el.on("hotKey.adp",this._onHotKey.bind(this))},_bindTimepickerEvents:function(){this.$el.on("timeChange.adp",this._onTimeChange.bind(this))},isWeekend:function(t){return-1!==this.opts.weekends.indexOf(t)},_defineLocale:function(t){"string"==typeof t?(this.loc=e.fn.datepicker.language[t],this.loc||(console.warn("Can't find language \""+t+'" in Datepicker.language, will use "ru" instead'),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru)),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,e.fn.datepicker.language[t])):this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,t),this.opts.dateFormat&&(this.loc.dateFormat=this.opts.dateFormat),this.opts.timeFormat&&(this.loc.timeFormat=this.opts.timeFormat),""!==this.opts.firstDay&&(this.loc.firstDay=this.opts.firstDay),this.opts.timepicker&&(this.loc.dateFormat=[this.loc.dateFormat,this.loc.timeFormat].join(this.opts.dateTimeSeparator)),this.opts.onlyTimepicker&&(this.loc.dateFormat=this.loc.timeFormat);var i=this._getWordBoundaryRegExp;(this.loc.timeFormat.match(i("aa"))||this.loc.timeFormat.match(i("AA")))&&(this.ampm=!0)},_buildDatepickersContainer:function(){c=!0,s.append('<div class="datepickers-container" id="datepickers-container"></div>'),a=e("#datepickers-container")},_buildBaseHtml:function(){var t,i=e('<div class="datepicker-inline">');t="INPUT"==this.el.nodeName?this.opts.inline?i.insertAfter(this.$el):a:i.appendTo(this.$el),this.$datepicker=e(d).appendTo(t),this.$content=e(".datepicker--content",this.$datepicker),this.$nav=e(".datepicker--nav",this.$datepicker)},_triggerOnChange:function(){if(!this.selectedDates.length){if(""===this._prevOnSelectValue)return;return this._prevOnSelectValue="",this.opts.onSelect("","",this)}var t,e=this.selectedDates,i=n.getParsedDate(e[0]),s=this,a=new Date(i.year,i.month,i.date,i.hours,i.minutes);t=e.map(function(t){return s.formatDate(s.loc.dateFormat,t)}).join(this.opts.multipleDatesSeparator),(this.opts.multipleDates||this.opts.range)&&(a=e.map(function(t){var e=n.getParsedDate(t);return new Date(e.year,e.month,e.date,e.hours,e.minutes)})),this._prevOnSelectValue=t,this.opts.onSelect(t,a,this)},next:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month+1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year+1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year+10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},prev:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month-1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year-1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year-10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},formatDate:function(t,e){e=e||this.date;var i,s=t,a=this._getWordBoundaryRegExp,h=this.loc,o=n.getLeadingZeroNum,r=n.getDecade(e),c=n.getParsedDate(e),d=c.fullHours,l=c.hours,u=t.match(a("aa"))||t.match(a("AA")),m="am",p=this._replacer;switch(this.opts.timepicker&&this.timepicker&&u&&(i=this.timepicker._getValidHoursFromDate(e,u),d=o(i.hours),l=i.hours,m=i.dayPeriod),!0){case/@/.test(s):s=s.replace(/@/,e.getTime());case/aa/.test(s):s=p(s,a("aa"),m);case/AA/.test(s):s=p(s,a("AA"),m.toUpperCase());case/dd/.test(s):s=p(s,a("dd"),c.fullDate);case/d/.test(s):s=p(s,a("d"),c.date);case/DD/.test(s):s=p(s,a("DD"),h.days[c.day]);case/D/.test(s):s=p(s,a("D"),h.daysShort[c.day]);case/mm/.test(s):s=p(s,a("mm"),c.fullMonth);case/m/.test(s):s=p(s,a("m"),c.month+1);case/MM/.test(s):s=p(s,a("MM"),this.loc.months[c.month]);case/M/.test(s):s=p(s,a("M"),h.monthsShort[c.month]);case/ii/.test(s):s=p(s,a("ii"),c.fullMinutes);case/i/.test(s):s=p(s,a("i"),c.minutes);case/hh/.test(s):s=p(s,a("hh"),d);case/h/.test(s):s=p(s,a("h"),l);case/yyyy/.test(s):s=p(s,a("yyyy"),c.year);case/yyyy1/.test(s):s=p(s,a("yyyy1"),r[0]);case/yyyy2/.test(s):s=p(s,a("yyyy2"),r[1]);case/yy/.test(s):s=p(s,a("yy"),c.year.toString().slice(-2))}return s},_replacer:function(t,e,i){return t.replace(e,function(t,e,s,a){return e+i+a})},_getWordBoundaryRegExp:function(t){var e="\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;";return new RegExp("(^|>|"+e+")("+t+")($|<|"+e+")","g")},selectDate:function(t){var e=this,i=e.opts,s=e.parsedDate,a=e.selectedDates,h=a.length,o="";if(Array.isArray(t))return void t.forEach(function(t){e.selectDate(t)});if(t instanceof Date){if(this.lastSelectedDate=t,this.timepicker&&this.timepicker._setTime(t),e._trigger("selectDate",t),this.timepicker&&(t.setHours(this.timepicker.hours),t.setMinutes(this.timepicker.minutes)),"days"==e.view&&t.getMonth()!=s.month&&i.moveToOtherMonthsOnSelect&&(o=new Date(t.getFullYear(),t.getMonth(),1)),"years"==e.view&&t.getFullYear()!=s.year&&i.moveToOtherYearsOnSelect&&(o=new Date(t.getFullYear(),0,1)),o&&(e.silent=!0,e.date=o,e.silent=!1,e.nav._render()),i.multipleDates&&!i.range){if(h===i.multipleDates)return;e._isSelected(t)||e.selectedDates.push(t)}else i.range?2==h?(e.selectedDates=[t],e.minRange=t,e.maxRange=""):1==h?(e.selectedDates.push(t),e.maxRange?e.minRange=t:e.maxRange=t,n.bigger(e.maxRange,e.minRange)&&(e.maxRange=e.minRange,e.minRange=t),e.selectedDates=[e.minRange,e.maxRange]):(e.selectedDates=[t],e.minRange=t):e.selectedDates=[t];e._setInputValue(),i.onSelect&&e._triggerOnChange(),i.autoClose&&!this.timepickerIsActive&&(i.multipleDates||i.range?i.range&&2==e.selectedDates.length&&e.hide():e.hide()),e.views[this.currentView]._render()}},removeDate:function(t){var e=this.selectedDates,i=this;if(t instanceof Date)return e.some(function(s,a){return n.isSame(s,t)?(e.splice(a,1),i.selectedDates.length?i.lastSelectedDate=i.selectedDates[i.selectedDates.length-1]:(i.minRange="",i.maxRange="",i.lastSelectedDate=""),i.views[i.currentView]._render(),i._setInputValue(),i.opts.onSelect&&i._triggerOnChange(),!0):void 0})},today:function(){this.silent=!0,this.view=this.opts.minView,this.silent=!1,this.date=new Date,this.opts.todayButton instanceof Date&&this.selectDate(this.opts.todayButton)},clear:function(){this.selectedDates=[],this.minRange="",this.maxRange="",this.views[this.currentView]._render(),this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()},update:function(t,i){var s=arguments.length,a=this.lastSelectedDate;return 2==s?this.opts[t]=i:1==s&&"object"==typeof t&&(this.opts=e.extend(!0,this.opts,t)),this._createShortCuts(),this._syncWithMinMaxDates(),this._defineLocale(this.opts.language),this.nav._addButtonsIfNeed(),this.opts.onlyTimepicker||this.nav._render(),this.views[this.currentView]._render(),this.elIsInput&&!this.opts.inline&&(this._setPositionClasses(this.opts.position),this.visible&&this.setPosition(this.opts.position)),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.onlyTimepicker&&this.$datepicker.addClass("-only-timepicker-"),this.opts.timepicker&&(a&&this.timepicker._handleDate(a),this.timepicker._updateRanges(),this.timepicker._updateCurrentTime(),a&&(a.setHours(this.timepicker.hours),a.setMinutes(this.timepicker.minutes))),this._setInputValue(),this},_syncWithMinMaxDates:function(){var t=this.date.getTime();this.silent=!0,this.minTime>t&&(this.date=this.minDate),this.maxTime<t&&(this.date=this.maxDate),this.silent=!1},_isSelected:function(t,e){var i=!1;return this.selectedDates.some(function(s){return n.isSame(s,t,e)?(i=s,!0):void 0}),i},_setInputValue:function(){var t,e=this,i=e.opts,s=e.loc.dateFormat,a=i.altFieldDateFormat,n=e.selectedDates.map(function(t){return e.formatDate(s,t)});i.altField&&e.$altField.length&&(t=this.selectedDates.map(function(t){return e.formatDate(a,t)}),t=t.join(this.opts.multipleDatesSeparator),this.$altField.val(t)),n=n.join(this.opts.multipleDatesSeparator),this.$el.val(n)},_isInRange:function(t,e){var i=t.getTime(),s=n.getParsedDate(t),a=n.getParsedDate(this.minDate),h=n.getParsedDate(this.maxDate),o=new Date(s.year,s.month,a.date).getTime(),r=new Date(s.year,s.month,h.date).getTime(),c={day:i>=this.minTime&&i<=this.maxTime,month:o>=this.minTime&&r<=this.maxTime,year:s.year>=a.year&&s.year<=h.year};return e?c[e]:c.day},_getDimensions:function(t){var e=t.offset();return{width:t.outerWidth(),height:t.outerHeight(),left:e.left,top:e.top}},_getDateFromCell:function(t){var e=this.parsedDate,s=t.data("year")||e.year,a=t.data("month")==i?e.month:t.data("month"),n=t.data("date")||1;return new Date(s,a,n)},_setPositionClasses:function(t){t=t.split(" ");var e=t[0],i=t[1],s="datepicker -"+e+"-"+i+"- -from-"+e+"-";this.visible&&(s+=" active"),this.$datepicker.removeAttr("class").addClass(s)},setPosition:function(t){t=t||this.opts.position;var e,i,s=this._getDimensions(this.$el),a=this._getDimensions(this.$datepicker),n=t.split(" "),h=this.opts.offset,o=n[0],r=n[1];switch(o){case"top":e=s.top-a.height-h;break;case"right":i=s.left+s.width+h;break;case"bottom":e=s.top+s.height+h;break;case"left":i=s.left-a.width-h}switch(r){case"top":e=s.top;break;case"right":i=s.left+s.width-a.width;break;case"bottom":e=s.top+s.height-a.height;break;case"left":i=s.left;break;case"center":/left|right/.test(o)?e=s.top+s.height/2-a.height/2:i=s.left+s.width/2-a.width/2}this.$datepicker.css({left:i,top:e})},show:function(){var t=this.opts.onShow;this.setPosition(this.opts.position),this.$datepicker.addClass("active"),this.visible=!0,t&&this._bindVisionEvents(t)},hide:function(){var t=this.opts.onHide;this.$datepicker.removeClass("active").css({left:"-100000px"}),this.focused="",this.keys=[],this.inFocus=!1,this.visible=!1,this.$el.blur(),t&&this._bindVisionEvents(t)},down:function(t){this._changeView(t,"down")},up:function(t){this._changeView(t,"up")},_bindVisionEvents:function(t){this.$datepicker.off("transitionend.dp"),t(this,!1),this.$datepicker.one("transitionend.dp",t.bind(this,this,!0))},_changeView:function(t,e){t=t||this.focused||this.date;var i="up"==e?this.viewIndex+1:this.viewIndex-1;i>2&&(i=2),0>i&&(i=0),this.silent=!0,this.date=new Date(t.getFullYear(),t.getMonth(),1),this.silent=!1,this.view=this.viewIndexes[i]},_handleHotKey:function(t){var e,i,s,a=n.getParsedDate(this._getFocusedDate()),h=this.opts,o=!1,r=!1,c=!1,d=a.year,l=a.month,u=a.date;switch(t){case"ctrlRight":case"ctrlUp":l+=1,o=!0;break;case"ctrlLeft":case"ctrlDown":l-=1,o=!0;break;case"shiftRight":case"shiftUp":r=!0,d+=1;break;case"shiftLeft":case"shiftDown":r=!0,d-=1;break;case"altRight":case"altUp":c=!0,d+=10;break;case"altLeft":case"altDown":c=!0,d-=10;break;case"ctrlShiftUp":this.up()}s=n.getDaysCount(new Date(d,l)),i=new Date(d,l,u),u>s&&(u=s),i.getTime()<this.minTime?i=this.minDate:i.getTime()>this.maxTime&&(i=this.maxDate),this.focused=i,e=n.getParsedDate(i),o&&h.onChangeMonth&&h.onChangeMonth(e.month,e.year),r&&h.onChangeYear&&h.onChangeYear(e.year),c&&h.onChangeDecade&&h.onChangeDecade(this.curDecade)},_registerKey:function(t){var e=this.keys.some(function(e){return e==t});e||this.keys.push(t)},_unRegisterKey:function(t){var e=this.keys.indexOf(t);this.keys.splice(e,1)},_isHotKeyPressed:function(){var t,e=!1,i=this,s=this.keys.sort();for(var a in u)t=u[a],s.length==t.length&&t.every(function(t,e){return t==s[e]})&&(i._trigger("hotKey",a),e=!0);return e},_trigger:function(t,e){this.$el.trigger(t,e)},_focusNextCell:function(t,e){e=e||this.cellType;var i=n.getParsedDate(this._getFocusedDate()),s=i.year,a=i.month,h=i.date;if(!this._isHotKeyPressed()){switch(t){case 37:"day"==e?h-=1:"","month"==e?a-=1:"","year"==e?s-=1:"";break;case 38:"day"==e?h-=7:"","month"==e?a-=3:"","year"==e?s-=4:"";break;case 39:"day"==e?h+=1:"","month"==e?a+=1:"","year"==e?s+=1:"";break;case 40:"day"==e?h+=7:"","month"==e?a+=3:"","year"==e?s+=4:""}var o=new Date(s,a,h);o.getTime()<this.minTime?o=this.minDate:o.getTime()>this.maxTime&&(o=this.maxDate),this.focused=o}},_getFocusedDate:function(){var t=this.focused||this.selectedDates[this.selectedDates.length-1],e=this.parsedDate;if(!t)switch(this.view){case"days":t=new Date(e.year,e.month,(new Date).getDate());break;case"months":t=new Date(e.year,e.month,1);break;case"years":t=new Date(e.year,0,1)}return t},_getCell:function(t,i){i=i||this.cellType;var s,a=n.getParsedDate(t),h='.datepicker--cell[data-year="'+a.year+'"]';switch(i){case"month":h='[data-month="'+a.month+'"]';break;case"day":h+='[data-month="'+a.month+'"][data-date="'+a.date+'"]'}return s=this.views[this.currentView].$el.find(h),s.length?s:e("")},destroy:function(){var t=this;t.$el.off(".adp").data("datepicker",""),t.selectedDates=[],t.focused="",t.views={},t.keys=[],t.minRange="",t.maxRange="",t.opts.inline||!t.elIsInput?t.$datepicker.closest(".datepicker-inline").remove():t.$datepicker.remove()},_handleAlreadySelectedDates:function(t,e){this.opts.range?this.opts.toggleSelected?this.removeDate(e):2!=this.selectedDates.length&&this._trigger("clickCell",e):this.opts.toggleSelected&&this.removeDate(e),this.opts.toggleSelected||(this.lastSelectedDate=t,this.opts.timepicker&&(this.timepicker._setTime(t),this.timepicker.update()))},_onShowEvent:function(t){this.visible||this.show()},_onBlur:function(){!this.inFocus&&this.visible&&this.hide()},_onMouseDownDatepicker:function(t){this.inFocus=!0},_onMouseUpDatepicker:function(t){this.inFocus=!1,t.originalEvent.inFocus=!0,t.originalEvent.timepickerFocus||this.$el.focus()},_onKeyUpGeneral:function(t){var e=this.$el.val();e||this.clear()},_onResize:function(){this.visible&&this.setPosition()},_onMouseUpBody:function(t){t.originalEvent.inFocus||this.visible&&!this.inFocus&&this.hide()},_onMouseUpEl:function(t){t.originalEvent.inFocus=!0,setTimeout(this._onKeyUpGeneral.bind(this),4)},_onKeyDown:function(t){var e=t.which;if(this._registerKey(e),e>=37&&40>=e&&(t.preventDefault(),this._focusNextCell(e)),13==e&&this.focused){if(this._getCell(this.focused).hasClass("-disabled-"))return;if(this.view!=this.opts.minView)this.down();else{var i=this._isSelected(this.focused,this.cellType);if(!i)return this.timepicker&&(this.focused.setHours(this.timepicker.hours),this.focused.setMinutes(this.timepicker.minutes)),void this.selectDate(this.focused);this._handleAlreadySelectedDates(i,this.focused)}}27==e&&this.hide()},_onKeyUp:function(t){var e=t.which;this._unRegisterKey(e)},_onHotKey:function(t,e){this._handleHotKey(e)},_onMouseEnterCell:function(t){var i=e(t.target).closest(".datepicker--cell"),s=this._getDateFromCell(i);this.silent=!0,this.focused&&(this.focused=""),i.addClass("-focus-"),this.focused=s,this.silent=!1,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this.focused)&&(this.maxRange=this.minRange,this.minRange=""),this.views[this.currentView]._update())},_onMouseLeaveCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.removeClass("-focus-"),this.silent=!0,this.focused="",this.silent=!1},_onTimeChange:function(t,e,i){var s=new Date,a=this.selectedDates,n=!1;a.length&&(n=!0,s=this.lastSelectedDate),s.setHours(e),s.setMinutes(i),n||this._getCell(s).hasClass("-disabled-")?(this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()):this.selectDate(s)},_onClickCell:function(t,e){this.timepicker&&(e.setHours(this.timepicker.hours),e.setMinutes(this.timepicker.minutes)),this.selectDate(e)},set focused(t){if(!t&&this.focused){var e=this._getCell(this.focused);e.length&&e.removeClass("-focus-")}this._focused=t,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this._focused)&&(this.maxRange=this.minRange,this.minRange="")),this.silent||(this.date=t)},get focused(){return this._focused},get parsedDate(){return n.getParsedDate(this.date)},set date(t){return t instanceof Date?(this.currentDate=t,this.inited&&!this.silent&&(this.views[this.view]._render(),this.nav._render(),this.visible&&this.elIsInput&&this.setPosition()),t):void 0},get date(){return this.currentDate},set view(t){return this.viewIndex=this.viewIndexes.indexOf(t),this.viewIndex<0?void 0:(this.prevView=this.currentView,this.currentView=t,this.inited&&(this.views[t]?this.views[t]._render():this.views[t]=new e.fn.datepicker.Body(this,t,this.opts),this.views[this.prevView].hide(),this.views[t].show(),this.nav._render(),this.opts.onChangeView&&this.opts.onChangeView(t),this.elIsInput&&this.visible&&this.setPosition()),t)},get view(){return this.currentView},get cellType(){return this.view.substring(0,this.view.length-1)},get minTime(){var t=n.getParsedDate(this.minDate);return new Date(t.year,t.month,t.date).getTime()},get maxTime(){var t=n.getParsedDate(this.maxDate);return new Date(t.year,t.month,t.date).getTime()},get curDecade(){return n.getDecade(this.date)}},n.getDaysCount=function(t){return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()},n.getParsedDate=function(t){return{year:t.getFullYear(),month:t.getMonth(),fullMonth:t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,date:t.getDate(),fullDate:t.getDate()<10?"0"+t.getDate():t.getDate(),day:t.getDay(),hours:t.getHours(),fullHours:t.getHours()<10?"0"+t.getHours():t.getHours(),minutes:t.getMinutes(),fullMinutes:t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes()}},n.getDecade=function(t){var e=10*Math.floor(t.getFullYear()/10);return[e,e+9]},n.template=function(t,e){return t.replace(/#\{([\w]+)\}/g,function(t,i){return e[i]||0===e[i]?e[i]:void 0})},n.isSame=function(t,e,i){if(!t||!e)return!1;var s=n.getParsedDate(t),a=n.getParsedDate(e),h=i?i:"day",o={day:s.date==a.date&&s.month==a.month&&s.year==a.year,month:s.month==a.month&&s.year==a.year,year:s.year==a.year};return o[h]},n.less=function(t,e,i){return t&&e?e.getTime()<t.getTime():!1},n.bigger=function(t,e,i){return t&&e?e.getTime()>t.getTime():!1},n.getLeadingZeroNum=function(t){return parseInt(t)<10?"0"+t:t},n.resetTime=function(t){return"object"==typeof t?(t=n.getParsedDate(t),new Date(t.year,t.month,t.date)):void 0},e.fn.datepicker=function(t){return this.each(function(){if(e.data(this,o)){var i=e.data(this,o);i.opts=e.extend(!0,i.opts,t),i.update()}else e.data(this,o,new m(this,t))})},e.fn.datepicker.Constructor=m,e.fn.datepicker.language={ru:{days:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],daysShort:["Вос","Пон","Вто","Сре","Чет","Пят","Суб"],daysMin:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthsShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],today:"Сегодня",clear:"Очистить",dateFormat:"dd.mm.yyyy",timeFormat:"hh:ii",firstDay:1}},e(function(){e(r).datepicker()})}(),function(){var t={days:'<div class="datepicker--days datepicker--body"><div class="datepicker--days-names"></div><div class="datepicker--cells datepicker--cells-days"></div></div>',months:'<div class="datepicker--months datepicker--body"><div class="datepicker--cells datepicker--cells-months"></div></div>',years:'<div class="datepicker--years datepicker--body"><div class="datepicker--cells datepicker--cells-years"></div></div>'},s=e.fn.datepicker,a=s.Constructor;s.Body=function(t,i,s){this.d=t,this.type=i,this.opts=s,this.$el=e(""),this.opts.onlyTimepicker||this.init()},s.Body.prototype={init:function(){this._buildBaseHtml(),this._render(),this._bindEvents()},_bindEvents:function(){this.$el.on("click",".datepicker--cell",e.proxy(this._onClickCell,this))},_buildBaseHtml:function(){this.$el=e(t[this.type]).appendTo(this.d.$content),this.$names=e(".datepicker--days-names",this.$el),this.$cells=e(".datepicker--cells",this.$el)},_getDayNamesHtml:function(t,e,s,a){return e=e!=i?e:t,s=s?s:"",a=a!=i?a:0,a>7?s:7==e?this._getDayNamesHtml(t,0,s,++a):(s+='<div class="datepicker--day-name'+(this.d.isWeekend(e)?" -weekend-":"")+'">'+this.d.loc.daysMin[e]+"</div>",this._getDayNamesHtml(t,++e,s,++a))},_getCellContents:function(t,e){var i="datepicker--cell datepicker--cell-"+e,s=new Date,n=this.d,h=a.resetTime(n.minRange),o=a.resetTime(n.maxRange),r=n.opts,c=a.getParsedDate(t),d={},l=c.date;switch(e){case"day":n.isWeekend(c.day)&&(i+=" -weekend-"),c.month!=this.d.parsedDate.month&&(i+=" -other-month-",r.selectOtherMonths||(i+=" -disabled-"),r.showOtherMonths||(l=""));break;case"month":l=n.loc[n.opts.monthsField][c.month];break;case"year":var u=n.curDecade;l=c.year,(c.year<u[0]||c.year>u[1])&&(i+=" -other-decade-",r.selectOtherYears||(i+=" -disabled-"),r.showOtherYears||(l=""))}return r.onRenderCell&&(d=r.onRenderCell(t,e)||{},l=d.html?d.html:l,i+=d.classes?" "+d.classes:""),r.range&&(a.isSame(h,t,e)&&(i+=" -range-from-"),a.isSame(o,t,e)&&(i+=" -range-to-"),1==n.selectedDates.length&&n.focused?((a.bigger(h,t)&&a.less(n.focused,t)||a.less(o,t)&&a.bigger(n.focused,t))&&(i+=" -in-range-"),a.less(o,t)&&a.isSame(n.focused,t)&&(i+=" -range-from-"),a.bigger(h,t)&&a.isSame(n.focused,t)&&(i+=" -range-to-")):2==n.selectedDates.length&&a.bigger(h,t)&&a.less(o,t)&&(i+=" -in-range-")),a.isSame(s,t,e)&&(i+=" -current-"),n.focused&&a.isSame(t,n.focused,e)&&(i+=" -focus-"),n._isSelected(t,e)&&(i+=" -selected-"),(!n._isInRange(t,e)||d.disabled)&&(i+=" -disabled-"),{html:l,classes:i}},_getDaysHtml:function(t){var e=a.getDaysCount(t),i=new Date(t.getFullYear(),t.getMonth(),1).getDay(),s=new Date(t.getFullYear(),t.getMonth(),e).getDay(),n=i-this.d.loc.firstDay,h=6-s+this.d.loc.firstDay;n=0>n?n+7:n,h=h>6?h-7:h;for(var o,r,c=-n+1,d="",l=c,u=e+h;u>=l;l++)r=t.getFullYear(),o=t.getMonth(),d+=this._getDayHtml(new Date(r,o,l));return d},_getDayHtml:function(t){var e=this._getCellContents(t,"day");return'<div class="'+e.classes+'" data-date="'+t.getDate()+'" data-month="'+t.getMonth()+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_getMonthsHtml:function(t){for(var e="",i=a.getParsedDate(t),s=0;12>s;)e+=this._getMonthHtml(new Date(i.year,s)),s++;return e},_getMonthHtml:function(t){var e=this._getCellContents(t,"month");return'<div class="'+e.classes+'" data-month="'+t.getMonth()+'">'+e.html+"</div>"},_getYearsHtml:function(t){var e=(a.getParsedDate(t),a.getDecade(t)),i=e[0]-1,s="",n=i;for(n;n<=e[1]+1;n++)s+=this._getYearHtml(new Date(n,0));return s},_getYearHtml:function(t){var e=this._getCellContents(t,"year");return'<div class="'+e.classes+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_renderTypes:{days:function(){var t=this._getDayNamesHtml(this.d.loc.firstDay),e=this._getDaysHtml(this.d.currentDate);this.$cells.html(e),this.$names.html(t)},months:function(){var t=this._getMonthsHtml(this.d.currentDate);this.$cells.html(t)},years:function(){var t=this._getYearsHtml(this.d.currentDate);this.$cells.html(t)}},_render:function(){this.opts.onlyTimepicker||this._renderTypes[this.type].bind(this)()},_update:function(){var t,i,s,a=e(".datepicker--cell",this.$cells),n=this;a.each(function(a,h){i=e(this),s=n.d._getDateFromCell(e(this)),t=n._getCellContents(s,n.d.cellType),i.attr("class",t.classes)})},show:function(){this.opts.onlyTimepicker||(this.$el.addClass("active"),this.acitve=!0)},hide:function(){this.$el.removeClass("active"),this.active=!1},_handleClick:function(t){var e=t.data("date")||1,i=t.data("month")||0,s=t.data("year")||this.d.parsedDate.year,a=this.d;if(a.view!=this.opts.minView)return void a.down(new Date(s,i,e));var n=new Date(s,i,e),h=this.d._isSelected(n,this.d.cellType);return h?void a._handleAlreadySelectedDates.bind(a,h,n)():void a._trigger("clickCell",n)},_onClickCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.hasClass("-disabled-")||this._handleClick.bind(this)(i)}}}(),function(){var t='<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div><div class="datepicker--nav-title">#{title}</div><div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',i='<div class="datepicker--buttons"></div>',s='<span class="datepicker--button" data-action="#{action}">#{label}</span>',a=e.fn.datepicker,n=a.Constructor;a.Navigation=function(t,e){this.d=t,this.opts=e,this.$buttonsContainer="",this.init()},a.Navigation.prototype={init:function(){this._buildBaseHtml(),this._bindEvents()},_bindEvents:function(){this.d.$nav.on("click",".datepicker--nav-action",e.proxy(this._onClickNavButton,this)),this.d.$nav.on("click",".datepicker--nav-title",e.proxy(this._onClickNavTitle,this)),this.d.$datepicker.on("click",".datepicker--button",e.proxy(this._onClickNavButton,this))},_buildBaseHtml:function(){this.opts.onlyTimepicker||this._render(),this._addButtonsIfNeed()},_addButtonsIfNeed:function(){this.opts.todayButton&&this._addButton("today"),this.opts.clearButton&&this._addButton("clear")},_render:function(){var i=this._getTitle(this.d.currentDate),s=n.template(t,e.extend({title:i},this.opts));this.d.$nav.html(s),"years"==this.d.view&&e(".datepicker--nav-title",this.d.$nav).addClass("-disabled-"),this.setNavStatus()},_getTitle:function(t){return this.d.formatDate(this.opts.navTitles[this.d.view],t)},_addButton:function(t){this.$buttonsContainer.length||this._addButtonsContainer();var i={action:t,label:this.d.loc[t]},a=n.template(s,i);e("[data-action="+t+"]",this.$buttonsContainer).length||this.$buttonsContainer.append(a)},_addButtonsContainer:function(){this.d.$datepicker.append(i),this.$buttonsContainer=e(".datepicker--buttons",this.d.$datepicker)},setNavStatus:function(){if((this.opts.minDate||this.opts.maxDate)&&this.opts.disableNavWhenOutOfRange){var t=this.d.parsedDate,e=t.month,i=t.year,s=t.date;switch(this.d.view){case"days":this.d._isInRange(new Date(i,e-1,1),"month")||this._disableNav("prev"),this.d._isInRange(new Date(i,e+1,1),"month")||this._disableNav("next");break;case"months":this.d._isInRange(new Date(i-1,e,s),"year")||this._disableNav("prev"),this.d._isInRange(new Date(i+1,e,s),"year")||this._disableNav("next");break;case"years":var a=n.getDecade(this.d.date);this.d._isInRange(new Date(a[0]-1,0,1),"year")||this._disableNav("prev"),this.d._isInRange(new Date(a[1]+1,0,1),"year")||this._disableNav("next")}}},_disableNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).addClass("-disabled-")},_activateNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).removeClass("-disabled-")},_onClickNavButton:function(t){var i=e(t.target).closest("[data-action]"),s=i.data("action");this.d[s]()},_onClickNavTitle:function(t){return e(t.target).hasClass("-disabled-")?void 0:"days"==this.d.view?this.d.view="months":void(this.d.view="years")}}}(),function(){var t='<div class="datepicker--time"><div class="datepicker--time-current">   <span class="datepicker--time-current-hours">#{hourVisible}</span>   <span class="datepicker--time-current-colon">:</span>   <span class="datepicker--time-current-minutes">#{minValue}</span></div><div class="datepicker--time-sliders">   <div class="datepicker--time-row">      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>   </div>   <div class="datepicker--time-row">      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>   </div></div></div>',i=e.fn.datepicker,s=i.Constructor;i.Timepicker=function(t,e){this.d=t,this.opts=e,this.init()},i.Timepicker.prototype={init:function(){var t="input";this._setTime(this.d.date),this._buildHTML(),navigator.userAgent.match(/trident/gi)&&(t="change"),this.d.$el.on("selectDate",this._onSelectDate.bind(this)),this.$ranges.on(t,this._onChangeRange.bind(this)),this.$ranges.on("mouseup",this._onMouseUpRange.bind(this)),this.$ranges.on("mousemove focus ",this._onMouseEnterRange.bind(this)),this.$ranges.on("mouseout blur",this._onMouseOutRange.bind(this))},_setTime:function(t){var e=s.getParsedDate(t);this._handleDate(t),this.hours=e.hours<this.minHours?this.minHours:e.hours,this.minutes=e.minutes<this.minMinutes?this.minMinutes:e.minutes},_setMinTimeFromDate:function(t){this.minHours=t.getHours(),this.minMinutes=t.getMinutes(),this.d.lastSelectedDate&&this.d.lastSelectedDate.getHours()>t.getHours()&&(this.minMinutes=this.opts.minMinutes)},_setMaxTimeFromDate:function(t){
this.maxHours=t.getHours(),this.maxMinutes=t.getMinutes(),this.d.lastSelectedDate&&this.d.lastSelectedDate.getHours()<t.getHours()&&(this.maxMinutes=this.opts.maxMinutes)},_setDefaultMinMaxTime:function(){var t=23,e=59,i=this.opts;this.minHours=i.minHours<0||i.minHours>t?0:i.minHours,this.minMinutes=i.minMinutes<0||i.minMinutes>e?0:i.minMinutes,this.maxHours=i.maxHours<0||i.maxHours>t?t:i.maxHours,this.maxMinutes=i.maxMinutes<0||i.maxMinutes>e?e:i.maxMinutes},_validateHoursMinutes:function(t){this.hours<this.minHours?this.hours=this.minHours:this.hours>this.maxHours&&(this.hours=this.maxHours),this.minutes<this.minMinutes?this.minutes=this.minMinutes:this.minutes>this.maxMinutes&&(this.minutes=this.maxMinutes)},_buildHTML:function(){var i=s.getLeadingZeroNum,a={hourMin:this.minHours,hourMax:i(this.maxHours),hourStep:this.opts.hoursStep,hourValue:this.hours,hourVisible:i(this.displayHours),minMin:this.minMinutes,minMax:i(this.maxMinutes),minStep:this.opts.minutesStep,minValue:i(this.minutes)},n=s.template(t,a);this.$timepicker=e(n).appendTo(this.d.$datepicker),this.$ranges=e('[type="range"]',this.$timepicker),this.$hours=e('[name="hours"]',this.$timepicker),this.$minutes=e('[name="minutes"]',this.$timepicker),this.$hoursText=e(".datepicker--time-current-hours",this.$timepicker),this.$minutesText=e(".datepicker--time-current-minutes",this.$timepicker),this.d.ampm&&(this.$ampm=e('<span class="datepicker--time-current-ampm">').appendTo(e(".datepicker--time-current",this.$timepicker)).html(this.dayPeriod),this.$timepicker.addClass("-am-pm-"))},_updateCurrentTime:function(){var t=s.getLeadingZeroNum(this.displayHours),e=s.getLeadingZeroNum(this.minutes);this.$hoursText.html(t),this.$minutesText.html(e),this.d.ampm&&this.$ampm.html(this.dayPeriod)},_updateRanges:function(){this.$hours.attr({min:this.minHours,max:this.maxHours}).val(this.hours),this.$minutes.attr({min:this.minMinutes,max:this.maxMinutes}).val(this.minutes)},_handleDate:function(t){this._setDefaultMinMaxTime(),t&&(s.isSame(t,this.d.opts.minDate)?this._setMinTimeFromDate(this.d.opts.minDate):s.isSame(t,this.d.opts.maxDate)&&this._setMaxTimeFromDate(this.d.opts.maxDate)),this._validateHoursMinutes(t)},update:function(){this._updateRanges(),this._updateCurrentTime()},_getValidHoursFromDate:function(t,e){var i=t,a=t;t instanceof Date&&(i=s.getParsedDate(t),a=i.hours);var n=e||this.d.ampm,h="am";if(n)switch(!0){case 0==a:a=12;break;case 12==a:h="pm";break;case a>11:a-=12,h="pm"}return{hours:a,dayPeriod:h}},set hours(t){this._hours=t;var e=this._getValidHoursFromDate(t);this.displayHours=e.hours,this.dayPeriod=e.dayPeriod},get hours(){return this._hours},_onChangeRange:function(t){var i=e(t.target),s=i.attr("name");this.d.timepickerIsActive=!0,this[s]=i.val(),this._updateCurrentTime(),this.d._trigger("timeChange",[this.hours,this.minutes]),this._handleDate(this.d.lastSelectedDate),this.update()},_onSelectDate:function(t,e){this._handleDate(e),this.update()},_onMouseEnterRange:function(t){var i=e(t.target).attr("name");e(".datepicker--time-current-"+i,this.$timepicker).addClass("-focus-")},_onMouseOutRange:function(t){var i=e(t.target).attr("name");this.d.inFocus||e(".datepicker--time-current-"+i,this.$timepicker).removeClass("-focus-")},_onMouseUpRange:function(t){this.d.timepickerIsActive=!1}}}()}(window,jQuery);
/**
 * jQuery Timepicker - v1.3.5 - 2016-07-10
 * http://timepicker.co
 *
 * Enhances standard form input fields helping users to select (or type) times.
 *
 * Copyright (c) 2016 Willington Vega; Licensed MIT, GPL
 */

!function(a){"object"==typeof module&&"object"==typeof module.exports?a(require("jquery"),window,document):"undefined"!=typeof jQuery&&a(jQuery,window,document)}(function(a,b,c,d){!function(){function b(a,b,c){return new Array(c+1-a.length).join(b)+a}function d(){if(1===arguments.length){var b=arguments[0];return"string"==typeof b&&(b=a.fn.timepicker.parseTime(b)),new Date(0,0,0,b.getHours(),b.getMinutes(),b.getSeconds())}return 3===arguments.length?new Date(0,0,0,arguments[0],arguments[1],arguments[2]):2===arguments.length?new Date(0,0,0,arguments[0],arguments[1],0):new Date(0,0,0)}a.TimePicker=function(){var b=this;b.container=a(".ui-timepicker-container"),b.ui=b.container.find(".ui-timepicker"),0===b.container.length&&(b.container=a("<div></div>").addClass("ui-timepicker-container").addClass("ui-timepicker-hidden ui-helper-hidden").appendTo("body").hide(),b.ui=a("<div></div>").addClass("ui-timepicker").addClass("ui-widget ui-widget-content ui-menu").addClass("ui-corner-all").appendTo(b.container),b.viewport=a("<ul></ul>").addClass("ui-timepicker-viewport").appendTo(b.ui),a.fn.jquery>="1.4.2"&&b.ui.delegate("a","mouseenter.timepicker",function(){b.activate(!1,a(this).parent())}).delegate("a","mouseleave.timepicker",function(){b.deactivate(!1)}).delegate("a","click.timepicker",function(c){c.preventDefault(),b.select(!1,a(this).parent())}))},a.TimePicker.count=0,a.TimePicker.instance=function(){return a.TimePicker._instance||(a.TimePicker._instance=new a.TimePicker),a.TimePicker._instance},a.TimePicker.prototype={keyCode:{ALT:18,BLOQ_MAYUS:20,CTRL:17,DOWN:40,END:35,ENTER:13,HOME:36,LEFT:37,NUMPAD_ENTER:108,PAGE_DOWN:34,PAGE_UP:33,RIGHT:39,SHIFT:16,TAB:9,UP:38},_items:function(b,c){var e,f,g=this,h=a("<ul></ul>"),i=null;for(-1===b.options.timeFormat.indexOf("m")&&b.options.interval%60!==0&&(b.options.interval=60*Math.max(Math.round(b.options.interval/60),1)),e=c?d(c):b.options.startTime?d(b.options.startTime):d(b.options.startHour,b.options.startMinutes),f=new Date(e.getTime()+864e5);f>e;)g._isValidTime(b,e)&&(i=a("<li>").addClass("ui-menu-item").appendTo(h),a("<a>").addClass("ui-corner-all").text(a.fn.timepicker.formatTime(b.options.timeFormat,e)).appendTo(i),i.data("time-value",e)),e=new Date(e.getTime()+60*b.options.interval*1e3);return h.children()},_isValidTime:function(a,b){var c=null,e=null;return b=d(b),null!==a.options.minTime?c=d(a.options.minTime):(null!==a.options.minHour||null!==a.options.minMinutes)&&(c=d(a.options.minHour,a.options.minMinutes)),null!==a.options.maxTime?e=d(a.options.maxTime):(null!==a.options.maxHour||null!==a.options.maxMinutes)&&(e=d(a.options.maxHour,a.options.maxMinutes)),null!==c&&null!==e?b>=c&&e>=b:null!==c?b>=c:null!==e?e>=b:!0},_hasScroll:function(){var a="undefined"!=typeof this.ui.prop?"prop":"attr";return this.ui.height()<this.ui[a]("scrollHeight")},_move:function(a,b,c){var d=this;if(d.closed()&&d.open(a),!d.active)return void d.activate(a,d.viewport.children(c));var e=d.active[b+"All"](".ui-menu-item").eq(0);e.length?d.activate(a,e):d.activate(a,d.viewport.children(c))},register:function(b,c){var d=this,e={};e.element=a(b),e.element.data("TimePicker")||(e.options=a.metadata?a.extend({},c,e.element.metadata()):a.extend({},c),e.widget=d,a.extend(e,{next:function(){return d.next(e)},previous:function(){return d.previous(e)},first:function(){return d.first(e)},last:function(){return d.last(e)},selected:function(){return d.selected(e)},open:function(){return d.open(e)},close:function(){return d.close(e)},closed:function(){return d.closed(e)},destroy:function(){return d.destroy(e)},parse:function(a){return d.parse(e,a)},format:function(a,b){return d.format(e,a,b)},getTime:function(){return d.getTime(e)},setTime:function(a,b){return d.setTime(e,a,b)},option:function(a,b){return d.option(e,a,b)}}),d._setDefaultTime(e),d._addInputEventsHandlers(e),e.element.data("TimePicker",e))},_setDefaultTime:function(b){"now"===b.options.defaultTime?b.setTime(d(new Date)):b.options.defaultTime&&b.options.defaultTime.getFullYear?b.setTime(d(b.options.defaultTime)):b.options.defaultTime&&b.setTime(a.fn.timepicker.parseTime(b.options.defaultTime))},_addInputEventsHandlers:function(b){var c=this;b.element.bind("keydown.timepicker",function(a){switch(a.which||a.keyCode){case c.keyCode.ENTER:case c.keyCode.NUMPAD_ENTER:a.preventDefault(),c.closed()?b.element.trigger("change.timepicker"):c.select(b,c.active);break;case c.keyCode.UP:b.previous();break;case c.keyCode.DOWN:b.next();break;default:c.closed()||b.close(!0)}}).bind("focus.timepicker",function(){b.open()}).bind("blur.timepicker",function(){setTimeout(function(){b.element.data("timepicker-user-clicked-outside")&&b.close()})}).bind("change.timepicker",function(){b.closed()&&b.setTime(a.fn.timepicker.parseTime(b.element.val()))})},select:function(b,c){var d=this,e=b===!1?d.instance:b;d.setTime(e,a.fn.timepicker.parseTime(c.children("a").text())),d.close(e,!0)},activate:function(a,b){var c=this,d=a===!1?c.instance:a;if(d===c.instance){if(c.deactivate(),c._hasScroll()){var e=b.offset().top-c.ui.offset().top,f=c.ui.scrollTop(),g=c.ui.height();0>e?c.ui.scrollTop(f+e):e>=g&&c.ui.scrollTop(f+e-g+b.height())}c.active=b.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-item").end()}},deactivate:function(){var a=this;a.active&&(a.active.children("a").removeClass("ui-state-hover").removeAttr("id"),a.active=null)},next:function(a){return(this.closed()||this.instance===a)&&this._move(a,"next",".ui-menu-item:first"),a.element},previous:function(a){return(this.closed()||this.instance===a)&&this._move(a,"prev",".ui-menu-item:last"),a.element},first:function(a){return this.instance===a?this.active&&0===this.active.prevAll(".ui-menu-item").length:!1},last:function(a){return this.instance===a?this.active&&0===this.active.nextAll(".ui-menu-item").length:!1},selected:function(a){return this.instance===a&&this.active?this.active:null},open:function(b){var d=this,e=b.getTime(),f=b.options.dynamic&&e;if(!b.options.dropdown)return b.element;switch(b.element.data("timepicker-event-namespace",Math.random()),a(c).bind("click.timepicker-"+b.element.data("timepicker-event-namespace"),function(a){b.element.get(0)===a.target?b.element.data("timepicker-user-clicked-outside",!1):b.element.data("timepicker-user-clicked-outside",!0).blur()}),(b.rebuild||!b.items||f)&&(b.items=d._items(b,f?e:null)),(b.rebuild||d.instance!==b||f)&&(a.fn.jquery<"1.4.2"?(d.viewport.children().remove(),d.viewport.append(b.items),d.viewport.find("a").bind("mouseover.timepicker",function(){d.activate(b,a(this).parent())}).bind("mouseout.timepicker",function(){d.deactivate(b)}).bind("click.timepicker",function(c){c.preventDefault(),d.select(b,a(this).parent())})):(d.viewport.children().detach(),d.viewport.append(b.items))),b.rebuild=!1,d.container.removeClass("ui-helper-hidden ui-timepicker-hidden ui-timepicker-standard ui-timepicker-corners").show(),b.options.theme){case"standard":d.container.addClass("ui-timepicker-standard");break;case"standard-rounded-corners":d.container.addClass("ui-timepicker-standard ui-timepicker-corners")}d.container.hasClass("ui-timepicker-no-scrollbar")||b.options.scrollbar||(d.container.addClass("ui-timepicker-no-scrollbar"),d.viewport.css({paddingRight:40}));var g=d.container.outerHeight()-d.container.height(),h=b.options.zindex?b.options.zindex:b.element.offsetParent().css("z-index"),i=b.element.offset();d.container.css({top:i.top+b.element.outerHeight(),left:i.left}),d.container.show(),d.container.css({left:b.element.offset().left,height:d.ui.outerHeight()+g,width:b.element.outerWidth(),zIndex:h,cursor:"default"});var j=d.container.width()-(d.ui.outerWidth()-d.ui.width());return d.ui.css({width:j}),d.viewport.css({width:j}),b.items.css({width:j}),d.instance=b,e?b.items.each(function(){var c,f=a(this);return c=a.fn.jquery<"1.4.2"?a.fn.timepicker.parseTime(f.find("a").text()):f.data("time-value"),c.getTime()===e.getTime()?(d.activate(b,f),!1):!0}):d.deactivate(b),b.element},close:function(b){var d=this;return d.instance===b&&(d.container.addClass("ui-helper-hidden ui-timepicker-hidden").hide(),d.ui.scrollTop(0),d.ui.children().removeClass("ui-state-hover")),a(c).unbind("click.timepicker-"+b.element.data("timepicker-event-namespace")),b.element},closed:function(){return this.ui.is(":hidden")},destroy:function(a){var b=this;return b.close(a,!0),a.element.unbind(".timepicker").data("TimePicker",null)},parse:function(b,c){return a.fn.timepicker.parseTime(c)},format:function(b,c,d){return d=d||b.options.timeFormat,a.fn.timepicker.formatTime(d,c)},getTime:function(b){var c=this,d=a.fn.timepicker.parseTime(b.element.val());return d instanceof Date&&!c._isValidTime(b,d)?null:d instanceof Date&&b.selectedTime?b.format(d)===b.format(b.selectedTime)?b.selectedTime:d:d instanceof Date?d:null},setTime:function(b,c,e){var f=this,g=b.selectedTime;if("string"==typeof c&&(c=b.parse(c)),c&&c.getMinutes&&f._isValidTime(b,c)){if(c=d(c),b.selectedTime=c,b.element.val(b.format(c,b.options.timeFormat)),e)return b}else b.selectedTime=null;return(null!==g||null!==b.selectedTime)&&(b.element.trigger("time-change",[c]),a.isFunction(b.options.change)&&b.options.change.apply(b.element,[c])),b.element},option:function(b,c,d){if("undefined"==typeof d)return b.options[c];var e,f,g=b.getTime();"string"==typeof c?(e={},e[c]=d):e=c,f=["minHour","minMinutes","minTime","maxHour","maxMinutes","maxTime","startHour","startMinutes","startTime","timeFormat","interval","dropdown"],a.each(e,function(c){b.options[c]=e[c],b.rebuild=b.rebuild||a.inArray(c,f)>-1}),b.rebuild&&b.setTime(g)}},a.TimePicker.defaults={timeFormat:"hh:mm p",minHour:null,minMinutes:null,minTime:null,maxHour:null,maxMinutes:null,maxTime:null,startHour:null,startMinutes:null,startTime:null,interval:30,dynamic:!0,theme:"standard",zindex:null,dropdown:!0,scrollbar:!1,change:function(){}},a.TimePicker.methods={chainable:["next","previous","open","close","destroy","setTime"]},a.fn.timepicker=function(b){if("string"==typeof b){var c,d,e=Array.prototype.slice.call(arguments,1);return c="option"===b&&arguments.length>2?"each":-1!==a.inArray(b,a.TimePicker.methods.chainable)?"each":"map",d=this[c](function(){var c=a(this),d=c.data("TimePicker");return"object"==typeof d?d[b].apply(d,e):void 0}),"map"===c&&1===this.length?a.makeArray(d).shift():"map"===c?a.makeArray(d):d}if(1===this.length&&this.data("TimePicker"))return this.data("TimePicker");var f=a.extend({},a.TimePicker.defaults,b);return this.each(function(){a.TimePicker.instance().register(this,f)})},a.fn.timepicker.formatTime=function(a,c){var d=c.getHours(),e=d%12,f=c.getMinutes(),g=c.getSeconds(),h={hh:b((0===e?12:e).toString(),"0",2),HH:b(d.toString(),"0",2),mm:b(f.toString(),"0",2),ss:b(g.toString(),"0",2),h:0===e?12:e,H:d,m:f,s:g,p:d>11?"PM":"AM"},i=a,j="";for(j in h)h.hasOwnProperty(j)&&(i=i.replace(new RegExp(j,"g"),h[j]));return i=i.replace(new RegExp("a","g"),d>11?"pm":"am")},a.fn.timepicker.parseTime=function(){var b=[[/^(\d+)$/,"$1"],[/^:(\d)$/,"$10"],[/^:(\d+)/,"$1"],[/^(\d):([7-9])$/,"0$10$2"],[/^(\d):(\d\d)$/,"$1$2"],[/^(\d):(\d{1,})$/,"0$1$20"],[/^(\d\d):([7-9])$/,"$10$2"],[/^(\d\d):(\d)$/,"$1$20"],[/^(\d\d):(\d*)$/,"$1$2"],[/^(\d{3,}):(\d)$/,"$10$2"],[/^(\d{3,}):(\d{2,})/,"$1$2"],[/^(\d):(\d):(\d)$/,"0$10$20$3"],[/^(\d{1,2}):(\d):(\d\d)/,"$10$2$3"]],c=b.length;return function(e){var f=d(new Date),g=!1,h=!1,i=!1,j=!1,k=!1;if("undefined"==typeof e||!e.toLowerCase)return null;e=e.toLowerCase(),g=/a/.test(e),h=g?!1:/p/.test(e),e=e.replace(/[^0-9:]/g,"").replace(/:+/g,":");for(var l=0;c>l;l+=1)if(b[l][0].test(e)){e=e.replace(b[l][0],b[l][1]);break}return e=e.replace(/:/g,""),1===e.length?i=e:2===e.length?i=e:3===e.length||5===e.length?(i=e.substr(0,1),j=e.substr(1,2),k=e.substr(3,2)):(4===e.length||e.length>5)&&(i=e.substr(0,2),j=e.substr(2,2),k=e.substr(4,2)),e.length>0&&e.length<5&&(e.length<3&&(j=0),k=0),i===!1||j===!1||k===!1?!1:(i=parseInt(i,10),j=parseInt(j,10),k=parseInt(k,10),g&&12===i?i=0:h&&12>i&&(i+=12),i>24?e.length>=6?a.fn.timepicker.parseTime(e.substr(0,5)):a.fn.timepicker.parseTime(e+"0"+(g?"a":"")+(h?"p":"")):(f.setHours(i,j,k),f))}}()}()});
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports!=="undefined"){module.exports=factory(require("jquery"))}else{factory(jQuery)}})(function($){"use strict";var Slick=window.Slick||{};Slick=function(){var instanceUid=0;function Slick(element,settings){var _=this,dataSettings;_.defaults={accessibility:true,adaptiveHeight:false,appendArrows:$(element),appendDots:$(element),arrows:true,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:false,autoplaySpeed:3e3,centerMode:false,centerPadding:"50px",cssEase:"ease",customPaging:function(slider,i){return $('<button type="button" />').text(i+1)},dots:false,dotsClass:"slick-dots",draggable:true,easing:"linear",edgeFriction:.35,fade:false,focusOnSelect:false,focusOnChange:false,infinite:true,initialSlide:0,lazyLoad:"ondemand",mobileFirst:false,pauseOnHover:true,pauseOnFocus:true,pauseOnDotsHover:false,respondTo:"window",responsive:null,rows:1,rtl:false,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:true,swipeToSlide:false,touchMove:true,touchThreshold:5,useCSS:true,useTransform:true,variableWidth:false,vertical:false,verticalSwiping:false,waitForAnimate:true,zIndex:1e3};_.initials={animating:false,dragging:false,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:false,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:false,slideOffset:0,swipeLeft:null,swiping:false,$list:null,touchObject:{},transformsEnabled:false,unslicked:false};$.extend(_,_.initials);_.activeBreakpoint=null;_.animType=null;_.animProp=null;_.breakpoints=[];_.breakpointSettings=[];_.cssTransitions=false;_.focussed=false;_.interrupted=false;_.hidden="hidden";_.paused=true;_.positionProp=null;_.respondTo=null;_.rowCount=1;_.shouldClick=true;_.$slider=$(element);_.$slidesCache=null;_.transformType=null;_.transitionType=null;_.visibilityChange="visibilitychange";_.windowWidth=0;_.windowTimer=null;dataSettings=$(element).data("slick")||{};_.options=$.extend({},_.defaults,settings,dataSettings);_.currentSlide=_.options.initialSlide;_.originalSettings=_.options;if(typeof document.mozHidden!=="undefined"){_.hidden="mozHidden";_.visibilityChange="mozvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){_.hidden="webkitHidden";_.visibilityChange="webkitvisibilitychange"}_.autoPlay=$.proxy(_.autoPlay,_);_.autoPlayClear=$.proxy(_.autoPlayClear,_);_.autoPlayIterator=$.proxy(_.autoPlayIterator,_);_.changeSlide=$.proxy(_.changeSlide,_);_.clickHandler=$.proxy(_.clickHandler,_);_.selectHandler=$.proxy(_.selectHandler,_);_.setPosition=$.proxy(_.setPosition,_);_.swipeHandler=$.proxy(_.swipeHandler,_);_.dragHandler=$.proxy(_.dragHandler,_);_.keyHandler=$.proxy(_.keyHandler,_);_.instanceUid=instanceUid++;_.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/;_.registerBreakpoints();_.init(true)}return Slick}();Slick.prototype.activateADA=function(){var _=this;_.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})};Slick.prototype.addSlide=Slick.prototype.slickAdd=function(markup,index,addBefore){var _=this;if(typeof index==="boolean"){addBefore=index;index=null}else if(index<0||index>=_.slideCount){return false}_.unload();if(typeof index==="number"){if(index===0&&_.$slides.length===0){$(markup).appendTo(_.$slideTrack)}else if(addBefore){$(markup).insertBefore(_.$slides.eq(index))}else{$(markup).insertAfter(_.$slides.eq(index))}}else{if(addBefore===true){$(markup).prependTo(_.$slideTrack)}else{$(markup).appendTo(_.$slideTrack)}}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slides.each(function(index,element){$(element).attr("data-slick-index",index)});_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.animateHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.animate({height:targetHeight},_.options.speed)}};Slick.prototype.animateSlide=function(targetLeft,callback){var animProps={},_=this;_.animateHeight();if(_.options.rtl===true&&_.options.vertical===false){targetLeft=-targetLeft}if(_.transformsEnabled===false){if(_.options.vertical===false){_.$slideTrack.animate({left:targetLeft},_.options.speed,_.options.easing,callback)}else{_.$slideTrack.animate({top:targetLeft},_.options.speed,_.options.easing,callback)}}else{if(_.cssTransitions===false){if(_.options.rtl===true){_.currentLeft=-_.currentLeft}$({animStart:_.currentLeft}).animate({animStart:targetLeft},{duration:_.options.speed,easing:_.options.easing,step:function(now){now=Math.ceil(now);if(_.options.vertical===false){animProps[_.animType]="translate("+now+"px, 0px)";_.$slideTrack.css(animProps)}else{animProps[_.animType]="translate(0px,"+now+"px)";_.$slideTrack.css(animProps)}},complete:function(){if(callback){callback.call()}}})}else{_.applyTransition();targetLeft=Math.ceil(targetLeft);if(_.options.vertical===false){animProps[_.animType]="translate3d("+targetLeft+"px, 0px, 0px)"}else{animProps[_.animType]="translate3d(0px,"+targetLeft+"px, 0px)"}_.$slideTrack.css(animProps);if(callback){setTimeout(function(){_.disableTransition();callback.call()},_.options.speed)}}}};Slick.prototype.getNavTarget=function(){var _=this,asNavFor=_.options.asNavFor;if(asNavFor&&asNavFor!==null){asNavFor=$(asNavFor).not(_.$slider)}return asNavFor};Slick.prototype.asNavFor=function(index){var _=this,asNavFor=_.getNavTarget();if(asNavFor!==null&&typeof asNavFor==="object"){asNavFor.each(function(){var target=$(this).slick("getSlick");if(!target.unslicked){target.slideHandler(index,true)}})}};Slick.prototype.applyTransition=function(slide){var _=this,transition={};if(_.options.fade===false){transition[_.transitionType]=_.transformType+" "+_.options.speed+"ms "+_.options.cssEase}else{transition[_.transitionType]="opacity "+_.options.speed+"ms "+_.options.cssEase}if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.autoPlay=function(){var _=this;_.autoPlayClear();if(_.slideCount>_.options.slidesToShow){_.autoPlayTimer=setInterval(_.autoPlayIterator,_.options.autoplaySpeed)}};Slick.prototype.autoPlayClear=function(){var _=this;if(_.autoPlayTimer){clearInterval(_.autoPlayTimer)}};Slick.prototype.autoPlayIterator=function(){var _=this,slideTo=_.currentSlide+_.options.slidesToScroll;if(!_.paused&&!_.interrupted&&!_.focussed){if(_.options.infinite===false){if(_.direction===1&&_.currentSlide+1===_.slideCount-1){_.direction=0}else if(_.direction===0){slideTo=_.currentSlide-_.options.slidesToScroll;if(_.currentSlide-1===0){_.direction=1}}}_.slideHandler(slideTo)}};Slick.prototype.buildArrows=function(){var _=this;if(_.options.arrows===true){_.$prevArrow=$(_.options.prevArrow).addClass("slick-arrow");_.$nextArrow=$(_.options.nextArrow).addClass("slick-arrow");if(_.slideCount>_.options.slidesToShow){_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");_.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.prependTo(_.options.appendArrows)}if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.appendTo(_.options.appendArrows)}if(_.options.infinite!==true){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")}}else{_.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"})}}};Slick.prototype.buildDots=function(){var _=this,i,dot;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$slider.addClass("slick-dotted");dot=$("<ul />").addClass(_.options.dotsClass);for(i=0;i<=_.getDotCount();i+=1){dot.append($("<li />").append(_.options.customPaging.call(this,_,i)))}_.$dots=dot.appendTo(_.options.appendDots);_.$dots.find("li").first().addClass("slick-active")}};Slick.prototype.buildOut=function(){var _=this;_.$slides=_.$slider.children(_.options.slide+":not(.slick-cloned)").addClass("slick-slide");_.slideCount=_.$slides.length;_.$slides.each(function(index,element){$(element).attr("data-slick-index",index).data("originalStyling",$(element).attr("style")||"")});_.$slider.addClass("slick-slider");_.$slideTrack=_.slideCount===0?$('<div class="slick-track"/>').appendTo(_.$slider):_.$slides.wrapAll('<div class="slick-track"/>').parent();_.$list=_.$slideTrack.wrap('<div class="slick-list"/>').parent();_.$slideTrack.css("opacity",0);if(_.options.centerMode===true||_.options.swipeToSlide===true){_.options.slidesToScroll=1}$("img[data-lazy]",_.$slider).not("[src]").addClass("slick-loading");_.setupInfinite();_.buildArrows();_.buildDots();_.updateDots();_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);if(_.options.draggable===true){_.$list.addClass("draggable")}};Slick.prototype.buildRows=function(){var _=this,a,b,c,newSlides,numOfSlides,originalSlides,slidesPerSection;newSlides=document.createDocumentFragment();originalSlides=_.$slider.children();if(_.options.rows>0){slidesPerSection=_.options.slidesPerRow*_.options.rows;numOfSlides=Math.ceil(originalSlides.length/slidesPerSection);for(a=0;a<numOfSlides;a++){var slide=document.createElement("div");for(b=0;b<_.options.rows;b++){var row=document.createElement("div");for(c=0;c<_.options.slidesPerRow;c++){var target=a*slidesPerSection+(b*_.options.slidesPerRow+c);if(originalSlides.get(target)){row.appendChild(originalSlides.get(target))}}slide.appendChild(row)}newSlides.appendChild(slide)}_.$slider.empty().append(newSlides);_.$slider.children().children().children().css({width:100/_.options.slidesPerRow+"%",display:"inline-block"})}};Slick.prototype.checkResponsive=function(initial,forceUpdate){var _=this,breakpoint,targetBreakpoint,respondToWidth,triggerBreakpoint=false;var sliderWidth=_.$slider.width();var windowWidth=window.innerWidth||$(window).width();if(_.respondTo==="window"){respondToWidth=windowWidth}else if(_.respondTo==="slider"){respondToWidth=sliderWidth}else if(_.respondTo==="min"){respondToWidth=Math.min(windowWidth,sliderWidth)}if(_.options.responsive&&_.options.responsive.length&&_.options.responsive!==null){targetBreakpoint=null;for(breakpoint in _.breakpoints){if(_.breakpoints.hasOwnProperty(breakpoint)){if(_.originalSettings.mobileFirst===false){if(respondToWidth<_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}else{if(respondToWidth>_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}}}if(targetBreakpoint!==null){if(_.activeBreakpoint!==null){if(targetBreakpoint!==_.activeBreakpoint||forceUpdate){_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{if(_.activeBreakpoint!==null){_.activeBreakpoint=null;_.options=_.originalSettings;if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial);triggerBreakpoint=targetBreakpoint}}if(!initial&&triggerBreakpoint!==false){_.$slider.trigger("breakpoint",[_,triggerBreakpoint])}}};Slick.prototype.changeSlide=function(event,dontAnimate){var _=this,$target=$(event.currentTarget),indexOffset,slideOffset,unevenOffset;if($target.is("a")){event.preventDefault()}if(!$target.is("li")){$target=$target.closest("li")}unevenOffset=_.slideCount%_.options.slidesToScroll!==0;indexOffset=unevenOffset?0:(_.slideCount-_.currentSlide)%_.options.slidesToScroll;switch(event.data.message){case"previous":slideOffset=indexOffset===0?_.options.slidesToScroll:_.options.slidesToShow-indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide-slideOffset,false,dontAnimate)}break;case"next":slideOffset=indexOffset===0?_.options.slidesToScroll:indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide+slideOffset,false,dontAnimate)}break;case"index":var index=event.data.index===0?0:event.data.index||$target.index()*_.options.slidesToScroll;_.slideHandler(_.checkNavigable(index),false,dontAnimate);$target.children().trigger("focus");break;default:return}};Slick.prototype.checkNavigable=function(index){var _=this,navigables,prevNavigable;navigables=_.getNavigableIndexes();prevNavigable=0;if(index>navigables[navigables.length-1]){index=navigables[navigables.length-1]}else{for(var n in navigables){if(index<navigables[n]){index=prevNavigable;break}prevNavigable=navigables[n]}}return index};Slick.prototype.cleanUpEvents=function(){var _=this;if(_.options.dots&&_.$dots!==null){$("li",_.$dots).off("click.slick",_.changeSlide).off("mouseenter.slick",$.proxy(_.interrupt,_,true)).off("mouseleave.slick",$.proxy(_.interrupt,_,false));if(_.options.accessibility===true){_.$dots.off("keydown.slick",_.keyHandler)}}_.$slider.off("focus.slick blur.slick");if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow&&_.$prevArrow.off("click.slick",_.changeSlide);_.$nextArrow&&_.$nextArrow.off("click.slick",_.changeSlide);if(_.options.accessibility===true){_.$prevArrow&&_.$prevArrow.off("keydown.slick",_.keyHandler);_.$nextArrow&&_.$nextArrow.off("keydown.slick",_.keyHandler)}}_.$list.off("touchstart.slick mousedown.slick",_.swipeHandler);_.$list.off("touchmove.slick mousemove.slick",_.swipeHandler);_.$list.off("touchend.slick mouseup.slick",_.swipeHandler);_.$list.off("touchcancel.slick mouseleave.slick",_.swipeHandler);_.$list.off("click.slick",_.clickHandler);$(document).off(_.visibilityChange,_.visibility);_.cleanUpSlideEvents();if(_.options.accessibility===true){_.$list.off("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().off("click.slick",_.selectHandler)}$(window).off("orientationchange.slick.slick-"+_.instanceUid,_.orientationChange);$(window).off("resize.slick.slick-"+_.instanceUid,_.resize);$("[draggable!=true]",_.$slideTrack).off("dragstart",_.preventDefault);$(window).off("load.slick.slick-"+_.instanceUid,_.setPosition)};Slick.prototype.cleanUpSlideEvents=function(){var _=this;_.$list.off("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.off("mouseleave.slick",$.proxy(_.interrupt,_,false))};Slick.prototype.cleanUpRows=function(){var _=this,originalSlides;if(_.options.rows>0){originalSlides=_.$slides.children().children();originalSlides.removeAttr("style");_.$slider.empty().append(originalSlides)}};Slick.prototype.clickHandler=function(event){var _=this;if(_.shouldClick===false){event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()}};Slick.prototype.destroy=function(refresh){var _=this;_.autoPlayClear();_.touchObject={};_.cleanUpEvents();$(".slick-cloned",_.$slider).detach();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.$prevArrow.length){_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}}if(_.$nextArrow&&_.$nextArrow.length){_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}}if(_.$slides){_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){$(this).attr("style",$(this).data("originalStyling"))});_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.detach();_.$list.detach();_.$slider.append(_.$slides)}_.cleanUpRows();_.$slider.removeClass("slick-slider");_.$slider.removeClass("slick-initialized");_.$slider.removeClass("slick-dotted");_.unslicked=true;if(!refresh){_.$slider.trigger("destroy",[_])}};Slick.prototype.disableTransition=function(slide){var _=this,transition={};transition[_.transitionType]="";if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.fadeSlide=function(slideIndex,callback){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).css({zIndex:_.options.zIndex});_.$slides.eq(slideIndex).animate({opacity:1},_.options.speed,_.options.easing,callback)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:1,zIndex:_.options.zIndex});if(callback){setTimeout(function(){_.disableTransition(slideIndex);callback.call()},_.options.speed)}}};Slick.prototype.fadeSlideOut=function(slideIndex){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).animate({opacity:0,zIndex:_.options.zIndex-2},_.options.speed,_.options.easing)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:0,zIndex:_.options.zIndex-2})}};Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(filter){var _=this;if(filter!==null){_.$slidesCache=_.$slides;_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.filter(filter).appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.focusHandler=function(){var _=this;_.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(event){var $sf=$(this);setTimeout(function(){if(_.options.pauseOnFocus){if($sf.is(":focus")){_.focussed=true;_.autoPlay()}}},0)}).on("blur.slick","*",function(event){var $sf=$(this);if(_.options.pauseOnFocus){_.focussed=false;_.autoPlay()}})};Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){var _=this;return _.currentSlide};Slick.prototype.getDotCount=function(){var _=this;var breakPoint=0;var counter=0;var pagerQty=0;if(_.options.infinite===true){if(_.slideCount<=_.options.slidesToShow){++pagerQty}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}}else if(_.options.centerMode===true){pagerQty=_.slideCount}else if(!_.options.asNavFor){pagerQty=1+Math.ceil((_.slideCount-_.options.slidesToShow)/_.options.slidesToScroll)}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}return pagerQty-1};Slick.prototype.getLeft=function(slideIndex){var _=this,targetLeft,verticalHeight,verticalOffset=0,targetSlide,coef;_.slideOffset=0;verticalHeight=_.$slides.first().outerHeight(true);if(_.options.infinite===true){if(_.slideCount>_.options.slidesToShow){_.slideOffset=_.slideWidth*_.options.slidesToShow*-1;coef=-1;if(_.options.vertical===true&&_.options.centerMode===true){if(_.options.slidesToShow===2){coef=-1.5}else if(_.options.slidesToShow===1){coef=-2}}verticalOffset=verticalHeight*_.options.slidesToShow*coef}if(_.slideCount%_.options.slidesToScroll!==0){if(slideIndex+_.options.slidesToScroll>_.slideCount&&_.slideCount>_.options.slidesToShow){if(slideIndex>_.slideCount){_.slideOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*_.slideWidth*-1;verticalOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*verticalHeight*-1}else{_.slideOffset=_.slideCount%_.options.slidesToScroll*_.slideWidth*-1;verticalOffset=_.slideCount%_.options.slidesToScroll*verticalHeight*-1}}}}else{if(slideIndex+_.options.slidesToShow>_.slideCount){_.slideOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*_.slideWidth;verticalOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*verticalHeight}}if(_.slideCount<=_.options.slidesToShow){_.slideOffset=0;verticalOffset=0}if(_.options.centerMode===true&&_.slideCount<=_.options.slidesToShow){_.slideOffset=_.slideWidth*Math.floor(_.options.slidesToShow)/2-_.slideWidth*_.slideCount/2}else if(_.options.centerMode===true&&_.options.infinite===true){_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)-_.slideWidth}else if(_.options.centerMode===true){_.slideOffset=0;_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)}if(_.options.vertical===false){targetLeft=slideIndex*_.slideWidth*-1+_.slideOffset}else{targetLeft=slideIndex*verticalHeight*-1+verticalOffset}if(_.options.variableWidth===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}if(_.options.centerMode===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow+1)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}targetLeft+=(_.$list.width()-targetSlide.outerWidth())/2}}return targetLeft};Slick.prototype.getOption=Slick.prototype.slickGetOption=function(option){var _=this;return _.options[option]};Slick.prototype.getNavigableIndexes=function(){var _=this,breakPoint=0,counter=0,indexes=[],max;if(_.options.infinite===false){max=_.slideCount}else{breakPoint=_.options.slidesToScroll*-1;counter=_.options.slidesToScroll*-1;max=_.slideCount*2}while(breakPoint<max){indexes.push(breakPoint);breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}return indexes};Slick.prototype.getSlick=function(){return this};Slick.prototype.getSlideCount=function(){var _=this,slidesTraversed,swipedSlide,swipeTarget,centerOffset;centerOffset=_.options.centerMode===true?Math.floor(_.$list.width()/2):0;swipeTarget=_.swipeLeft*-1+centerOffset;if(_.options.swipeToSlide===true){_.$slideTrack.find(".slick-slide").each(function(index,slide){var slideOuterWidth,slideOffset,slideRightBoundary;slideOuterWidth=$(slide).outerWidth();slideOffset=slide.offsetLeft;if(_.options.centerMode!==true){slideOffset+=slideOuterWidth/2}slideRightBoundary=slideOffset+slideOuterWidth;if(swipeTarget<slideRightBoundary){swipedSlide=slide;return false}});slidesTraversed=Math.abs($(swipedSlide).attr("data-slick-index")-_.currentSlide)||1;return slidesTraversed}else{return _.options.slidesToScroll}};Slick.prototype.goTo=Slick.prototype.slickGoTo=function(slide,dontAnimate){var _=this;_.changeSlide({data:{message:"index",index:parseInt(slide)}},dontAnimate)};Slick.prototype.init=function(creation){var _=this;if(!$(_.$slider).hasClass("slick-initialized")){$(_.$slider).addClass("slick-initialized");_.buildRows();_.buildOut();_.setProps();_.startLoad();_.loadSlider();_.initializeEvents();_.updateArrows();_.updateDots();_.checkResponsive(true);_.focusHandler()}if(creation){_.$slider.trigger("init",[_])}if(_.options.accessibility===true){_.initADA()}if(_.options.autoplay){_.paused=false;_.autoPlay()}};Slick.prototype.initADA=function(){var _=this,numDotGroups=Math.ceil(_.slideCount/_.options.slidesToShow),tabControlIndexes=_.getNavigableIndexes().filter(function(val){return val>=0&&val<_.slideCount});_.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"});if(_.$dots!==null){_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function(i){var slideControlIndex=tabControlIndexes.indexOf(i);$(this).attr({role:"tabpanel",id:"slick-slide"+_.instanceUid+i,tabindex:-1});if(slideControlIndex!==-1){var ariaButtonControl="slick-slide-control"+_.instanceUid+slideControlIndex;if($("#"+ariaButtonControl).length){$(this).attr({"aria-describedby":ariaButtonControl})}}});_.$dots.attr("role","tablist").find("li").each(function(i){var mappedSlideIndex=tabControlIndexes[i];$(this).attr({role:"presentation"});$(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+_.instanceUid+i,"aria-controls":"slick-slide"+_.instanceUid+mappedSlideIndex,"aria-label":i+1+" of "+numDotGroups,"aria-selected":null,tabindex:"-1"})}).eq(_.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end()}for(var i=_.currentSlide,max=i+_.options.slidesToShow;i<max;i++){if(_.options.focusOnChange){_.$slides.eq(i).attr({tabindex:"0"})}else{_.$slides.eq(i).removeAttr("tabindex")}}_.activateADA()};Slick.prototype.initArrowEvents=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},_.changeSlide);_.$nextArrow.off("click.slick").on("click.slick",{message:"next"},_.changeSlide);if(_.options.accessibility===true){_.$prevArrow.on("keydown.slick",_.keyHandler);_.$nextArrow.on("keydown.slick",_.keyHandler)}}};Slick.prototype.initDotEvents=function(){var _=this;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("click.slick",{message:"index"},_.changeSlide);if(_.options.accessibility===true){_.$dots.on("keydown.slick",_.keyHandler)}}if(_.options.dots===true&&_.options.pauseOnDotsHover===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("mouseenter.slick",$.proxy(_.interrupt,_,true)).on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initSlideEvents=function(){var _=this;if(_.options.pauseOnHover){_.$list.on("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initializeEvents=function(){var _=this;_.initArrowEvents();_.initDotEvents();_.initSlideEvents();_.$list.on("touchstart.slick mousedown.slick",{action:"start"},_.swipeHandler);_.$list.on("touchmove.slick mousemove.slick",{action:"move"},_.swipeHandler);_.$list.on("touchend.slick mouseup.slick",{action:"end"},_.swipeHandler);_.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},_.swipeHandler);_.$list.on("click.slick",_.clickHandler);$(document).on(_.visibilityChange,$.proxy(_.visibility,_));if(_.options.accessibility===true){_.$list.on("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}$(window).on("orientationchange.slick.slick-"+_.instanceUid,$.proxy(_.orientationChange,_));$(window).on("resize.slick.slick-"+_.instanceUid,$.proxy(_.resize,_));$("[draggable!=true]",_.$slideTrack).on("dragstart",_.preventDefault);$(window).on("load.slick.slick-"+_.instanceUid,_.setPosition);$(_.setPosition)};Slick.prototype.initUI=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.show();_.$nextArrow.show()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.show()}};Slick.prototype.keyHandler=function(event){var _=this;if(!event.target.tagName.match("TEXTAREA|INPUT|SELECT")){if(event.keyCode===37&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"next":"previous"}})}else if(event.keyCode===39&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"previous":"next"}})}}};Slick.prototype.lazyLoad=function(){var _=this,loadRange,cloneRange,rangeStart,rangeEnd;function loadImages(imagesScope){$("img[data-lazy]",imagesScope).each(function(){var image=$(this),imageSource=$(this).attr("data-lazy"),imageSrcSet=$(this).attr("data-srcset"),imageSizes=$(this).attr("data-sizes")||_.$slider.attr("data-sizes"),imageToLoad=document.createElement("img");imageToLoad.onload=function(){image.animate({opacity:0},100,function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).animate({opacity:1},200,function(){image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")});_.$slider.trigger("lazyLoaded",[_,image,imageSource])})};imageToLoad.onerror=function(){image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource])};imageToLoad.src=imageSource})}if(_.options.centerMode===true){if(_.options.infinite===true){rangeStart=_.currentSlide+(_.options.slidesToShow/2+1);rangeEnd=rangeStart+_.options.slidesToShow+2}else{rangeStart=Math.max(0,_.currentSlide-(_.options.slidesToShow/2+1));rangeEnd=2+(_.options.slidesToShow/2+1)+_.currentSlide}}else{rangeStart=_.options.infinite?_.options.slidesToShow+_.currentSlide:_.currentSlide;rangeEnd=Math.ceil(rangeStart+_.options.slidesToShow);if(_.options.fade===true){if(rangeStart>0)rangeStart--;if(rangeEnd<=_.slideCount)rangeEnd++}}loadRange=_.$slider.find(".slick-slide").slice(rangeStart,rangeEnd);if(_.options.lazyLoad==="anticipated"){var prevSlide=rangeStart-1,nextSlide=rangeEnd,$slides=_.$slider.find(".slick-slide");for(var i=0;i<_.options.slidesToScroll;i++){if(prevSlide<0)prevSlide=_.slideCount-1;loadRange=loadRange.add($slides.eq(prevSlide));loadRange=loadRange.add($slides.eq(nextSlide));prevSlide--;nextSlide++}}loadImages(loadRange);if(_.slideCount<=_.options.slidesToShow){cloneRange=_.$slider.find(".slick-slide");loadImages(cloneRange)}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow){cloneRange=_.$slider.find(".slick-cloned").slice(0,_.options.slidesToShow);loadImages(cloneRange)}else if(_.currentSlide===0){cloneRange=_.$slider.find(".slick-cloned").slice(_.options.slidesToShow*-1);loadImages(cloneRange)}};Slick.prototype.loadSlider=function(){var _=this;_.setPosition();_.$slideTrack.css({opacity:1});_.$slider.removeClass("slick-loading");_.initUI();if(_.options.lazyLoad==="progressive"){_.progressiveLazyLoad()}};Slick.prototype.next=Slick.prototype.slickNext=function(){var _=this;_.changeSlide({data:{message:"next"}})};Slick.prototype.orientationChange=function(){var _=this;_.checkResponsive();_.setPosition()};Slick.prototype.pause=Slick.prototype.slickPause=function(){var _=this;_.autoPlayClear();_.paused=true};Slick.prototype.play=Slick.prototype.slickPlay=function(){var _=this;_.autoPlay();_.options.autoplay=true;_.paused=false;_.focussed=false;_.interrupted=false};Slick.prototype.postSlide=function(index){var _=this;if(!_.unslicked){_.$slider.trigger("afterChange",[_,index]);_.animating=false;if(_.slideCount>_.options.slidesToShow){_.setPosition()}_.swipeLeft=null;if(_.options.autoplay){_.autoPlay()}if(_.options.accessibility===true){_.initADA();if(_.options.focusOnChange){var $currentSlide=$(_.$slides.get(_.currentSlide));$currentSlide.attr("tabindex",0).focus()}}}};Slick.prototype.prev=Slick.prototype.slickPrev=function(){var _=this;_.changeSlide({data:{message:"previous"}})};Slick.prototype.preventDefault=function(event){event.preventDefault()};Slick.prototype.progressiveLazyLoad=function(tryCount){tryCount=tryCount||1;var _=this,$imgsToLoad=$("img[data-lazy]",_.$slider),image,imageSource,imageSrcSet,imageSizes,imageToLoad;if($imgsToLoad.length){image=$imgsToLoad.first();imageSource=image.attr("data-lazy");imageSrcSet=image.attr("data-srcset");imageSizes=image.attr("data-sizes")||_.$slider.attr("data-sizes");imageToLoad=document.createElement("img");imageToLoad.onload=function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");if(_.options.adaptiveHeight===true){_.setPosition()}_.$slider.trigger("lazyLoaded",[_,image,imageSource]);_.progressiveLazyLoad()};imageToLoad.onerror=function(){if(tryCount<3){setTimeout(function(){_.progressiveLazyLoad(tryCount+1)},500)}else{image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource]);_.progressiveLazyLoad()}};imageToLoad.src=imageSource}else{_.$slider.trigger("allImagesLoaded",[_])}};Slick.prototype.refresh=function(initializing){var _=this,currentSlide,lastVisibleIndex;lastVisibleIndex=_.slideCount-_.options.slidesToShow;if(!_.options.infinite&&_.currentSlide>lastVisibleIndex){_.currentSlide=lastVisibleIndex}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}currentSlide=_.currentSlide;_.destroy(true);$.extend(_,_.initials,{currentSlide:currentSlide});_.init();if(!initializing){_.changeSlide({data:{message:"index",index:currentSlide}},false)}};Slick.prototype.registerBreakpoints=function(){var _=this,breakpoint,currentBreakpoint,l,responsiveSettings=_.options.responsive||null;if($.type(responsiveSettings)==="array"&&responsiveSettings.length){_.respondTo=_.options.respondTo||"window";for(breakpoint in responsiveSettings){l=_.breakpoints.length-1;if(responsiveSettings.hasOwnProperty(breakpoint)){currentBreakpoint=responsiveSettings[breakpoint].breakpoint;while(l>=0){if(_.breakpoints[l]&&_.breakpoints[l]===currentBreakpoint){_.breakpoints.splice(l,1)}l--}_.breakpoints.push(currentBreakpoint);_.breakpointSettings[currentBreakpoint]=responsiveSettings[breakpoint].settings}}_.breakpoints.sort(function(a,b){return _.options.mobileFirst?a-b:b-a})}};Slick.prototype.reinit=function(){var _=this;_.$slides=_.$slideTrack.children(_.options.slide).addClass("slick-slide");_.slideCount=_.$slides.length;if(_.currentSlide>=_.slideCount&&_.currentSlide!==0){_.currentSlide=_.currentSlide-_.options.slidesToScroll}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}_.registerBreakpoints();_.setProps();_.setupInfinite();_.buildArrows();_.updateArrows();_.initArrowEvents();_.buildDots();_.updateDots();_.initDotEvents();_.cleanUpSlideEvents();_.initSlideEvents();_.checkResponsive(false,true);if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);_.setPosition();_.focusHandler();_.paused=!_.options.autoplay;_.autoPlay();_.$slider.trigger("reInit",[_])};Slick.prototype.resize=function(){var _=this;if($(window).width()!==_.windowWidth){clearTimeout(_.windowDelay);_.windowDelay=window.setTimeout(function(){_.windowWidth=$(window).width();_.checkResponsive();if(!_.unslicked){_.setPosition()}},50)}};Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(index,removeBefore,removeAll){var _=this;if(typeof index==="boolean"){removeBefore=index;index=removeBefore===true?0:_.slideCount-1}else{index=removeBefore===true?--index:index}if(_.slideCount<1||index<0||index>_.slideCount-1){return false}_.unload();if(removeAll===true){_.$slideTrack.children().remove()}else{_.$slideTrack.children(this.options.slide).eq(index).remove()}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.setCSS=function(position){var _=this,positionProps={},x,y;if(_.options.rtl===true){position=-position}x=_.positionProp=="left"?Math.ceil(position)+"px":"0px";y=_.positionProp=="top"?Math.ceil(position)+"px":"0px";positionProps[_.positionProp]=position;if(_.transformsEnabled===false){_.$slideTrack.css(positionProps)}else{positionProps={};if(_.cssTransitions===false){positionProps[_.animType]="translate("+x+", "+y+")";_.$slideTrack.css(positionProps)}else{positionProps[_.animType]="translate3d("+x+", "+y+", 0px)";_.$slideTrack.css(positionProps)}}};Slick.prototype.setDimensions=function(){var _=this;if(_.options.vertical===false){if(_.options.centerMode===true){_.$list.css({padding:"0px "+_.options.centerPadding})}}else{_.$list.height(_.$slides.first().outerHeight(true)*_.options.slidesToShow);if(_.options.centerMode===true){_.$list.css({padding:_.options.centerPadding+" 0px"})}}_.listWidth=_.$list.width();_.listHeight=_.$list.height();if(_.options.vertical===false&&_.options.variableWidth===false){_.slideWidth=Math.ceil(_.listWidth/_.options.slidesToShow);_.$slideTrack.width(Math.ceil(_.slideWidth*_.$slideTrack.children(".slick-slide").length))}else if(_.options.variableWidth===true){_.$slideTrack.width(5e3*_.slideCount)}else{_.slideWidth=Math.ceil(_.listWidth);_.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true)*_.$slideTrack.children(".slick-slide").length))}var offset=_.$slides.first().outerWidth(true)-_.$slides.first().width();if(_.options.variableWidth===false)_.$slideTrack.children(".slick-slide").width(_.slideWidth-offset)};Slick.prototype.setFade=function(){var _=this,targetLeft;_.$slides.each(function(index,element){targetLeft=_.slideWidth*index*-1;if(_.options.rtl===true){$(element).css({position:"relative",right:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}else{$(element).css({position:"relative",left:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}});_.$slides.eq(_.currentSlide).css({zIndex:_.options.zIndex-1,opacity:1})};Slick.prototype.setHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.css("height",targetHeight)}};Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){var _=this,l,item,option,value,refresh=false,type;if($.type(arguments[0])==="object"){option=arguments[0];refresh=arguments[1];type="multiple"}else if($.type(arguments[0])==="string"){option=arguments[0];value=arguments[1];refresh=arguments[2];if(arguments[0]==="responsive"&&$.type(arguments[1])==="array"){type="responsive"}else if(typeof arguments[1]!=="undefined"){type="single"}}if(type==="single"){_.options[option]=value}else if(type==="multiple"){$.each(option,function(opt,val){_.options[opt]=val})}else if(type==="responsive"){for(item in value){if($.type(_.options.responsive)!=="array"){_.options.responsive=[value[item]]}else{l=_.options.responsive.length-1;while(l>=0){if(_.options.responsive[l].breakpoint===value[item].breakpoint){_.options.responsive.splice(l,1)}l--}_.options.responsive.push(value[item])}}}if(refresh){_.unload();_.reinit()}};Slick.prototype.setPosition=function(){var _=this;_.setDimensions();_.setHeight();if(_.options.fade===false){_.setCSS(_.getLeft(_.currentSlide))}else{_.setFade()}_.$slider.trigger("setPosition",[_])};Slick.prototype.setProps=function(){var _=this,bodyStyle=document.body.style;_.positionProp=_.options.vertical===true?"top":"left";if(_.positionProp==="top"){_.$slider.addClass("slick-vertical")}else{_.$slider.removeClass("slick-vertical")}if(bodyStyle.WebkitTransition!==undefined||bodyStyle.MozTransition!==undefined||bodyStyle.msTransition!==undefined){if(_.options.useCSS===true){_.cssTransitions=true}}if(_.options.fade){if(typeof _.options.zIndex==="number"){if(_.options.zIndex<3){_.options.zIndex=3}}else{_.options.zIndex=_.defaults.zIndex}}if(bodyStyle.OTransform!==undefined){_.animType="OTransform";_.transformType="-o-transform";_.transitionType="OTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.MozTransform!==undefined){_.animType="MozTransform";_.transformType="-moz-transform";_.transitionType="MozTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.MozPerspective===undefined)_.animType=false}if(bodyStyle.webkitTransform!==undefined){_.animType="webkitTransform";_.transformType="-webkit-transform";_.transitionType="webkitTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.msTransform!==undefined){_.animType="msTransform";_.transformType="-ms-transform";_.transitionType="msTransition";if(bodyStyle.msTransform===undefined)_.animType=false}if(bodyStyle.transform!==undefined&&_.animType!==false){_.animType="transform";_.transformType="transform";_.transitionType="transition"}_.transformsEnabled=_.options.useTransform&&(_.animType!==null&&_.animType!==false)};Slick.prototype.setSlideClasses=function(index){var _=this,centerOffset,allSlides,indexOffset,remainder;allSlides=_.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true");_.$slides.eq(index).addClass("slick-current");if(_.options.centerMode===true){var evenCoef=_.options.slidesToShow%2===0?1:0;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.infinite===true){if(index>=centerOffset&&index<=_.slideCount-1-centerOffset){_.$slides.slice(index-centerOffset+evenCoef,index+centerOffset+1).addClass("slick-active").attr("aria-hidden","false")}else{indexOffset=_.options.slidesToShow+index;allSlides.slice(indexOffset-centerOffset+1+evenCoef,indexOffset+centerOffset+2).addClass("slick-active").attr("aria-hidden","false")}if(index===0){allSlides.eq(allSlides.length-1-_.options.slidesToShow).addClass("slick-center")}else if(index===_.slideCount-1){allSlides.eq(_.options.slidesToShow).addClass("slick-center")}}_.$slides.eq(index).addClass("slick-center")}else{if(index>=0&&index<=_.slideCount-_.options.slidesToShow){_.$slides.slice(index,index+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}else if(allSlides.length<=_.options.slidesToShow){allSlides.addClass("slick-active").attr("aria-hidden","false")}else{remainder=_.slideCount%_.options.slidesToShow;indexOffset=_.options.infinite===true?_.options.slidesToShow+index:index;if(_.options.slidesToShow==_.options.slidesToScroll&&_.slideCount-index<_.options.slidesToShow){allSlides.slice(indexOffset-(_.options.slidesToShow-remainder),indexOffset+remainder).addClass("slick-active").attr("aria-hidden","false")}else{allSlides.slice(indexOffset,indexOffset+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}}}if(_.options.lazyLoad==="ondemand"||_.options.lazyLoad==="anticipated"){_.lazyLoad()}};Slick.prototype.setupInfinite=function(){var _=this,i,slideIndex,infiniteCount;if(_.options.fade===true){_.options.centerMode=false}if(_.options.infinite===true&&_.options.fade===false){slideIndex=null;if(_.slideCount>_.options.slidesToShow){if(_.options.centerMode===true){infiniteCount=_.options.slidesToShow+1}else{infiniteCount=_.options.slidesToShow}for(i=_.slideCount;i>_.slideCount-infiniteCount;i-=1){slideIndex=i-1;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex-_.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned")}for(i=0;i<infiniteCount+_.slideCount;i+=1){slideIndex=i;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex+_.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned")}_.$slideTrack.find(".slick-cloned").find("[id]").each(function(){$(this).attr("id","")})}}};Slick.prototype.interrupt=function(toggle){var _=this;if(!toggle){_.autoPlay()}_.interrupted=toggle};Slick.prototype.selectHandler=function(event){var _=this;var targetElement=$(event.target).is(".slick-slide")?$(event.target):$(event.target).parents(".slick-slide");var index=parseInt(targetElement.attr("data-slick-index"));if(!index)index=0;if(_.slideCount<=_.options.slidesToShow){_.slideHandler(index,false,true);return}_.slideHandler(index)};Slick.prototype.slideHandler=function(index,sync,dontAnimate){var targetSlide,animSlide,oldSlide,slideLeft,targetLeft=null,_=this,navTarget;sync=sync||false;if(_.animating===true&&_.options.waitForAnimate===true){return}if(_.options.fade===true&&_.currentSlide===index){return}if(sync===false){_.asNavFor(index)}targetSlide=index;targetLeft=_.getLeft(targetSlide);slideLeft=_.getLeft(_.currentSlide);_.currentLeft=_.swipeLeft===null?slideLeft:_.swipeLeft;if(_.options.infinite===false&&_.options.centerMode===false&&(index<0||index>_.getDotCount()*_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}else if(_.options.infinite===false&&_.options.centerMode===true&&(index<0||index>_.slideCount-_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}if(_.options.autoplay){clearInterval(_.autoPlayTimer)}if(targetSlide<0){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=_.slideCount-_.slideCount%_.options.slidesToScroll}else{animSlide=_.slideCount+targetSlide}}else if(targetSlide>=_.slideCount){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=0}else{animSlide=targetSlide-_.slideCount}}else{animSlide=targetSlide}_.animating=true;_.$slider.trigger("beforeChange",[_,_.currentSlide,animSlide]);oldSlide=_.currentSlide;_.currentSlide=animSlide;_.setSlideClasses(_.currentSlide);if(_.options.asNavFor){navTarget=_.getNavTarget();navTarget=navTarget.slick("getSlick");if(navTarget.slideCount<=navTarget.options.slidesToShow){navTarget.setSlideClasses(_.currentSlide)}}_.updateDots();_.updateArrows();if(_.options.fade===true){if(dontAnimate!==true){_.fadeSlideOut(oldSlide);_.fadeSlide(animSlide,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}_.animateHeight();return}if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(targetLeft,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}};Slick.prototype.startLoad=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.hide();_.$nextArrow.hide()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.hide()}_.$slider.addClass("slick-loading")};Slick.prototype.swipeDirection=function(){var xDist,yDist,r,swipeAngle,_=this;xDist=_.touchObject.startX-_.touchObject.curX;yDist=_.touchObject.startY-_.touchObject.curY;r=Math.atan2(yDist,xDist);swipeAngle=Math.round(r*180/Math.PI);if(swipeAngle<0){swipeAngle=360-Math.abs(swipeAngle)}if(swipeAngle<=45&&swipeAngle>=0){return _.options.rtl===false?"left":"right"}if(swipeAngle<=360&&swipeAngle>=315){return _.options.rtl===false?"left":"right"}if(swipeAngle>=135&&swipeAngle<=225){return _.options.rtl===false?"right":"left"}if(_.options.verticalSwiping===true){if(swipeAngle>=35&&swipeAngle<=135){return"down"}else{return"up"}}return"vertical"};Slick.prototype.swipeEnd=function(event){var _=this,slideCount,direction;_.dragging=false;_.swiping=false;if(_.scrolling){_.scrolling=false;return false}_.interrupted=false;_.shouldClick=_.touchObject.swipeLength>10?false:true;if(_.touchObject.curX===undefined){return false}if(_.touchObject.edgeHit===true){_.$slider.trigger("edge",[_,_.swipeDirection()])}if(_.touchObject.swipeLength>=_.touchObject.minSwipe){direction=_.swipeDirection();switch(direction){case"left":case"down":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide+_.getSlideCount()):_.currentSlide+_.getSlideCount();_.currentDirection=0;break;case"right":case"up":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide-_.getSlideCount()):_.currentSlide-_.getSlideCount();_.currentDirection=1;break;default:}if(direction!="vertical"){_.slideHandler(slideCount);_.touchObject={};_.$slider.trigger("swipe",[_,direction])}}else{if(_.touchObject.startX!==_.touchObject.curX){_.slideHandler(_.currentSlide);_.touchObject={}}}};Slick.prototype.swipeHandler=function(event){var _=this;if(_.options.swipe===false||"ontouchend"in document&&_.options.swipe===false){return}else if(_.options.draggable===false&&event.type.indexOf("mouse")!==-1){return}_.touchObject.fingerCount=event.originalEvent&&event.originalEvent.touches!==undefined?event.originalEvent.touches.length:1;_.touchObject.minSwipe=_.listWidth/_.options.touchThreshold;if(_.options.verticalSwiping===true){_.touchObject.minSwipe=_.listHeight/_.options.touchThreshold}switch(event.data.action){case"start":_.swipeStart(event);break;case"move":_.swipeMove(event);break;case"end":_.swipeEnd(event);break}};Slick.prototype.swipeMove=function(event){var _=this,edgeWasHit=false,curLeft,swipeDirection,swipeLength,positionOffset,touches,verticalSwipeLength;touches=event.originalEvent!==undefined?event.originalEvent.touches:null;if(!_.dragging||_.scrolling||touches&&touches.length!==1){return false}curLeft=_.getLeft(_.currentSlide);_.touchObject.curX=touches!==undefined?touches[0].pageX:event.clientX;_.touchObject.curY=touches!==undefined?touches[0].pageY:event.clientY;_.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curX-_.touchObject.startX,2)));verticalSwipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curY-_.touchObject.startY,2)));if(!_.options.verticalSwiping&&!_.swiping&&verticalSwipeLength>4){_.scrolling=true;return false}if(_.options.verticalSwiping===true){_.touchObject.swipeLength=verticalSwipeLength}swipeDirection=_.swipeDirection();if(event.originalEvent!==undefined&&_.touchObject.swipeLength>4){_.swiping=true;event.preventDefault()}positionOffset=(_.options.rtl===false?1:-1)*(_.touchObject.curX>_.touchObject.startX?1:-1);if(_.options.verticalSwiping===true){positionOffset=_.touchObject.curY>_.touchObject.startY?1:-1}swipeLength=_.touchObject.swipeLength;_.touchObject.edgeHit=false;if(_.options.infinite===false){if(_.currentSlide===0&&swipeDirection==="right"||_.currentSlide>=_.getDotCount()&&swipeDirection==="left"){swipeLength=_.touchObject.swipeLength*_.options.edgeFriction;_.touchObject.edgeHit=true}}if(_.options.vertical===false){_.swipeLeft=curLeft+swipeLength*positionOffset}else{_.swipeLeft=curLeft+swipeLength*(_.$list.height()/_.listWidth)*positionOffset}if(_.options.verticalSwiping===true){_.swipeLeft=curLeft+swipeLength*positionOffset}if(_.options.fade===true||_.options.touchMove===false){return false}if(_.animating===true){_.swipeLeft=null;return false}_.setCSS(_.swipeLeft)};Slick.prototype.swipeStart=function(event){var _=this,touches;_.interrupted=true;if(_.touchObject.fingerCount!==1||_.slideCount<=_.options.slidesToShow){_.touchObject={};return false}if(event.originalEvent!==undefined&&event.originalEvent.touches!==undefined){touches=event.originalEvent.touches[0]}_.touchObject.startX=_.touchObject.curX=touches!==undefined?touches.pageX:event.clientX;_.touchObject.startY=_.touchObject.curY=touches!==undefined?touches.pageY:event.clientY;_.dragging=true};Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var _=this;if(_.$slidesCache!==null){_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.unload=function(){var _=this;$(".slick-cloned",_.$slider).remove();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}if(_.$nextArrow&&_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}_.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")};Slick.prototype.unslick=function(fromBreakpoint){var _=this;_.$slider.trigger("unslick",[_,fromBreakpoint]);_.destroy()};Slick.prototype.updateArrows=function(){var _=this,centerOffset;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow&&!_.options.infinite){_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false");if(_.currentSlide===0){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow&&_.options.centerMode===false){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-1&&_.options.centerMode===true){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}}};Slick.prototype.updateDots=function(){var _=this;if(_.$dots!==null){_.$dots.find("li").removeClass("slick-active").end();_.$dots.find("li").eq(Math.floor(_.currentSlide/_.options.slidesToScroll)).addClass("slick-active")}};Slick.prototype.visibility=function(){var _=this;if(_.options.autoplay){if(document[_.hidden]){_.interrupted=true}else{_.interrupted=false}}};$.fn.slick=function(){var _=this,opt=arguments[0],args=Array.prototype.slice.call(arguments,1),l=_.length,i,ret;for(i=0;i<l;i++){if(typeof opt=="object"||typeof opt=="undefined")_[i].slick=new Slick(_[i],opt);else ret=_[i].slick[opt].apply(_[i].slick,args);if(typeof ret!="undefined")return ret}return _}});

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).noUiSlider={})}(this,function(st){"use strict";function n(t){return"object"==typeof t&&"function"==typeof t.to}function at(t){t.parentElement.removeChild(t)}function lt(t){return null!=t}function ut(t){t.preventDefault()}function i(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)}function ct(t,e,r){0<r&&(dt(t,e),setTimeout(function(){ht(t,e)},r))}function pt(t){return Math.max(Math.min(t,100),0)}function ft(t){return Array.isArray(t)?t:[t]}function e(t){t=(t=String(t)).split(".");return 1<t.length?t[1].length:0}function dt(t,e){t.classList&&!/\s/.test(e)?t.classList.add(e):t.className+=" "+e}function ht(t,e){t.classList&&!/\s/.test(e)?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")}function mt(t){var e=void 0!==window.pageXOffset,r="CSS1Compat"===(t.compatMode||"");return{x:e?window.pageXOffset:(r?t.documentElement:t.body).scrollLeft,y:e?window.pageYOffset:(r?t.documentElement:t.body).scrollTop}}function s(t,e){return 100/(e-t)}function a(t,e,r){return 100*e/(t[r+1]-t[r])}function l(t,e){for(var r=1;t>=e[r];)r+=1;return r}function r(t,e,r){if(r>=t.slice(-1)[0])return 100;var n=l(r,t),i=t[n-1],o=t[n],t=e[n-1],n=e[n];return t+(r=r,a(o=[i,o],o[0]<0?r+Math.abs(o[0]):r-o[0],0)/s(t,n))}function o(t,e,r,n){if(100===n)return n;var i=l(n,t),o=t[i-1],s=t[i];return r?(s-o)/2<n-o?s:o:e[i-1]?t[i-1]+(t=n-t[i-1],i=e[i-1],Math.round(t/i)*i):n}st.PipsMode=void 0,(H=st.PipsMode||(st.PipsMode={})).Range="range",H.Steps="steps",H.Positions="positions",H.Count="count",H.Values="values",st.PipsType=void 0,(H=st.PipsType||(st.PipsType={}))[H.None=-1]="None",H[H.NoValue=0]="NoValue",H[H.LargeValue=1]="LargeValue",H[H.SmallValue=2]="SmallValue";var u=(t.prototype.getDistance=function(t){for(var e=[],r=0;r<this.xNumSteps.length-1;r++)e[r]=a(this.xVal,t,r);return e},t.prototype.getAbsoluteDistance=function(t,e,r){var n=0;if(t<this.xPct[this.xPct.length-1])for(;t>this.xPct[n+1];)n++;else t===this.xPct[this.xPct.length-1]&&(n=this.xPct.length-2);r||t!==this.xPct[n+1]||n++;for(var i,o=1,s=(e=null===e?[]:e)[n],a=0,l=0,u=0,c=r?(t-this.xPct[n])/(this.xPct[n+1]-this.xPct[n]):(this.xPct[n+1]-t)/(this.xPct[n+1]-this.xPct[n]);0<s;)i=this.xPct[n+1+u]-this.xPct[n+u],100<e[n+u]*o+100-100*c?(a=i*c,o=(s-100*c)/e[n+u],c=1):(a=e[n+u]*i/100*o,o=0),r?(l-=a,1<=this.xPct.length+u&&u--):(l+=a,1<=this.xPct.length-u&&u++),s=e[n+u]*o;return t+l},t.prototype.toStepping=function(t){return t=r(this.xVal,this.xPct,t)},t.prototype.fromStepping=function(t){return function(t,e,r){if(100<=r)return t.slice(-1)[0];var n=l(r,e),i=t[n-1],o=t[n],t=e[n-1],n=e[n];return(r-t)*s(t,n)*((o=[i,o])[1]-o[0])/100+o[0]}(this.xVal,this.xPct,t)},t.prototype.getStep=function(t){return t=o(this.xPct,this.xSteps,this.snap,t)},t.prototype.getDefaultStep=function(t,e,r){var n=l(t,this.xPct);return(100===t||e&&t===this.xPct[n-1])&&(n=Math.max(n-1,1)),(this.xVal[n]-this.xVal[n-1])/r},t.prototype.getNearbySteps=function(t){t=l(t,this.xPct);return{stepBefore:{startValue:this.xVal[t-2],step:this.xNumSteps[t-2],highestStep:this.xHighestCompleteStep[t-2]},thisStep:{startValue:this.xVal[t-1],step:this.xNumSteps[t-1],highestStep:this.xHighestCompleteStep[t-1]},stepAfter:{startValue:this.xVal[t],step:this.xNumSteps[t],highestStep:this.xHighestCompleteStep[t]}}},t.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(e);return Math.max.apply(null,t)},t.prototype.hasNoSize=function(){return this.xVal[0]===this.xVal[this.xVal.length-1]},t.prototype.convert=function(t){return this.getStep(this.toStepping(t))},t.prototype.handleEntryPoint=function(t,e){t="min"===t?0:"max"===t?100:parseFloat(t);if(!i(t)||!i(e[0]))throw new Error("noUiSlider: 'range' value isn't numeric.");this.xPct.push(t),this.xVal.push(e[0]);e=Number(e[1]);t?this.xSteps.push(!isNaN(e)&&e):isNaN(e)||(this.xSteps[0]=e),this.xHighestCompleteStep.push(0)},t.prototype.handleStepPoint=function(t,e){e&&(this.xVal[t]!==this.xVal[t+1]?(this.xSteps[t]=a([this.xVal[t],this.xVal[t+1]],e,0)/s(this.xPct[t],this.xPct[t+1]),e=(this.xVal[t+1]-this.xVal[t])/this.xNumSteps[t],e=Math.ceil(Number(e.toFixed(3))-1),e=this.xVal[t]+this.xNumSteps[t]*e,this.xHighestCompleteStep[t]=e):this.xSteps[t]=this.xHighestCompleteStep[t]=this.xVal[t])},t);function t(e,t,r){var n;this.xPct=[],this.xVal=[],this.xSteps=[],this.xNumSteps=[],this.xHighestCompleteStep=[],this.xSteps=[r||!1],this.xNumSteps=[!1],this.snap=t;var i=[];for(Object.keys(e).forEach(function(t){i.push([ft(e[t]),t])}),i.sort(function(t,e){return t[0][0]-e[0][0]}),n=0;n<i.length;n++)this.handleEntryPoint(i[n][1],i[n][0]);for(this.xNumSteps=this.xSteps.slice(0),n=0;n<this.xNumSteps.length;n++)this.handleStepPoint(n,this.xNumSteps[n])}var c={to:function(t){return void 0===t?"":t.toFixed(2)},from:Number},p={target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",touchArea:"touch-area",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",textDirectionLtr:"txt-dir-ltr",textDirectionRtl:"txt-dir-rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},gt={tooltips:".__tooltips",aria:".__aria"};function f(t,e){if(!i(e))throw new Error("noUiSlider: 'step' is not numeric.");t.singleStep=e}function d(t,e){if(!i(e))throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");t.keyboardPageMultiplier=e}function h(t,e){if(!i(e))throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");t.keyboardMultiplier=e}function m(t,e){if(!i(e))throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");t.keyboardDefaultStep=e}function g(t,e){if("object"!=typeof e||Array.isArray(e))throw new Error("noUiSlider: 'range' is not an object.");if(void 0===e.min||void 0===e.max)throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");t.spectrum=new u(e,t.snap||!1,t.singleStep)}function v(t,e){if(e=ft(e),!Array.isArray(e)||!e.length)throw new Error("noUiSlider: 'start' option is incorrect.");t.handles=e.length,t.start=e}function b(t,e){if("boolean"!=typeof e)throw new Error("noUiSlider: 'snap' option must be a boolean.");t.snap=e}function S(t,e){if("boolean"!=typeof e)throw new Error("noUiSlider: 'animate' option must be a boolean.");t.animate=e}function x(t,e){if("number"!=typeof e)throw new Error("noUiSlider: 'animationDuration' option must be a number.");t.animationDuration=e}function y(t,e){var r,n=[!1];if("lower"===e?e=[!0,!1]:"upper"===e&&(e=[!1,!0]),!0===e||!1===e){for(r=1;r<t.handles;r++)n.push(e);n.push(!1)}else{if(!Array.isArray(e)||!e.length||e.length!==t.handles+1)throw new Error("noUiSlider: 'connect' option doesn't match handle count.");n=e}t.connect=n}function w(t,e){switch(e){case"horizontal":t.ort=0;break;case"vertical":t.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function E(t,e){if(!i(e))throw new Error("noUiSlider: 'margin' option must be numeric.");0!==e&&(t.margin=t.spectrum.getDistance(e))}function P(t,e){if(!i(e))throw new Error("noUiSlider: 'limit' option must be numeric.");if(t.limit=t.spectrum.getDistance(e),!t.limit||t.handles<2)throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.")}function C(t,e){var r;if(!i(e)&&!Array.isArray(e))throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(e)&&2!==e.length&&!i(e[0])&&!i(e[1]))throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==e){for(Array.isArray(e)||(e=[e,e]),t.padding=[t.spectrum.getDistance(e[0]),t.spectrum.getDistance(e[1])],r=0;r<t.spectrum.xNumSteps.length-1;r++)if(t.padding[0][r]<0||t.padding[1][r]<0)throw new Error("noUiSlider: 'padding' option must be a positive number(s).");var n=e[0]+e[1],e=t.spectrum.xVal[0];if(1<n/(t.spectrum.xVal[t.spectrum.xVal.length-1]-e))throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.")}}function N(t,e){switch(e){case"ltr":t.dir=0;break;case"rtl":t.dir=1;break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function V(t,e){if("string"!=typeof e)throw new Error("noUiSlider: 'behaviour' must be a string containing options.");var r=0<=e.indexOf("tap"),n=0<=e.indexOf("drag"),i=0<=e.indexOf("fixed"),o=0<=e.indexOf("snap"),s=0<=e.indexOf("hover"),a=0<=e.indexOf("unconstrained"),e=0<=e.indexOf("drag-all");if(i){if(2!==t.handles)throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");E(t,t.start[1]-t.start[0])}if(a&&(t.margin||t.limit))throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");t.events={tap:r||o,drag:n,dragAll:e,fixed:i,snap:o,hover:s,unconstrained:a}}function k(t,e){if(!1!==e)if(!0===e||n(e)){t.tooltips=[];for(var r=0;r<t.handles;r++)t.tooltips.push(e)}else{if((e=ft(e)).length!==t.handles)throw new Error("noUiSlider: must pass a formatter for all handles.");e.forEach(function(t){if("boolean"!=typeof t&&!n(t))throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.")}),t.tooltips=e}}function M(t,e){if(e.length!==t.handles)throw new Error("noUiSlider: must pass a attributes for all handles.");t.handleAttributes=e}function A(t,e){if(!n(e))throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");t.ariaFormat=e}function U(t,e){if(!n(r=e)||"function"!=typeof r.from)throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");var r;t.format=e}function D(t,e){if("boolean"!=typeof e)throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");t.keyboardSupport=e}function O(t,e){t.documentElement=e}function L(t,e){if("string"!=typeof e&&!1!==e)throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");t.cssPrefix=e}function T(e,r){if("object"!=typeof r)throw new Error("noUiSlider: 'cssClasses' must be an object.");"string"==typeof e.cssPrefix?(e.cssClasses={},Object.keys(r).forEach(function(t){e.cssClasses[t]=e.cssPrefix+r[t]})):e.cssClasses=r}function vt(e){var r={margin:null,limit:null,padding:null,animate:!0,animationDuration:300,ariaFormat:c,format:c},n={step:{r:!1,t:f},keyboardPageMultiplier:{r:!1,t:d},keyboardMultiplier:{r:!1,t:h},keyboardDefaultStep:{r:!1,t:m},start:{r:!0,t:v},connect:{r:!0,t:y},direction:{r:!0,t:N},snap:{r:!1,t:b},animate:{r:!1,t:S},animationDuration:{r:!1,t:x},range:{r:!0,t:g},orientation:{r:!1,t:w},margin:{r:!1,t:E},limit:{r:!1,t:P},padding:{r:!1,t:C},behaviour:{r:!0,t:V},ariaFormat:{r:!1,t:A},format:{r:!1,t:U},tooltips:{r:!1,t:k},keyboardSupport:{r:!0,t:D},documentElement:{r:!1,t:O},cssPrefix:{r:!0,t:L},cssClasses:{r:!0,t:T},handleAttributes:{r:!1,t:M}},i={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",keyboardSupport:!0,cssPrefix:"noUi-",cssClasses:p,keyboardPageMultiplier:5,keyboardMultiplier:1,keyboardDefaultStep:10};e.format&&!e.ariaFormat&&(e.ariaFormat=e.format),Object.keys(n).forEach(function(t){if(lt(e[t])||void 0!==i[t])n[t].t(r,(lt(e[t])?e:i)[t]);else if(n[t].r)throw new Error("noUiSlider: '"+t+"' is required.")}),r.pips=e.pips;var t=document.createElement("div"),o=void 0!==t.style.msTransform,t=void 0!==t.style.transform;r.transformRule=t?"transform":o?"msTransform":"webkitTransform";return r.style=[["left","top"],["right","bottom"]][r.dir][r.ort],r}function j(t,f,o){var i,a,l,n,s,e,u,c=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},p=window.CSS&&CSS.supports&&CSS.supports("touch-action","none")&&function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,e)}catch(t){}return t}(),d=t,S=f.spectrum,h=[],m=[],g=[],v=0,b={},x=t.ownerDocument,y=f.documentElement||x.documentElement,w=x.body,E="rtl"===x.dir||1===f.ort?0:100;function P(t,e){var r=x.createElement("div");return e&&dt(r,e),t.appendChild(r),r}function C(t,e){var r,t=P(t,f.cssClasses.origin),n=P(t,f.cssClasses.handle);return P(n,f.cssClasses.touchArea),n.setAttribute("data-handle",String(e)),f.keyboardSupport&&(n.setAttribute("tabindex","0"),n.addEventListener("keydown",function(t){return function(t,e){if(V()||k(e))return!1;var r=["Left","Right"],n=["Down","Up"],i=["PageDown","PageUp"],o=["Home","End"];f.dir&&!f.ort?r.reverse():f.ort&&!f.dir&&(n.reverse(),i.reverse());var s=t.key.replace("Arrow",""),a=s===i[0],l=s===i[1],i=s===n[0]||s===r[0]||a,n=s===n[1]||s===r[1]||l,r=s===o[0],o=s===o[1];if(!(i||n||r||o))return!0;if(t.preventDefault(),n||i){var u=i?0:1,u=it(e)[u];if(null===u)return!1;!1===u&&(u=S.getDefaultStep(m[e],i,f.keyboardDefaultStep)),u*=l||a?f.keyboardPageMultiplier:f.keyboardMultiplier,u=Math.max(u,1e-7),u*=i?-1:1,u=h[e]+u}else u=o?f.spectrum.xVal[f.spectrum.xVal.length-1]:f.spectrum.xVal[0];return Z(e,S.toStepping(u),!0,!0),W("slide",e),W("update",e),W("change",e),W("set",e),!1}(t,e)})),void 0!==f.handleAttributes&&(r=f.handleAttributes[e],Object.keys(r).forEach(function(t){n.setAttribute(t,r[t])})),n.setAttribute("role","slider"),n.setAttribute("aria-orientation",f.ort?"vertical":"horizontal"),0===e?dt(n,f.cssClasses.handleLower):e===f.handles-1&&dt(n,f.cssClasses.handleUpper),t}function N(t,e){return!!e&&P(t,f.cssClasses.connect)}function r(t,e){return!(!f.tooltips||!f.tooltips[e])&&P(t.firstChild,f.cssClasses.tooltip)}function V(){return d.hasAttribute("disabled")}function k(t){return a[t].hasAttribute("disabled")}function M(){s&&(I("update"+gt.tooltips),s.forEach(function(t){t&&at(t)}),s=null)}function A(){M(),s=a.map(r),Y("update"+gt.tooltips,function(t,e,r){s&&f.tooltips&&!1!==s[e]&&(t=t[e],!0!==f.tooltips[e]&&(t=f.tooltips[e].to(r[e])),s[e].innerHTML=t)})}function U(t,e){return t.map(function(t){return S.fromStepping(e?S.getStep(t):t)})}function D(d){var h=function(t){if(t.mode===st.PipsMode.Range||t.mode===st.PipsMode.Steps)return S.xVal;if(t.mode!==st.PipsMode.Count)return t.mode===st.PipsMode.Positions?U(t.values,t.stepped):t.mode===st.PipsMode.Values?t.stepped?t.values.map(function(t){return S.fromStepping(S.getStep(S.toStepping(t)))}):t.values:[];if(t.values<2)throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");for(var e=t.values-1,r=100/e,n=[];e--;)n[e]=e*r;return n.push(100),U(n,t.stepped)}(d),m={},t=S.xVal[0],e=S.xVal[S.xVal.length-1],g=!1,v=!1,b=0;return(h=h.slice().sort(function(t,e){return t-e}).filter(function(t){return!this[t]&&(this[t]=!0)},{}))[0]!==t&&(h.unshift(t),g=!0),h[h.length-1]!==e&&(h.push(e),v=!0),h.forEach(function(t,e){var r,n,i,o,s,a,l,u,t=t,c=h[e+1],p=d.mode===st.PipsMode.Steps,f=(f=p?S.xNumSteps[e]:f)||c-t;for(void 0===c&&(c=t),f=Math.max(f,1e-7),r=t;r<=c;r=Number((r+f).toFixed(7))){for(a=(o=(i=S.toStepping(r))-b)/(d.density||1),u=o/(l=Math.round(a)),n=1;n<=l;n+=1)m[(s=b+n*u).toFixed(5)]=[S.fromStepping(s),0];a=-1<h.indexOf(r)?st.PipsType.LargeValue:p?st.PipsType.SmallValue:st.PipsType.NoValue,!e&&g&&r!==c&&(a=0),r===c&&v||(m[i.toFixed(5)]=[r,a]),b=i}}),m}function O(i,o,s){var t,a=x.createElement("div"),n=((t={})[st.PipsType.None]="",t[st.PipsType.NoValue]=f.cssClasses.valueNormal,t[st.PipsType.LargeValue]=f.cssClasses.valueLarge,t[st.PipsType.SmallValue]=f.cssClasses.valueSub,t),l=((t={})[st.PipsType.None]="",t[st.PipsType.NoValue]=f.cssClasses.markerNormal,t[st.PipsType.LargeValue]=f.cssClasses.markerLarge,t[st.PipsType.SmallValue]=f.cssClasses.markerSub,t),u=[f.cssClasses.valueHorizontal,f.cssClasses.valueVertical],c=[f.cssClasses.markerHorizontal,f.cssClasses.markerVertical];function p(t,e){var r=e===f.cssClasses.value;return e+" "+(r?u:c)[f.ort]+" "+(r?n:l)[t]}return dt(a,f.cssClasses.pips),dt(a,0===f.ort?f.cssClasses.pipsHorizontal:f.cssClasses.pipsVertical),Object.keys(i).forEach(function(t){var e,r,n;r=i[e=t][0],n=i[t][1],(n=o?o(r,n):n)!==st.PipsType.None&&((t=P(a,!1)).className=p(n,f.cssClasses.marker),t.style[f.style]=e+"%",n>st.PipsType.NoValue&&((t=P(a,!1)).className=p(n,f.cssClasses.value),t.setAttribute("data-value",String(r)),t.style[f.style]=e+"%",t.innerHTML=String(s.to(r))))}),a}function L(){n&&(at(n),n=null)}function T(t){L();var e=D(t),r=t.filter,t=t.format||{to:function(t){return String(Math.round(t))}};return n=d.appendChild(O(e,r,t))}function j(){var t=i.getBoundingClientRect(),e="offset"+["Width","Height"][f.ort];return 0===f.ort?t.width||i[e]:t.height||i[e]}function z(n,i,o,s){function e(t){var e,r=function(e,t,r){var n=0===e.type.indexOf("touch"),i=0===e.type.indexOf("mouse"),o=0===e.type.indexOf("pointer"),s=0,a=0;0===e.type.indexOf("MSPointer")&&(o=!0);if("mousedown"===e.type&&!e.buttons&&!e.touches)return!1;if(n){var l=function(t){t=t.target;return t===r||r.contains(t)||e.composed&&e.composedPath().shift()===r};if("touchstart"===e.type){n=Array.prototype.filter.call(e.touches,l);if(1<n.length)return!1;s=n[0].pageX,a=n[0].pageY}else{l=Array.prototype.find.call(e.changedTouches,l);if(!l)return!1;s=l.pageX,a=l.pageY}}t=t||mt(x),(i||o)&&(s=e.clientX+t.x,a=e.clientY+t.y);return e.pageOffset=t,e.points=[s,a],e.cursor=i||o,e}(t,s.pageOffset,s.target||i);return!!r&&(!(V()&&!s.doNotReject)&&(e=d,t=f.cssClasses.tap,!((e.classList?e.classList.contains(t):new RegExp("\\b"+t+"\\b").test(e.className))&&!s.doNotReject)&&(!(n===c.start&&void 0!==r.buttons&&1<r.buttons)&&((!s.hover||!r.buttons)&&(p||r.preventDefault(),r.calcPoint=r.points[f.ort],void o(r,s))))))}var r=[];return n.split(" ").forEach(function(t){i.addEventListener(t,e,!!p&&{passive:!0}),r.push([t,e])}),r}function H(t){var e,r,n=pt(n=100*(t-(n=i,e=f.ort,r=n.getBoundingClientRect(),n=(t=n.ownerDocument).documentElement,t=mt(t),/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(t.x=0),e?r.top+t.y-n.clientTop:r.left+t.x-n.clientLeft))/j());return f.dir?100-n:n}function F(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&_(t,e)}function R(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return _(t,e);t=(f.dir?-1:1)*(t.calcPoint-e.startCalcPoint);J(0<t,100*t/e.baseSize,e.locations,e.handleNumbers,e.connect)}function _(t,e){e.handle&&(ht(e.handle,f.cssClasses.active),--v),e.listeners.forEach(function(t){y.removeEventListener(t[0],t[1])}),0===v&&(ht(d,f.cssClasses.drag),Q(),t.cursor&&(w.style.cursor="",w.removeEventListener("selectstart",ut))),e.handleNumbers.forEach(function(t){W("change",t),W("set",t),W("end",t)})}function B(t,e){var r,n,i,o;e.handleNumbers.some(k)||(1===e.handleNumbers.length&&(o=a[e.handleNumbers[0]].children[0],v+=1,dt(o,f.cssClasses.active)),t.stopPropagation(),n=z(c.move,y,R,{target:t.target,handle:o,connect:e.connect,listeners:r=[],startCalcPoint:t.calcPoint,baseSize:j(),pageOffset:t.pageOffset,handleNumbers:e.handleNumbers,buttonsProperty:t.buttons,locations:m.slice()}),i=z(c.end,y,_,{target:t.target,handle:o,listeners:r,doNotReject:!0,handleNumbers:e.handleNumbers}),o=z("mouseout",y,F,{target:t.target,handle:o,listeners:r,doNotReject:!0,handleNumbers:e.handleNumbers}),r.push.apply(r,n.concat(i,o)),t.cursor&&(w.style.cursor=getComputedStyle(t.target).cursor,1<a.length&&dt(d,f.cssClasses.drag),w.addEventListener("selectstart",ut,!1)),e.handleNumbers.forEach(function(t){W("start",t)}))}function q(t){t.stopPropagation();var i,o,s,e=H(t.calcPoint),r=(i=e,s=!(o=100),a.forEach(function(t,e){var r,n;k(e)||(r=m[e],((n=Math.abs(r-i))<o||n<=o&&r<i||100===n&&100===o)&&(s=e,o=n))}),s);!1!==r&&(f.events.snap||ct(d,f.cssClasses.tap,f.animationDuration),Z(r,e,!0,!0),Q(),W("slide",r,!0),W("update",r,!0),f.events.snap?B(t,{handleNumbers:[r]}):(W("change",r,!0),W("set",r,!0)))}function X(t){var t=H(t.calcPoint),t=S.getStep(t),e=S.fromStepping(t);Object.keys(b).forEach(function(t){"hover"===t.split(".")[0]&&b[t].forEach(function(t){t.call(ot,e)})})}function Y(t,e){b[t]=b[t]||[],b[t].push(e),"update"===t.split(".")[0]&&a.forEach(function(t,e){W("update",e)})}function I(t){var n=t&&t.split(".")[0],i=n?t.substring(n.length):t;Object.keys(b).forEach(function(t){var e=t.split(".")[0],r=t.substring(e.length);n&&n!==e||i&&i!==r||((e=r)!==gt.aria&&e!==gt.tooltips||i===r)&&delete b[t]})}function W(r,n,i){Object.keys(b).forEach(function(t){var e=t.split(".")[0];r===e&&b[t].forEach(function(t){t.call(ot,h.map(f.format.to),n,h.slice(),i||!1,m.slice(),ot)})})}function $(t,e,r,n,i,o){var s;return 1<a.length&&!f.events.unconstrained&&(n&&0<e&&(s=S.getAbsoluteDistance(t[e-1],f.margin,!1),r=Math.max(r,s)),i&&e<a.length-1&&(s=S.getAbsoluteDistance(t[e+1],f.margin,!0),r=Math.min(r,s))),1<a.length&&f.limit&&(n&&0<e&&(s=S.getAbsoluteDistance(t[e-1],f.limit,!1),r=Math.min(r,s)),i&&e<a.length-1&&(s=S.getAbsoluteDistance(t[e+1],f.limit,!0),r=Math.max(r,s))),f.padding&&(0===e&&(s=S.getAbsoluteDistance(0,f.padding[0],!1),r=Math.max(r,s)),e===a.length-1&&(s=S.getAbsoluteDistance(100,f.padding[1],!0),r=Math.min(r,s))),!((r=pt(r=S.getStep(r)))===t[e]&&!o)&&r}function G(t,e){var r=f.ort;return(r?e:t)+", "+(r?t:e)}function J(t,r,n,e,i){var o=n.slice(),s=e[0],a=[!t,t],l=[t,!t];e=e.slice(),t&&e.reverse(),1<e.length?e.forEach(function(t,e){e=$(o,t,o[t]+r,a[e],l[e],!1);!1===e?r=0:(r=e-o[t],o[t]=e)}):a=l=[!0];var u=!1;e.forEach(function(t,e){u=Z(t,n[t]+r,a[e],l[e])||u}),u&&(e.forEach(function(t){W("update",t),W("slide",t)}),null!=i&&W("drag",s))}function K(t,e){return f.dir?100-t-e:t}function Q(){g.forEach(function(t){var e=50<m[t]?-1:1,e=3+(a.length+e*t);a[t].style.zIndex=String(e)})}function Z(t,e,r,n,i){return!1!==(e=i?e:$(m,t,e,r,n,!1))&&(e=e,m[t=t]=e,h[t]=S.fromStepping(e),e="translate("+G(K(e,0)-E+"%","0")+")",a[t].style[f.transformRule]=e,tt(t),tt(t+1),!0)}function tt(t){var e,r;l[t]&&(r=100,e="translate("+G(K(e=(e=0)!==t?m[t-1]:e,r=(r=t!==l.length-1?m[t]:r)-e)+"%","0")+")",r="scale("+G(r/100,"1")+")",l[t].style[f.transformRule]=e+" "+r)}function et(t,e){return null===t||!1===t||void 0===t?m[e]:("number"==typeof t&&(t=String(t)),!1===(t=!1!==(t=f.format.from(t))?S.toStepping(t):t)||isNaN(t)?m[e]:t)}function rt(t,e,r){var n=ft(t),t=void 0===m[0];e=void 0===e||e,f.animate&&!t&&ct(d,f.cssClasses.tap,f.animationDuration),g.forEach(function(t){Z(t,et(n[t],t),!0,!1,r)});var i,o=1===g.length?0:1;for(t&&S.hasNoSize()&&(r=!0,m[0]=0,1<g.length&&(i=100/(g.length-1),g.forEach(function(t){m[t]=t*i})));o<g.length;++o)g.forEach(function(t){Z(t,m[t],!0,!0,r)});Q(),g.forEach(function(t){W("update",t),null!==n[t]&&e&&W("set",t)})}function nt(t){if(t=void 0===t?!1:t)return 1===h.length?h[0]:h.slice(0);t=h.map(f.format.to);return 1===t.length?t[0]:t}function it(t){var e=m[t],r=S.getNearbySteps(e),n=h[t],i=r.thisStep.step,t=null;if(f.snap)return[n-r.stepBefore.startValue||null,r.stepAfter.startValue-n||null];!1!==i&&n+i>r.stepAfter.startValue&&(i=r.stepAfter.startValue-n),t=n>r.thisStep.startValue?r.thisStep.step:!1!==r.stepBefore.step&&n-r.stepBefore.highestStep,100===e?i=null:0===e&&(t=null);e=S.countStepDecimals();return null!==i&&!1!==i&&(i=Number(i.toFixed(e))),[t=null!==t&&!1!==t?Number(t.toFixed(e)):t,i]}dt(e=d,f.cssClasses.target),0===f.dir?dt(e,f.cssClasses.ltr):dt(e,f.cssClasses.rtl),0===f.ort?dt(e,f.cssClasses.horizontal):dt(e,f.cssClasses.vertical),dt(e,"rtl"===getComputedStyle(e).direction?f.cssClasses.textDirectionRtl:f.cssClasses.textDirectionLtr),i=P(e,f.cssClasses.base),function(t,e){var r=P(e,f.cssClasses.connects);a=[],(l=[]).push(N(r,t[0]));for(var n=0;n<f.handles;n++)a.push(C(e,n)),g[n]=n,l.push(N(r,t[n+1]))}(f.connect,i),(u=f.events).fixed||a.forEach(function(t,e){z(c.start,t.children[0],B,{handleNumbers:[e]})}),u.tap&&z(c.start,i,q,{}),u.hover&&z(c.move,i,X,{hover:!0}),u.drag&&l.forEach(function(e,t){var r,n,i,o,s;!1!==e&&0!==t&&t!==l.length-1&&(r=a[t-1],n=a[t],i=[e],o=[r,n],s=[t-1,t],dt(e,f.cssClasses.draggable),u.fixed&&(i.push(r.children[0]),i.push(n.children[0])),u.dragAll&&(o=a,s=g),i.forEach(function(t){z(c.start,t,B,{handles:o,handleNumbers:s,connect:e})}))}),rt(f.start),f.pips&&T(f.pips),f.tooltips&&A(),I("update"+gt.aria),Y("update"+gt.aria,function(t,e,o,r,s){g.forEach(function(t){var e=a[t],r=$(m,t,0,!0,!0,!0),n=$(m,t,100,!0,!0,!0),i=s[t],t=String(f.ariaFormat.to(o[t])),r=S.fromStepping(r).toFixed(1),n=S.fromStepping(n).toFixed(1),i=S.fromStepping(i).toFixed(1);e.children[0].setAttribute("aria-valuemin",r),e.children[0].setAttribute("aria-valuemax",n),e.children[0].setAttribute("aria-valuenow",i),e.children[0].setAttribute("aria-valuetext",t)})});var ot={destroy:function(){for(I(gt.aria),I(gt.tooltips),Object.keys(f.cssClasses).forEach(function(t){ht(d,f.cssClasses[t])});d.firstChild;)d.removeChild(d.firstChild);delete d.noUiSlider},steps:function(){return g.map(it)},on:Y,off:I,get:nt,set:rt,setHandle:function(t,e,r,n){if(!(0<=(t=Number(t))&&t<g.length))throw new Error("noUiSlider: invalid handle number, got: "+t);Z(t,et(e,t),!0,!0,n),W("update",t),r&&W("set",t)},reset:function(t){rt(f.start,t)},__moveHandles:function(t,e,r){J(t,e,m,r)},options:o,updateOptions:function(e,t){var r=nt(),n=["margin","limit","padding","range","animate","snap","step","format","pips","tooltips"];n.forEach(function(t){void 0!==e[t]&&(o[t]=e[t])});var i=vt(o);n.forEach(function(t){void 0!==e[t]&&(f[t]=i[t])}),S=i.spectrum,f.margin=i.margin,f.limit=i.limit,f.padding=i.padding,f.pips?T(f.pips):L(),(f.tooltips?A:M)(),m=[],rt(lt(e.start)?e.start:r,t)},target:d,removePips:L,removeTooltips:M,getPositions:function(){return m.slice()},getTooltips:function(){return s},getOrigins:function(){return a},pips:T};return ot}function z(t,e){if(!t||!t.nodeName)throw new Error("noUiSlider: create requires a single element, got: "+t);if(t.noUiSlider)throw new Error("noUiSlider: Slider was already initialized.");e=j(t,vt(e),e);return t.noUiSlider=e}var H={__spectrum:u,cssClasses:p,create:z};st.create=z,st.cssClasses=p,st.default=H,Object.defineProperty(st,"__esModule",{value:!0})});

// ползунок выбора цен
let filterSlaiderLine = document.getElementById('filter-slaider-line');
if (filterSlaiderLine) {
    noUiSlider.create(filterSlaiderLine, {
        start: [209, 2090],
        connect: true,
        step: 1,
        range: {
            'min': 0,
            'max': 3000

        }
    });

    let filterSlaiderOne = document.getElementById('filter-slaider-1');
    let filterSlaiderTwo = document.getElementById('filter-slaider-2');
    let filterList = [filterSlaiderOne, filterSlaiderTwo];
    let filterSlaiderLineRemove = document.querySelectorAll('.filter__line-remove')
    let filterInfoBox = document.querySelectorAll('.filter__info-box');

    filterSlaiderLine.noUiSlider.on('update', function (values, handle) {
        filterList[handle].value = Math.round(values[handle]);
    });

    const setfilterSlaider = (i, value) => {
        let arr = [null, null];
        arr[i] = value;
        filterSlaiderLine.noUiSlider.set(arr);
    }

    filterSlaiderLineRemove.forEach((item) => {
        item.addEventListener('click', function () {
            filterSlaiderLine.noUiSlider.set([209, 2090]);
        });
    });

    filterList.forEach((item, index) => {
        item.addEventListener('change', (e) => {
            setfilterSlaider(index, e.currentTarget.value);
        })
    })

    filterInfoBox.forEach((item) => {
        item.addEventListener("click", function () {
            document.querySelector('.filter__price-close').classList.remove('--active');
        })
    })

}

$('.add__share-time').timepicker({
    timeFormat: 'H:mm',
    interval: 10,
    minTime: '0',
    maxTime: '23:59',
    startTime: '00:00',
});
$('.firms__slaider').slick({
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: false,
    dots: false
});


$('.add__share-date').datepicker();

$(function () {
    $("#telForm").mask("+3(999) 999-99-99");
    $(".telForm-2").mask("+3(999) 999-99-99");
    $(".order__tell").mask("+3(999) 999-99-99");
    $('.popup-content').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-fade'
    });

    // popup close


});
$(window).on("load", function () {
    $(".chat__message-box").mCustomScrollbar({
    });
    $(".chat__user-box").mCustomScrollbar({
    });
    $(".select-checkbox").mCustomScrollbar({
    });
});


function closePopup() {
    $.magnificPopup.close();
}


// select
let select = function () {
    let selectHeader = document.querySelectorAll('.select__header');

    let selectItem = document.querySelectorAll('.select__item');

    selectHeader.forEach((item) => {
        item.addEventListener('click', selectToggle)
    })

    selectItem.forEach((item) => {
        item.addEventListener('click', selectChoose)
    })

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    function selectChoose() {
        let text = this.innerText;
        let select = this.closest('.select');
        let currentText = select.querySelector(".select__current");
        currentText.innerText = text;
        select.classList.remove('is-active');
    }


}

// показывать скрывать пароль
function showPassword() {
    let btn = document.querySelectorAll('.cabinet__password-btn');
    let inputPassword = document.querySelectorAll('.input-password');
    btn.forEach((item) => {
        item.addEventListener('click', function () {
            let passwordId = item.getAttribute('data-password');
            let showPassword = document.querySelector(passwordId);
            item.classList.toggle('cabinet__password-btn--active')
            if (showPassword.getAttribute('type') === 'password') {
                showPassword.type = 'text';
            } else {
                showPassword.type = 'password';
            }
        })
    })
}

// tabs 
function tabs() {
    const cabinetBtn = document.querySelectorAll('.cabinet__btn');
    const cabinetTab = document.querySelectorAll('.cabinet__tab');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-tab');
            let currentTab = document.querySelector(tabId);

            cabinetBtn.forEach(function (item) {
                item.classList.remove('cabinet__btn-acive')
            })

            cabinetTab.forEach(function (item) {
                item.classList.remove('cabinet__tab-active')
            })
            item.classList.add('cabinet__btn-acive');
            currentTab.classList.add('cabinet__tab-active');
        });
    });

}

// открытие меню изменения данных
function dataMenuHidden() {
    let cabinetBtnSave = document.querySelector('.cabinet__btn-save');
    let cabinetBtnChange = document.querySelector('.cabinet__btn-change');
    let cabinetDataBox = document.querySelector('.cabinet__data-box ');
    let cabinetDataInner = document.querySelector('.cabinet__data-inner');

    cabinetBtnChange.addEventListener('click', function () {
        cabinetBtnChange.classList.add('cabinet__tab-data--hidden');
        cabinetDataInner.classList.add('cabinet__tab-data--hidden');
        cabinetDataBox.classList.remove('cabinet__tab-data--hidden');
    })
    cabinetBtnSave.addEventListener('click', function () {
        cabinetBtnChange.classList.remove('cabinet__tab-data--hidden');
        cabinetDataInner.classList.remove('cabinet__tab-data--hidden');
        cabinetDataBox.classList.add('cabinet__tab-data--hidden');
    })
};


// product like

function productLike() {
    let productLike = document.querySelectorAll('.product-like');
    productLike.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('product-like-active');
        })
    })
}
// product size active
function productSize() {
    let productSizeColl = document.querySelectorAll('.product-size-coll');
    productSizeColl.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('product-size-coll--active');
        })
    })
}


// delite document

function fileDell(buttonDell, dataAtr) {
    const myDocumentDell = document.querySelectorAll(buttonDell);
    myDocumentDell.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute(dataAtr);
            let myDocument = document.querySelector(tabId);
            myDocument.remove();
        });
    });
}

// btn создания товара

function productCreation() {
    let productCreationBtn = document.querySelector('.product__creation-btn');
    let productPublishBtn = document.querySelector('.product__publish-btn');
    let productCreation = document.querySelector('.product__creation');
    let product__management = document.querySelector('.product__management');

    productCreationBtn.addEventListener('click', function () {
        productCreation.classList.remove('product__creation-hidden');
        product__management.classList.add('product__creation-hidden');
    });

    productPublishBtn.addEventListener('click', function () {
        productCreation.classList.add('product__creation-hidden');
        product__management.classList.remove('product__creation-hidden');
    });
};

// accardion

function accardion() {
    let accordionBtn = document.querySelectorAll('.accordion-btn');
    accordionBtn.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('accordion-btn-active');
        })
    })
};


// checboc select
function selectChecbox(inputChecbox, listHtml) {
    let selectChoiseLabel = document.querySelectorAll('.select__choise-label');
    let selectChoiseCheckbox = document.querySelectorAll(inputChecbox)
    selectChoiseLabel.forEach((item) => {
        item.addEventListener('click', function () {
            let choise__list = '';
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {

                    choise__list += selectChoiseCheckbox[i].value;
                    choise__list += ', ';

                }
            }
            document.querySelector(listHtml).innerHTML = choise__list.slice(0, -2)

        })
    })
}


// checkbox filter select

function filterChecbox(inputChecbox, listHtmls, headNums) {
    let selectChoiseLabel = document.querySelectorAll('.select__choise-label');
    let selectChoiseCheckbox = document.querySelectorAll(inputChecbox);
    let listHtml = document.querySelector(listHtmls);
    let selectCheckboxBtnDell = document.querySelectorAll('.select-checkbox-btn-dell');
    let headNum = document.querySelector(headNums);
    selectChoiseLabel.forEach((item) => {
        item.addEventListener('click', function () {

            let sumSize = 0;
            let sumMaterial = 0;
            let sumColor = 0;
            let sumPrice = 0;
            let sumBrand = 0;
            let sumSeason = 0;
            let sumSale = 0;
            let choise__list = [];
            let x = 0;
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {
                    x += 1
                    selectChoiseCheckbox[i].id = 'check_' + x;
                    choise__list.push(selectChoiseCheckbox[i].value)


                    if ('select__choise-size' == selectChoiseCheckbox[i].classList[1]) {
                        sumSize += 1;
                        headNum.innerHTML = sumSize;

                    }
                    if ('select__choise-material' == selectChoiseCheckbox[i].classList[1]) {
                        sumMaterial += 1;
                        document.querySelector('.select__choise-material-title').textContent += sumMaterial;

                    }
                    if ('select__choise-color' == selectChoiseCheckbox[i].classList[1]) {
                        sumColor += 1;
                        document.querySelector('.select__choise-color-title').textContent += sumColor;

                    }
                    if ('select__choise-price' == selectChoiseCheckbox[i].classList[1]) {
                        sumPrice += 1;
                        document.querySelector('.select__choise-price-title').textContent += sumPrice;

                    }
                    if ('select__choise-brand' == selectChoiseCheckbox[i].classList[1]) {
                        sumBrand += 1;
                        document.querySelector('.select__choise-brand-title').textContent += sumBrand;

                    }
                    if ('select__choise-season' == selectChoiseCheckbox[i].classList[1]) {
                        sumSeason += 1;
                        document.querySelector('.select__choise-season-title').textContent += sumSeason;

                    } if ('select__choise-sale' == selectChoiseCheckbox[i].classList[1]) {
                        sumSale += 1;
                        document.querySelector('.select__choise-sale-title').textContent += sumSale;
                    }
                }
            }
            if (headNum.textContent.length > 0) {
                headNum.textContent = '(' + sumSize + ')';
            }
            if (document.querySelector('.select__choise-material-title').textContent.length > 0) {
                document.querySelector('.select__choise-material-title').textContent = '(' + sumMaterial + ')';
            }



            if (document.querySelector('.select__choise-color-title').textContent.length > 0) {
                document.querySelector('.select__choise-color-title').textContent = '(' + sumColor + ')';
            }

            if (document.querySelector('.select__choise-price-title').textContent.length > 0) {
                document.querySelector('.select__choise-price-title').textContent = '(' + sumPrice + ')';
            }

            if (document.querySelector('.select__choise-brand-title').textContent.length > 0) {
                document.querySelector('.select__choise-brand-title').textContent = '(' + sumBrand + ')';
            }

            if (document.querySelector('.select__choise-season-title').textContent.length > 0) {
                document.querySelector('.select__choise-season-title').textContent = '(' + sumSeason + ')';
            }

            if (document.querySelector('.select__choise-sale-title').textContent.length > 0) {
                document.querySelector('.select__choise-sale-title').textContent = '(' + sumSale + ')';
            }

            listHtml.textContent = '';
            let y = 0;
            for (let i = 0; i < choise__list.length; i++) {
                let cabinetInputContainer = document.createElement('div');
                y += 1;
                cabinetInputContainer.innerHTML = choise__list[i] + '<button class="filtr__list-close" data-check="check_' + y + '"></button>';
                listHtml.appendChild(cabinetInputContainer);


            }

            function t() {
                let filtrListClose = document.querySelectorAll('.filtr__list-close');
                filtrListClose.forEach((item) => {
                    item.addEventListener('click', () => {
                        let tabId = item.getAttribute('data-check');
                        let currentTab = document.getElementById(tabId);
                        let filtrListClose = document.querySelectorAll('.filtr__list-close');
                        currentTab.checked = false;
                        item.parentElement.remove();
                        if (filtrListClose.length <= 1) {
                            document.querySelector('.filter__list').classList.remove('filter--active');
                        }

                        if (currentTab.classList[1] == 'select__choise-size') {
                            let sizex = document.querySelector('.select__choise-size-title').textContent;
                            let sizey = Number(sizex.replace(')', '').replace('(', '')) - 1;
                            if (sizey <= 0) {
                                document.querySelector('.select__choise-size-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-size-title').textContent = '(' + sizey + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-material') {
                            let materialx = document.querySelector('.select__choise-material-title').textContent;
                            let materialy = Number(materialx.replace(')', '').replace('(', '')) - 1;
                            if (materialy <= 0) {
                                document.querySelector('.select__choise-material-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-material-title').textContent = '(' + materialy + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-color') {
                            let colorx = document.querySelector('.select__choise-color-title').textContent;
                            let colory = Number(colorx.replace(')', '').replace('(', '')) - 1;
                            if (colory <= 0) {
                                document.querySelector('.select__choise-color-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-color-title').textContent = '(' + colory + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-price') {
                            let pricex = document.querySelector('.select__choise-price-title').textContent;
                            let pricey = Number(pricex.replace(')', '').replace('(', '')) - 1;
                            if (pricey <= 0) {
                                document.querySelector('.select__choise-price-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-price-title').textContent = '(' + pricey + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-brand') {
                            let brandx = document.querySelector('.select__choise-brand-title').textContent;
                            let brandy = Number(brandx.replace(')', '').replace('(', '')) - 1;
                            if (brandy <= 0) {
                                document.querySelector('.select__choise-brand-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-brand-title').textContent = '(' + brandy + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-season') {
                            let seasonx = document.querySelector('.select__choise-season-title').textContent;
                            let seasony = Number(seasonx.replace(')', '').replace('(', '')) - 1;
                            if (seasony <= 0) {
                                document.querySelector('.select__choise-season-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-season-title').textContent = '(' + seasony + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-sale') {
                            let salex = document.querySelector('.select__choise-sale-title').textContent;
                            let saley = Number(salex.replace(')', '').replace('(', '')) - 1;
                            if (saley <= 0) {
                                document.querySelector('.select__choise-sale-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-sale-title').textContent = '(' + saley + ')';
                            }
                        }


                    })
                })

            }
            t();


        })

        document.querySelectorAll('.select-checkbox-btn').forEach((item) => {
            item.addEventListener('click', () => {
                listHtml.classList.add('filter--active');
            })
        })
        document.querySelector('.filter__btn-dell').addEventListener('click', () => {
            listHtml.classList.remove('filter--active');
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {
                    selectChoiseCheckbox[i].checked = false;
                }
                headNum.textContent = '';
                listHtml.textContent = '';
                document.querySelector('.select__choise-material-title').textContent = '';
                document.querySelector('.select__choise-color-title').textContent = '';
                document.querySelector('.select__choise-price-title').textContent = '';
                document.querySelector('.select__choise-brand-title').textContent = '';
                document.querySelector('.select__choise-season-title').textContent = '';
                document.querySelector('.select__choise-sale-title').textContent = '';
            }
        })

        selectCheckboxBtnDell.forEach((item) => {
            item.addEventListener('click', () => {

                item.parentElement.parentElement.classList.remove('--active');
                listHtml.classList.remove('filter--active');
                headNum.textContent = '';
                listHtml.textContent = '';
                document.querySelector('.select__choise-material-title').textContent = '';
                document.querySelector('.select__choise-color-title').textContent = '';
                document.querySelector('.select__choise-price-title').textContent = '';
                document.querySelector('.select__choise-brand-title').textContent = '';
                document.querySelector('.select__choise-season-title').textContent = '';
                document.querySelector('.select__choise-sale-title').textContent = '';
                for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                    if (selectChoiseCheckbox[i].checked == true) {
                        selectChoiseCheckbox[i].checked = false;
                    }
                }
            })
        })


    })
}



function selectCheckboxActive() {
    let selectCheckboxHeader = document.querySelectorAll('.select-checkbox-header');
    let selectCheckboxBtn = document.querySelectorAll('.select-checkbox-btn');
    selectCheckboxHeader.forEach((item) => {
        item.addEventListener('click', selectToggle)
    })
    function selectToggle() {
        this.parentElement.classList.toggle('--active');
    }
    selectCheckboxBtn.forEach((item) => {
        item.addEventListener('click', selectClose)
    })
    function selectClose() {
        this.parentElement.parentElement.classList.toggle('--active');
    }

}

// удаление добовление placholder creation__textarea

function creationPlacholer() {
    let creationDescriptionTextarea = document.querySelectorAll('.creation__description-textarea');

    creationDescriptionTextarea.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.add('placholder-del');

        })

        document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
            creationDescriptionTextarea.forEach((item) => {

                if (!$(item).is(":focus") && item.value == '') {
                    item.classList.remove('placholder-del');
                }
            });
        });

    });

}

// open and close product__promotion 
//btnOpenWindow кнопка открытия скрытого первоночально элемента
//windowHide блок который скрывается
// hideWindow скрытое окно 
// retrunBtn возврощение в первоночальное состояние

function openPromotion(btnOpenWindow, windowHide, hideWindow, retrunBtn) {
    let managementRowBtn = document.querySelectorAll(btnOpenWindow);
    let productManagement = document.querySelector(windowHide);
    let productPromotion = document.querySelector(hideWindow);
    let productPromotionBtn = document.querySelector(retrunBtn);


    managementRowBtn.forEach((item) => {
        item.addEventListener('click', () => {
            productManagement.classList.add('product__creation-hidden');
            productPromotion.classList.remove('product__creation-hidden');
        })
    })

    productPromotionBtn.addEventListener('click', () => {
        productManagement.classList.remove('product__creation-hidden');
        productPromotion.classList.add('product__creation-hidden');
    })

};
// добовлние  точки выдочи заказа
function myDataInsert() {
    let myDataInsertBtn = document.querySelector('.my__data-insert-btn');
    let myDataInsert = document.querySelector('.my__data-insert');
    myDataInsertBtn.addEventListener('click', () => {
        let cabinetInputContainer = document.createElement('span');
        cabinetInputContainer.innerHTML = '<input class="cabinet-input" type="text">'
        myDataInsert.appendChild(cabinetInputContainer);

    })
}


// sale tabs 
function saleTabs() {
    const cabinetBtn = document.querySelectorAll('.sale__tab-btn');
    const cabinetTab = document.querySelectorAll('.sale__tab-wrapp');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-sale');
            let currentTab = document.querySelector(tabId);

            cabinetBtn.forEach(function (item) {
                item.classList.remove('sale__btn-acive')
            })

            cabinetTab.forEach(function (item) {
                item.classList.remove('sale__tab-active')
            })
            item.classList.add('sale__btn-acive');
            currentTab.classList.add('sale__tab-active');
            this.parentElement.parentElement.classList.toggle('--sale__tab-title-hide');
        });
    });

}

// add__share-change tabs 
function saleTabs() {
    const cabinetBtn = document.querySelectorAll('.add__share-change-btn');
    const cabinetTab = document.querySelectorAll('.share-change-tab');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-block');
            let currentTab = document.querySelector(tabId);



            cabinetTab.forEach(function (item) {
                item.classList.remove('share-change-tab--active')
            })

            currentTab.classList.add('share-change-tab--active');

        });
    });

}

function postoffice() {
    let newPostoffice = document.querySelector('.new-postoffice');
    let justinPostoffice = document.querySelector('.justin-postoffice');
    let ykrPostoffice = document.querySelector('.ykr-postoffice');
    let orderPickup = document.querySelector('.orderpickup');
    let labelOrderCheckbox = document.querySelectorAll('.postoffice-check');
    let orderRegistrationRow = document.querySelectorAll('.order__registration-row');

    labelOrderCheckbox.forEach((item) => {
        item.addEventListener('click', () => {
            for (let i = 0; i < labelOrderCheckbox.length; i++) {
                labelOrderCheckbox[i].checked = false;
            }
            item.checked = true;
            for (let i = 0; i < orderRegistrationRow.length; i++) {
                if (orderRegistrationRow[i].classList.contains('order__plasholder-active')) {
                    orderRegistrationRow[i].classList.remove('order__plasholder-active');
                }

            }



            if (newPostoffice.checked) {
                document.querySelector('.new-postoffice-block').classList.add('order__plasholder-active');
            } else if (justinPostoffice.checked) {
                document.querySelector('.justin-postoffice-block').classList.add('order__plasholder-active');
            } else if (ykrPostoffice.checked) {
                document.querySelector('.ykr-postoffice-block').classList.add('order__plasholder-active');
            } else if (orderPickup.checked) {
                document.querySelector('.orderpickup-block').classList.add('order__plasholder-active');
            }
        })

    })
};

function orderBuyChek() {
    const orderBuyChekOne = document.querySelector('.order__buy-chek-1');
    const orderBuyChekTwo = document.querySelector('.order__buy-chek-2');

    orderBuyChekOne.addEventListener('click', () => {
        if (orderBuyChekTwo.checked) {
            orderBuyChekTwo.checked = false;
        }
    })
    orderBuyChekTwo.addEventListener('click', () => {
        if (orderBuyChekOne.checked) {
            orderBuyChekOne.checked = false;
        }
    })

}
// accardion();
// tabs();
// selectCheckboxActive();
// selectChecbox('.select__choise-size', '.select__output-size');
// selectChecbox('.select__checkbox-color', '.select__output-color');
// select();
// showPassword();

// dataMenuHidden();
// productLike();
// productSize();
// myDataInsert();
// fileDell('.my__document-dell', 'data-document');
// fileDell('.foto-dell', 'data-foto');
// productCreation();

// creationPlacholer();
// saleTabs();
// openPromotion('.management__row-btn', '.product__management', '.product__promotion', '.product__promotion-btn');
// openPromotion('.salwsman__order-open', '.salesman__order-container', '.selesman__order-window ', '.order__return-btn');
// openPromotion('.salesman__sale-btn', '.salesman__sale', '.add__share', '.add__share-btn');
// openPromotion('.salesman__sale-btn-2', '.salesman__sale', '.add__share-2', '.add__share-btn-2');
// filterChecbox(".select__choise-checkbox", '.filter__list', '.select__choise-size-title');