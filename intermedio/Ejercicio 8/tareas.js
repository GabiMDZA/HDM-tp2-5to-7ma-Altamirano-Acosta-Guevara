class Tarea {
  constructor(id, titulo, descripcion, prioridad, fechaLimite) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.prioridad = prioridad; 
    this.completada = false;
    this.fechaCreacion = new Date();
    this.fechaLimite = fechaLimite; 
  }

  completar() {
    this.completada = true;
  }

  editar(nuevosDatos) {
    for (const clave in nuevosDatos) {
      if (clave in this) {
        this[clave] = nuevosDatos[clave];
      }
    }
  }

  getInfo() {
    const estado = this.completada ? "✅ Completada" : "⏳ Pendiente";
    const limite = this.fechaLimite ? `Vence: ${this.fechaLimite}` : "Sin fecha límite";
    return `${this.titulo} [${this.prioridad.toUpperCase()}] - ${estado} - ${limite}`;
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];
    this.contadorId = 1;
  }

  agregar(titulo, descripcion, prioridad, fechaLimite) {
    if (!titulo) {
      return { exito: false, mensaje: "Ponele titulo porfa." };
    }

    const nuevaTarea = new Tarea(this.contadorId, titulo, descripcion, prioridad, fechaLimite);
    this.tareas.push(nuevaTarea);
    this.contadorId++;

    return { exito: true, mensaje: `✅ Tarea "${titulo}" agregada.`, tarea: nuevaTarea };
  }

  eliminar(id) {
    const indice = this.tareas.findIndex(t => t.id === id);

    if (indice === -1) {
      return { exito: false, mensaje: "❌ Tarea no encontrada." };
    }

    const eliminada = this.tareas[indice];
    this.tareas.splice(indice, 1);

    return { exito: true, mensaje: `🗑️ Tarea "${eliminada.titulo}" eliminada.` };
  }

  completarTarea(id) {
    const tarea = this.tareas.find(t => t.id === id);

    if (!tarea) {
      return { exito: false, mensaje: "❌ Tarea no encontrada." };
    }

    tarea.completar();
    return { exito: true, mensaje: `✅ Tarea "${tarea.titulo}" marcada como completada.` };
  }

  filtrarPorPrioridad(prioridad) {
    return this.tareas.filter(t => t.prioridad === prioridad);
  }

  filtrarCompletadas() {
    return this.tareas.filter(t => t.completada);
  }

  filtrarPendientes() {
    return this.tareas.filter(t => !t.completada);
  }

  mostrarTodas() {
    if (this.tareas.length === 0) {
      return "Tranqui que no hay tareas.";
    }

    let texto = "📋 Lista de Tareas:\n";
    texto += "─".repeat(50) + "\n";

    this.tareas.forEach((tarea, index) => {
      texto += `${index + 1}. ${tarea.getInfo()}\n`;
    });

    texto += "─".repeat(50);
    return texto;
  }
}

const gestor = new GestorTareas();
let filtroActual = "todas";

const tareasLista = document.getElementById("tareas-lista");
const outTareas = document.getElementById("out-tareas");

function mostrarMensaje(texto, tipo = "") {
  outTareas.textContent = texto;
  outTareas.className = "output " + tipo; 
}

function limpiarFormulario() {
  document.getElementById("t-titulo").value = "";
  document.getElementById("t-descripcion").value = "";
  document.getElementById("t-prioridad").value = "media";
  document.getElementById("t-fecha").value = "";
  document.getElementById("t-titulo").focus();
}

function obtenerTareasFiltradas() {
  if (filtroActual === "pendientes") return gestor.filtrarPendientes();
  if (filtroActual === "completadas") return gestor.filtrarCompletadas();
  return gestor.tareas; 
}

function renderizarTareas() {
  const tareas = obtenerTareasFiltradas();

  if (tareas.length === 0) {
    tareasLista.innerHTML = '<div class="tareas-vacio">No hay tareas.</div>';
    return;
  }

  tareasLista.innerHTML = tareas.map(tarea => {
    const claseCompletada = tarea.completada ? "completada" : "";
    const limite = tarea.fechaLimite ? `📅 ${tarea.fechaLimite}` : "📅 Sin fecha límite";

    return `
      <div class="tarea-item prioridad-${tarea.prioridad} ${claseCompletada}">
        <div class="tarea-info">
          <div class="tarea-titulo">${tarea.titulo}</div>
          <div class="tarea-desc">${tarea.descripcion || "Sin descripción"}</div>
          <div class="tarea-meta">
            <span class="badge-prioridad ${tarea.prioridad}">${tarea.prioridad}</span>
            <span>${limite}</span>
          </div>
        </div>
        <div class="tarea-acciones">
          ${tarea.completada
            ? ""
            : `<button class="btn btn-icon btn-success" onclick="completarTareaUI(${tarea.id})">✔️ Completar</button>`
          }
          <button class="btn btn-icon btn-danger" onclick="eliminarTareaUI(${tarea.id})">🗑️ Eliminar</button>
        </div>
      </div>
    `;
  }).join("");
}

function completarTareaUI(id) {
  const resultado = gestor.completarTarea(id);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");
  renderizarTareas();
}

function eliminarTareaUI(id) {
  const resultado = gestor.eliminar(id);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");
  renderizarTareas();
}

// coso pa agregar tareas
document.getElementById("btn-agregar-tarea").addEventListener("click", () => {
  const titulo = document.getElementById("t-titulo").value.trim();
  const descripcion = document.getElementById("t-descripcion").value.trim();
  const prioridad = document.getElementById("t-prioridad").value;
  const fechaLimite = document.getElementById("t-fecha").value;

  const resultado = gestor.agregar(titulo, descripcion, prioridad, fechaLimite);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) {
    limpiarFormulario();
    renderizarTareas();
  }
});

// coso pa los filtross
const botonesFiltro = document.querySelectorAll(".btn-filter");

botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("active"));
    boton.classList.add("active");
    filtroActual = boton.dataset.filtro;
    renderizarTareas();
  });
});

// Con esto el enter agrega la tarea asi bien pro
document.getElementById("t-titulo").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btn-agregar-tarea").click();
  }
});

// comenzar
renderizarTareas();