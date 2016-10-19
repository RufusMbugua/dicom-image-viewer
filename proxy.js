var http = require('http'),
    httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
var options = {
  target:'http://localhost:8042',
  auth:'orthanc:orthanc'
}

httpProxy.createProxyServer(options).listen(8043); // See (†)
