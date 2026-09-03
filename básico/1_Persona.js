class Persona {
    constructor(nombre, edad, ciudad) {
        this.nombre = nombre;
        this.edad = edad;
        this.ciudad = ciudad;
    }

    presentarse() {
        return `Hola, mi nombre es ${this.nombre}, tengo ${this.edad} años y vivo en ${this.ciudad}.`;
    }
}

const persona1 = new Persona('Gabi', 18, 'Guaymallén');
const persona2 = new Persona('Sebas', 14, 'Las Heras');
const persona3 = new Persona('Pedro', 24, 'Godoy Cruz');

console.log(persona1.presentarse());
console.log(persona2.presentarse());
console.log(persona3.presentarse());