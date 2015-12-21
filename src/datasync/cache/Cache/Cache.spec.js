describe('Cache class',function(){
	
	//use the datapath (Jordan)
	_public
	.addDatapath('http://www.test.com/some/simple/datapath/:param')
	.as('Jordan')
	.setCacheSize(2);

	//clear the dataframes from the cache
	beforeEach(function(){
		//if the cache exists, clear it's dataframes
		if(_private.cache.getCache('Jordan'))
			_private.cache.getCache('Jordan').clearDataframes();
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

		var cache = _private.cache.getCache('Jordan');
		var nDataframes = cache._dataframes.length;

		//we would expect there to be a maximum of 2 frames (the cache size)
		expect(nDataframes).toBe(2);
		
		//expect the existing frames to be 2 and 3
		expect(cache._dataframes[0]._param['param']).toBe(3);
		expect(cache._dataframes[1]._param['param']).toBe(2);

	});

});