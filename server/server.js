const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
	console.log('App is running on port ' + port )
})



