if (
    localStorage.getItem("sesionActiva") !== "true" ||
    localStorage.getItem("rolActivo") !== "cliente" ||
    !localStorage.getItem("correoActivo")
) {
    window.location.href = "login.html";
}

const correoActivo = localStorage.getItem("correoActivo");

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


function renderizarVentas() {
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.correo === correoActivo);

    const tbody = document.querySelector("#tablaVentas tbody");
    tbody.innerHTML = "";

    if (!cliente) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">Debes registrar tus datos personales antes de ver tus compras.</td></tr>`;
        return;
    }

    const encabezados = obtenerEncabezados();
    const misCompras = encabezados.filter(e => e.idCliente === cliente.id);

    if (misCompras.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">Todavía no has realizado ninguna compra.</td></tr>`;
        return;
    }

    const comprasOrdenadas = [...misCompras].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    comprasOrdenadas.forEach(venta => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${venta.id}</td>
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
            mostrarDetalle(this.dataset.id);
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
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">Esta compra no tiene detalles.</td></tr>`;
    } else {
        detallesVenta.forEach(det => {
            const producto = productos.find(p => p.id === det.idProducto);
            const nombreProducto = producto ? producto.nombre : "Producto eliminado";
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