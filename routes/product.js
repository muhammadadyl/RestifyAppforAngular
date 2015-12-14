var ProductVm = require('../models/productVm');
var Product = require('../models/product');
var Comment = require('../models/comment');
var restify = require('restify');

module.exports = function (server) {

server.pre(restify.pre.sanitizePath());
  
  var products = [ 
     { 
       id : '1', 
       name : 'My Product', 
       description : 'New Enhance product',
       price : '89.0', 
       comments : [ 
              { name : 'Ahmed', text : 'Good Accessory to have'}, 
              { name :'Ali', text : 'Good' }, 
              { name :'imran', text : 'Awesome'}, 
              { name :'Jane', text : 'not good just broke'} 
        ]
      },
     { 
       id : '2', 
       name : 'My Product', 
       description : 'New Enhance product',
       price : '82.0', 
       comments : [ 
              { name : 'Ahmed', text : 'Good Accessory to have'}, 
              { name :'Ali', text : 'Good' }, 
              { name :'imran', text : 'Awesome'}, 
              { name :'Jane', text : 'not good just broke'} 
        ]
      },
     { 
       id : '3', 
       name : 'My Product', 
       description : 'New Enhance product',
       price : '90.0', 
       comments : [ 
              { name : 'Ahmed', text : 'Good Accessory to have'}, 
              { name :'Ali', text : 'Good' }, 
              { name :'imran', text : 'Awesome'}, 
              { name :'Jane', text : 'not good just broke'} 
        ]
      }
   ];
   
   server.get('/products', function (req, res, next) {
     var prods = [];
     products.forEach(function(value, key){
       prods.push(new ProductVm(value.id, value.name, value.description, value.price));
     });
     res.send(200, prods);
     return next();
  });
  
  server.get('/product/:id', function (req, res, next) {
    if(req.params.id != 'undefined'){
      var pro = products.filter(function(value){
        return (value.id == req.params.id);
      });
      if(pro.length > 0)
        res.send(200, pro);
      else
        res.sent(404);  
    } else {
      res.send(504);
    }
     return next();
  });

  server.post('/product/', function (req, res, next) {
    var body = req.body;
    if(body != 'undefined'){
         if(body.name != 'undefined' && body.description != 'undefined' && !isNaN(Number(body.price))){
              var greaterValue = 1; 
              products.forEach(function(value, key){
                greaterValue = Math.max(parseInt(value.id.substring(value.id.length - 1), 10), greaterValue);
              });
              var newPro = new Product(greaterValue+1, body.name, body.description, body.price, []);
              products.push(newPro);
              res.send(newPro);              
        }else {
          res.send(400);
        }
    }
    return next();
  });
  
  server.post('product/:id/comment/', function (req, res, next) {
    var body = req.body;
    var id = req.params.id;
    if(body != 'undefined'){
         if(body.name != 'undefined' && body.text != 'undefined'){
              var newComent = new Comment(body.name, body.discription);
              products.forEach(function(value, key){
                if(value.id == id){
                  value.comments.push(newComent);
                  res.send(value);
                  return next();
                }
              });              
        }else {
          res.send(400);
          return next();
        }
    } else {
          res.send(400);
          return next();
    } 
    res.send(404, "product not find.");
    return next();
  });
};