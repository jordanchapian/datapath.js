(function(paramAPI, publicAPI){
	
	var parameterMap = {};

	//private api passes around Parameter objects
	paramAPI.getParameter = function(key){

	};

	//public api only sees associated state (not actual Parameter objects)
	publicAPI.setParameter = function(key, value){

	};

	publicAPI.getParameter = function(key){

	};

})(
	_private('state.parameter'),
	_public()
);