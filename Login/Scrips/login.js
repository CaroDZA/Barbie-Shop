function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function inicializarUsuarios() {
  const usuarios = obtenerUsuarios();
  const cuentasSemilla = [
    { id: "1", correo: "sofiaospina@gmail.com", nombre: "Sofía Ospina", contraseña: "client123", rol: "cliente", estado: "Activo" },
    { id: "2", correo: "caroduque@gmail.com", nombre: "Carolina Duque", contraseña: "admin123", rol: "admin", estado: "Activo" },
  ];

  let huboCambios = false;
  cuentasSemilla.forEach(function (cuenta) {
    const yaExiste = usuarios.some(function (u) { return u.correo === cuenta.correo; });
    if (!yaExiste) {
      usuarios.push(cuenta);
      huboCambios = true;
    }
  });

  if (huboCambios) {
    guardarUsuarios(usuarios);
  }
}

inicializarUsuarios();

document.getElementById("toggleContraseña").addEventListener("click", function () {
  const campoContraseña = document.getElementById("contraseña");
  const mostrando = campoContraseña.type === "text";

  campoContraseña.type = mostrando ? "password" : "text";
  this.classList.toggle("fa-eye", mostrando);
  this.classList.toggle("fa-eye-slash", !mostrando);
});

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("contraseña").value;

  if (email === "" || contraseña === "") {
    alert("Ingresa tu correo y contraseña.");
    return;
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(function (u) { return u.correo === email; });

  if (!usuario || usuario.contraseña !== contraseña) {
    alert("Correo o contraseña incorrectos.");
    return;
  }

  if (usuario.estado !== "Activo") {
    alert("Tu cuenta todavía está pendiente de aprobación por un administrador.");
    return;
  }

  localStorage.setItem("sesionActiva", "true");
  localStorage.setItem("rolActivo", usuario.rol);
  localStorage.setItem("correoActivo", usuario.correo);
  window.location.href = "home.html";
});
