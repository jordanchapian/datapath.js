(function(info, logOptions, is, undefined){


	info.warn = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.warn( logOptions.logPrefix + '  ' + message );
	};

	info.error = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.error( logOptions.logPrefix + '  ' + message );
	};

	info.log = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.log( logOptions.logPrefix + '  ' + message );
	};

	function canSendLog(message){
		//Check if we have logging enabled
		if(logOptions.logEnabled === false) return false;
		//check to see if this is a valid message
		else if(!is.String(message)) return false;
		else return true;
	}

})(
	_private('info'),
	_private('info.option'), 
	_private('util.is')
);