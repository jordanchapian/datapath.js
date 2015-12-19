(function(paramAPI, publicAPI, parameterFactories){
	
	var parameterMap = {};

	//private api passes around Parameter objects
	paramAPI.getParameter = function(key){
		return parameterMap[key];
	};

	//public api only sees associated state (not actual Parameter objects)
	publicAPI.setParameter = function(key, value){
		//if we have not seen this param before, let's start a new history for it
		if(parameterMap[key] === undefined){
			parameterMap[key] = (new parameterFactories.Parameter(value));
		}
		//lets update the history for this param
		else parameterMap[key].assignValue(value);
	};

	publicAPI.getParameter = function(key){
		if(parameterMap[key] === undefined) return undefined;
		else return parameterMap[key].getValue();
	};

})(
	_private('state.parameter'),
	_public(),
	_private('state.parameter.factory')
);