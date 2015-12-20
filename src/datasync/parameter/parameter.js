(function(paramAPI, publicAPI, parameterFactories){
	
	var parameterMap = {};

	//public api only sees associated state (not actual Parameter objects)
	publicAPI.setParameter = function(key, value){
		parameterMap[key] = value;
	};

	publicAPI.getParameter = paramAPI.getParameter = function(key){
		parameterMap[key]
	};

})(
	_private('state.parameter'),
	_public()
);