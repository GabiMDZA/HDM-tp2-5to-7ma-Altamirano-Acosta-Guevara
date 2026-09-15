class Calculadora {
  constructor() {
    this.resultado = 0;
    this.historial = [];
  }

  sumar(n) {
    this.resultado += n;
    this.historial.push(`+ ${n} = ${this.resultado}`);
    return this;
  }

  restar(n) {
    this.resultado -= n;
    this.historial.push(`- ${n} = ${this.resultado}`);
    return this;
  }

  multiplicar(n) {
    this.resultado *= n;
    this.historial.push(`× ${n} = ${this.resultado}`);
    return this;
  }

  dividir(n) {
    if (n === 0) {
      this.historial.push(`/ ${n} = NO PODES DIVIDIR POR 0`);
      return this;
    }

    this.resultado /= n;
    this.historial.push(`/ ${n} = ${this.resultado}`);
    return this;
  }

  reset() {
    this.resultado = 0;
    this.historial = [];
    return this;
  }

  mostrar() {
    return this.resultado;
  }

  obtenerHistorial() {
    return this.historial;
  }

  hayError() {
    return this.historial.some(item => item.includes("ERROR"));
  }
}

//Esto estaba en el coso del profe, así que ni idea que hace jkasdkasdjkasdkj
const calc = new Calculadora();

// Funciones pro
function actualizarDisplay() {
  document.getElementById("resultado-display").value = calc.mostrar();
  actualizarHistorial();
}

function actualizarHistorial() {
  const historialEl = document.getElementById("historial");
  const items = calc.obtenerHistorial();

  if (items.length === 0) {
    historialEl.innerHTML =
      '<div style="color: #6b7280; text-align: center; padding: 20px;">Sin operaciones</div>';
    return;
  }

  historialEl.innerHTML = items
    .map(item => {
      if (item.includes("NO PODES DIVIDIR POR 0")) {
        return `<div class="historial-item"><span style="color: #f87171;">${item}</span></div>`;
      }

      return `<div class="historial-item">${item}</div>`;
    })
    .join("");

  historialEl.scrollTop = historialEl.scrollHeight;
}

function obtenerNumero() {
  const valor = parseFloat(
    document.getElementById("numero-input").value
  );

  if (isNaN(valor)) {
    return null;
  }

  return valor;
}

// Botones y coso
document.getElementById("btn-sumar").addEventListener("click", () => {
  const n = obtenerNumero();

  if (n === null) return;

  calc.sumar(n);
  actualizarDisplay();
});

document.getElementById("btn-restar").addEventListener("click", () => {
  const n = obtenerNumero();

  if (n === null) return;

  calc.restar(n);
  actualizarDisplay();
});

document.getElementById("btn-multiplicar").addEventListener("click", () => {
  const n = obtenerNumero();

  if (n === null) return;

  calc.multiplicar(n);
  actualizarDisplay();
});

document.getElementById("btn-dividir").addEventListener("click", () => {
  const n = obtenerNumero();

  if (n === null) return;

  calc.dividir(n);
  actualizarDisplay();
});

document.getElementById("btn-reset").addEventListener("click", () => {
  calc.reset();

  actualizarDisplay();

  document.getElementById("numero-input").value = "0";
  document.getElementById("numero-input").focus();
});

document.getElementById("numero-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btn-sumar").click();
  }
});

actualizarDisplay();
document.getElementById("numero-input").focus();
