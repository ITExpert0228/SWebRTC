var express        =        require("express");
var app            =        express();
var path           =        require("path");
var bodyParser     =        require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

app.post('/api/msg',function(req,res){
    var txt=req.body.message;
    console.log(txt);
    res.send(txt+" - 'server edited'");
});

app.listen(5000,function(){
    console.log("Started on PORT 5000");
})