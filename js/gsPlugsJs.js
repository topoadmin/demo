;(function($) {
	'use strict';
	try {
		$.fn.serializeJson = function(){
			// --序列化表单成json格式 -- form.serializeJson();
			var serializeObj={};  
            $(this.serializeArray()).each(function(){  
                serializeObj[this.name]=this.value;  
            });  
            return serializeObj;  
		}
		$.fn.touchPage = function(options){
			var defaults = {
				"leftTouch":function(){
					console.log("向左划动");
				},
				"rightTouch":function(){
					console.log("向右划动");
				}
			},opt = $.extend(defaults, options),elem=$(this),
			startPosition, endPosition, deltaX, deltaY, moveLength;
			elem.bind('touchstart', function(e) {
				var touch = e.touches[0];
				startPosition = {
					x: touch.pageX,
					y: touch.pageY
				}
			}).bind('touchmove', function(e) {
				var touch = e.touches[0];
				endPosition = {
					x: touch.pageX,
					y: touch.pageY
				};
		
				deltaX = endPosition.x - startPosition.x;
				deltaY = endPosition.y - startPosition.y;
				moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
			}).bind('touchend', function(e) {
				if (deltaX < 0) { 
					opt.leftTouch(startPosition,elem);
				} else if (deltaX > 0) { 
					opt.rightTouch(startPosition,elem);
				}
			});
		}
	} catch (err) {
		console.warn("你确定加载了Zepto？")
	}
})(window.Zepto);

;(function(){
	var base = function(id){
		this.elements = [];
		this.elements.push(this.getDom(id))
	};
	
	base.prototype = {
		addLoadEvent:function(func){
			// -- window.onload是不能同时加载多个函数的，本函数解决	
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
				window.onload = func;
			} else {
				window.onload = function() {
					oldonload();
					func();
				}
			}
		},getDom:function(id){
			//--获取dom
			var _dom = document.getElementById(id);
			if(!_dom){
				console.info("Error undefined ："+id)
			}
			return _dom;
		},getStyle:function(name) {
			var _this = this,str,elems = _this.elements[0];
			if (elems.style[name]) {
				return elems.style[name];
			} else if (elems.currentStyle) {
				return elems.currentStyle[name];
			} else if (document.defaultView && document.defaultView.getComputedStyle) {
				name = name.replace(/([A-Z])/g, "-$1");
				name = name.toLowerCase();
				str = document.defaultView.getComputedStyle(elems, ""); 
				return str; 
			}else{ 
				return null 
			} 
		},setStyle:function(name,value){
			var _this = this,elems = _this.elements[0];
			elems.style[name] = value;
			return _this;
		},getArea:function(){
			var _this = this,elems = _this.elements[0];
			if (_this.getStyle("display") != "none") {
				return {
					"height":elems.offsetHeight,
					"width":elems.offsetWidth
				}
			} else {
				var old = gsJsPlugs.resetCss({
					display: "block",
					visibility: "hidden",
					position: "absolute"
				});
				var h = elem.clientHeight;
				var w = elem.clientWidth;
				_this.restoreCss(elem, old);
				return {width:w,height:h};
			}
		},resetCss:function(prop){
			var _this = this,elems = _this.elements[0],old = {};
		    for (var i in prop) {
		        old[i] = elems.style[i];
		        elems.style[i] = prop[i];
		    }
		    return old;
		},restoreCss:function(prop) {
			var _this = this,elems = _this.elements[0],old = {};
		    for (var i in prop) {
		        elems.style[i] = prop[i];
		    }
		},fillForm:function(json){
			var _this = this,elems = _this.elements,
			einput = _this.elements[0],jsonObj = json;
			
			if (typeof jsonObj === "string") {
				jsonObj = evel("("+jsonObj+")");
			}
			for (var key in jsonObj) {
				var k = key,v = jsonObj[key];
				for(var i=0; i < einput.length;i++){
					if(einput[i].name == k){
						einput[i].value = v;
						break;
					}
				}
			}
		}
	}
	window.gsPlugs = function(id){
		return new base(id);
	}
}())


	

