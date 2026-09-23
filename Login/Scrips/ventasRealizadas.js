if (
    localStorage.getItem("sesionActiva") !== "true" ||
    localStorage.getItem("rolActivo") !== "admin"
) {
    window.location.href = "login.html";
}

function obtenerEncabezados() {
    return JSON.parse(localStorage.getItem("encabezados")) || [];
}

function obtenerDetalles() {
    return JSON.parse(localStorage.getItem("detalles")) || [];
}

function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensajeGuardado");
    mensaje.textContent = texto;
    mensaje.classList.add("visible");
    clearTimeout(mensaje.temporizador);
    mensaje.temporizador = setTimeout(() => {
        mensaje.classList.remove("visible");
    }, 3000);
}

function renderizarVentas() {
    const encabezados = obtenerEncabezados();
    const clientes = obtenerClientes();
    const tbody = document.querySelector("#tablaVentas tbody");
    tbody.innerHTML = "";

    if (encabezados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">No hay ventas registradas.</td></tr>`;
        return;
    }

    const ventasOrdenadas = [...encabezados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    ventasOrdenadas.forEach(venta => {
        const cliente = clientes.find(c => c.id === venta.idCliente);
        const nombreCliente = cliente ? cliente.nombreCompleto : "Cliente no encontrado";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${venta.id}</td>
            <td>${nombreCliente}</td>
            <td>${venta.fecha}</td>
            <td>$${Number(venta.total).toLocaleString("es-CO")}</td>
            <td>
                <button class="btn-ver" data-id="${venta.id}">Ver Detalle</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    document.querySelectorAll(".btn-ver").forEach(btn => {
        btn.addEventListener("click", function () {
            const idVenta = this.dataset.id;
            mostrarDetalle(idVenta);
        });
    });
}

function mostrarDetalle(idEncabezado) {
    const detalles = obtenerDetalles();
    const productos = obtenerProductos();
    const encabezados = obtenerEncabezados();

    const venta = encabezados.find(e => e.id === idEncabezado);
    if (!venta) return;

    const detallesVenta = detalles.filter(d => d.idEncabezado === idEncabezado);

    const tbody = document.querySelector("#tablaDetalles tbody");
    tbody.innerHTML = "";

    if (detallesVenta.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">Esta venta no tiene detalles.</td></tr>`;
    } else {
        detallesVenta.forEach(det => {
            const producto = productos.find(p => p.id === det.idProducto);
            const nombreProducto = producto ? producto.nombre : "Producto eliminado";
            // El valor unitario se puede calcular como valor / cantidad
            const valorUnitario = det.cantidad > 0 ? det.valor / det.cantidad : 0;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${nombreProducto}</td>
                <td>${det.cantidad}</td>
                <td>$${Number(valorUnitario).toLocaleString("es-CO")}</td>
                <td>$${Number(det.valor).toLocaleString("es-CO")}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    document.getElementById("idVentaDetalle").textContent = `#${idEncabezado}`;
    document.getElementById("totalDetalle").textContent = Number(venta.total).toLocaleString("es-CO");

    document.getElementById("detalleVenta").hidden = false;

    document.getElementById("detalleVenta").scrollIntoView({ behavior: "smooth", block: "nearest" });
}


document.getElementById("btnCerrarDetalle").addEventListener("click", function () {
    document.getElementById("detalleVenta").hidden = true;
});

document.addEventListener("DOMContentLoaded", function () {
    renderizarVentas();
});