(function(datapathFactories, info, is, undefined){

	function VirtualRoute(route){
		//internal memory
		this._ = {
			route:route,

			paramIndex:{},
			routeConstructor:[]
		};

		//init the component
		generateRouteStructure(this, route);
	}

	VirtualRoute.prototype.generateURL = function(paramMap){
		//clone the route template
		var rRoute = this._.routeConstructor.slice(0);

		//cycle the provided param map and fill in the rRoute
		for(var paramKey in paramMap){
			//do not worry about params provided that are not relevant to route
			var indexes = this._.paramIndex[paramKey]
			if(indexes === undefined)continue;

			var paramValue = paramMap[paramKey];
			for(var i=0; i < indexes.length; i++){
				rRoute[indexes[i]] = formatDataForURL(paramValue);
			}
		}

		//join the constructed path
		return rRoute.join('');
	}

	/*----------  utilities  ----------*/
	function formatDataForURL(datum){
		return datum;
	}

	//params are now flat no distinction between query and route params
	function generateRouteStructure(self, route){
		var params = route.match(/:[\w\d]+/g),
				paramIndex = {},
				routeStructure = route.split(/:[\w\d]+/g);

		//generate a parameter map if there are params found
		if(params){
			var i = 1, p;
			while(p = params.shift()){
				//remove the colon
				p = p.slice(1);

				//insert an empty sting placeholder for the param
				routeStructure.splice(i, 0,'');

				//ensure the param map is an array
				paramIndex[p] = paramIndex[p] || [];

				//push the index into the paramMap
				paramIndex[p].push(i);

				//increment our count
				i+=2;
			}
		}

		//expose results
		self._.paramIndex = paramIndex;
		self._.routeConstructor = routeStructure;
	}
	

	//alias this class in factories
	datapathFactories.VirtualRoute = VirtualRoute;

})(
	_private('pipeline.datapath.factory'), 
	_private('info'),
	_private('util.is')
);
