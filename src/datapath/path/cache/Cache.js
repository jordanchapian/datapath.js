define('path/cache/Cache',
[
	'option/cacheDefault',
	'./data/DataFrame',
	'util/is'
],
function(cacheDefault, DataFrame, is){

	function Cache(datapath){
		//private instance namespace
		this._ = {};

		//dataframes, ordered from recent to oldest
		this._.dataframes = [new DataFrame(datapath)];
		this._.capacity = cacheDefault.cacheSize;

		//reference to the datapath object associated with this cache
		this._.datapath = datapath;
	}

	Cache.prototype.setSize = function(size){
		if(is.Number(size) && size >= 1){
			this._.capacity = size;

			//we have changed the local cache size configuration, 
			//we can emit this event internally, then externally.
			// if(!omitEvents && this._.cacheSize !== size)
			// {

			// }

		}
	};

	Cache.prototype.activeDataFrame = function(){
		return (this._.dataframes.length > 0) ? this._.dataframes[0] : undefined;
	};

	Cache.prototype.isCacheFull = function(){
		return (this._.capacity === this._.dataframes.length);
	};

	Cache.prototype.cacheOverflow = function(){
		return (this._.capacity < this._.dataframes.length);
	};

	//remove entire cache
	Cache.prototype.clearDataframes = function(){
		this._.dataframes = [];
	};

	Cache.prototype.sync = function(cb){ //should return promise
		var validIndex;

		//if we have a valid frame already, we need to put it in the front of the array, and no datafetch required
		if((validIndex = validFrameIndex(this)) > -1){
			this._.dataframes.splice(0, 0, this._.dataframes.splice(validIndex, 1)[0]);
		}
		//we must add a new frame. (then check overflow)
		else{
			this._.dataframes.splice(0,0, new DataFrame(this._.datapath) );
		}

		//remove an old frame if we've overflowed
		if(this.cacheOverflow()){
			this._.dataframes.splice((this._.dataframes.length - 1), 1);
		}

		//now we can request our dataframe to fill it's dataset from remote
		this._.dataframes[0].fill(function(){
			//action is complete (TODO, this would be an async response...)
			return cb();
		});
	};

	/*----------  utils  ----------*/
	function validFrameIndex(self){

		for(var i=0; i < self._.dataframes.length; i++){
			if(self._.dataframes[i].parametersValid()) return i;
		}

		return -1;
	}


	/*----------  Expose  ----------*/
	
	return Cache;
});
