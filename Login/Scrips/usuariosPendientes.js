if (
  localStorage.getItem("sesionActiva") !== "true" ||
  localStorage.getItem("rolActivo") !== "admin"
) {
  window.location.href = "login.html";
}

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function renderTabla() {
  const pendientes = obtenerUsuarios().filter(function (u) { return u.estado === "Pendiente"; });
  const tbody = document.querySelector("#tablaPendientes tbody");
  tbody.innerHTML = "";

  if (pendientes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888;">No hay solicitudes pendientes.</td></tr>`;
    return;
  }

  pendientes.forEach(function (usuario) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.correo}</td>
      <td>
        <select class="selectRol" data-id="${usuario.id}">
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <div class="acciones-tabla">
          <button class="btn-editar btn-activar" data-id="${usuario.id}">Activar</button>
        </div>
      </td>
    `;
    tbody.appendChild(fila);
  });

  document.querySelectorAll(".btn-activar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      activarUsuario(this.dataset.id);
    });
  });
}

function activarUsuario(id) {
  const usuarios = obtenerUsuarios();
  const select = document.querySelector(`.selectRol[data-id="${id}"]`);
  const rolElegido = select.value;

  const indice = usuarios.findIndex(function (u) { return u.id === id; });
  if (indice === -1) return;

  usuarios[indice].rol = rolElegido;
  usuarios[indice].estado = "Activo";
  guardarUsuarios(usuarios);

  renderTabla();
  mostrarMensaje("Cuenta activada correctamente");
}

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
