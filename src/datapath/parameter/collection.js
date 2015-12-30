define('parameter/collection', 
[

],
function(datapath){

	var parameterMap = {};

	var api = {};

	api.set = function(key, value){
		parameterMap[key] = value;
	};

	api.get = function(key){
		return parameterMap[key];
	};

	return api;
})