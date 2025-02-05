document.addEventListener("DOMContentLoaded", () => {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const modal = document.getElementById("modal-confirmacion");
    const confirmarBtn = document.getElementById("confirmar-compra");
    const cancelarBtn = document.getElementById("cancelar-compra");

    const formularioCompra = document.getElementById("formulario-compra");
    const overlay = document.getElementById("overlay");
    const cerrarFormulario = document.getElementById("cerrar-formulario");

    const tarjetaInput = document.getElementById('tarjeta');
    const cvvInput = document.getElementById('cvv');
    const direccionInput = document.getElementById('direccion');
    const pagarButton = document.getElementById('pagar');
    const formDatosEnvio = document.getElementById('form-datos-envio');
    const actualizarCarrito = () => {
        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {
            const mensajeCarritoVacio = document.createElement("p");
            mensajeCarritoVacio.textContent = "El carrito está vacío.";
            contenedorCarrito.append(mensajeCarritoVacio);
            totalCarrito.textContent = "Total: $0";
            return;
        }

        carrito.forEach((elm) => {
            const div = document.createElement("div");
            div.classList.add("producto");

            div.innerHTML = `
                <img src="${elm.img}">
                <h3 class="nombre">${elm.nombre}</h3>
                <p class="precio">$${elm.precio}</p>
                <p>Cantidad: 
                    <button class="mas" data-id="${elm.id}"> + </button> 
                    <span id="cantidad${elm.id}">${elm.cantidad}</span> 
                    <button class="menos" data-id="${elm.id}"> - </button>
                </p>
                <button class="boton" data-id="${elm.id}">Borrar</button>
            `;

            contenedorCarrito.append(div);

            const botonBorrar = div.querySelector(".boton");
            botonBorrar.addEventListener("click", () => {
                borrarDelCarrito(elm.id);
                actualizarCarrito();
            });

            const botonIncrementar = div.querySelector(".mas");
            botonIncrementar.addEventListener("click", () => {
                elm.cantidad++;
                actualizarCarrito();
                guardarCarrito();
            });

            const botonDecrementar = div.querySelector(".menos");
            botonDecrementar.addEventListener("click", () => {
                if (elm.cantidad > 1) {
                    elm.cantidad--;
                    guardarCarrito();
                    actualizarCarrito();
                }
            });
        });

        totalCarrito.textContent = `
        Total: $${carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0)}`;

        const contenedorTotalBoton = document.createElement("div");
        contenedorTotalBoton.classList.add("contenedor-total-boton");

        contenedorTotalBoton.appendChild(totalCarrito);

        const botonFinalizar = document.createElement("button");
        botonFinalizar.textContent = "Finalizar Compra";
        botonFinalizar.classList.add("finalizar");
        contenedorTotalBoton.appendChild(botonFinalizar);

        contenedorCarrito.append(contenedorTotalBoton);

        botonFinalizar.addEventListener("click", () => {
            formularioCompra.style.display = "block";
            overlay.style.display = "block";
            modal.style.display = "block";
        });
    };

    tarjetaInput.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');
        event.target.value = newValue;
    });

    cvvInput.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');
    
        event.target.value = newValue;

    })

    direccionInput.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^a-zA-Z0-9\s\.\,\-]/g, '');
        event.target.value = newValue;
    });

    pagarButton.addEventListener('click', () => {
        if (formDatosEnvio.checkValidity()) {
            alert("¡Pago exitoso!");
            localStorage.removeItem("carrito");
            carrito.length = 0;
            actualizarCarrito();
            cerrarModal();
        } else {
            formDatosEnvio.reportValidity();
        }
    });
    const borrarDelCarrito = (id) => {
        const index = carrito.findIndex((prd) => prd.id === id);
        carrito.splice(index, 1);
        guardarCarrito();
    };

    const guardarCarrito = () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    const cerrarModal = () => {
        formularioCompra.style.display = "none";
        overlay.style.display = "none";
        modal.style.display = "none";
    };

    cerrarFormulario.addEventListener("click", cerrarModal);
    overlay.addEventListener("click", cerrarModal);

    if (cancelarBtn) {
        cancelarBtn.addEventListener("click", cerrarModal);
    }

    actualizarCarrito(); // Llama a actualizarCarrito() al cargar la página

    confirmarBtn.addEventListener("click", () => {
        // Se ha eliminado el código de pago
        localStorage.removeItem("carrito");
        carrito.length = 0;
        actualizarCarrito();
        alert("Compra realizada con éxito (sin pago).");
        cerrarModal();
    });

    cancelarBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
});