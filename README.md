# SSRouter
**S**uper **S**imple **Router** written for the node native HTTP module.

SSRouter is designed to be as simple as possible, and as such is lacking many
niceties present in more comprehensive routers (such as HTTP method-based
routing). If you require such things, consider using something like
[Restify](//restify.com).

## Usage
Register the Router.route method as a HTTP handler in the usual way:
```
http.createServer(myRouter.route);
```

You can add a route map through the constructor, like so:
```
var myRouter = new router({
  "map":{
    "/": {
      "handler": returnBlockData
    },
    "/extended": {
      "handler": defaultHandler
    }
  },
  "notFoundHandler": 
    function(request, response, queryData) {
      response.write('No data found');
      response.end();
    }
});
```
Alternatively, you can add routes using the Router.addRoute method:
```
function handler(request, response, queryData) {
  console.log("Got here");
}
myRouter.addRoute("/another/test/route", handler);
```

## Future
I had originally planned to extend this project into a more fully-featured
router, but since using this as a development aide I've decided to keep it
as-is for the time being. Besides, there's plenty of high-quality routing
modules out there... there's no need for another one!
