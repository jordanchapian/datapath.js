(function(schemaFactories){
	function SchemaTemplateNode(configuration){
		
		this._ = {
			value:null,
			type:null//const
		};

	}

	/*----------  class methods  ----------*/
	
	/*----------  static methods  ----------*/
	
	schemaFactories.SchemaTemplateNode = SchemaTemplateNode;
})(
	_private('schema.factory')
);