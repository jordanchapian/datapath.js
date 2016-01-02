//types are for primitives...
define('type/Number',[],
{
	//the accessor is what is used to identify a type
	//custom types expose some kind of accessor, and
	//expose these under types like datapath.types.ObjectId
	accessor:Number,

	//the options that this type accepts
	options:['range'],

	//this is required for validation.
	//the datum to be validated is passed in as the first argument
	//and the options specified for the schema primitive are passed in
	//so that decisions can be made dynamically...
	isValid:function(datum, options){

	}

});