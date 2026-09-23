if (
  localStorage.getItem("sesionActiva") !== "true" ||
  localStorage.getItem("rolActivo") !== "cliente" ||
  !localStorage.getItem("correoActivo")
) {
  window.location.href = "login.html";
}

const correoActivo = localStorage.getItem("correoActivo");

function obtenerClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

function guardarClientes(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("correo").value = correoActivo || "";

  const clientes = obtenerClientes();
  const miInfo = clientes.find(function (cliente) {
    return cliente.correo === correoActivo;
  });

  if (miInfo) {
    document.getElementById("idCliente").value = miInfo.id;
    document.getElementById("nombreCompleto").value = miInfo.nombreCompleto;
    document.getElementById("fechaNacimiento").value = miInfo.fechaNacimiento;
  }
});

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  let nombreCompleto = document.getElementById("nombreCompleto").value;
  let fechaNacimiento = document.getElementById("fechaNacimiento").value;

  if (nombreCompleto === "" || fechaNacimiento === "") {
    alert("Por favor complete los campos");
    return;
  }

  const clientes = obtenerClientes();
  const indiceExistente = clientes.findIndex(function (cliente) {
    return cliente.correo === correoActivo;
  });

  let idCliente;
  let esEdicion = indiceExistente !== -1;

  if (!esEdicion) {
    idCliente = Date.now().toString();
    clientes.push({
      id: idCliente,
      nombreCompleto: nombreCompleto,
      fechaNacimiento: fechaNacimiento,
      correo: correoActivo,
    });
  } else {
    idCliente = clientes[indiceExistente].id;
    clientes[indiceExistente].nombreCompleto = nombreCompleto;
    clientes[indiceExistente].fechaNacimiento = fechaNacimiento;
  }

  document.getElementById("idCliente").value = idCliente;
  guardarClientes(clientes);

  mostrarMensaje(esEdicion ? "Información actualizada correctamente" : "Información guardada correctamente");
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
