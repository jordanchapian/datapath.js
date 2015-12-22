(function(publicApi, datapathAPI, is,set, schemaFactories, info, undefined){

	var schemaMap = {};

	//add datapath single level
	var _addSchema = function(schemaDefinition, schemaKey){
		console.log(schemaDefinition, schemaKey);
		//defend input
		if(schemaDefinition === undefined || is.Object(schemaDefinition) === false
				|| schemaKey === undefined || is.String(schemaKey) === false){

			info.error('Input format for addSchema is invalid. No recovery.');
			return;
		}
		//atempting to make multiple definitions with same key
		else if(schemaMap[schemaKey] !== undefined){
			info.warn('Provided multiple definitions for schema key ['+schemaKey+']. Behavior is not predictable.');
		}

		//take action
		return (schemaMap[schemaKey] = new schemaFactories.Schema(schemaDefinition));
	};

	//multi-level datapath adder
	var _addSchema_ML = function(schemaDefinition){
		return {
			as:function(schemaKey){
				return _addSchema(schemaDefinition, schemaKey);
			}
		}
	};

	//public exposure
	publicApi.addSchema = function(schemaDefinition, schemaKey){
		//do we have valid input?
		if(schemaDefinition === undefined){
			info.warn("Calling addSchema with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(schemaKey !== undefined)
			return _addSchema(schemaDefinition, schemaKey);
		//they must want a multi-level accessor
		else
			return _addSchema_ML(schemaDefinition);
	};

	publicApi.getSchema = function(key){
		if(key === undefined)return set.values(schemaMap);
		else return schemaMap[key];
	};


	//private exposure
	datapathAPI.getSchema = function(key){
		if(key === undefined)return set.values(schemaMap);
		else return schemaMap[key];
	};	


})(
	_public(), 
	_private('datapath'),
	_private('util.is'),
	_private('util.set'),
	_private('schema.factory'),
	_private('info')
);
