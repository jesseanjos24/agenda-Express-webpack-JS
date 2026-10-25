const mongoose =  require('mongoose');

const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

class Home {
    constructor(x,y,z){
        console.log(y+x+z);
    }
}

module.exports = Home;