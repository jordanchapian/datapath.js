(function(defaults){

	//the number of <paramset>:<dataset> pairs to store before flagging cached data for garbage collection
	defaults.cacheSize = 1;

})(
	_private('datapath.configDefault')
);
