var express = require('express');
var app = express();
var path = require('path');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '../../app')));
app.set('views', path.join(__dirname, '../../app'));
// views is directory for all template files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
