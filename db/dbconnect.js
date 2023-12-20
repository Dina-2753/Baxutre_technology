const mongoose = require('mongoose');
const DB = 'mongodb+srv://dinanishad:gl8s1kOHEefbgCzL@cluster0.caea5.mongodb.net/mongodbapi?retryWrites=true&w=majority'
// "mongodb+srv://dinanishad:XTcUYNuXHGoK60xp@cluster0.xzltdu0.mongodb.net/mongodbapi?retryWrites=true&w=majority"
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected");
}).catch((err) => console.log(`no connection` + err))