if (
  localStorage.getItem("sesionActiva") !== "true" ||
  localStorage.getItem("rolActivo") !== "admin"
) {
  window.location.href = "login.html";
}

function inicializarProductos() {
  if (!localStorage.getItem("productos")) {
    const productosIniciales = [
      { id: "1", nombre: "Barbie", descripcion: "Edición escuela de perritos", stock: 20, precio: 45000 },
      { id: "2", nombre: "Gorra Barbie", descripcion: "Gorra ajustable con bordado rosa", stock: 15, precio: 30000 },
      { id: "3", nombre: "Carro barbie", descripcion: "Edición a control remoto", stock: 8, precio: 85000 },
      { id: "4", nombre: "Llavero Corazón", descripcion: "Llavero acrílico en forma de corazón", stock: 40, precio: 12000 },
    ];
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
  }
}

function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function renderTabla() {
  const productos = obtenerProductos();
  const tbody = document.querySelector("#tablaProductos tbody");
  tbody.innerHTML = "";

  if (productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No hay productos guardados.</td></tr>`;
    return;
  }

  productos.forEach(function (producto) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>${producto.stock}</td>
      <td>$${Number(producto.precio).toLocaleString("es-CO")}</td>
      <td>
        <div class="acciones-tabla">
          <button class="btn-editar" data-id="${producto.id}">Editar</button>
          <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(fila);
  });

  document.querySelectorAll(".btn-editar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cargarEdicion(this.dataset.id);
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarProducto(this.dataset.id);
    });
  });
}

function cargarEdicion(id) {
  const productos = obtenerProductos();
  const producto = productos.find(function (p) { return p.id === id; });
  if (!producto) return;

  document.getElementById("idProducto").value = producto.id;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("precio").value = producto.precio;

  document.getElementById("botonGuardar").textContent = "Actualizar";
  document.getElementById("botonCancelar").hidden = false;
}

function limpiarFormulario() {
  document.getElementById("formulario").reset();
  document.getElementById("idProducto").value = "";
  document.getElementById("botonGuardar").textContent = "Guardar";
  document.getElementById("botonCancelar").hidden = true;
}

document.getElementById("botonCancelar").addEventListener("click", limpiarFormulario);

function eliminarProducto(id) {
  let productos = obtenerProductos();
  productos = productos.filter(function (p) { return p.id !== id; });
  guardarProductos(productos);
  renderTabla();
  mostrarMensaje("Producto eliminado");

  if (document.getElementById("idProducto").value === id) {
    limpiarFormulario();
  }
}

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const idProducto = document.getElementById("idProducto").value;
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const stock = document.getElementById("stock").value;
  const precio = document.getElementById("precio").value;

  if (nombre === "" || descripcion === "" || stock === "" || precio === "") {
    alert("Por favor complete todos los campos");
    return;
  }

  const productos = obtenerProductos();
  const esEdicion = idProducto !== "";

  if (esEdicion) {
    const indice = productos.findIndex(function (p) { return p.id === idProducto; });
    if (indice !== -1) {
      productos[indice] = { id: idProducto, nombre, descripcion, stock, precio };
    }
  } else {
    const nuevoId = productos.length > 0
      ? Math.max(...productos.map(p => Number(p.id) || 0)) + 1
      : 1;
    productos.push({ id: nuevoId.toString(), nombre, descripcion, stock, precio });
  }

  guardarProductos(productos);
  renderTabla();
  limpiarFormulario();
  mostrarMensaje(esEdicion ? "Producto actualizado correctamente" : "Producto guardado correctamente");
});

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensajeGuardado");
  mensaje.textContent = texto;
  mensaje.classList.add("visible");

  clearTimeout(mensaje.temporizador);
  mensaje.temporizador = setTimeout(function () {
    mensaje.classList.remove("visible");
  }, 3000);
}

inicializarProductos();
renderTabla();