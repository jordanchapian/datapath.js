define('parameter/collection', 
[

],
function(datapath){

	var parameterMap = {};

	var api = {};

	api.setParameter = function(key, value){
		parameterMap[key] = value;
	};

	api.getParameter = paramAPI.getParameter = function(key){
		return parameterMap[key];
	};

	return api;
})