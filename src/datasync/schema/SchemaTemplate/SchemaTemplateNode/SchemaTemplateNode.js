(function(schemaFactories, is){
	function SchemaTemplateNode(configuration, accessor){
		
		this._ = {
			value:null,
			typeCode:null,//const
			config:configuration,
			accessor:accessor,

			children:[]
		};

		//run init
		init(this);
	}

	/*----------  class methods  ----------*/
	
	/*----------  static methods  ----------*/
		
	/*----------  utils  ----------*/
	function init(self){
		assignTypeCode(self);


	}

	//determine if the object is a primitive configuration object (rather than just a type declaration)
	function assignTypeCode(self){
		//
		if(isPrimitiveConfig(self))
			return (self._.typeCode = 0);
		else if(isPrimitive())
			return (self._.typeCode = 1);
		else if(isCollection(self))
			return (self._.typeCode = 2);
		else if(isSchema(self))
			return (self._.typeCode = 3);
	}
		
	//some type object like String, Boolean
	function isPrimitive(self){
		var config = self._.config;
		return (is.Function(config) && (config === String || config === Boolean || config === Date || config === Number));
	}

	//some configuration object for a primitive like {_type:Boolean, default:true}
	function isPrimitiveConfig(self){
		return (is.Object(self._.config) && ob._type !== undefined);
	}
	
	function isCollection(self){
		return (is.Array(self._.config));
	}

	function isSchema(self){
		return (is.Object(self._.config) && isPrimitiveConfig(self) === false);
	}



	schemaFactories.SchemaTemplateNode = SchemaTemplateNode;

})(
	_private('schema.factory'),
	_private('util.is')
);