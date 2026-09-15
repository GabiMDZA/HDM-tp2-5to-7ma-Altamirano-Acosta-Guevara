//Antes que nada, este codigo esta hecho con tanta ia que capaz ocupé
//El agua equivalente a Potrerillos, eso nomas
//Sufrí como nadie tratando de hacer el código, sufriré más tratando de entender como funciona
class ListaCompras {
  constructor() {
    this.items = [];
  }

  /**
   * Agrega un item a la lista (oa verdad ni idea pq está esto así)
   * @param {string} nombre
   * @param {number} cantidad
   * @param {number} precioUnitario
   */
  agregarItem(nombre, cantidad, precioUnitario) {
    if (!nombre || cantidad <= 0 || precioUnitario < 0) {
      return { exito: false, mensaje: "Datos inválidos" };
    }

    // Buscar si ya existe el coso
    const itemExistente = this.items.find(item => 
      item.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      return { 
        exito: true, 
        mensaje: `Se aumentó la cantidad de ${nombre}` 
      };
    }

    // Agregar nuevo coso
    this.items.push({
      nombre,
      cantidad: parseInt(cantidad),
      precioUnitario: parseFloat(precioUnitario)
    });

    return { 
      exito: true, 
      mensaje: `✅ ${nombre} agregado a la lista` 
    };
  }

  /**
   * Elimina un item de la lista por nombre
   * @param {string} nombre
   */
  eliminarItem(nombre) {
    const indice = this.items.findIndex(item => 
      item.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
      return { 
        exito: false, 
        mensaje: `⛔ "${nombre}" no encontrado en la lista` 
      };
    }

    const itemEliminado = this.items[indice];
    this.items.splice(indice, 1);

    return { 
      exito: true, 
      mensaje: `🗑️ ${itemEliminado.nombre} eliminado de la lista` 
    };
  }

  /**
   * Busca un item en la lista por nombre
   * @param {string} nombre
   */
  buscarItem(nombre) {
    const item = this.items.find(item => 
      item.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!item) {
      return { 
        exito: false, 
        item: null,
        mensaje: `🔍 "${nombre}" no encontrado` 
      };
    }

    return { 
      exito: true, 
      item,
      mensaje: `🔍 Encontrado: ${item.nombre} (${item.cantidad}x $${item.precioUnitario.toFixed(2)})` 
    };
  }

  /**
   * Calcula el total de la compra
   * @returns {number} Total de la compra
   */
  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.cantidad * item.precioUnitario);
    }, 0);
  }

  /**
   * Obtiene la lista formateada de items
   * @returns {array} Array de items
   */
  obtenerLista() {
    return this.items;
  }

  /**
   * Muestra la lista formateada en la consola
   * @returns {string} Lista formateada
   */
  mostrarLista() {
    if (this.items.length === 0) {
      return "📋 Lista vacía";
    }

    let lista = "📋 Lista de Compras:\n";
    lista += "─".repeat(50) + "\n";

    this.items.forEach((item, index) => {
      const subtotal = (item.cantidad * item.precioUnitario).toFixed(2);
      lista += `${index + 1}. ${item.nombre}\n`;
      lista += `   Cantidad: ${item.cantidad}x | Precio: $${item.precioUnitario.toFixed(2)} | Subtotal: $${subtotal}\n`;
    });

    lista += "─".repeat(50) + "\n";
    lista += `💰 TOTAL: $${this.calcularTotal().toFixed(2)}\n`;

    return lista;
  }

  //Limpiar lista 
  limpiarLista() {
    this.items = [];
    return { 
      exito: true, 
      mensaje: "🧹 Lista limpiada" 
    };
  }

  /**
   * Obtiene el cantidad de items en la lista
   * @returns {number} Cantidad de items
   */
  obtenerCantidadItems() {
    return this.items.length;
  }
}

const lista = new ListaCompras();

function mostrarOutput(texto, tipo = "normal") {
  const output = document.getElementById("out-lista");
  output.textContent = texto;
  output.classList.remove("error", "success");
  
  if (tipo === "error") {
    output.classList.add("error");
  } else if (tipo === "success") {
    output.classList.add("success");
  }
}

