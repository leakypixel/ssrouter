"use strict";

var Router = (function() {
  function Router(options) {
    var route = function(request, response) {
      var path = (request.url.replace(/\//gi, ",/")).split(",");
      var step = 1;
      var trail = this.map;
      var handler = this.notFoundHandler;
      while (trail && trail.hasOwnProperty(path[step])) {
        var segment = trail[path[step]];
        handler = segment.handler || handler;
        trail = segment.routes;
        step++;
      }
      handler(request, response, path.slice(step));
    };
    this.map = options.map || {};
    this.notFoundHandler = options.notFoundHandler;

    //Using the Node HTTP server can break scope when routing, so we bind it to
    //this scope here for safety and ease of use.
    this.route = route.bind(this);
  }

  Router.prototype.addRoute = function(path, handler) {
    path = path.replace(/\//gi, ",/").split(",");
    var step = 1;
    var trail = this.map;
    var currentLocation;
    while (path[step]) {
      trail[path[step]] = trail[path[step]] || {};
      trail[path[step]].routes = trail[path[step]].routes || {};
      currentLocation = trail[path[step]];
      trail = trail[path[step]].routes;
      step++;
    }

    currentLocation.handler = handler;
  };

  return Router;
})();

module.exports = Router;
