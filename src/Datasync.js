var Datasync = {
	_:{

		info:{
			version:'0.0.1',
			
		},

		log:{},

		decorator:{},
		factory:{},

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


/*================================
=            Pipeline            =
================================*/

/*----------  Public API  ----------*/

(function(){

	

})();
/*----------  Datapath  ----------*/

(function(){

	function Datapath(){

		//create instance memory for pipeline input
		this._pipeline = {
			formatter:null,
			filler:[],
			subset:[],
			transform:[]
		};

	}
	
	Datapath.prototype._ = {};

	/*----------  Formatter Operations  ----------*/
	Datapath.prototype.getFormatter = function(){
		return this_pipeline.formatter;
	};

	Datapath.prototype.hasFormatter = function(){
		return (this._pipeline.formatter !== null);
	};

	Datapath.prototype.addFormatter = function(fn){
		//1] defend the input

		//Are there any arguments?
		if(fn === undefined){
			Datasync._.info.warn("Calling [Datapath].addFormatter with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(Datasync._.util.is.Function(fn) === false){
			Datasync._.info.warn("Calling [Datapath].addFormatter an argument other than a function. No action was taken.");

			return this;
		}
		//is the user attempting to overwrite a previously defined formatter on this datapath?
		else if(this._pipeline.formatter !== null){
			Datasync._.info.warn("Calling [Datapath].addFormatter caused Datasync to overwrite a formatter. Action was taken.");
		}

		//2] take the action
		this._pipeline.formatter = (new Datasync.factory.Formatter(fn));

		return this;
	};

	/*----------  Filler Operations  ----------*/
	Datapath.prototype.getFiller = function(){
		return this_pipeline.filler;
	};
	
	Datapath.prototype.hasFiller = function(){
		return (this._pipeline.filler.length !== 0);
	};

	Datapath.prototype.addFiller = function(fn){
		//1] defend the input

		//Are there any arguments?
		if(fn === undefined){
			Datasync._.info.warn("Calling [Datapath].addFiller with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(Datasync._.util.is.Function(fn) === false){
			Datasync._.info.warn("Calling [Datapath].addFiller an argument other than a function. No action was taken.");

			return this;
		}

		//2] take the action
		this._pipeline.filler.push(new Datasync.factory.Formatter(fn));

		return this;
	};


	/*----------  Subset Operations  ----------*/
	
	//multi level add API
	Datapath.prototype._.addSubsetML = function(subsetName){
		var self = this;
		return function(fn){
			//what is the scope here?? TODO: test if i actually need self.
			return self._.addSubset(subsetName, fn);
		};
	};

	//single level add API (Used by multilevel)
	Datapath.prototype._.addSubset = function(subsetName, fn){
		//some actions here

		return this;
	};

	//add public facing interface
	Datapath.prototype.addSubset = function(subsetName, fn){

		//do we have valid input?
		if(subsetName === undefined){
			Datasync._.info.warn("Calling [Datapath].addSubset with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(fn !== undefined)
			return this._.addSubset(subsetName, fn);
		//they must want a multi-level accessor
		else
			return this._addSubsetML(subsetName);

	};


	/*----------  Transform Operation  ----------*/
	
	Datapath.prototype.addTransform = function(){
		
		return this;
	};


	//alias this class in factories
	Datasync.factory.Datapath = Datapath;

	//TODO:This will need to be moved out... but, we do want this flat api...

	// _addDatapath = function(key, path){
	// 	//report any potential issues
	// 	if(Datasync._.state.datapath[key] !== undefined){
	// 		Datasync._.info.warn('Warning, attempting to overwrite a datapath with [key = '+key+'][path = '+path+']');
	// 	}

	// 	//how to add data path here?
	// 	// datapath[key] = path;
	// };

	// //publically exposed method
	// Datasync.addDatapath = function(datapath){
	// 	return {
	// 		as:function(key){
	// 			_addDatapath(key, datapath);
	// 		}
	// 	}
	// };

})();

/*----------  Formatter  ----------*/

(function(){
	
	function Formatter(fn){
		//defend input

	}


	//alias this class in factories
	Datasync.factory.Formatter = Formatter;

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
	return (isNumber(val) && Math.floor(val) == val);
};

Datasync._.util.is.Number = function(val) {
	return (typeof val == "number");
};

Datasync._.util.is.String = function(){
	return (typeof val == "string");
};

Datasync._.util.is.Boolean = function(val) {
	return (typeof val == "boolean");
};

Datasync._.util.is.Object = function(val) {
	return (typeof val == "object" && val !== null);
};

Datasync._.util.is.Array = function(val) {
	return (val instanceof Array);
};

Datasync._.util.is.Function = function(val) {
	return (typeof val == "function");
};

Datasync._.util.is.Date = function(val) {
	return (Object.prototype.toString.call(val) === "[object Date]");
};

/*=====  End of Utils  ======*/
