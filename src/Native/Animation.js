var _elm_lang$animation$Native_Animation = function()
{

var rAF = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	var id = requestAnimationFrame(function(time) {
		callback(_elm_lang$core$Native_Scheduler.succeed(time || Time.now()));
	});

	return function() {
		cancelAnimationFrame(id);
	};
});

return {
	rAF: rAF
};

}();