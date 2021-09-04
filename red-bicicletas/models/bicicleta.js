const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});

bicicletaSchema.methods.toString = function () {
    return 'code: ' + this.code + ' | color: ' + this.color;
};

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.statics.allBicis = function(cb) {
    return this.find({},cb);
};

bicicletaSchema.statics.add = function(aBici, cb){
    console.log(aBici);
    this.create(aBici,cb);
};

bicicletaSchema.statics.findByCode = function(aCode, cb){
    return this.findOne({ code:aCode }, cb);
};

bicicletaSchema.statics.updateOne = function(aBici, cb){
    this.update({code:aBici.code}, {$set: aBici}, cb);
};

bicicletaSchema.statics.removeByCode = function(aCode, cb){
    return this.deleteOne({ code:aCode }, cb);
};

module.exports = mongoose.model('Bicicleta', bicicletaSchema);

/*  OLD VERSION
const Bicicleta = function(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

 Bicicleta.prototype.toString = function() {
     return 'id: ' + this.id + ' | color: ' + this.color;
 }

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici) {
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById = function(aBiciId) {
    const aBici = Bicicleta.allBicis.find(x => x.id.toString() === aBiciId.toString());
    if(aBici) {
        return aBici;
    } else {
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
    }
}

Bicicleta.removeById = function(aBiciId) {
    for(let i = 0; i < Bicicleta.allBicis.length; i++) {
        if(Bicicleta.allBicis[i].id.toString() === aBiciId.toString()){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

const a = new Bicicleta(1, 'rojo', 'urbana', [-34.94, -54.95]);
const b = new Bicicleta(2, 'azul', 'urbana', [-34.943, -54.951]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
*/
