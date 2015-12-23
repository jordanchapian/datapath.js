(function(schemaFactory, info, is){
	function Schema(key, config){
		//private collections
		this._ = {
			key:key,
			templateDefinition:(config || null),
			virtual:{}
		};
	}

	Schema.prototype.setTemplate = function(templateDefinition){
		if(is.Object(templateDefinition) === false){
			info.warn('Template definition must be an object. Definition not assigned.');
			return this;
		}
		else if(this._.templateDefinition !== null){
			info.warn('Overwriting template definition for ['+this._.key+'] multiple times. Behavior may difficult to predict.');	
		}
		
		this._.templateDefinition = templateDefinition;
		
		return this;
	};

	//basically wraps some raw datum... Cusing any required type conversions
	//and adding virtual properties.
	Schema.prototype.wrapDatum = function(datum){
		console.log(datum);
	};

	//determines if the datum is actually valid (are there required fields that are not filled?)
	Schema.prototype.isValid = function(datum){
		
	};

	/*----------  virtuals  ----------*/
	
	function addVirtual_sl(self, name, fn){
		if(name === undefined || is.String(name) === false
			|| fn === undefined || is.Function(fn) === false){
			info.warn('Invalid input provided to addVirtual. No action taken.');
			return self;
		}
		else if(self._.virtual[name] !== undefined){
			info.warn('Multiple definitions for virtual property ['+name+'] in schema ['+self._.key+']');
		}

		//take action
		self._.virtual[name] = fn;

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