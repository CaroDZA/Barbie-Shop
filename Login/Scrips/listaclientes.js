if (
  localStorage.getItem("sesionActiva") !== "true" ||
  localStorage.getItem("rolActivo") !== "admin"
) {
  window.location.href = "login.html";
}

function obtenerClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

function guardarClientes(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderTabla() {
  const clientes = obtenerClientes();
  const tbody = document.querySelector("#tablaClientes tbody");
  tbody.innerHTML = "";

  if (clientes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">Todavía no hay clientes registrados.</td></tr>`;
    return;
  }

  clientes.forEach(function (cliente) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombreCompleto}</td>
      <td>${cliente.fechaNacimiento}</td>
      <td>${cliente.correo}</td>
      <td>
        <div class="acciones-tabla">
          <button class="btn-editar" data-id="${cliente.id}">Editar</button>
          <button class="btn-eliminar" data-id="${cliente.id}">Eliminar</button>
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
      eliminarCliente(this.dataset.id);
    });
  });
}

function cargarEdicion(id) {
  const clientes = obtenerClientes();
  const cliente = clientes.find(function (c) { return c.id === id; });
  if (!cliente) return;

  document.getElementById("idClienteEditar").value = cliente.id;
  document.getElementById("nombreCompletoEditar").value = cliente.nombreCompleto;
  document.getElementById("fechaNacimientoEditar").value = cliente.fechaNacimiento;
  document.getElementById("correoEditar").value = cliente.correo;

  document.getElementById("formularioEditar").hidden = false;
  document.getElementById("formularioEditar").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cerrarEdicion() {
  document.getElementById("formularioEditar").reset();
  document.getElementById("formularioEditar").hidden = true;
}

document.getElementById("botonCancelarEdicion").addEventListener("click", cerrarEdicion);

function eliminarCliente(id) {
  let clientes = obtenerClientes();
  clientes = clientes.filter(function (c) { return c.id !== id; });
  guardarClientes(clientes);
  renderTabla();
  mostrarMensaje("Cliente eliminado");

  if (document.getElementById("idClienteEditar").value === id) {
    cerrarEdicion();
  }
}

document.getElementById("formularioEditar").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("idClienteEditar").value;
  const nombreCompleto = document.getElementById("nombreCompletoEditar").value.trim();
  const fechaNacimiento = document.getElementById("fechaNacimientoEditar").value;

  if (nombreCompleto === "" || fechaNacimiento === "") {
    alert("Por favor complete todos los campos");
    return;
  }

  const clientes = obtenerClientes();
  const indice = clientes.findIndex(function (c) { return c.id === id; });

  if (indice !== -1) {
    clientes[indice].nombreCompleto = nombreCompleto;
    clientes[indice].fechaNacimiento = fechaNacimiento;
    guardarClientes(clientes);
    renderTabla();
  }

  cerrarEdicion();
  mostrarMensaje("Cliente actualizado correctamente");
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

renderTabla();