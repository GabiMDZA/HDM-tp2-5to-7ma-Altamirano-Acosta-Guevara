class Mascota {
      constructor(nombre, tipo) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.energia = 100;
      }
 
      jugar() {
        if (this.energia >= 20) {
          this.energia -= 20;
          return `🎮 ${this.nombre} está jugando. Energía: ${this.energia}/100`;
        } else {
          return `⛔ ${this.nombre} está muy cansado para jugar.`;
        }
      }
 
      comer() {
        if (this.energia < 100) {
          this.energia = Math.min(this.energia + 10, 100);
          return `🍖 ${this.nombre} comió comida (:v). Energía: ${this.energia}/100`;
        } else {
          return `😋 ${this.nombre} ya esta lleno.`;
        }
      }
 
      dormir() {
        this.energia = 100;
        return `😴 ${this.nombre} se durmió. Energía: ${this.energia}/100`;
      }
 
      estado() {
        return `${this.nombre} (${this.tipo}) — Energía: ${this.energia}/100`;
      }
 
      getEmoji() {
        const emojis = {
          perro: "🐕",
          gato: "🐱",
        };
        return emojis[this.tipo] || "🐾";
      }
    }
 
    let mascotas = [];
    let mascotaActual = null;
 
//funciones pro
    function mostrarOutput(texto) {
      document.getElementById("out-mascota").textContent = texto;
    }
 
    function actualizarGaraje() {
      const garage = document.getElementById("garage");
      garage.innerHTML = mascotas
        .map(
          (m, i) => `
        <div class="mascota-card" onclick="mascotaActual = mascotas[${i}]; mostrarOutput(mascotaActual.estado())">
          <div class="mascota-emoji">${m.getEmoji()}</div>
          <div class="mascota-nombre">${m.nombre}</div>
          <div class="mascota-tipo">${m.tipo}</div>
          <div class="mascota-energia">${m.energia}/100</div>
        </div>
      `
        )
        .join("");
    }
 

    document.getElementById("btn-crear-mascota").addEventListener("click", () => {
      const nombre = document.getElementById("m-nombre").value.trim();
      const tipo = document.getElementById("m-tipo").value;
 
      if (!nombre) {
        mostrarOutput("⛔ Por favor ingresa un nombre.");
        return;
      }
 
      const mascota = new Mascota(nombre, tipo);
      mascotas.push(mascota);
      mascotaActual = mascota;
 
      mostrarOutput(`🎉 ${mascota.estado()}`);
      actualizarGaraje();
    });
 
    document.getElementById("btn-jugar").addEventListener("click", () => {
      if (!mascotaActual) {
        mostrarOutput("⛔ Primero crea una mascota.");
        return;
      }
      mostrarOutput(mascotaActual.jugar());
      actualizarGaraje();
    });
 
    document.getElementById("btn-comer").addEventListener("click", () => {
      if (!mascotaActual) {
        mostrarOutput("⛔ Primero crea una mascota.");
        return;
      }
      mostrarOutput(mascotaActual.comer());
      actualizarGaraje();
    });
 
    document.getElementById("btn-dormir").addEventListener("click", () => {
      if (!mascotaActual) {
        mostrarOutput("⛔ Primero crea una mascota.");
        return;
      }
      mostrarOutput(mascotaActual.dormir());
      actualizarGaraje();
    });
 
    // Focus inicial
    document.getElementById("m-nombre").focus();