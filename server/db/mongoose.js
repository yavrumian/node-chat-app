const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

try{
	mongoose.connect(process.env.MONGODB_URI);
}catch(e){
	console.log('Failed to connect to DB because of following reason' + e);
}

module.exports ={
	mongoose
}
