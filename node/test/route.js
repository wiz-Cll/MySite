function route(handle, pathname, response){
    console.log("About to route a request for "+ pathname);
    if( handle[pathname] instanceof Function){
      handle[pathname](response);
    }
    else if( pathname === '/favicon.ico'){
    	
    }
    else{
      console.log("No request handler found for "+ pathname);
      response.writeHead(404,{"Content-Type":"text/plain"});
      response.write("404 Not found");
      response.end();
    }
}

exports.route = route;