if (
    localStorage.getItem("sesionActiva") !== "true" ||
    localStorage.getItem("rolActivo") !== "cliente" ||
    !localStorage.getItem("correoActivo")
) {
    window.location.href = "login.html";
}

const correoActivo = localStorage.getItem("correoActivo");

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

function obtenerEncabezados() {
    return JSON.parse(localStorage.getItem("encabezados")) || [];
}

function guardarEncabezados(encabezados) {
    localStorage.setItem("encabezados", JSON.stringify(encabezados));
}

function obtenerDetalles() {
    return JSON.parse(localStorage.getItem("detalles")) || [];
}

function guardarDetalles(detalles) {
    localStorage.setItem("detalles", JSON.stringify(detalles));
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

function validarClienteRegistrado() {
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.correo === correoActivo);
    if (!cliente) {
        alert("Debes completar tus datos personales antes de realizar una compra.");
        window.location.href = "index.html";
        return false;
    }
    return cliente;
}

function validarProductosExistentes() {
    const productos = obtenerProductos();
    if (productos.length === 0) {
        alert("No hay productos registrados. Contacta al administrador.");
        window.location.href = "home.html";
        return false;
    }
    return true;
}

let carrito = [];

function renderizarProductos() {
    const productos = obtenerProductos();
    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = "";

    const productosConStock = productos.filter(p => Number(p.stock) > 0);

    if (productosConStock.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No hay productos con stock disponible.</td></tr>`;
        return;
    }

    productosConStock.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>$${Number(p.precio).toLocaleString("es-CO")}</td>
            <td>${p.stock}</td>
            <td>
                <input type="number" class="cantidad-input" data-id="${p.id}" min="1" max="${p.stock}" value="1">
            </td>
            <td>
                <button class="btn-agregar" data-id="${p.id}">Agregar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            const input = document.querySelector(`.cantidad-input[data-id="${id}"]`);
            const cantidad = parseInt(input.value, 10);
            agregarAlCarrito(id, cantidad);
        });
    });
}

function agregarAlCarrito(idProducto, cantidad) {
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;

    if (cantidad > Number(producto.stock)) {
        alert(`No puedes agregar más de ${producto.stock} unidades.`);
        return;
    }

    const itemExistente = carrito.find(item => item.idProducto === idProducto);
    if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (nuevaCantidad > Number(producto.stock)) {
            alert(`La cantidad total supera el stock disponible (${producto.stock}).`);
            return;
        }
        itemExistente.cantidad = nuevaCantidad;
    } else {
        carrito.push({ idProducto, cantidad });
    }

    renderizarCarrito();
    mostrarMensaje("Producto agregado al carrito");
}

function renderizarCarrito() {
    const tbody = document.querySelector("#tablaCarrito tbody");
    tbody.innerHTML = "";
    const productos = obtenerProductos();

    if (carrito.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">No hay productos en el carrito.</td></tr>`;
        document.getElementById("totalCompra").textContent = "0";
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        const producto = productos.find(p => p.id === item.idProducto);
        if (!producto) return; // por si acaso fue eliminado

        const subtotal = Number(producto.precio) * item.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${Number(producto.precio).toLocaleString("es-CO")}</td>
            <td>${item.cantidad}</td>
            <td>$${subtotal.toLocaleString("es-CO")}</td>
            <td>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    document.getElementById("totalCompra").textContent = total.toLocaleString("es-CO");

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = parseInt(this.dataset.index, 10);
            carrito.splice(index, 1);
            renderizarCarrito();
            mostrarMensaje("Producto eliminado del carrito");
        });
    });
}


document.getElementById("btnConfirmarCompra").addEventListener("click", function () {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega al menos un producto.");
        return;
    }

    const cliente = validarClienteRegistrado();
    if (!cliente) return;

    const productos = obtenerProductos();

    // Verificar stock nuevamente antes de confirmar
    for (let item of carrito) {
        const prod = productos.find(p => p.id === item.idProducto);
        if (!prod || Number(prod.stock) < item.cantidad) {
            alert(`El producto "${prod ? prod.nombre : 'desconocido'}" ya no tiene stock suficiente. Actualiza el carrito.`);
            return;
        }
    }

    let total = 0;
    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.idProducto);
        total += Number(prod.precio) * item.cantidad;
    });

    const encabezados = obtenerEncabezados();
    const nuevoIdEncabezado = Date.now().toString();
    const nuevoEncabezado = {
        id: nuevoIdEncabezado,
        idCliente: cliente.id,
        fecha: new Date().toISOString().split("T")[0],
        total: total
    };
    encabezados.push(nuevoEncabezado);

    const detalles = obtenerDetalles();
    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.idProducto);
        detalles.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            idEncabezado: nuevoIdEncabezado,
            idProducto: item.idProducto,
            cantidad: item.cantidad,
            valor: Number(prod.precio) * item.cantidad
        });
    });

    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.idProducto);
        if (prod) {
            prod.stock = Number(prod.stock) - item.cantidad;
        }
    });

    guardarProductos(productos);
    guardarEncabezados(encabezados);
    guardarDetalles(detalles);

    carrito = [];
    renderizarCarrito();
    renderizarProductos();
    mostrarMensaje("¡Compra realizada con éxito! Stock actualizado.");
});

document.getElementById("btnCancelarCompra").addEventListener("click", function () {
    if (carrito.length > 0) {
        if (confirm("¿Seguro que deseas cancelar la compra? Se perderán los productos agregados.")) {
            carrito = [];
            renderizarCarrito();
        }
    } else {
        window.location.href = "home.html";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    if (!validarClienteRegistrado()) return;
    if (!validarProductosExistentes()) return;
    renderizarProductos();
    renderizarCarrito();
});