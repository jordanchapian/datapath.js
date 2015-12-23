(function(schemaFactory, info, is){
	function Schema(config){
		//private collections
		this._ = {
			propertyConfig:config
		};
	}

	//basically wraps some raw datum... Cusing any required type conversions
	//and adding virtual properties.
	Schema.prototype.wrapDatum = function(datum){
		console.log(datum);
	};

	/*----------  virtuals  ----------*/
	
	function addVirtual_sl(self, name, fn){
		if(name === undefined || is.String(name) === false
			|| fn === undefined || is.Function(fn) === false){
			info.warn('Invalid input provided to addVirtual. No action taken.');
			return self;
		}

		//take action
		return self;
	}

	function addVirtual_ml(self, name){
		return function(fn){
			return addVirtual_sl(self, name, fn);
		}
	}

	Schema.prototype.addVirtual = function(name, fn){
		if(name === undefined && fn === undefined){
			info.warn('no input provided to addVirtual. No action taken');
			return this;
		}
		else if(fn === undefined){//multi level add
			return addVirtual_ml(this, name);
		}
		else{//single level add
			return addVirtual_sl(this, name, fn);
		}
	};

	schemaFactory.Schema = Schema;

})(
	_private('schema.factory'),
	_private('info'),
	_private('util.is')
);