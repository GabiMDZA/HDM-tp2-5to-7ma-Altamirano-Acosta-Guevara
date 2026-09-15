//clase base
class Vehiculo {
  constructor(marca, modelo, año) {
    this.marca = marca;
    this.modelo = modelo;
    this.año = año;
    this.kilometraje = 0;
  }

  conducir(km) {
    if (km < 0) {
      return "⛔ No puedes conducir kilómetros negativos.";
    }
    this.kilometraje += km;
    return `🛣️ Conduciendo ${km}km. Kilometraje total: ${this.kilometraje}km`;
  }

  mostrarInfo() {
    return `${this.marca} ${this.modelo} (${this.año}) - ${this.kilometraje}km`;
  }
}

//auto hijo (hijo corre xdxdxd)
class Auto extends Vehiculo {
  constructor(marca, modelo, año, puertas) {
    super(marca, modelo, año);
    this.puertas = puertas;
    this.tipo = puertas >= 5 ? "SUV" : "Sedán";
  }

  abrirMaletero() {
    return `El ${this.marca} ${this.modelo} abrió el maletero. +100 de aura`;
  }

  mostrarInfo() {
    return `🚗 ${super.mostrarInfo()} | ${this.puertas} puertas | ${this.tipo}`;
  }
}

//hija moto moto
class Moto extends Vehiculo {
  constructor(marca, modelo, año, cilindrada) {
    super(marca, modelo, año);
    this.cilindrada = cilindrada;
    this.tipo = cilindrada >= 600 ? "Deportiva" : "Turismo";
  }

  hacerCaballito() {
    return `🏍️ ¡haces mansa wheelie!`;
  }

  mostrarInfo() {
    return `🏍️ ${super.mostrarInfo()} | ${this.cilindrada}cc | ${this.tipo}`;
  }
}

//camion pro
class Camion extends Vehiculo {
  constructor(marca, modelo, año, capacidadCarga, ejes) {
    super(marca, modelo, año);
    this.capacidadCarga = capacidadCarga;
    this.ejes = ejes;
    this.cargaActual = 0;
  }

  cargar(toneladas) {
    if (this.cargaActual + toneladas > this.capacidadCarga) {
      return `⛔ No aguanta el camión. Max: ${this.capacidadCarga}t, Actual: ${this.cargaActual}t`;
    }
    this.cargaActual += toneladas;
    return `📦 ${this.marca} cargó ${toneladas}t. Carga: ${this.cargaActual}/${this.capacidadCarga}t`;
  }

  mostrarInfo() {
    return `🚚 ${super.mostrarInfo()} | ${this.ejes} ejes | Carga: ${this.cargaActual}/${this.capacidadCarga}t`;
  }
}

//coso
let vehiculos = [];
let vehiculoActual = null;

//otras funciones
function mostrarOutput(texto, tipo = "normal") {
  const output = document.getElementById("out-vehiculo");
  output.innerHTML = texto;
  output.classList.remove("error", "success");
  
  if (tipo === "error") {
    output.classList.add("error");
  } else if (tipo === "success") {
    output.classList.add("success");
  }
}

function limpiarFormulario() {
  document.getElementById("v-marca").value = "";
  document.getElementById("v-modelo").value = "";
  document.getElementById("v-ano").value = "";
  document.getElementById("v-extra").value = "";
  document.getElementById("v-marca").focus();
}

