const formulario = document.querySelector("#formulario")
const resultado = document.querySelector("#resultado")
const paginacion = document.querySelector("#paginacion")
const registrosPorPagina = 32
let totalPaginas;
let iterator;
let paginaActual = 1

const limpiarHTML = (referencia) => {
    while (referencia.firstChild) {
        referencia.removeChild(referencia.firstChild);
    }
}

const imprimirPaginador = () => {
    iterator = crearPaginador(totalPaginas)

    while (true) {
        const { value, done } = iterator.next();
        if (done) return;

        const boton = document.createElement("A")
        boton.href = "#"
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-4", "rounded")

        boton.onclick = (e) => {
            e.preventDefault();
            paginaActual = value
            buscarImagenes()
        }

        paginacion.appendChild(boton)
    }
}

const calcularPaginas = (total) => {
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

const mostrarImagenes = (imagenes) => {
    limpiarHTML(resultado)

    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen

        resultado.innerHTML += `
        <div class='w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4'>
            <div class='bg-white'>
                <img class='w-full h-64 object-cover' src='${previewURL}'>
                
                <div class='p-4'>
                    <p class='font-bold'>${likes} <span>Me Gusta</span></p>
                    <p class='font-bold'>${views} <span>Me Gusta</span></p>

                    <a 
                        class=' block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1'
                        href='${largeImageURL}' 
                        target='_blank' 
                        rel='noopener noreferrer'
                    >
                        Ver Imagen
                    </a>
                </div>
            </div>
        </div>
        `
    })

    limpiarHTML(paginacion)

    imprimirPaginador()
}

const buscarImagenes = () => {
    const termino = document.querySelector("#termino").value


    // https://pixabay.com/api/docs/
    const KEY = "50336770-aef1335f4426a5c5c872a67a7";
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            totalPaginas = calcularPaginas(data.totalHits)
            mostrarImagenes(data.hits)
        })
}

const mostrarAlerta = (mensaje) => {
    const existeAlerta = document.querySelector(".bg-red-100")

    //Si no existe creas la alerta, si existe no la crea
    if (!existeAlerta) {
        const alerta = document.createElement("P")
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center")

        alerta.innerHTML = `
            <strong class='font-bold'>Error!</strong>
            <span class='block sm:inline'>${mensaje}</span>
        `

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }

}

const validarFormulario = (e) => {
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value

    if (terminoBusqueda === "") {
        mostrarAlerta("Tienes que agregar un termino de busqueda")
        return
    }

    buscarImagenes()
}

document.addEventListener("DOMContentLoaded", () => {
    formulario.addEventListener("submit", validarFormulario)
})