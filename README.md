# data-path
The Data API State Machine. Add parameteized data routes, set parameters throughout the lifetime of the application, sync data based on parameter state, cache retrieved datasets based on parameter sets.

## The Problem
Throughout the lifetime of a data-heavy web application, the application will constantly be fetching datasets (sometimes very large) from the api. Every time data is fetched from the api, a series of opeations are likely performed on the dataset before the data is in a state that is usable by the application. As an example, many d3 charting libraries will require that timeseries data does not contain gaps, and we must iterate over the dataset to ensure that this is the case (depending on the quality of our data.) Another example is to ensure that types returned from our api are as expected (ex: are our dates String primitives and not Date primitives as expected.) We are also likely to produce results from datasets every time we retrieve them. Data-path is designed to focus on heavy operation configuration, and light-weight runtime interaction to perform feature rich, and optimized, interaction with web apis. Data-path provides a caching state machine that will save data and computations from previously fetched parameterized routes. Also, it allows the programmer to configure a data pipeline that data will be passed through as data is fetched from an api.

## Getting Started
### Add your first datapath
You can add a datapath by accessing the exposed base function. Just give it a key for future access.

```javascript

var myFirstDatapath = datapath('myApiRoute');

```

### Assign a parameterized route
Now that we have a datapath, we can add a parameterized route to it, so that it can fetch our data. Parameters are specified with the common ":[key]" syntax. For example, below is a route that has three parameters (fromDate, toDate, userid).

```javascript
datapath('myapiroute')
.setRoute('api/user/:userid/transtactions?from=:fromDate&to=:toDate');
```

### Assign Parameter State
As our application runs, the state of the parameters are going to be constantly changing. Data-path provides a simple interface to manipulate parameter state. There is a static function that is accessed with the "parameter" key on the global accessor function. Assume our application has entered into a state where we require fetching a range of transaction data associated with a userid. Also assume that this state has a UI element that allows the user to select a date range. Updating the datapath parameters is as simple as this:

```javascript
//on: event, range changed or init

//set the user
datapath.parameter('userid').set('12sa21');

//assume the user wants to view the last hour of transactions
datapath.parameter('fromDate').set(new Date(Date.now() - 3600000));
datapath.parameter('toDate').set(new Date());

```
