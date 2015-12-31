define('path/cache/data/Data',
[
],
function(){
	
		function Data(Datapath, rawData){

			//apply fillers and formatters
			applyFormatter(Datapath, rawData);
			applyFiller(Datapath, rawData);

			//extend an array-like object to provide interface into the data
			var collection = Object.create( Array.prototype );
			collection = (Array.apply( collection, rawData ) || collection);

			var transformData = initTransforms(Datapath, rawData),
					subsetData = initSubsets(Datapath, rawData);

			collection.subset = function(subsetKey){
				return subsetData[subsetKey];
			};

			collection.transform = function(transformKey){
				return transformData[transformKey];
			};

			return collection;
		}

		/*----------  static methods  ----------*/
		Data.injectClassMethods = function( collection ){

	      // Loop over all the prototype methods and add them
	      // to the new collection.
	      for (var method in Data.prototype){

	          // Make sure this is a local method.
	          if (Data.prototype.hasOwnProperty( method )){

	              // Add the method to the collection.
	              collection[ method ] = Data.prototype[ method ];

	          }

	      }

	      // Return the updated collection.
	      return( collection );

	  };

	  /*----------  class methods  ----------*/
	  

		/*----------  utils  ----------*/

		function initTransforms(Datapath, rawData){
			var r = {};

			Datapath.getTransform().forEach(function(transformInstance){
				r[transformInstance.getKey()] = transformInstance.run(rawData);
			});

			return r;
		}

		function initSubsets(Datapath, rawData){
			var r = {};

			Datapath.getSubset().forEach(function(subsetInstance){
				r[subsetInstance.getKey()] = subsetInstance.run(rawData);
			});

			return r;
		}

		//in place formatting
		function applyFormatter(Datapath, data){
			if(Datapath.getFormatter() === null) return;

			Datapath.getFormatter().run(data);
		}

		//in place filling
		function applyFiller(Datapath, data){
			if(Datapath.getFiller().length === 0) return;
			Datapath.getFiller().forEach(function(fillerInstance){
				fillerInstance.run(data);
			});
		}


		return Data;
});
