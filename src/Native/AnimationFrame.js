var _elm_lang$animation_frame$Native_AnimationFrame = function()
{

var rAF = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	var id = requestAnimationFrame(function(time) {
		var now = Date.now();
		var normalizedTime = performance.timing.navigationStart + time;
		var yieldedTime = time ?
			(normalizedTime > now ? time : normalizedTime) :
			now;
		
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
