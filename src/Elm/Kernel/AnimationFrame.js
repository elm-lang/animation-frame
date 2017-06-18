/*

import Elm.Kernel.Scheduler exposing (binding, succeed)

*/

var _AnimationFrame_rAF = __Scheduler_binding(function(callback)
{
	var id = requestAnimationFrame(function() {
		callback(__Scheduler_succeed(Date.now()));
	});

	return function() {
		cancelAnimationFrame(id);
	};
});
