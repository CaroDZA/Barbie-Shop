function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

document.getElementById("toggleContraseña").addEventListener("click", function () {
  const campoContraseña = document.getElementById("contraseña");
  const mostrando = campoContraseña.type === "text";

  campoContraseña.type = mostrando ? "password" : "text";
  this.classList.toggle("fa-eye", mostrando);
  this.classList.toggle("fa-eye-slash", !mostrando);
});

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("contraseña").value;
  const confirmarContraseña = document.getElementById("confirmarContraseña").value;

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexContraseñaSegura = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (!regexCorreo.test(correo)) {
    alert("Ingresa un correo electrónico válido.");
    return;
  }

  if (!regexContraseñaSegura.test(contraseña)) {
    alert("La contraseña debe tener mínimo 6 caracteres, incluyendo letras y números.");
    return;
  }

  if (contraseña !== confirmarContraseña) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const usuarios = obtenerUsuarios();

  if (usuarios.some(function (u) { return u.correo === correo; })) {
    alert("Ya existe una cuenta registrada con ese correo.");
    return;
  }

  usuarios.push({
    id: Date.now().toString(),
    correo: correo,
    contraseña: contraseña,
    rol: null,
    estado: "Pendiente",
  });

  guardarUsuarios(usuarios);

  document.getElementById("formulario").hidden = true;
  document.getElementById("mensajeExito").hidden = false;
});
