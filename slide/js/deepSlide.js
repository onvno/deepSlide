/**
 * @authors     Li Weidong (https://github.com/onvno)
 * @email       leewei2020@gmail.com
 * @contributer Zhou Xiaotian , Lao Geng
 * @company     Deep (www.deeping.cn) 
 * @date        2016-05
 * @version     0.1
 * @commit      This is first time to build some components , just want to get a more easy way for working . Before do this, most time work with jQuery, so i'm a worse JSer , please give us more confidence , more time & suggestions , thx !
 * Released under the MIT license.
 */

function deepSlide (options) {
	var defaults = {
		content : '',
		pause : true,
		speed : 500,
		time : 3000

	}

	var options,
		inner,
		dotwrap,
		firstPage,
		clonePage,
		pageWidth,
		pageLength,
		time,
		speeds,
		slideDistance,
		leftBtn,
		rightBtn,
		content,
		otarget;
	var timer = null;
	var step = 0;




	// change default config
	function inputArguments(source,attribute) {
		var attr;
		for (attr in attribute) {
			if (attribute.hasOwnProperty(attr)) {
				source[attr] = attribute[attr];
			}
		}
		return source;
	}

	// change default
	if(arguments[0] && typeof arguments[0] === 'object') {
		options = inputArguments(defaults,arguments[0]);
	}else if(!arguments[0]){
		options = defaults;
	}

	//clone & add page
	content = options.content;
	inner = content.getElementsByTagName('ul')[0];
	dotwrap = content.getElementsByTagName('ol')[0];
	dotters = dotwrap.getElementsByTagName('li');

	firstPage = inner.firstElementChild; 
	clonePage = firstPage.cloneNode(true);
	inner.appendChild(clonePage);
	
	//change inner width
	pageWidth = inner.getElementsByTagName('li')[0].offsetWidth; 
	pageLength = inner.getElementsByTagName('li').length;
	inner.style.width = pageWidth * pageLength + 'px';

	//auto slide
	step = 0;
	speeds = options.speed;

	var Liter = function(){}; //尝试使用Liter = {},结果报错，不能添加prototype.adclasser
	Liter.prototype.adclasser = function (array) {
			for(var i = 0; i<array.length; i++){
				array[i].className = 'current';
			}			
	};
	Liter.prototype.rmclasser = function (array) {
			for(var i = 0; i<array.length; i++){
				array[i].className = '';
			}				
	};
	var test = new Liter();

	function autoLeft () {
		clearTimeout(timer);
		step ++;
		if(step == pageLength) {
			inner.style.left = 0;
			step = 1;
		}
		if(step == pageLength-1) {
			test.rmclasser(dotters);
			dotters[0].className = 'current';
		} else {
			test.rmclasser(dotters);
			dotters[step].className = 'current';
		}

		otarget = {
			left : -step*pageWidth
		};
		deepEase(inner , otarget , speeds , 'linear');
		timer = setTimeout(autoLeft,time);
	}

	function autoRight () {
		clearTimeout(timer)
		step--
		if(step == -1){
			inner.style.left = -( pageLength - 1 ) * pageWidth + 'px';
			step = pageLength - 2;
			test.rmclasser(dotters);
			dotters[step].className = 'current';
		} else {
			test.rmclasser(dotters);
			dotters[step].className = 'current';
		}

		otarget = {
			left : -step*pageWidth
		};
		deepEase(inner , otarget , speeds , 'linear');
		timer = setTimeout(autoLeft,time);
	}

	time = options.time;
	timer = setTimeout(autoLeft,time);


	leftBtn = document.getElementById('left');
	rightBtn = document.getElementById('right');
	leftBtn.addEventListener('click' , autoRight);
	rightBtn.addEventListener('click' , autoLeft);

	for(var j=0; j<dotters.length; j++) {
		dotters[j].dotindex = j;
		dotters[j].addEventListener('click',function(){
			clearTimeout(timer);
			otarget = {
				left : -this.dotindex*pageWidth
			};
			step = this.dotindex;
			deepEase(inner , otarget , speeds , 'linear');
			dotSelect(dotters, this.dotindex);
			timer = setTimeout(autoLeft,time);
		});
	}

	function dotSelect(array, index) {
		for(var i=0 ; i<array.length; i++) {
			array[i].className = '';
		}
		array[index].className = 'current';
	}

	content.addEventListener('mouseover', function(){
		clearTimeout(timer);
	});
	content.addEventListener('mouseleave', function(){
		timer = setTimeout(autoLeft,time);
	});


	//Compatible chrome / firefox flash
	/*window.addEventListener('focus' , function(){
		timer = setTimeout(autoLeft,time);
	});*/

	/*window.addEventListener('blur' , function(){
		window.clearTimeout(timer);
	});*/

	// 1、注意初始化left:0,因为浏览器默认会识别为left:auto;
	// 2·注意判定左右按钮是否存在，否则会报错



}