var _elm_lang$animation_frame$Native_AnimationFrame = function()
{
var rAF = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	var id = requestAnimationFrame(function() {
		callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
	});

	return function() {
		cancelAnimationFrame(id);
	};
});

return {
	rAF: rAF
};

}();
