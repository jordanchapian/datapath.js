(function(datapathFactories, info){

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
			info.warn("Calling [Datapath].addFormatter with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(Datasync._.util.is.Function(fn) === false){
			info.warn("Calling [Datapath].addFormatter an argument other than a function. No action was taken.");

			return this;
		}
		//is the user attempting to overwrite a previously defined formatter on this datapath?
		else if(this._pipeline.formatter !== null){
			info.warn("Calling [Datapath].addFormatter caused Datasync to overwrite a formatter. Action was taken.");
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
			info.warn("Calling [Datapath].addFiller with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(internalApi.util.is.Function(fn) === false){
			info.warn("Calling [Datapath].addFiller an argument other than a function. No action was taken.");

			return this;
		}

		//2] take the action
		// this._pipeline.filler.push();

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
			info.warn("Calling [Datapath].addSubset with no arguments. No action was taken.");
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
	datapathFactories.Datapath = Datapath;

})(
	_private('pipeline.datapath.factory'), 
	_private('info')
);
