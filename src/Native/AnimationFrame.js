var _elm_lang$animation_frame$Native_AnimationFrame = function()
{
	
var navStart = window.performance && window.performance.timing && window.performance.timing.navigationStart ?
	window.performance.timing.navigationStart :
	Date.now();

var rAF = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	var id = requestAnimationFrame(function(time) {
		var yieldedTime = time ?
			(time > navStart ? time : time + navStart) :
			Date.now();
		
		callback(_elm_lang$core$Native_Scheduler.succeed(yieldedTime));
	});

	return function() {
		cancelAnimationFrame(id);
	};
});

return {
	rAF: rAF
};

}();
