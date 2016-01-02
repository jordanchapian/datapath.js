/**
* Module returning the DataFrame constructor
*	@module path/cache/data/DataFrame
*/

define('path/cache/data/DataFrame',
[
	'util/is',
	'util/Promise',

	'./Data',
	'parameter/collection'
],
function(is, Promise, Data, parameterCollection){

	/**
   * @constructor
   * @alias module:path/cache/data/DataFrame
   *
   * @description
   * The DataFrame is to house data, and the parameters that were associated with
   * that data. [[DATA] | [PARAMS]]. The cache can use this association
   * to determine if a particular frame is valid with respect to the current
   * parameters.
   *
   */

	function DataFrame(datapath){
		//private namespace
		this._ = {};

		//datapath
		this._.datapath = datapath;

		//the datapath (needs to be injected with data)
		this._.data = new Data(datapath, []);

		//param map (what state is this data frame relative to)
		this._.param = {};
		this._.paramKeys = datapath._.route.getParameterKeys();

		init(this);
	}

	/** 
	*	Fill the frame with data. This function will use the associated path
	* to get the resource location, and then use the parameters that 
	* were associated with this frame when it was created to fill out the
	* location path.
	*/
	DataFrame.prototype.fill = function(){
		var self = this;

		return new Promise(function(resolve, reject){
			self._.data = new Data(self._.datapath, ['this', 'is', 'the', 'dataset']);
			
			resolve(self._.data);
		});
	};

	/** 
	*	Return the data contents of the data frame.
	*/
	DataFrame.prototype.getData = function(){
		return this._.data;
	};
	
	/** 
	*	Reach out to the virtual route of the path, and determine what 
	* the expected parameters are. Then, reach out to the parameter collection
	* and see if the parameters associated with this frame match the required
	* parameters from the path and the state of the parameter collection.
	*
	* @return {Boolean} isValid 
	*/
	DataFrame.prototype.parametersValid = function(){
		//get the parameter keys from  the route attached to the path
		var paramKeys = this._.datapath._.route.getParameterKeys();

		//go through each of our parameter keys and ensure that each value associated
		//with this frame is consistent to the current set parameters
		for(var i = 0; i < paramKeys.length; i++){
			var paramKey = paramKeys[i];

			var p0 = this._.param[paramKey];
			var p1 = parameterCollection.get(paramKey);

			if(paramsEqual(p0, p1) === false) return false;
		}

		return true;
	};

	function init(self){
		//get the parameter keys from  the route attached to the path
		var paramKeys = self._.datapath._.route.getParameterKeys();

		//grab the most recent param state. That is what this frame will anchor to.
		paramKeys.forEach(function(paramKey){
			self._.param[paramKey] = parameterCollection.get(paramKey);
		});
	}
	

	//this needs to be tested
	function paramsEqual(p0, p1){
		//---- date cases ----//
		//inconsistent types
		if(is.Date(p0) && !is.Date(p1) || !is.Date(p0) && is.Date(p1)) return false;
		//both dates, and times are not equal
		else if(is.Date(p0) && is.Date(p1) && (p1.getTime !== p2.getTime())) return false;
		//---- string cases ----//
		//---- boolean cases ----//
		//TODO:remaining cases?

		//---- catch remaining cases with strict equality ----// (TODO:test)		
		else if(p0 === p1) return true;
		//everything must be ok.
		else return false;
	}

	return DataFrame;

});
