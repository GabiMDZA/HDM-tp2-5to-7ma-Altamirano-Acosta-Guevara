
// 1. clases que se piden en el enunciado

class Producto {
  constructor(id, nombre, precio, stock, categoria, descuento) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.categoria = categoria;
    this.descuento = descuento; // porcentaje, ej: 10 para 10%
  }

  obtenerPrecioConDescuento() {
    const rebaja = this.precio * (this.descuento / 100);
    return this.precio - rebaja;
  }
}

class Cliente {
  constructor(id, nombre, email, direccion) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.direccion = direccion;
    this.historialCompras = [];
  }

  agregarOrden(orden) {
    this.historialCompras.push(orden);
  }
}

class ItemCarrito {
  constructor(producto, cantidad) {
    this.producto = producto; // Instancia de Producto
    this.cantidad = cantidad;
    this.subtotal = this.calcularSubtotal();
  }

  calcularSubtotal() {
    return this.producto.obtenerPrecioConDescuento() * this.cantidad;
  }
}

class Carrito {
  constructor(cliente) {
    this.items = []; // Lista de instancias ItemCarrito
    this.cliente = cliente;
    this.total = 0;
    this.fecha = new Date().toLocaleDateString();
  }

  agregarProducto(producto) {
    if (producto.stock <= 0) {
      return `❌ Sin stock de ${producto.nombre}.`;
    }

    // Busca si este producto específico ya estaba en el carrito
    const itemExistente = this.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
      itemExistente.subtotal = itemExistente.calcularSubtotal();
    } else {
      this.items.push(new ItemCarrito(producto, 1));
    }

    producto.stock -= 1;
    this.calcularTotal();
    return `✅ Se agregó 1 unidad de ${producto.nombre}.`;
  }

  quitarProducto(producto) {
    const itemIndex = this.items.findIndex(item => item.producto.id === producto.id);

    if (itemIndex === -1) {
      return `⚠️ No tienes ${producto.nombre} en el carrito.`;
    }

    this.items[itemIndex].cantidad -= 1;
    producto.stock += 1;

    if (this.items[itemIndex].cantidad <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].subtotal = this.items[itemIndex].calcularSubtotal();
    }

    this.calcularTotal();
    return `➖ Se retiró 1 unidad de ${producto.nombre}.`;
  }

  calcularTotal() {
    this.total = 0;
    this.items.forEach(item => {
      this.total += item.subtotal;
    });
    return this.total;
  }
}

class Orden {
  constructor(carrito) {
    this.numeroOrden = "ORD-" + Math.floor(Math.random() * 90000 + 10000);
    this.subtotal = carrito.total;
    this.impuestos = this.subtotal * 0.21; // 21% de IVA
    this.envio = this.subtotal < 5000 && this.subtotal > 0 ? 500 : 0;
    this.totalFinal = this.subtotal + this.impuestos + this.envio;
    this.fecha = new Date().toLocaleDateString();
  }
}

// 2. creación de instancias ahi hice solo 3 productos
const teclado = new Producto(1, "Teclado Mecánico", 6000, 5, "Periféricos", 10);
const mouse = new Producto(2, "Mouse Snapdragon", 9000, 5, "Periféricos", 0);
const auriculares = new Producto(3, "Auriculares Gamer", 4000, 3, "Audio", 15);

let clienteActual = new Cliente(101, "", "", "");
let carritoActual = new Carrito(clienteActual);

// 3.  aca estaria la captura de elementos del DOM

const outMensaje = document.querySelector("#out-mensaje");
const cartInfo = document.querySelector("#cart-info");
const txLog = document.querySelector("#tx-log");

const prodStock1 = document.querySelector("#prod-stock");
const prodStock2 = document.querySelector("#prod-stock-2");
const prodStock3 = document.querySelector("#prod-stock-3");

// 4. aqui van las funciones de apoyo

function mostrarMensaje(texto, tipo = "") {
  outMensaje.textContent = texto;
  outMensaje.className = "output " + tipo;
}

