const Bicicleta = require('../../models/bicicleta');

beforeEach(() => {
    Bicicleta.allBicis = [];
})

describe('Bicicleta.allBicis', () => {
    it('Should start empty', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    })
});

describe('Bicicleta.add', () => {
   it('Should add Bici', () => {
       // Prev State
       expect(Bicicleta.allBicis.length).toBe(0);

       // Action
       const a = new Bicicleta(1, 'rojo', 'urbana', [-34.94, -54.95]);
       Bicicleta.add(a);

       // Expected State
       expect(Bicicleta.allBicis.length).toBe(1);
       expect(Bicicleta.allBicis[0]).toBe(a);
   });
});

describe('Bicicleta.findById', () => {
    it('Should return Bici with id 1', () => {
        // Prev State
        expect(Bicicleta.allBicis.length).toBe(0);

        // Action
        const a = new Bicicleta(1, 'rojo', 'urbana', [-34.94, -54.95]);
        const b = new Bicicleta(2, 'azul', 'urbana', [-34.943, -54.951]);

        Bicicleta.add(a);
        Bicicleta.add(b);

        const targetBici = Bicicleta.findById(1);

        // Expected State
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(a.color);
        expect(targetBici.modelo).toBe(a.modelo);
    });
});

describe('Bicicleta.removeById', () => {
   it('Should delete a Bici with id 3', () => {
       // Prev State
       expect(Bicicleta.allBicis.length).toBe(0);

       // Action
       const a = new Bicicleta(3, 'rojo', 'urbana', [-34.94, -54.95]);
       Bicicleta.add(a);
       Bicicleta.removeById(3);

       // Expected State
       expect(Bicicleta.allBicis.length).toBe(0);

   });
});
