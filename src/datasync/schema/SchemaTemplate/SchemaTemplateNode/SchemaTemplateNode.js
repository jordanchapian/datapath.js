(function(schemaFactories, typeCode, is){
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

		if(isPrimitiveConfig(self))
			return (self._.typeCode = typeCode.primitiveConfig);
		else if(isPrimitive(self))
			return (self._.typeCode = typeCode.primitive);
		else if(isCollection(self))
			return (self._.typeCode = typeCode.collection);
		else if(isSchema(self))
			return (self._.typeCode = typeCode.schema);

	}
	
	function assignChildren(self){
		// if(self.)

		//if we are a primitive, we do not need to assign children 
		//this is our termination statement for recursive behavior
		if(self._.typeCode === typeCode.primitive || self._.typeCode === typeCode.primitiveConfig){

		}
		//we just create a single child, and that is the iterative relationship
		else if(self._.typeCode === typeCode.collection){

		}
		//a schema is to need to create child nodes for each of it's first level properties
		else if(self._.typeCode === typeCode.schema){

		}
	}

	//some type object like String, Boolean
	function isPrimitive(self){
		var config = self._.config;
		return (is.Function(config) && (config === String || config === Boolean || config === Date || config === Number));
	}

	//some configuration object for a primitive like {_type:Boolean, default:true}
	function isPrimitiveConfig(self){
		return (is.Object(self._.config) && self._.config._type !== undefined);
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
	_private('schema.constant.typeCode'),
	_private('util.is')
);