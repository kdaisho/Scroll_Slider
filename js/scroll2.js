document.addEventListener('DOMContentLoaded', function() {
	var _img01 = document.getElementById('_img01'),
		_container = document.getElementById('_container'),
		_imgCont_01 = document.getElementById('_imgCont_01'),
		_imgCont_02 = document.getElementById('_imgCont_02'),
		_overlay = document.getElementById('_overlay'),
		_indicator = document.getElementById('_indicator'),
		_innerH,
		_rect,
		_startingY = 0,
		_scAmount = 0,
		_scAmount2 = 0,
		_scrollDir,
		_CSSprop,
		_isAnimate = false,
		_isPassed,
		_supportOffset = window.pageYOffset !== undefined,
		_lastKnownPos = 0,
		_ticking = false,
		_scrollDir,
		_currYPos,
		_is01done = false,
		_scrollYonLoad,
		_isCrossed = false,
		_imageHeight = 100,
		_reverse = false,
		_lasthit,
		_counter = 0;

	$(window).on("load resize", function() {
		setDefaultHeight([_img01, _imgCont_01, img02, _imgCont_02, _container]);
		_rect = _container.getBoundingClientRect();
		_scrollYonLoad = _rect.top;
		_isPassed = _rect.top < 0 ? true : false;
		console.log('_isPassed on load? ' + _isPassed);
	});

	function setDefaultHeight(arr) {
		for (var i = 0, _innerH = window._innerHeight, len = arr.length; i < len; i++) {
			arr[i].style.height = _innerH + 'px';
		}
	}

	function detectIfcrossed() {
		if (!_is01done && !_isPassed && _rect.top < 0 && _scrollDir === 'down') {
			_isCrossed = true;
			_lasthit = 'top';
		}
		else if (_is01done && _rect.top > 0 && _scrollDir === 'up') {
			_isCrossed = true;
			_is01done = false;
			_lasthit = 'bottom';
		}
		_isPassed = false;
	}

	function setConditionsWhenSlideEnd() {
		_reverse = _scrollDir === 'up' ? true : false;
		_imageHeight = !_reverse ? 0 : 100;
		_is01done = !_reverse ? true : false;
		_isCrossed = _isAnimate = false;
		_isCrossed = false;
		_scAmount = 0;
	}

	function set_counter(x) {
		if (x === 0 && _CSSprop <= 1) {
			_counter++;
		}
		else if (x === 1 && _CSSprop >= 100) {
			_counter--;
		}
	}

	function slide(slide1, slide2) {
		if (!_isPassed && _isCrossed && !_is01done) {

			_overlay.style.display = 'block';
			_container.style.position = 'fixed';

			if (_isAnimate === false) {
				_startingY = window.pageYOffset;
				_isAnimate = true;
			}

			_scAmount = (window.pageYOffset - parseInt(_startingY))/10;

			_CSSprop = _imageHeight - _scAmount;


			//forward
			if (_lasthit === 'top') {

				if (_counter === 0) {
					slide1.style.height = _CSSprop + '%';
				}

				if (_counter === 1) {
					_CSSprop = 100;
					_scAmount2 = _scAmount - 100;
					_CSSprop = 100 - _scAmount2;
					
					if (_scAmount2 >= 0) slide2.style.height = _CSSprop + '%';

					_CSSprop = Math.abs(_scAmount2);

					if (_scAmount2 <= 1) slide1.style.height = _CSSprop + '%';
				}
			}


			//_reverse
			if (_lasthit === 'bottom') {

				if (_counter === 1) {
					_CSSprop = Math.abs(_CSSprop);
					slide2.style.height = _CSSprop + '%';
				}

				if (_counter === 0) {

					_CSSprop -= 100;

					slide1.style.height = _CSSprop + '%';

					if (_scAmount >= -100) {
						_CSSprop = 100 - Math.abs(_CSSprop);
						slide2.style.height = _CSSprop + '%';
					}
				}
			}

			set_counter(_counter);

			_indicator.innerHTML = 'Last hit: ' + _lasthit + '<br>';
			_indicator.innerHTML += '_imageHeight: ' + _imageHeight + '<br>';
			_indicator.innerHTML += '_counter: ' + _counter + '<br>';
			_indicator.innerHTML += '_scAmount: ' + _scAmount + '<br>';
			_indicator.innerHTML += '_scAmount2: ' + _scAmount2 + '<br>';
			_indicator.innerHTML += '_CSSprop ' + _CSSprop + '<br>';
			
			//Leave slide mode
			if ((_lasthit === 'top' && (_scAmount >= 200 || _scAmount <= -1)) || (_lasthit === 'bottom' && (_scAmount >= 1 || _scAmount <= -200))) {
				setConditionsWhenSlideEnd();
				_container.style.position = 'relative';
				_overlay.style.display = 'none';
				_container.scrollIntoView();
			}
		}
	}

	window.addEventListener('scroll', function() {
		_currYPos = _supportOffset ? window.pageYOffset : document.body.scrollTop;
		_rect = _container.getBoundingClientRect();
		_scrollDir = _lastKnownPos > _currYPos ? 'up' : 'down';
		_lastKnownPos = _currYPos;
		detectIfcrossed();
		if (!_ticking) {
			window.requestAnimationFrame(function() {
				slide(_imgCont_01, _imgCont_02);
				_ticking = false;
			});
		}
		_ticking = true;
	}, {
		capture: true,
		passive: true
	});
});