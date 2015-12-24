(function(schemaFactories, is){

	function SchemaTemplate(config, accessor){
		console.log('created schema template with configuration', config);

		this._ = {
			config:config,
			root:null
		};

		init(this);
	}

	/*----------  class methods  ----------*/
	
	/*----------  static methods  ----------*/
	SchemaTemplate.isValidConfiguration = function(){

	};
	
	/*----------  utils  ----------*/
	function init(self){
		//initialize the root of the schema configuration
		//(this is a recursive operation)
		self._.root = schemaFactories.SchemaTemplateNode(self._.config);


	}

	//expose to namespace
	schemaFactories.SchemaTemplate = SchemaTemplate;

})(
	_private('schema.factory'),
	_private('util.is')
);