function actualizarLista() {
  const lista = document.getElementById("vehiculos-lista");
  
  if (vehiculos.length === 0) {
    lista.innerHTML = '<div style="color: #6b7280; text-align: center; padding: 40px; width: 100%;">🏜️ Garage vacío</div>';
    return;
  }

  lista.innerHTML = vehiculos.map((v, index) => {
    let emoji = "🚗";
    if (v instanceof Moto) emoji = "🏍️";
    if (v instanceof Camion) emoji = "🚚";

    return `
      <div class="vehiculo-card" onclick="seleccionarVehiculo(${index})">
        <div class="vehiculo-emoji">${emoji}</div>
        <div class="vehiculo-tipo">${v.constructor.name}</div>
        <div class="vehiculo-nombre">${v.marca} ${v.modelo}</div>
        <div class="vehiculo-info">
          <div><strong>Año:</strong> ${v.año}</div>
          <div><strong>KM:</strong> ${v.kilometraje}km</div>
          ${v instanceof Auto ? `<div><strong>Puertas:</strong> ${v.puertas}</div><div><strong>Tipo:</strong> ${v.tipo}</div>` : ""}
          ${v instanceof Moto ? `<div><strong>Cilindrada:</strong> ${v.cilindrada}cc</div><div><strong>Tipo:</strong> ${v.tipo}</div>` : ""}
          ${v instanceof Camion ? `<div><strong>Ejes:</strong> ${v.ejes}</div><div><strong>Carga:</strong> ${v.cargaActual}/${v.capacidadCarga}t</div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function seleccionarVehiculo(index) {
  vehiculoActual = vehiculos[index];
  mostrarOutput(`✅ ${vehiculoActual.mostrarInfo()}`);
}

//listeners
document.getElementById("btn-crear-vehiculo").addEventListener("click", () => {
  const marca = document.getElementById("v-marca").value.trim();
  const modelo = document.getElementById("v-modelo").value.trim();
  const año = parseInt(document.getElementById("v-ano").value);
  const tipo = document.getElementById("v-tipo").value;
  const extra = document.getElementById("v-extra").value.trim();

  if (!marca || !modelo || !año) {
    mostrarOutput("⛔ Completá las cosas porfa", "error");
    return;
  }

  if (!extra) {
    mostrarOutput("⛔ Por favor completa el dato adicional", "error");
    return;
  }

  let vehiculo;

  if (tipo === "auto") {
    const puertas = parseInt(extra) || 4;
    vehiculo = new Auto(marca, modelo, año, puertas);
  } else if (tipo === "moto") {
    const cilindrada = parseInt(extra) || 500;
    vehiculo = new Moto(marca, modelo, año, cilindrada);
  } else if (tipo === "camion") {
    const capacidad = parseFloat(extra) || 25;
    vehiculo = new Camion(marca, modelo, año, capacidad, 3);
  }

  vehiculos.push(vehiculo);
  vehiculoActual = vehiculo;
  mostrarOutput(`✅ ${vehiculo.mostrarInfo()}`, "success");
  limpiarFormulario();
  actualizarLista();
});

document.getElementById("btn-conducir").addEventListener("click", () => {
  if (!vehiculoActual) {
    mostrarOutput("⛔ Selecciona un vehículo primero", "error");
    return;
  }
  const km = prompt("¿Cuántos km quieres conducir?", "10");
  if (km !== null) {
    mostrarOutput(vehiculoActual.conducir(parseFloat(km)));
    actualizarLista();
  }
});

document.getElementById("btn-especial").addEventListener("click", () => {
  if (!vehiculoActual) {
    mostrarOutput("⛔ Selecciona un vehículo primero", "error");
    return;
  }

  let resultado = "";
  if (vehiculoActual instanceof Auto) {
    resultado = vehiculoActual.abrirMaletero();
  } else if (vehiculoActual instanceof Moto) {
    resultado = vehiculoActual.hacerCaballito();
  } else if (vehiculoActual instanceof Camion) {
    const toneladas = prompt("¿Cuántas toneladas cargar?", "5");
    if (toneladas !== null) {
      resultado = vehiculoActual.cargar(parseFloat(toneladas));
    } else {
      return;
    }
  }

  mostrarOutput(resultado, resultado.includes("⛔") ? "error" : "success");
  actualizarLista();
});

document.getElementById("btn-eliminar").addEventListener("click", () => {
  if (!vehiculoActual) {
    mostrarOutput("⛔ Selecciona un vehículo para eliminar", "error");
    return;
  }

  const index = vehiculos.indexOf(vehiculoActual);
  if (index > -1) {
    vehiculos.splice(index, 1);
    vehiculoActual = null;
    mostrarOutput("🗑️ Vehículo eliminado", "success");
    actualizarLista();
  }
});

// iniciar
document.getElementById("v-marca").focus();