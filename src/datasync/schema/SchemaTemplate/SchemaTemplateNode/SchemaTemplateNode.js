(function(schemaFactories, typeCode, is){
	function SchemaTemplateNode(configuration, accessKey){
		
		this._ = {
			value:null,
			typeCode:null,//const
			config:configuration,

			accessKey:accessKey || '',
			children:[]
		};

		//run init
		init(this);
	}
	/*----------  class methods  ----------*/
	SchemaTemplateNode.prototype.isPrimitive = function(){
		return ((self._.typeCode === typeCode.primitive));
	};

	SchemaTemplateNode.prototype.isCollection = function(){
		return (self._.typeCode === typeCode.collection);
	};

	SchemaTemplateNode.prototype.isSchema = function(){
		return (self._.typeCode === typeCode.schema);
	};

	/*----------  static methods  ----------*/
	SchemaTemplateNode.isPrimitive = function(config){
		//handle configuration object and basic function cases
		return ((is.Function(config) && (config === String || config === Boolean || config === Date || config === Number))
					 || (is.Object(config) && config._type !== undefined));
	};

	SchemaTemplateNode.isCollection = function(config){
		return (is.Array(config));
	};

	SchemaTemplateNode.isSchema = function(config){
		return (is.Object(config) && config._type === undefined);
	};

	/*----------  utils  ----------*/
	function init(self){
		assignTypeCode(self);
		assignChildren(self);
	}

	//determine if the object is a primitive configuration object (rather than just a type declaration)
	function assignTypeCode(self){
		var config = self._.config;
		if(SchemaTemplateNode.isPrimitive(config))
			return (self._.typeCode = typeCode.primitive);
		else if(SchemaTemplateNode.isCollection(config))
			return (self._.typeCode = typeCode.collection);
		else if(SchemaTemplateNode.isSchema(config))
			return (self._.typeCode = typeCode.schema);
	}

	function assignChildren(self){
		//we just create a single child, and that is the iterative relationship
		if(self._.typeCode === typeCode.collection){
			self._.children.push( new SchemaTemplateNode(self._.config[0]) );
		}
		//a schema is to need to create child nodes for each of it's first level properties
		else if(self._.typeCode === typeCode.schema){
			for(var key in self._.config){
				self._.children.push( new SchemaTemplateNode(self._.config[key], key) );
			}
		}
	}

	schemaFactories.SchemaTemplateNode = SchemaTemplateNode;

})(
	_private('schema.factory'),
	_private('schema.constant.typeCode'),
	_private('util.is')
);