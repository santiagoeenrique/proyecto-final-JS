const carrito = JSON.parse(localStorage.getItem("carrito")) || []
const contenedorProductos = document.getElementById("contenedor-productos")
const botonOfertas = document.getElementById("ofertas")
const botonTodos = document.getElementById("todos")
const barraBusqueda = document.getElementById("busqueda")

// fetch("./js/stock.json")
//     .then((respuesta) => respuesta.json)
//     .then( (productos) => {
//         renderizarProductos(productos)
//     })

const getData = async () => {

    try {
        const respuesta = await fetch("./js/stock.json")
        const productos = await respuesta.json()

        renderizarProductos(productos)
    } catch (e) {
        console.log(e);
    }
}

const renderizarProductos = (array) => {

    contenedorProductos.innerHTML = ""

    // prd = cada objeto de mi array 
    array.forEach((prd) => {

        const div = document.createElement("div")

        // div.className = "producto"
        div.classList.add("producto")

        div.innerHTML = `
        <img src="${prd.img}">
        <h3 class="nombre">${prd.nombre}</h3>
        <p class="precio">$${prd.precio}</p>
        <button class="boton" onclick="pres();" id="agregar${prd.id}">Agregar al carrito</button>
        `
        contenedorProductos.appendChild(div)

        const boton = document.getElementById(`agregar${prd.id}`)
        boton.addEventListener("click", () => {
            agregarCarrito(prd.id)
        })
    })
}

const agregarCarrito = (id) => {

    // Recorrer el Array y encontrar un primer elemento que coincida con la comparación que establecemos
    const producto = stockProductos.find((prod) => prod.id === id)

    // método some 
    if (carrito.some((prd) => prd.id === id)) {

        // Actualizar la cantidad de ese elemento en el carrito
        // Encontrar el indice de mi producto en el carrito
        const index = carrito.findIndex((prd) => prd.id === id)
        carrito[index].cantidad++

    } else {
        producto.cantidad = 1
        carrito.push(producto)
    }

    Swal.fire({
        title: '¡Agregado!✅',
        text: `${producto.nombre} se ha añadido a tu carrito.`,
        showConfirmButton: false,
        timer: 1000,
        position:  "top-end"
    })

    guardarCarrito()
}

const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

botonOfertas.addEventListener("click", () => {
    const productosOfertas = stockProductos.filter((prd) => prd.oferta === true)

    renderizarProductos(productosOfertas)
})

botonTodos.addEventListener("click", () => {
    renderizarProductos(stockProductos)
})

barraBusqueda.addEventListener("input", () => {
    const textoBusqueda = barraBusqueda.value.toLowerCase()

    const productosFiltrados = stockProductos.filter(prd => prd.nombre.toLowerCase().includes(textoBusqueda))

    renderizarProductos(productosFiltrados)
})

window.addEventListener("DOMContentLoaded", getData)