/**
 * 
 * @authors deep (liweidong@deeping.cn)
 * @date    2016-05-12 11:08:54
 * @version 0.1
 * 
 *
 * 
 */

/**
 * ie8 - es5 - add eventlistener
 */
(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();

/**
 * ie8 - es5 - string.prototype.trim
 */
(function(){
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }  
})();

/**
 * ie8 - es5 - firstElementChild
 */
(function() {
	// Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
	if(!("firstElementChild" in document.documentElement)){
	    Object.defineProperty(Element.prototype, "firstElementChild", {
	        get: function(){
	            for(var nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i)
	                if(n = nodes[i], 1 === n.nodeType) return n;
	            return null;
	        }
	    });
	}
})();

/**
 * ie8 - es5 - getComputedStyle - zxx
 */
(function() {
 	
  if (typeof window.getComputedStyle !== "function") {
      window.getComputedStyle = function(el, pseudo) {
        var oStyle = {};
        var oCurrentStyle = el.currentStyle || {};
        for (var key in oCurrentStyle) {
          oStyle[key] = oCurrentStyle[key];
        }

        //oStyle.styleFloat = oStyle.cssFloat; // ie8 没有cssFloat,但此处不做浮动属性的兼容，故先隐藏
        
        oStyle.getPropertyValue = function(prop) {
          return oCurrentStyle.getAttribute(prop) || null;  // 不考虑ie6兼容
        };
        return oStyle;
      };
  }
})();

/**
 * ie8 - es5 - getElementsByClassName - document / Element
 */
(function() {
  getByClassName = function(classNames){
    return this.querySelectorAll("." + classNames.trim().replace(/\s+/,"."));
  };

  if (!document.getElementsByClassName){
    document.getElementsByClassName = getByClassName;
  }

  if(!Element.getElementsByClassName){
    Element.prototype.getElementsByClassName = getByClassName;
  }
})();

/**
 * ie8 - es5 - map - zxx
 */
(function() {
  if (typeof Array.prototype.map != "function") {
    Array.prototype.map = function (fn, context) {
      var arr = [];
      if (typeof fn === "function") {
        for (var k = 0, length = this.length; k < length; k++) {
          arr.push(fn.call(context, this[k], k, this));
        }
      }
      return arr;
    };
  }
})();

/**
 * ie8 - es5 - indexOf - zxx - change detail
 */
(function(){
  if(typeof Array.prototype.indexOf != "function") {

    Array.prototype.indexOf = function(search,from){
      var index = -1;
      var fromIndex = parseInt(from) || 0;

      for (var k=0, length = this.length; k < length; k++){
        if(k >= fromIndex && this[k] === search) {
          index = k;
          break;
        }
      }
      return index;
    };
  }

})();

/**
 * ie8 - es5 - nextElementSibling
 */
(function(){
  // Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
  if(!("nextElementSibling" in document.documentElement)){
      Object.defineProperty(Element.prototype, "nextElementSibling", {
          get: function(){
              var e = this.nextSibling;
              while(e && 1 !== e.nodeType)
                  e = e.nextSibling;
              return e;
          }
      });
  }  
})();

/**
 * ie8 - es5 - textContent
 */
(function(){
  if (Object.defineProperty 
    && Object.getOwnPropertyDescriptor 
    && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") 
    && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
    (function() {
      var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
      Object.defineProperty(Element.prototype, "textContent",
       {
         get: function() {
           return innerText.get.call(this);
         },
         set: function(s) {
           return innerText.set.call(this, s);
         }
       }
     );
    })();
  }
})();

/**
 * ie8 - es5 - Function.prototype.bind
 */
(function(){
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype; 
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
})();