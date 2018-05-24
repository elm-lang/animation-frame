/*

import Elm.Kernel.Scheduler exposing (binding, succeed)

*/

function _AnimationFrame_rAF()
{
	return __Scheduler_binding(function(callback)
	{
		var id = requestAnimationFrame(function() {
			callback(__Scheduler_succeed(Date.now()));
		});

		return function() {
			cancelAnimationFrame(id);
		};
	});
}


function _AnimationFrame_now()
{
	return __Scheduler_binding(function(callback)
	{
		callback(__Scheduler_succeed(Date.now()));
	});
}
