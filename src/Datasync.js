var Datasync = {
	_:{

		info:{
			version:'0.0.1',
			
		},

		log:{},

		factories:{
			pipeline:{}
		},

		state:{
			dataset:{}
		},

		util:{},

		option:{}
	}
};

/*===============================
=            Options            =
===============================*/

Datasync._.option.log = {
	logPrefix:'datasync::-',
	logEnabled:true
};


/*=====  End of Options  ======*/



(function(){

	_addDataset = function(key, path){
		//report any potential issues
		if(datapath[key]){
			console.warn('Warning, attempting to overwrite a datapath with [key = '+key+'][path = '+path+']');
		}

		datapath[key] = path;
	};

	//public exposed method
	Datasync.addDataset = function(datapath){
		return {
			as:function(key){
				_addDatapath(key, datapath);
			}
		}
	};

})();
/*================================
=            Pipeline            =
================================*/

/*----------  Formatter  ----------*/

(function(){
	
	function Formatter(){

	}


	Datasync.factories.Formatter = function(){
		return (new formatter());
	};

	Datasync.addSubset = function(){

	};

})();



/*=====  End of Pipeline  ======*/

/*===============================
=            Logging            =
===============================*/
(function(){
	
	Datasync._.info = {};

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

/*=====  End of Logging  ======*/


/*=============================
=            Utils            =
=============================*/

/*----------  Type Checking  ----------*/
Datasync._.util.is = {};

Datasync._.util.is.Integer = function(val) {
	return isNumber(val) && Math.floor(val) == val;
};

Datasync._.util.is.Number = function(val) {
	return typeof val == "number";
};

Datasync._.util.is.String = function(){
	return typeof val == "string";
};

Datasync._.util.is.Boolean = function(val) {
	return typeof val == "boolean";
};

Datasync._.util.is.Object = function(val) {
	return typeof val == "object" && val !== null;
};

Datasync._.util.is.Array = function(val) {
	return val instanceof Array;
};

Datasync._.util.is.Function = function(val) {
	return typeof val == "function";
};

Datasync._.util.is.Date = function(val) {
	return (Object.prototype.toString.call(val) === "[object Date]");
};

/*=====  End of Utils  ======*/
