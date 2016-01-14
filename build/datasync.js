(function(){
	'use strict';

	

var Datasync = {
	_:{
		log:{},

		decorator:{},
		factory:{},

		state:{
			dataset:{}
		},

		util:{},
		option:{},
		info:{}
	}
};

(function(info, undefined){


	Datasync._.info.warn = function(message){
		if(!canSendLog())return;
		//carry through with request, appending prefix to message
		console.warn( Datasync._.option.log.logPrefix + '  ' + message );
	};

	Datasync._.info.error = function(message){
		if(!canSendLog())return;
		//carry through with request, appending prefix to message
		console.error( Datasync._.option.log.logPrefix + '  ' + message );
	};

	Datasync._.info.log = function(message){
		if(!canSendLog())return;
		//carry through with request, appending prefix to message
		console.log( Datasync._.option.log.logPrefix + '  ' + message );
	};

	function canSendLog(message){
		//Check if we have logging enabled
		if(Datasync._.option.log.logEnabled === false) return false;
		//check to see if this is a valid message
		else if(!Datasync._.util.is.String(message)) return false;
	}

})();
(function(){

	Datasync._.option.log = {
		logPrefix:'datasync::-',
		logEnabled:true
	};
	
})();
})();