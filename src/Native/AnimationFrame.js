var _elm_lang$animation_frame$Native_AnimationFrame = function()
{

var hasStartTime =
	window.performance &&
	window.performance.timing &&
	window.performance.timing.navigationStart;

var navStart = hasStartTime
	? window.performance.timing.navigationStart
	: Date.now();

var rAF = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	var id = requestAnimationFrame(function(time) {
		var timeNow = time
			? (time > navStart ? time : time + navStart)
			: Date.now();

		callback(_elm_lang$core$Native_Scheduler.succeed(timeNow));
	});

	return function() {
		cancelAnimationFrame(id);
	};
});

return {
	rAF: rAF
};

}();
