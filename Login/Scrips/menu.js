(function () {

    if (localStorage.getItem("sesionActiva") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const rolActivo = localStorage.getItem("rolActivo");
    const correoActivo = localStorage.getItem("correoActivo");
    const paginaActual = window.location.pathname.split("/").pop() || "home.html";

    const nombresConocidos = {
        "caroduque@gmail.com": "Carolina Duque",
        "sofiaospina@gmail.com": "Sofía Ospina",
    };

    let nombreMostrar = correoActivo ? correoActivo.split("@")[0] : "Usuario";

    if (rolActivo === "cliente") {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const cliente = clientes.find(c => c.correo === correoActivo);
        if (cliente && cliente.nombreCompleto && cliente.nombreCompleto.trim() !== "") {
            nombreMostrar = cliente.nombreCompleto;
        } else if (nombresConocidos[correoActivo]) {
            nombreMostrar = nombresConocidos[correoActivo];
        }
    } else if (rolActivo === "admin") {
        if (nombresConocidos[correoActivo]) {
            nombreMostrar = nombresConocidos[correoActivo];
        }
    }

    const seccionesPorRol = {
        cliente: [
            { href: "home.html", label: "Inicio" },
            { href: "index.html", label: "Mi Perfil" },
            { href: "compra.html", label: "Realizar Compra" },
            { href: "misCompras.html", label: "Mis Compras" },
        ],
        admin: [
            { href: "home.html", label: "Inicio" },
            { href: "producto.html", label: "Producto" },
            { href: "listaClientes.html", label: "Lista de Clientes" },
            { href: "usuariosPendientes.html", label: "Usuarios Pendientes" },
            { href: "ventasRealizadas.html", label: "Ventas Realizadas" },
        ],
    };

    const enlaces = seccionesPorRol[rolActivo] || [];

    const menuHTML = `
        <aside class="menu-lateral">
            <div class="menu-bienvenida">
                <p class="menu-bienvenida-titulo">Bienvenido a</p>
                <p class="menu-bienvenida-marca">BarbieShop</p>
                <p class="menu-bienvenida-nombre">${nombreMostrar}</p>
                <span class="menu-bienvenida-rol">${rolActivo === "admin" ? "Administrador" : "Cliente"}</span>
            </div>
            <ul class="menu-lista">
                ${enlaces.map(e => `
                    <li>
                        <a href="${e.href}" class="${paginaActual === e.href ? "activo" : ""}">${e.label}</a>
                    </li>
                `).join("")}
            </ul>
            <button class="menu-cerrar-sesion" id="btnCerrarSesion">
                <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
            </button>
        </aside>
    `;

    document.body.insertAdjacentHTML("afterbegin", menuHTML);
    document.body.classList.add("con-menu");

    document.getElementById("btnCerrarSesion").addEventListener("click", function () {
        if (confirm("¿Seguro que deseas cerrar sesión?")) {
            localStorage.removeItem("sesionActiva");
            localStorage.removeItem("rolActivo");
            localStorage.removeItem("correoActivo");
            window.location.href = "login.html";
        }
    });
})();