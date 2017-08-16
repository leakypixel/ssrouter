"use strict";

const Router = (function() {
  function Router(options) {
    options = options || {};
    this.routes = options.routes || {};
    this.notFoundHandler = options.notFoundHandler;
    
    // This works well, but is inelegant and rough. 
    let route = function(request, response) {
      
      // Trim leading/trailing slashes from the request and split
      let path = request.url.replace(/^\//, "").replace(/\/$/, "").split("/");
      let step = 0;
      let numberOfSteps = path.length - 1;
      let trail = this.routes;
      let handler = this.notFoundHandler;
      
      while (trail && trail.hasOwnProperty(path[step])) {
        let segment = trail[path[step]];
        let useArgHandler = (step < numberOfSteps) && segment.handlers.withArgs;
        let handlerContext = useArgHandler ? segment.handlers.withArgs : segment.handlers;
        handler = handlerContext[request.method] || handlerContext || handler;
        trail = segment.routes;
        step++;
      }
      
      if (typeof handler !== "function") {
        handler = this.notFoundHandler;
      }
      handler(request, response, path.slice(step));
    };

    //Using the Node HTTP server can break scope when routing, so we bind it to
    //this scope here for safety and ease of use.
    this.route = route.bind(this);
  }

  Router.prototype.addRoute = function(path, handler) {
    path = path.split("/");
    let step = 1;
    let trail = this.routes;
    let currentLocation;
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
