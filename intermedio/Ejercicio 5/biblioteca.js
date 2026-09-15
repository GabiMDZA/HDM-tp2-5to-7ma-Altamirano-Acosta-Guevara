class Libro {
  constructor(id, titulo, autor, año) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.año = año;
    this.prestado = false;
    this.prestadoA = "";
  }

  prestar(persona) {
    if (this.prestado) {
      return `"${this.titulo}" ya está prestado a ${this.prestadoA}.`;
    }

    this.prestado = true;
    this.prestadoA = persona;
    return `"${this.titulo}" prestado a ${persona}.`;
  }

  devolver() {
    if (!this.prestado) {
      return `"${this.titulo}" no estaba prestado.`;
    }

    const persona = this.prestadoA;
    this.prestado = false;
    this.prestadoA = "";
    return `"${this.titulo}" devuelto (lo tenía ${persona}).`;
  }

  getInfo() {
    const estado = this.prestado ? `Prestado a ${this.prestadoA}` : "Disponible";
    return `#${this.id} - ${this.titulo} (${this.autor}, ${this.año}) - ${estado}`;
  }
}

class Biblioteca {
  constructor() {
    this.libros = [];
    this.contadorId = 1;
  }

  agregarLibro(titulo, autor, año) {
    if (!titulo || !autor) {
      return { exito: false, mensaje: "Porfa ingrese título y autor." };
    }

    const nuevoLibro = new Libro(this.contadorId, titulo, autor, año);
    this.libros.push(nuevoLibro);
    this.contadorId++;

    return { exito: true, mensaje: `"${titulo}" agregado al catálogo con id ${nuevoLibro.id}.`, libro: nuevoLibro };
  }

  buscarPorId(id) {
    return this.libros.find(libro => libro.id === id);
  }

  prestarLibro(id, persona) {
    const libro = this.buscarPorId(id);

    if (!libro) {
      return { exito: false, mensaje: " No existe un libro con ese id." };
    }
    if (!persona) {
      return { exito: false, mensaje: "Ingresá el nombre de la persona." };
    }
    if (libro.prestado) {
      return { exito: false, mensaje: ` "${libro.titulo}" ya está prestado a ${libro.prestadoA}.` };
    }

    const mensaje = libro.prestar(persona);
    return { exito: true, mensaje };
  }

  devolverLibro(id) {
    const libro = this.buscarPorId(id);

    if (!libro) {
      return { exito: false, mensaje: " No existe un libro con ese id." };
    }
    if (!libro.prestado) {
      return { exito: false, mensaje: `"${libro.titulo}" no estaba prestado.` };
    }

    const mensaje = libro.devolver();
    return { exito: true, mensaje };
  }

  mostrarCatalogo() {
    if (this.libros.length === 0) {
      return "El catálogo está vacío.";
    }

    let texto = "Catálogo de la Biblioteca:\n";
    texto += "─".repeat(50) + "\n";

    this.libros.forEach(libro => {
      texto += `${libro.getInfo()}\n`;
    });

    texto += "─".repeat(50);
    return texto;
  }

  getEstadisticas() {
    const total = this.libros.length;
    const prestados = this.libros.filter(libro => libro.prestado).length;
    const disponibles = total - prestados;

    return { total, prestados, disponibles };
  }
}

//coso que tdv no entiendo
const biblioteca = new Biblioteca();

const catalogoLista = document.getElementById("catalogo-lista");
const statsRow = document.getElementById("stats-row");
const outBiblioteca = document.getElementById("out-biblioteca");

//funciones
function mostrarMensaje(texto, tipo = "") {
  outBiblioteca.textContent = texto;
  outBiblioteca.className = "output " + tipo;
}

function actualizarEstadisticas() {
  const { total, prestados, disponibles } = biblioteca.getEstadisticas();

  statsRow.innerHTML = `
    <div class="stat-card">
      <div class="stat-numero">${total}</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-card">
      <div class="stat-numero">${disponibles}</div>
      <div class="stat-label">Disponibles</div>
    </div>
    <div class="stat-card">
      <div class="stat-numero">${prestados}</div>
      <div class="stat-label">Prestados</div>
    </div>
  `;
}

function renderizarCatalogo() {
  if (biblioteca.libros.length === 0) {
    catalogoLista.innerHTML = '<div class="catalogo-vacio">No hay libros cargados</div>';
    actualizarEstadisticas();
    return;
  }

  catalogoLista.innerHTML = biblioteca.libros.map(libro => {
    const clasePrestado = libro.prestado ? "prestado" : "";
    const estadoHTML = libro.prestado
      ? `<div class="libro-estado prestado-a"> Prestado a ${libro.prestadoA}</div>`
      : `<div class="libro-estado disponible"> Disponible</div>`;

    return `
      <div class="libro-item ${clasePrestado}">
        <div class="libro-header">
          <div>
            <div class="libro-titulo">${libro.titulo}</div>
            <div class="libro-autor">${libro.autor} — ${libro.año}</div>
          </div>
          <div class="libro-id">#${libro.id}</div>
        </div>
        ${estadoHTML}
      </div>
    `;
  }).join("");

  actualizarEstadisticas();
}

// pa agregar un libro
document.getElementById("btn-agregar-libro").addEventListener("click", () => {
  const titulo = document.getElementById("l-titulo").value.trim();
  const autor = document.getElementById("l-autor").value.trim();
  const año = document.getElementById("l-anio").value;

  const resultado = biblioteca.agregarLibro(titulo, autor, año);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) {
    document.getElementById("l-titulo").value = "";
    document.getElementById("l-autor").value = "";
    document.getElementById("l-anio").value = "";
    document.getElementById("l-titulo").focus();
    renderizarCatalogo();
  }
});

// pa prestar un libro
document.getElementById("btn-prestar").addEventListener("click", () => {
  const id = Number(document.getElementById("l-id").value);
  const persona = document.getElementById("l-persona").value.trim();

  const resultado = biblioteca.prestarLibro(id, persona);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) renderizarCatalogo();
});

// pa devolver un libro
document.getElementById("btn-devolver").addEventListener("click", () => {
  const id = Number(document.getElementById("l-id").value);

  const resultado = biblioteca.devolverLibro(id);
  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) renderizarCatalogo();
});

// iniciar
renderizarCatalogo();