function actualizarInterfaz() {
  // 1. Actualiza el stock en cada tarjeta
  prodStock1.textContent = teclado.stock;
  prodStock2.textContent = mouse.stock;
  prodStock3.textContent = auriculares.stock;

  // 2. Muestra todos los items agregados al carrito
  if (carritoActual.items.length === 0) {
    cartInfo.textContent = "El carrito está vacío.";
  } else {
    let contenido = "";
    carritoActual.items.forEach(item => {
      contenido += `
        <div style="margin-bottom: 6px;">
          ${item.producto.nombre} x${item.cantidad} — <strong>$${item.subtotal}</strong>
        </div>
      `;
    });
    contenido += `<hr style="border-color:#2d2d44; margin:8px 0;"><strong>Subtotal carrito: $${carritoActual.total}</strong>`;
    cartInfo.innerHTML = contenido;
  }
}

function actualizarHistorial() {
  txLog.innerHTML = "";
  if (clienteActual.historialCompras.length === 0) {
    txLog.textContent = "No hay órdenes registradas.";
    return;
  }

  clienteActual.historialCompras.forEach(orden => {
    const div = document.createElement("div");
    div.className = "tx-item";
    div.textContent = `${orden.numeroOrden} | Subtotal: $${orden.subtotal} | Impuestos (21%): $${orden.impuestos} | Envío: $${orden.envio} → TOTAL: $${orden.totalFinal}`;
    txLog.prepend(div);
  });
}

// 5. aca estaria los eventos (addEventListener)


// aca registramos los datos del cliente
document.querySelector("#btn-crear-cliente").addEventListener("click", () => {
  const nom = document.querySelector("#cli-nombre").value.trim();
  const em = document.querySelector("#cli-email").value.trim();
  const dir = document.querySelector("#cli-direccion").value.trim();

  if (!nom || !em) {
    mostrarMensaje("❌ Completa al menos nombre y email.", "error");
    return;
  }

  clienteActual.nombre = nom;
  clienteActual.email = em;
  clienteActual.direccion = dir;

  mostrarMensaje(`✅ Datos de ${clienteActual.nombre} guardados.`, "success");
});

// Eventos Producto 1 (Teclado)
document.querySelector("#btn-agregar").addEventListener("click", () => {
  const res = carritoActual.agregarProducto(teclado);
  mostrarMensaje(res, res.startsWith("❌") ? "error" : "success");
  actualizarInterfaz();
});

document.querySelector("#btn-quitar").addEventListener("click", () => {
  const res = carritoActual.quitarProducto(teclado);
  mostrarMensaje(res, res.startsWith("⚠️") ? "error" : "success");
  actualizarInterfaz();
});

// Eventos Producto 2 (Mouse)
document.querySelector("#btn-agregar-2").addEventListener("click", () => {
  const res = carritoActual.agregarProducto(mouse);
  mostrarMensaje(res, res.startsWith("❌") ? "error" : "success");
  actualizarInterfaz();
});

document.querySelector("#btn-quitar-2").addEventListener("click", () => {
  const res = carritoActual.quitarProducto(mouse);
  mostrarMensaje(res, res.startsWith("⚠️") ? "error" : "success");
  actualizarInterfaz();
});

// Eventos Producto 3 (Auriculares)
document.querySelector("#btn-agregar-3").addEventListener("click", () => {
  const res = carritoActual.agregarProducto(auriculares);
  mostrarMensaje(res, res.startsWith("❌") ? "error" : "success");
  actualizarInterfaz();
});

document.querySelector("#btn-quitar-3").addEventListener("click", () => {
  const res = carritoActual.quitarProducto(auriculares);
  mostrarMensaje(res, res.startsWith("⚠️") ? "error" : "success");
  actualizarInterfaz();
});

// Finalizar Compra
document.querySelector("#btn-comprar").addEventListener("click", () => {
  if (carritoActual.items.length === 0) {
    mostrarMensaje("❌ No puedes comprar con el carrito vacío.", "error");
    return;
  }

  const nuevaOrden = new Orden(carritoActual);
  clienteActual.agregarOrden(nuevaOrden);
  carritoActual = new Carrito(clienteActual);

  mostrarMensaje(`🎉 ¡Compra finalizada! Orden: ${nuevaOrden.numeroOrden} por $${nuevaOrden.totalFinal}`, "success");
  actualizarInterfaz();
  actualizarHistorial();
});

// Inicio en pantalla
actualizarInterfaz();