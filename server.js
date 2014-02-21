/*
    Dependancies
*/

var connect = require('connect'),
    crushIt = require('crushit'), 
    http = require('http'), 
    app;


app = connect()
  .use(connect.static('app')) 
  .use(connect.bodyParser())
  .use('/crush', crush);


var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function() {
  console.log('Running on port %s', port);
});


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});



function crush (req, res) {
    var url = req.body.url,
        crusher = new crushIt(),    
        beautify  = !!req.body.beautify,
        comments  = !!req.body.comments,
        max  = !!req.body.max,
        mangle = !!req.body.mangle;
        
    if (url[0] === 'w') {
        url = 'http://' + url;
    }
    
    if (!isURL(url)) {
        res.statusCode = 500;
        res.end('Invalid URL :(');
        
        return;
    }
    
    crusher.squeeze({
        website: url,
        beautify: beautify,
        comments: comments,
        max: max,
        mangle: mangle
    },
    function (error, code) {
        if (error) {
            res.statusCode = 500;
            res.end('Crushing script from ' + url + ' failed :(');
        } 
        else {
            res.statusCode = 200;            
            res.end(code); 
        }
    });
}


function isURL(str) {
    var urlReg = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    
    return str.length < 2083 && urlReg.test(str);
}
