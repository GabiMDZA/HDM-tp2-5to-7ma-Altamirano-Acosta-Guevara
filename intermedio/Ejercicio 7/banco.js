class CuentaBancaria {
  #saldo;
  #pin;

  constructor(titular, saldoInicial, pin) {
    this.titular = titular;       
    this.#saldo = saldoInicial;   
    this.#pin = pin;             
    this.historial = [];         
  }

  //coso pa validar pin (lo dice ahi xd)
  #validarPin(pin) {
    return pin === this.#pin;
  }

  depositar(cantidad, pin) {
    if (!this.#validarPin(pin)) return "❌ PIN incorrecto.";
    if (cantidad <= 0) return "❌ Que queres hacer amigo.";

    this.#saldo += cantidad;
    this.historial.push({ tipo: "deposito", monto: cantidad, saldo: this.#saldo });
    return `✅ Depósito de $${cantidad}. Saldo: $${this.#saldo}`;
  }

  retirar(cantidad, pin) {
    if (!this.#validarPin(pin)) return "❌ PIN incorrecto.";
    if (cantidad <= 0) return "❌ Que queres hacer amigo.";
    if (cantidad > this.#saldo) return "❌ Saldo insuficiente.";

    this.#saldo -= cantidad;
    this.historial.push({ tipo: "retiro", monto: cantidad, saldo: this.#saldo });
    return `💸 Retiro de $${cantidad}. Saldo: $${this.#saldo}`;
  }

  consultarSaldo(pin) {
    if (!this.#validarPin(pin)) return "❌ PIN incorrecto.";
    return `Saldo actual: $${this.#saldo}`;
  }

  get saldo() {
    return this.#saldo;
  }
}


let cuenta = null; // Claude dice q acá se guarda la instancia de CuentaBancaria

const bankDisplay = document.getElementById("bank-display");
const bdUser = document.getElementById("bd-user");
const bdAmount = document.getElementById("bd-amount");
const txLog = document.getElementById("tx-log");
const outBanco = document.getElementById("out-banco");

function mostrarMensaje(texto, tipo = "") {
  outBanco.textContent = texto;
  outBanco.className = "output " + tipo; 
}

function actualizarDisplay() {
  bdUser.textContent = cuenta.titular;
  bdAmount.textContent = `$${cuenta.saldo}`;

  txLog.innerHTML = "";
  cuenta.historial.forEach(tx => {
    const div = document.createElement("div");
    div.className = "tx-item " + (tx.tipo === "deposito" ? "tx-deposito" : "tx-retiro");
    const signo = tx.tipo === "deposito" ? "+" : "-";
    div.textContent = `${tx.tipo.toUpperCase()} ${signo}$${tx.monto} → Saldo: $${tx.saldo}`;
    txLog.prepend(div);
  });
}

document.getElementById("btn-crear-cuenta").addEventListener("click", () => {
  const titular = document.getElementById("b-titular").value.trim();
  const saldoInicial = Number(document.getElementById("b-inicial").value);
  const pin = document.getElementById("b-pin").value;

  if (!titular) {
    mostrarMensaje("Ingresá un titular.", "error");
    return;
  }
  if (!/^\d{4}$/.test(pin)) {
    mostrarMensaje("El PIN debe tener 4 dígitos.", "error");
    return;
  }
  if (isNaN(saldoInicial) || saldoInicial < 0) {
    mostrarMensaje("Saldo inicial inválido.", "error");
    return;
  }

  cuenta = new CuentaBancaria(titular, saldoInicial, pin);
  bankDisplay.style.display = "block";
  actualizarDisplay();
  mostrarMensaje(`✅ Cuenta creada para ${titular}.`, "success");
});

// pa depositar
document.getElementById("btn-depositar").addEventListener("click", () => {
  if (!cuenta) {
    mostrarMensaje("Primero creá una cuenta.", "error");
    return;
  }
  const monto = Number(document.getElementById("b-monto").value);
  const pin = document.getElementById("b-pin-tx").value;

  const resultado = cuenta.depositar(monto, pin);
  const esError = resultado.startsWith("❌") || resultado.startsWith("⚠");
  mostrarMensaje(resultado, esError ? "error" : "success");

  if (!esError) actualizarDisplay();
});

// pa retirar
document.getElementById("btn-retirar").addEventListener("click", () => {
  if (!cuenta) {
    mostrarMensaje("Primero creá una cuenta.", "error");
    return;
  }
  const monto = Number(document.getElementById("b-monto").value);
  const pin = document.getElementById("b-pin-tx").value;

  const resultado = cuenta.retirar(monto, pin);
  const esError = resultado.startsWith("❌") || resultado.startsWith("⚠");
  mostrarMensaje(resultado, esError ? "error" : "success");

  if (!esError) actualizarDisplay();
});