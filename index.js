/*jslint node: true, indent: 2 */
'use strict';
var restify, bunyan, routes, log, server;

restify = require('restify');
bunyan  = require('bunyan');
routes  = require('./routes/');

log = bunyan.createLogger({
  name        : 'restifyapp',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : process.stdout,
  serializers : bunyan.stdSerializers
});

server = restify.createServer({
  name : 'restifyapp',
  log  : log,
  formatters : {
    'application/json' : function (req, res, body) {
      res.setHeader('Cache-Control', 'must-revalidate');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
      res.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader("Access-Control-Max-Age", "1728000");

//       // Does the client *explicitly* accepts application/json?
//       var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);
// 
//       // Send as plain text
//       if (sendPlainText) {
//         res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//       }
// 
//       // Send as JSON
//       if (!sendPlainText) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
 //     }
      return JSON.stringify(body);
    }
  }
});
server.pre(restify.pre.sanitizePath());
server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
server.use(restify.gzipResponse());

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, err) {
  console.log('Error!');
  console.log(err);
  res.send(500, { success : false });
});
/*jslint unparam:false*/

server.on('after', restify.auditLogger({ log: log }));
routes(server);

console.log('Server started.');
server.listen(8888, function () {
  log.info('%s listening at %s', server.name, server.url);
});