function obtenerValores() {
  const nombre = document.getElementById("item-nombre").value.trim();
  const cantidad = parseInt(document.getElementById("item-cantidad").value);
  const precio = parseFloat(document.getElementById("item-precio").value);

  return { nombre, cantidad, precio };
}

function limpiarFormulario() {
  document.getElementById("item-nombre").value = "";
  document.getElementById("item-cantidad").value = "1";
  document.getElementById("item-precio").value = "0";
  document.getElementById("item-nombre").focus();
}

function actualizarVistaLista() {
  const listItems = document.getElementById("lista-items");
  const items = lista.obtenerLista();
  const totalDisplay = document.getElementById("total-display");

  if (items.length === 0) {
    listItems.innerHTML = '<div style="color: #6b7280; text-align: center; padding: 20px;">La lista está vacía</div>';
    totalDisplay.textContent = "Total: $0.00";
    return;
  }

  listItems.innerHTML = items.map((item, index) => {
    const subtotal = (item.cantidad * item.precioUnitario).toFixed(2);
    return `
      <div class="item-row">
        <div class="item-info">
          <div class="item-nombre">${item.nombre}</div>
          <div class="item-detalles">
            <span>Cant: <strong>${item.cantidad}</strong></span>
            <span>Precio: <strong>$${item.precioUnitario.toFixed(2)}</strong></span>
          </div>
        </div>
        <div class="item-subtotal">$${subtotal}</div>
        <button class="btn-delete" onclick="eliminarItemUI('${item.nombre}')">Eliminar</button>
      </div>
    `;
  }).join("");

  const total = lista.calcularTotal().toFixed(2);
  totalDisplay.textContent = `Total: $${total}`;
}

function eliminarItemUI(nombre) {
  const resultado = lista.eliminarItem(nombre);
  mostrarOutput(resultado.mensaje, resultado.exito ? "success" : "error");
  actualizarVistaLista();
}

//esuchadores
document.getElementById("btn-agregar").addEventListener("click", () => {
  const { nombre, cantidad, precio } = obtenerValores();

  if (!nombre) {
    mostrarOutput("⛔ Por favor ingresa el nombre del producto", "error");
    return;
  }

  if (cantidad <= 0) {
    mostrarOutput("⛔ La cantidad debe ser mayor a 0", "error");
    return;
  }

  if (precio < 0) {
    mostrarOutput("⛔ El precio no puede ser negativo", "error");
    return;
  }

  const resultado = lista.agregarItem(nombre, cantidad, precio);
  mostrarOutput(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) {
    limpiarFormulario();
    actualizarVistaLista();
  }
});

document.getElementById("btn-buscar").addEventListener("click", () => {
  const nombre = document.getElementById("buscar-item").value.trim();

  if (!nombre) {
    mostrarOutput("⛔ Por favor ingresa un nombre para buscar", "error");
    return;
  }

  const resultado = lista.buscarItem(nombre);
  mostrarOutput(resultado.mensaje, resultado.exito ? "success" : "error");
  document.getElementById("buscar-item").value = "";
});

document.getElementById("btn-eliminar").addEventListener("click", () => {
  const nombre = document.getElementById("buscar-item").value.trim();

  if (!nombre) {
    mostrarOutput("⛔ Por favor ingresa el nombre del producto a eliminar", "error");
    return;
  }

  const resultado = lista.eliminarItem(nombre);
  mostrarOutput(resultado.mensaje, resultado.exito ? "success" : "error");

  if (resultado.exito) {
    document.getElementById("buscar-item").value = "";
    actualizarVistaLista();
  }
});

document.getElementById("btn-limpiar").addEventListener("click", () => {
  if (lista.obtenerCantidadItems() === 0) {
    mostrarOutput("⚠️ La lista ya está vacía", "error");
    return;
  }

  const resultado = lista.limpiarLista();
  mostrarOutput(resultado.mensaje, "success");
  actualizarVistaLista();
});

// Enter en input nombre para agregar rápido
document.getElementById("item-nombre").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btn-agregar").click();
  }
});

// la busqueda puede ser con el enter
document.getElementById("buscar-item").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btn-buscar").click();
  }
});

// comenzar
document.getElementById("item-nombre").focus();