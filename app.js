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
    var txt=req.body;
    console.log(txt);
    var resJson = {
        url: "https://rogerscott.com"
    }
    res.send(resJson);
});

app.listen(3000,function(){
    console.log("Started on PORT 3000");
})