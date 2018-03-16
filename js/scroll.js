document.addEventListener('DOMContentLoaded', function() {
	var img01 = document.getElementById('img01'),
		container = document.getElementById('container'),
		imgCont_01 = document.getElementById('imgCont_01'),
		imgCont_02 = document.getElementById('imgCont_02'),
		overlay = document.getElementById('overlay'),
		indicator = document.getElementById('indicator'),
		indicatorHead = document.getElementById('indicatorHead'),
		innerH,
		rect,
		rect_,
		startingY = 0,
		scAmount = 0,
		scAmount2 = 0,
		scrollDir,
		CSSprop,
		isAnimate = false,
		isPassed,
		supportOffset = window.pageYOffset !== undefined,
		lastKnownPos = 0,
		ticking = false,
		scrollDir,
		currYPos,
		is01done = false,
		scrollYonLoad,
		isCrossed = false,
		imageHeight = 100,
		reverse = false,
		lasthit,
		counter = 0;

	$(window).on("load resize", function() {
		setDefaultHeight([img01, imgCont_01, img02, imgCont_02, container]);
		rect_ = container.getBoundingClientRect();
		console.log('rect1 ' + rect_.top);
		scrollYonLoad = rect_.top;
		isPassed = rect_.top < 0 ? true : false;
		console.log('isPassed on load? ' + isPassed);
		indicatorHead.innerHTML = 'SECTION 1<br>';
		indicatorHead.innerHTML += 'rect.top(onload) ' + rect_.top + '<br>';
		indicatorHead.innerHTML += 'is01done ' + is01done + '<br>';
		// detectIfcrossed();
	});

	function setDefaultHeight(arr) {
		for (var i = 0, innerH = window.innerHeight, len = arr.length; i < len; i++) {
			arr[i].style.height = innerH + 'px';
		}
	}

	function detectIfcrossed() {
		// if(rect_) {
			if (!is01done && !isPassed && rect.top < 0 && scrollDir === 'down') {
				isCrossed = true;
				lasthit = 'top';
				_isPassed = false;
				// isPassed = true;
			}
			else if (is01done && rect.top > 0 && scrollDir === 'up') {
				isCrossed = true;
				is01done = false;
				lasthit = 'bottom';
				_isPassed = false;
				// isPassed = true;
			}
			// isPassed = false;
		// }
	}

	function setConditionsWhenSlideEnd() {
		reverse = scrollDir === 'up' ? true : false;
		imageHeight = !reverse ? 0 : 100;
		is01done = !reverse ? true : false;
		isCrossed = isAnimate = false;
		isCrossed = false;
		scAmount = 0;
	}

	function setCounter(x) {
		if (x === 0 && CSSprop <= 1) {
			counter++;
		}
		else if (x === 1 && CSSprop >= 100) {
			counter--;
		}
	}

	function slide(slide1, slide2) {
		if (!isPassed && isCrossed && !is01done) {
			console.log('hit 1');
			console.log('rect1 ' + rect.top);
			overlay.style.display = 'block';
			container.style.position = 'fixed';

			if (isAnimate === false) {
				startingY = window.pageYOffset;
				isAnimate = true;
			}

			scAmount = (window.pageYOffset - parseInt(startingY))/10;

			CSSprop = imageHeight - scAmount;


			//forward
			if (lasthit === 'top') {

				if (counter === 0) {
					slide1.style.height = CSSprop + '%';
				}

				if (counter === 1) {
					CSSprop = 100;
					scAmount2 = scAmount - 100;
					CSSprop = 100 - scAmount2;
					
					if (scAmount2 >= 0) slide2.style.height = CSSprop + '%';

					CSSprop = Math.abs(scAmount2);

					if (scAmount2 <= 1) slide1.style.height = CSSprop + '%';
				}
			}


			//reverse
			if (lasthit === 'bottom') {

				if (counter === 1) {
					CSSprop = Math.abs(CSSprop);
					slide2.style.height = CSSprop + '%';
				}

				if (counter === 0) {

					CSSprop -= 100;

					slide1.style.height = CSSprop + '%';

					if (scAmount >= -100) {
						CSSprop = 100 - Math.abs(CSSprop);
						slide2.style.height = CSSprop + '%';
					}
				}
			}

			setCounter(counter);
			
			//Leave slide mode
			if ((lasthit === 'top' && (scAmount >= 200 || scAmount <= -1)) || (lasthit === 'bottom' && (scAmount >= 1 || scAmount <= -200))) {
				setConditionsWhenSlideEnd();
				container.style.position = 'relative';
				overlay.style.display = 'none';
				container.scrollIntoView();
			}
		}
	}

	window.addEventListener('wheel', function() {
		currYPos = supportOffset ? window.pageYOffset : document.body.scrollTop;
		rect = container.getBoundingClientRect();
		scrollDir = lastKnownPos > currYPos ? 'up' : 'down';
		lastKnownPos = currYPos;
		detectIfcrossed();
		console.log('is 1 Passed ' + isPassed);
		if (!ticking) {
			window.requestAnimationFrame(function() {
				slide(imgCont_01, imgCont_02);
				ticking = false;
			});
		}
		ticking = true;

		indicator.innerHTML = `
			is01done: ${is01done} <br>
			rect.top: ${rect.top} <br>
			Last hit: ${lasthit} <br>
			imageHeight: ${imageHeight} <br>
			counter: ${counter} <br>
			scAmount: ${scAmount} <br>
			scAmount2: ${scAmount2} <br>
			CSSprop: ${CSSprop} <br>
			isPassed: ${isPassed} <br>
		`;

	}, {
		capture: true,
		passive: true
	});
});