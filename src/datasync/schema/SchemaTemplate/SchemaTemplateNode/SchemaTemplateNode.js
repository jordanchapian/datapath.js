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

	//from the configuration provided, what datum wrapper should we use?
	SchemaTemplateNode.provideSubclass = function(config){
		if(SchemaTemplateNode.isPrimitive(config)) return schemaFactories.STN_Primitive;
		else if(SchemaTemplateNode.isCollection(config)) return schemaFactories.STN_Collection;
		else if(SchemaTemplateNode.isSchema(config)) return schemaFactories.STN_Schema;
		else return SchemaTemplateNode;
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
		if(self._.typeCode === typeCode.collection && self._.config.length > 0){
			var childConstructor = SchemaTemplateNode.provideSubclass(self._.config[0]);
			self._.children.push( new childConstructor(self._.config[0]) );
		}
		//a schema is to need to create child nodes for each of it's first level properties
		else if(self._.typeCode === typeCode.schema){
			for(var key in self._.config){
				var childConstructor = SchemaTemplateNode.provideSubclass(self._.config[key]);
				self._.children.push( new childConstructor(self._.config[key]) );
			}
		}
	}

	schemaFactories.SchemaTemplateNode = SchemaTemplateNode;

})(
	_private('schema.factory'),
	_private('schema.constant.typeCode'),
	_private('util.is')
);