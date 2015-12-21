describe('Cache class',function(){
	
	//use the datapath (Jordan)
	_public
	.addDatapath('http://www.test.com/some/simple/datapath/:param')
	.as('Jordan')
	.setCacheSize(2);

	var cache;

	//clear the dataframes from the cache
	beforeEach(function(){
		//make sure we at least sync once so that the cache gets created.
		if(cache === undefined){
			_public.ensureSynced('Jordan');
			cache = _private.cache.getCache('Jordan');
		}
		//make sure we have a fresh cache (clearing frames)
		cache.clearDataframes();
	});

	it('should sort frames in order they are created', function(){
		//this will create a new frame (1)
		_public.setParameter('param', 1);
		_public.ensureSynced('Jordan');
		var firstFrame = cache._dataframes[0];

		//this will create another new frame (2)
		_public.setParameter('param', 2);
		_public.ensureSynced('Jordan');
		var secondFrame = cache._dataframes[0];

		expect(cache._dataframes[0]).toBe(secondFrame);
		expect(cache._dataframes[1]).toBe(firstFrame);
	});

	it('should reuse valid dataframes in cache',function(){
		//this will create a new frame (1)
		_public.setParameter('param', 1);
		_public.ensureSynced('Jordan');
		var firstFrame = cache._dataframes[0];

		//this will create another new frame (2)
		_public.setParameter('param', 2);
		_public.ensureSynced('Jordan');
		var secondFrame = cache._dataframes[0];

		//now, the make the first frame valid again
		_public.setParameter('param', 1);
		_public.ensureSynced('Jordan');

		//it should not be recreated, it should be reused and assigned to the 0 position
		expect(cache._dataframes[0]).toBe(firstFrame);
		expect(cache._dataframes[1]).toBe(secondFrame);
	});

	it('should handle dataframe overflows', function(){
		
		//this will create a new frame (1)
		_public.setParameter('param', 1);
		_public.ensureSynced('Jordan');

		//this will create another new frame (2)
		_public.setParameter('param', 2);
		_public.ensureSynced('Jordan');

		//this will create another new frame (3)
		_public.setParameter('param', 3);
		_public.ensureSynced('Jordan');

		var nDataframes = cache._dataframes.length;

		//we would expect there to be a maximum of 2 frames (the cache size)
		expect(nDataframes).toBe(2);
		
		//expect the existing frames to be 2 and 3
		expect(cache._dataframes[0]._param['param']).toBe(3);
		expect(cache._dataframes[1]._param['param']).toBe(2);

	});

});