(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}
}(this, function($) {
	$.fn.circliful = function(options) {
		var settings = $.extend({
			fgcolor: "#556b2f",
			backgroundColor: "#eee",
			fillColor: false,
			width: 15,
			dimension: 200,
			percent: 50,
			animationStep: 1.0
		}, options);
		return this.each(function() {
			var dimension = '';
			var text = '';
			var info = '';
			var width = '';
			var percent = 0;
			var endPercent = 100;
			var fgcolor = '';
			var bgcolor = '';
			var icon = '';
			var animationstep = 0.0;
			var $this = $(this);
			if ($this.data('dimension') != undefined) {
				dimension = $this.data('dimension');
			} else {
				dimension = settings.dimension;
			}
			if ($this.data('width') != undefined) {
				width = $this.data('width');
			} else {
				width = settings.width;
			}
			if ($this.data('percent') != undefined) {
				percent = $this.data('percent') / 100;
				endPercent = $this.data('percent');
			} else {
				percent = settings.percent / 100;
			}
			if ($this.data('fgcolor') != undefined) {
				fgcolor = $this.data('fgcolor');
			} else {
				fgcolor = settings.fgcolor;
			}
			if ($this.data('bgcolor') != undefined) {
				bgcolor = $this.data('bgcolor');
			} else {
				bgcolor = settings.bgcolor;
			}
			if ($this.data('animation-step') != undefined) {
				animationstep = parseFloat($this.data('animation-step'));
			} else {
				animationstep = settings.animationStep;
			}
			if ($this.data('text') != undefined || settings.text) {
				text = $this.data('text') || settings.text;
				$this.append('<span class="circle-text">' + text + '</span>');
				$this.find('.circle-text').css({
					'line-height': (dimension * .8) + 'px'
				});
			}
			if ($this.data('info') != undefined) {
				info = $this.data('info');
				$this.append('<span class="circle-info">' + info + '</span>');
				$this.find('.circle-info').css({
					'line-height': (dimension * 1.25) + 'px',
				});
			}
			$this.width(dimension + 'px');
			var canvas = $('<canvas></canvas>').attr({
				width: dimension,
				height: dimension
			}).appendTo($this).get(0);
			var context = canvas.getContext('2d');
			var x = canvas.width / 2;
			var y = canvas.height / 2;
			var degrees = percent * 360.0;
			var radians = degrees * (Math.PI / 180);
			var radius = canvas.width / 2.5;
			var startAngle = 2.3 * Math.PI;
			var endAngle = 0;
			var counterClockwise = false;
			var curPerc = animationstep === 0.0 ? endPercent : 0.0;
			var curStep = Math.max(animationstep, 0.0);
			var circ = Math.PI * 2;
			var quart = Math.PI / 2;
			var type = '';
			var fill = false;
			if ($this.data('fill') != undefined) {
				fill = $this.data('fill');
			} else {
				fill = settings.fillColor;
			}

			function animate(current) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.arc(x, y, radius, endAngle, startAngle, false);
				context.lineWidth = width - 1;
				context.strokeStyle = bgcolor;
				context.stroke();
				if (fill) {
					context.fillStyle = fill;
					context.fill();
				}
				context.beginPath();
				context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
				context.lineWidth = width;
				context.strokeStyle = fgcolor;
				context.stroke();
				if (curPerc < endPercent) {
					curPerc += curStep;
					requestAnimationFrame(function() {
						animate(Math.min(curPerc, endPercent) / 100);
					});
				}
			}
			animate(curPerc / 100);
		});
	};
}));