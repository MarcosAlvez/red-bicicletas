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
    const aBici = Bicicleta.allBicis.find(x => x.id.toString() === aBiciId);
    if(aBici) {
        return aBici;
    } else {
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
    }
}

Bicicleta.removeById = function(aBiciId) {
    for(let i = 0; i < Bicicleta.allBicis.length; i++) {
        if(Bicicleta.allBicis[i].id.toString() === aBiciId){
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
