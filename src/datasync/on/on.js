(function(publicAPI, privateAPI, onConstants, info, is){

	//initialize the event map to be keyed on constants
	var eventMap = {};

	//public setter api
	publicAPI.on = function(key, cb){
		console.log(onConstants);
		//ensure that this key exists in our constants
		if(key === undefined || is.String(key) === false){
			info.warn("Attempting use an invalid event key. Ignoring.");
			return;
		}
		//ensure that we have a proper callback
		else if(cb === undefined || is.Function(cb) === false){
			info.warn('Provided an invalid argument for callback. Requesting function. Ingnoring.');
			return;
		}

		//ensure that an array exists for this key
		if(eventMap[key] === undefined){
			eventMap[key] = [];
		}

		//push the listener into the array
		eventMap[key].push(cb);
	};

	//private getter function to retrieve collected listeners
	privateAPI.getEventListeners = function(key){
		if(eventMap[key] === undefined) return [];
		else return eventMap[key];
	};

})(
	_public(),
	_private('on'),
	_private('on.constants'),
	_private('info'),
	_private('util.is')
);