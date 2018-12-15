const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports ={
	mongoose
}
