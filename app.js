/* =========================================================
   MI COMPRA
   JAVASCRIPT PRINCIPAL
   Versión local - preparada posteriormente para Firebase
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_DATOS = "miCompra_datos_v1";


/* =========================================================
   CATEGORÍAS
========================================================= */

const CATEGORIAS = [
    "Fruta",
    "Verdura",
    "Huevos",
    "Carne",
    "Pescado",
    "Lácteos",
    "Panadería",
    "Bebidas",
    "Congelados",
    "Limpieza",
    "Higiene",
    "Otros"
];


/* =========================================================
   SUPERMERCADOS
========================================================= */

const SUPERMERCADOS = [
    "Mercadona",
    "Carrefour",
    "Familia",
    "Gadis",
    "Lupa",
    "Hipercor",
    "Lidl",
    "Alcampo",
    "MasyMas",
    "Otros"
];


/* =========================================================
   DATOS PRINCIPALES
========================================================= */

let catalogo = [];

let listaCompra = [];

let paginaActual = "paginaCompra";

let productoEditandoId = null;

let accionConfirmacion = null;

let temporizadorNotificacion = null;


/* =========================================================
   REFERENCIAS HTML
========================================================= */

const paginaCompra =
    document.getElementById("paginaCompra");

const paginaProductos =
    document.getElementById("paginaProductos");

const listaCompraHTML =
    document.getElementById("listaCompra");

const catalogoProductosHTML =
    document.getElementById("catalogoProductos");

const resultadosCompraHTML =
    document.getElementById("resultadosCompra");

const compraVacia =
    document.getElementById("compraVacia");

const catalogoVacio =
    document.getElementById("catalogoVacio");

const accionesCompra =
    document.getElementById("accionesCompra");

const resumenCompra =
    document.getElementById("resumenCompra");

const contadorCompra =
    document.getElementById("contadorCompra");

const buscarCompra =
    document.getElementById("buscarCompra");

const buscarProducto =
    document.getElementById("buscarProducto");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const filtroSupermercado =
    document.getElementById("filtroSupermercado");

const modalProducto =
    document.getElementById("modalProducto");

const modalConfirmacion =
    document.getElementById("modalConfirmacion");

const formProducto =
    document.getElementById("formProducto");

const tituloModalProducto =
    document.getElementById("tituloModalProducto");

const nombreProducto =
    document.getElementById("nombreProducto");

const categoriaProducto =
    document.getElementById("categoriaProducto");

const supermercadoProducto =
    document.getElementById("supermercadoProducto");

const textoConexion =
    document.getElementById("textoConexion");

const estadoConexion =
    document.getElementById("estadoConexion");

const notificacion =
    document.getElementById("notificacion");

const textoNotificacion =
    document.getElementById("textoNotificacion");

const iconoNotificacion =
    document.getElementById("iconoNotificacion");


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarAplicacion);


function iniciarAplicacion() {

    cargarDatos();

    configurarEventos();

    actualizarEstadoConexion();

    mostrarPagina("paginaCompra");

    dibujarTodo();

}


/* =========================================================
   CARGAR DATOS
========================================================= */

function cargarDatos() {

    try {

        const datosGuardados =
            localStorage.getItem(CLAVE_DATOS);

        if (!datosGuardados) {

            catalogo = [];

            listaCompra = [];

            return;

        }

        const datos =
            JSON.parse(datosGuardados);


        if (datos && Array.isArray(datos.catalogo)) {

            catalogo = datos.catalogo;

        } else {

            catalogo = [];

        }


        if (datos && Array.isArray(datos.listaCompra)) {

            listaCompra = datos.listaCompra;

        } else {

            listaCompra = [];

        }


        /*
         * Compatibilidad y limpieza de datos antiguos
         */

        catalogo = catalogo
            .filter(producto => producto)
            .map(producto => {

                return {

                    id:
                        producto.id ||
                        generarId(),

                    nombre:
                        String(producto.nombre || "")
                            .trim(),

                    categoria:
                        producto.categoria || "Otros",

                    supermercado:
                        producto.supermercado || "Otros"

                };

            })
            .filter(producto => producto.nombre);


        listaCompra = listaCompra
            .filter(item => item)
            .map(item => {

                return {

                    id:
                        item.id ||
                        generarId(),

                    productoId:
                        item.productoId ||
                        item.idProducto ||
                        null,

                    nombre:
                        String(item.nombre || "")
                            .trim(),

                    categoria:
                        item.categoria || "Otros",

                    supermercado:
                        item.supermercado || "Otros",

                    cantidad:
                        normalizarCantidad(item.cantidad),

                    preferente:
                        Boolean(item.preferente),

                    comprado:
                        Boolean(item.comprado)

                };

            })
            .filter(item => item.nombre);


    } catch (error) {

        console.error(
            "Error cargando los datos:",
            error
        );

        catalogo = [];

        listaCompra = [];

        mostrarNotificacion(
            "No se pudieron cargar los datos",
            "error"
        );

    }

}


/* =========================================================
   GUARDAR DATOS
========================================================= */

function guardarDatos() {

    try {

        const datos = {

            catalogo:
                catalogo,

            listaCompra:
                listaCompra,

            fechaActualizacion:
                new Date().toISOString()

        };


        localStorage.setItem(
            CLAVE_DATOS,
            JSON.stringify(datos)
        );


        actualizarEstadoConexion();


    } catch (error) {

        console.error(
            "Error guardando los datos:",
            error
        );

        mostrarNotificacion(
            "No se pudieron guardar los datos",
            "error"
        );

    }

}


/* =========================================================
   GENERAR ID
========================================================= */

function generarId() {

    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


/* =========================================================
   NORMALIZAR CANTIDAD
========================================================= */

function normalizarCantidad(valor) {

    const numero =
        parseInt(valor, 10);

    if (
        Number.isNaN(numero) ||
        numero < 1
    ) {

        return 1;

    }

    return numero;

}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {


    /* ---------------------------------------------
       NAVEGACIÓN
    --------------------------------------------- */

    document
        .getElementById("navCompra")
        .addEventListener(
            "click",
            () => mostrarPagina("paginaCompra")
        );


    document
        .getElementById("navProductos")
        .addEventListener(
            "click",
            () => mostrarPagina("paginaProductos")
        );


    /* ---------------------------------------------
       NUEVO PRODUCTO
    --------------------------------------------- */

    document
        .getElementById("btnNuevoProducto")
        .addEventListener(
            "click",
            abrirNuevoProducto
        );


    document
        .getElementById("btnCrearPrimerProducto")
        .addEventListener(
            "click",
            abrirNuevoProducto
        );


    /* ---------------------------------------------
       CERRAR MODAL PRODUCTO
    --------------------------------------------- */

    document
        .getElementById("btnCerrarModalProducto")
        .addEventListener(
            "click",
            cerrarModalProducto
        );


    document
        .getElementById("btnCancelarProducto")
        .addEventListener(
            "click",
            cerrarModalProducto
        );


    /* ---------------------------------------------
       FORMULARIO PRODUCTO
    --------------------------------------------- */

    formProducto.addEventListener(
        "submit",
        guardarProducto
    );


    /* ---------------------------------------------
       BUSCAR PRODUCTO
    --------------------------------------------- */

    buscarProducto.addEventListener(
        "input",
        dibujarCatalogo
    );


    /* ---------------------------------------------
       FILTROS
    --------------------------------------------- */

    filtroCategoria.addEventListener(
        "change",
        dibujarCatalogo
    );


    filtroSupermercado.addEventListener(
        "change",
        dibujarCatalogo
    );


    /* ---------------------------------------------
       BUSCAR PRODUCTO PARA COMPRA
    --------------------------------------------- */

    buscarCompra.addEventListener(
        "input",
        dibujarResultadosCompra
    );


    /* ---------------------------------------------
       LIMPIAR BÚSQUEDA COMPRA
    --------------------------------------------- */

    document
        .getElementById("limpiarBusquedaCompra")
        .addEventListener(
            "click",
            () => {

                buscarCompra.value = "";

                dibujarResultadosCompra();

                buscarCompra.focus();

            }
        );


    /* ---------------------------------------------
       LIMPIAR BÚSQUEDA PRODUCTOS
    --------------------------------------------- */

    document
        .getElementById("limpiarBusquedaProducto")
        .addEventListener(
            "click",
            () => {

                buscarProducto.value = "";

                filtroCategoria.value = "";

                filtroSupermercado.value = "";

                dibujarCatalogo();

                buscarProducto.focus();

            }
        );


    /* ---------------------------------------------
       MARCAR TODA LA COMPRA
    --------------------------------------------- */

    document
        .getElementById("btnMarcarTodos")
        .addEventListener(
            "click",
            marcarTodosComprados
        );


    /* ---------------------------------------------
       VACIAR COMPRA
    --------------------------------------------- */

    document
        .getElementById("btnVaciarCompra")
        .addEventListener(
            "click",
            confirmarVaciarCompra
        );


    /* ---------------------------------------------
       CONFIRMACIÓN
    --------------------------------------------- */

    document
        .getElementById("btnCancelarConfirmacion")
        .addEventListener(
            "click",
            cerrarModalConfirmacion
        );


    document
        .getElementById("btnAceptarConfirmacion")
        .addEventListener(
            "click",
            ejecutarConfirmacion
        );


    /* ---------------------------------------------
       CERRAR MODALES PULSANDO FONDO
    --------------------------------------------- */

    modalProducto
        .querySelector(".modal-fondo")
        .addEventListener(
            "click",
            cerrarModalProducto
        );


    modalConfirmacion
        .querySelector(".modal-fondo")
        .addEventListener(
            "click",
            cerrarModalConfirmacion
        );


    /* ---------------------------------------------
       TECLA ESC
    --------------------------------------------- */

    document.addEventListener(
        "keydown",
        manejarTeclado
    );


    /* ---------------------------------------------
       CONEXIÓN
    --------------------------------------------- */

    window.addEventListener(
        "online",
        actualizarEstadoConexion
    );


    window.addEventListener(
        "offline",
        actualizarEstadoConexion
    );

}


/* =========================================================
   NAVEGACIÓN ENTRE PÁGINAS
========================================================= */

function mostrarPagina(idPagina) {

    paginaActual = idPagina;


    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("activa");

        });


    const pagina =
        document.getElementById(idPagina);


    if (pagina) {

        pagina.classList.add("activa");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(boton => {

            boton.classList.remove("activo");

        });


    if (idPagina === "paginaCompra") {

        document
            .getElementById("navCompra")
            .classList.add("activo");

    } else {

        document
            .getElementById("navProductos")
            .classList.add("activo");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (idPagina === "paginaCompra") {

        dibujarResultadosCompra();

    }


    if (idPagina === "paginaProductos") {

        dibujarCatalogo();

    }

}


/* =========================================================
   DIBUJAR TODO
========================================================= */

function dibujarTodo() {

    dibujarResultadosCompra();

    dibujarListaCompra();

    dibujarCatalogo();

    actualizarContadores();

}


/* =========================================================
   ICONOS DE CATEGORÍA
========================================================= */

function obtenerIconoCategoria(categoria) {

    const iconos = {

        "Fruta": "🍎",

        "Verdura": "🥦",

        "Huevos": "🥚",

        "Carne": "🥩",

        "Pescado": "🐟",

        "Lácteos": "🥛",

        "Panadería": "🥖",

        "Bebidas": "🥤",

        "Congelados": "❄️",

        "Limpieza": "🧽",

        "Higiene": "🧴",

        "Otros": "📦"

    };


    return iconos[categoria] || "📦";

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ABRIR NUEVO PRODUCTO
========================================================= */

function abrirNuevoProducto() {

    productoEditandoId = null;


    tituloModalProducto.textContent =
        "Nuevo producto";


    formProducto.reset();


    document
        .getElementById("btnGuardarProducto")
        .textContent =
        "Guardar producto";


    abrirModalProducto();


    setTimeout(() => {

        nombreProducto.focus();

    }, 100);

}


/* =========================================================
   ABRIR MODAL PRODUCTO
========================================================= */

function abrirModalProducto() {

    modalProducto.classList.add("visible");

    modalProducto.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


/* =========================================================
   CERRAR MODAL PRODUCTO
========================================================= */

function cerrarModalProducto() {

    modalProducto.classList.remove("visible");

    modalProducto.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

    productoEditandoId = null;

}


/* =========================================================
   GUARDAR PRODUCTO
========================================================= */

function guardarProducto(event) {

    event.preventDefault();


    const nombre =
        nombreProducto.value.trim();

    const categoria =
        categoriaProducto.value;

    const supermercado =
        supermercadoProducto.value;


    if (!nombre) {

        mostrarNotificacion(
            "Escribe el nombre del producto",
            "aviso"
        );

        nombreProducto.focus();

        return;

    }


    if (!categoria) {

        mostrarNotificacion(
            "Selecciona una categoría",
            "aviso"
        );

        categoriaProducto.focus();

        return;

    }


    if (!supermercado) {

        mostrarNotificacion(
            "Selecciona un supermercado",
            "aviso"
        );

        supermercadoProducto.focus();

        return;

    }


    /* ---------------------------------------------
       COMPROBAR DUPLICADOS
    --------------------------------------------- */

    const nombreNormalizado =
        normalizarTexto(nombre);


    const duplicado =
        catalogo.find(producto => {

            const mismoNombre =
                normalizarTexto(producto.nombre) ===
                nombreNormalizado;

            const mismoId =
                producto.id === productoEditandoId;

            return mismoNombre && !mismoId;

        });


    if (duplicado) {

        mostrarNotificacion(
            "Ese producto ya existe",
            "aviso"
        );

        nombreProducto.focus();

        return;

    }


    /* ---------------------------------------------
       EDITAR
    --------------------------------------------- */

    if (productoEditandoId) {

        const producto =
            catalogo.find(
                p => p.id === productoEditandoId
            );


        if (!producto) {

            mostrarNotificacion(
                "No se encontró el producto",
                "error"
            );

            return;

        }


        producto.nombre =
            nombre;

        producto.categoria =
            categoria;

        producto.supermercado =
            supermercado;


        /*
         * Actualizamos también la información
         * visible de los productos que ya estén
         * en la lista de compra.
         */

        listaCompra.forEach(item => {

            if (
                item.productoId ===
                productoEditandoId
            ) {

                item.nombre =
                    nombre;

                item.categoria =
                    categoria;

                item.supermercado =
                    supermercado;

            }

        });


        guardarDatos();

        dibujarTodo();

        cerrarModalProducto();


        mostrarNotificacion(
            "Producto actualizado",
            "exito"
        );


        return;

    }


    /* ---------------------------------------------
       CREAR
    --------------------------------------------- */

    const nuevoProducto = {

        id:
            generarId(),

        nombre:
            nombre,

        categoria:
            categoria,

        supermercado:
            supermercado

    };


    catalogo.push(
        nuevoProducto
    );


    guardarDatos();

    dibujarTodo();

    cerrarModalProducto();


    mostrarNotificacion(
        "Producto creado correctamente",
        "exito"
    );

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(texto) {

    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


/* =========================================================
   EDITAR PRODUCTO
========================================================= */

function editarProducto(id) {

    const producto =
        catalogo.find(
            p => p.id === id
        );


    if (!producto) {

        return;

    }


    productoEditandoId =
        id;


    tituloModalProducto.textContent =
        "Editar producto";


    nombreProducto.value =
        producto.nombre;


    categoriaProducto.value =
        producto.categoria;


    supermercadoProducto.value =
        producto.supermercado;


    document
        .getElementById("btnGuardarProducto")
        .textContent =
        "Guardar cambios";


    abrirModalProducto();


    setTimeout(() => {

        nombreProducto.focus();

    }, 100);

}


/* =========================================================
   DIBUJAR CATÁLOGO
========================================================= */

function dibujarCatalogo() {

    const texto =
        normalizarTexto(
            buscarProducto.value
        );


    const categoria =
        filtroCategoria.value;


    const supermercado =
        filtroSupermercado.value;


    let productos =
        catalogo.filter(producto => {


            const coincideNombre =
                !texto ||
                normalizarTexto(
                    producto.nombre
                ).includes(texto);


            const coincideCategoria =
                !categoria ||
                producto.categoria === categoria;


            const coincideSupermercado =
                !supermercado ||
                producto.supermercado === supermercado;


            return (
                coincideNombre &&
                coincideCategoria &&
                coincideSupermercado
            );

        });


    productos.sort((a, b) =>
        a.nombre.localeCompare(
            b.nombre,
            "es",
            {
                sensitivity: "base"
            }
        )
    );


    catalogoProductosHTML.innerHTML = "";


    if (productos.length === 0) {

        catalogoVacio.style.display =
            "block";


        if (catalogo.length > 0) {

            catalogoVacio.querySelector("h3")
                .textContent =
                "No hay resultados";


            catalogoVacio.querySelector("p")
                .textContent =
                "Prueba con otro nombre o cambia los filtros.";

        } else {

            catalogoVacio.querySelector("h3")
                .textContent =
                "No hay productos";


            catalogoVacio.querySelector("p")
                .textContent =
                "Crea tu primer producto para empezar.";

        }


        return;

    }


    catalogoVacio.style.display =
        "none";


    productos.forEach(producto => {

        catalogoProductosHTML.appendChild(
            crearTarjetaCatalogo(producto)
        );

    });

}


/* =========================================================
   CREAR TARJETA CATÁLOGO
========================================================= */

function crearTarjetaCatalogo(producto) {

    const tarjeta =
        document.createElement("div");


    tarjeta.className =
        "catalogo-card";


    tarjeta.dataset.id =
        producto.id;


    tarjeta.innerHTML = `

        <div class="icono-categoria">
            ${obtenerIconoCategoria(producto.categoria)}
        </div>


        <div class="producto-info">

            <div class="producto-nombre">
                ${escaparHTML(producto.nombre)}
            </div>


            <div class="producto-detalles">

                <span class="etiqueta">
                    ${escaparHTML(producto.categoria)}
                </span>

                <span class="etiqueta etiqueta-supermercado">
                    🏪 ${escaparHTML(producto.supermercado)}
                </span>

            </div>

        </div>


        <div class="producto-controles">

            <button
                type="button"
                class="btn-icono btn-anadir-catalogo"
                title="Añadir a la compra"
                aria-label="Añadir a la compra"
            >
                ＋
            </button>


            <button
                type="button"
                class="btn-icono btn-editar-producto"
                title="Editar producto"
                aria-label="Editar producto"
            >
                ✏️
            </button>


            <button
                type="button"
                class="btn-icono btn-eliminar btn-eliminar-producto"
                title="Eliminar producto"
                aria-label="Eliminar producto"
            >
                🗑️
            </button>

        </div>

    `;


    tarjeta
        .querySelector(".btn-anadir-catalogo")
        .addEventListener(
            "click",
            () => añadirProductoCompra(producto.id)
        );


    tarjeta
        .querySelector(".btn-editar-producto")
        .addEventListener(
            "click",
            () => editarProducto(producto.id)
        );


    tarjeta
        .querySelector(".btn-eliminar-producto")
        .addEventListener(
            "click",
            () => confirmarEliminarProducto(producto.id)
        );


    return tarjeta;

}


/* =========================================================
   ELIMINAR PRODUCTO DEL CATÁLOGO
========================================================= */

function confirmarEliminarProducto(id) {

    const producto =
        catalogo.find(
            p => p.id === id
        );


    if (!producto) {

        return;

    }


    abrirConfirmacion(

        "Eliminar producto",

        `¿Quieres eliminar "${producto.nombre}" del catálogo?`,

        () => eliminarProductoCatalogo(id)

    );

}


/* =========================================================
   ELIMINAR PRODUCTO CATÁLOGO
========================================================= */

function eliminarProductoCatalogo(id) {

    const producto =
        catalogo.find(
            p => p.id === id
        );


    if (!producto) {

        return;

    }


    catalogo =
        catalogo.filter(
            p => p.id !== id
        );


    /*
     * IMPORTANTE:
     *
     * No eliminamos automáticamente el producto
     * de la lista de compra.
     *
     * La lista es independiente del catálogo.
     */

    guardarDatos();

    dibujarTodo();


    mostrarNotificacion(
        "Producto eliminado del catálogo",
        "exito"
    );

}


/* =========================================================
   DIBUJAR RESULTADOS PARA AÑADIR A COMPRA
========================================================= */

function dibujarResultadosCompra() {

    const texto =
        normalizarTexto(
            buscarCompra.value
        );


    resultadosCompraHTML.innerHTML = "";


    /*
     * Si no se está buscando nada,
     * no mostramos todo el catálogo.
     */

    if (!texto) {

        return;

    }


    const resultados =
        catalogo
            .filter(producto =>
                normalizarTexto(
                    producto.nombre
                ).includes(texto)
            )
            .sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es",
                    {
                        sensitivity: "base"
                    }
                )
            );


    if (resultados.length === 0) {

        resultadosCompraHTML.innerHTML = `

            <div class="sin-resultados">
                No se encontró ningún producto.
                <br>
                Puedes crearlo desde
                <strong>Productos</strong>.
            </div>

        `;

        return;

    }


    resultados.forEach(producto => {

        const yaEnCompra =
            listaCompra.find(
                item =>
                    item.productoId ===
                    producto.id
            );


        const cantidad =
            yaEnCompra
                ? yaEnCompra.cantidad
                : 0;


        const resultado =
            document.createElement("div");


        resultado.className =
            "resultado-producto";


        resultado.innerHTML = `

            <div class="resultado-info">

                <div class="resultado-nombre">
                    ${escaparHTML(producto.nombre)}
                </div>

                <div class="resultado-detalle">

                    ${escaparHTML(producto.categoria)}
                    ·
                    🏪 ${escaparHTML(producto.supermercado)}

                    ${
                        cantidad > 0
                            ? ` · En compra: ${cantidad}`
                            : ""
                    }

                </div>

            </div>


            <button
                type="button"
                class="btn btn-principal btn-anadir"
                aria-label="Añadir ${escaparHTML(producto.nombre)}"
                title="Añadir a la compra"
            >
                ＋
            </button>

        `;


        resultado
            .querySelector(".btn-anadir")
            .addEventListener(
                "click",
                () => {

                    añadirProductoCompra(
                        producto.id
                    );

                    dibujarResultadosCompra();

                }
            );


        resultadosCompraHTML.appendChild(
            resultado
        );

    });

}


/* =========================================================
   AÑADIR PRODUCTO A LA COMPRA
========================================================= */

function añadirProductoCompra(idProducto) {

    const producto =
        catalogo.find(
            p => p.id === idProducto
        );


    if (!producto) {

        mostrarNotificacion(
            "No se encontró el producto",
            "error"
        );

        return;

    }


    const existente =
        listaCompra.find(
            item =>
                item.productoId ===
                idProducto
        );


    if (existente) {

        existente.cantidad =
            normalizarCantidad(
                existente.cantidad
            ) + 1;


        /*
         * Si estaba comprado y lo vuelves a añadir,
         * vuelve a quedar pendiente.
         */

        existente.comprado =
            false;

    } else {

        listaCompra.push({

            id:
                generarId(),

            productoId:
                producto.id,

            nombre:
                producto.nombre,

            categoria:
                producto.categoria,

            supermercado:
                producto.supermercado,

            cantidad:
                1,

            preferente:
                false,

            comprado:
                false

        });

    }


    guardarDatos();

    dibujarListaCompra();

    actualizarContadores();


    mostrarNotificacion(
        `${producto.nombre} añadido a la compra`,
        "exito"
    );

}


/* =========================================================
   DIBUJAR LISTA DE COMPRA
========================================================= */

function dibujarListaCompra() {

    listaCompraHTML.innerHTML = "";


    /*
     * Preferentes primero.
     * Después pendientes.
     * Finalmente comprados.
     */

    const elementos =
        [...listaCompra].sort((a, b) => {

            if (
                a.preferente !==
                b.preferente
            ) {

                return a.preferente
                    ? -1
                    : 1;

            }


            if (
                a.comprado !==
                b.comprado
            ) {

                return a.comprado
                    ? 1
                    : -1;

            }


            return a.nombre.localeCompare(
                b.nombre,
                "es",
                {
                    sensitivity: "base"
                }
            );

        });


    elementos.forEach(item => {

        listaCompraHTML.appendChild(
            crearTarjetaCompra(item)
        );

    });


    if (listaCompra.length === 0) {

        compraVacia.style.display =
            "block";

        accionesCompra.style.display =
            "none";

    } else {

        compraVacia.style.display =
            "none";

        accionesCompra.style.display =
            "flex";

    }


    actualizarResumenCompra();

}


/* =========================================================
   CREAR TARJETA DE COMPRA
========================================================= */

function crearTarjetaCompra(item) {

    const tarjeta =
        document.createElement("div");


    tarjeta.className =
        "producto-card";


    if (item.comprado) {

        tarjeta.classList.add(
            "comprado"
        );

    }


    if (item.preferente) {

        tarjeta.classList.add(
            "preferente"
        );

    }


    tarjeta.dataset.id =
        item.id;


    tarjeta.innerHTML = `

        <div class="producto-icono">
            ${obtenerIconoCategoria(item.categoria)}
        </div>


        <div class="producto-info">

            <div class="producto-nombre">
                ${escaparHTML(item.nombre)}
            </div>


            <div class="producto-detalles">

                <span class="etiqueta">
                    ${escaparHTML(item.categoria)}
                </span>

                <span class="etiqueta etiqueta-supermercado">
                    🏪 ${escaparHTML(item.supermercado)}
                </span>

                ${
                    item.comprado
                        ? `
                            <span class="etiqueta">
                                ✓ Comprado
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="controles-cantidad">

                <button
                    type="button"
                    class="btn-cantidad btn-restar"
                    aria-label="Reducir cantidad"
                >
                    −
                </button>


                <div
                    class="cantidad"
                    aria-label="Cantidad"
                >
                    ${item.cantidad}
                </div>


                <button
                    type="button"
                    class="btn-cantidad btn-sumar"
                    aria-label="Aumentar cantidad"
                >
                    +
                </button>

            </div>

        </div>


        <div class="producto-controles">

            <button
                type="button"
                class="btn-icono btn-favorito ${
                    item.preferente
                        ? "activo"
                        : ""
                }"
                title="${
                    item.preferente
                        ? "Quitar de preferentes"
                        : "Marcar como preferente"
                }"
                aria-label="${
                    item.preferente
                        ? "Quitar de preferentes"
                        : "Marcar como preferente"
                }"
            >
                ${
                    item.preferente
                        ? "★"
                        : "☆"
                }
            </button>


            <button
                type="button"
                class="btn-icono btn-comprado ${
                    item.comprado
                        ? "activo"
                        : ""
                }"
                title="${
                    item.comprado
                        ? "Marcar como pendiente"
                        : "Marcar como comprado"
                }"
                aria-label="${
                    item.comprado
                        ? "Marcar como pendiente"
                        : "Marcar como comprado"
                }"
            >
                ${
                    item.comprado
                        ? "✓"
                        : "○"
                }
            </button>


            <button
                type="button"
                class="btn-icono btn-eliminar btn-eliminar-compra"
                title="Eliminar de la compra"
                aria-label="Eliminar de la compra"
            >
                🗑️
            </button>

        </div>

    `;


    /* ---------------------------------------------
       SUMAR
    --------------------------------------------- */

    tarjeta
        .querySelector(".btn-sumar")
        .addEventListener(
            "click",
            () => cambiarCantidad(
                item.id,
                1
            )
        );


    /* ---------------------------------------------
       RESTAR
    --------------------------------------------- */

    tarjeta
        .querySelector(".btn-restar")
        .addEventListener(
            "click",
            () => cambiarCantidad(
                item.id,
                -1
            )
        );


    /* ---------------------------------------------
       FAVORITO
    --------------------------------------------- */

    tarjeta
        .querySelector(".btn-favorito")
        .addEventListener(
            "click",
            () => cambiarPreferente(item.id)
        );


    /* ---------------------------------------------
       COMPRADO
    --------------------------------------------- */

    tarjeta
        .querySelector(".btn-comprado")
        .addEventListener(
            "click",
            () => cambiarComprado(item.id)
        );


    /* ---------------------------------------------
       ELIMINAR
    --------------------------------------------- */

    tarjeta
        .querySelector(".btn-eliminar-compra")
        .addEventListener(
            "click",
            () => eliminarProductoCompra(item.id)
        );


    return tarjeta;

}


/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */

function cambiarCantidad(id, cambio) {

    const item =
        listaCompra.find(
            producto =>
                producto.id === id
        );


    if (!item) {

        return;

    }


    const nuevaCantidad =
        normalizarCantidad(
            item.cantidad
        ) + cambio;


    if (nuevaCantidad < 1) {

        eliminarProductoCompra(id);

        return;

    }


    item.cantidad =
        nuevaCantidad;


    guardarDatos();

    dibujarListaCompra();

    actualizarContadores();

}


/* =========================================================
   CAMBIAR PREFERENTE
========================================================= */

function cambiarPreferente(id) {

    const item =
        listaCompra.find(
            producto =>
                producto.id === id
        );


    if (!item) {

        return;

    }


    item.preferente =
        !item.preferente;


    guardarDatos();

    dibujarListaCompra();

    actualizarContadores();


    mostrarNotificacion(
        item.preferente
            ? "Añadido a preferentes"
            : "Quitado de preferentes",
        "exito"
    );

}


/* =========================================================
   CAMBIAR COMPRADO
========================================================= */

function cambiarComprado(id) {

    const item =
        listaCompra.find(
            producto =>
                producto.id === id
        );


    if (!item) {

        return;

    }


    item.comprado =
        !item.comprado;


    guardarDatos();

    dibujarListaCompra();

    actualizarContadores();


    mostrarNotificacion(
        item.comprado
            ? "Producto marcado como comprado"
            : "Producto marcado como pendiente",
        "exito"
    );

}


/* =========================================================
   ELIMINAR PRODUCTO DE LA COMPRA
========================================================= */

function eliminarProductoCompra(id) {

    const item =
        listaCompra.find(
            producto =>
                producto.id === id
        );


    if (!item) {

        return;

    }


    listaCompra =
        listaCompra.filter(
            producto =>
                producto.id !== id
        );


    guardarDatos();

    dibujarListaCompra();

    dibujarResultadosCompra();

    actualizarContadores();


    mostrarNotificacion(
        "Producto eliminado de la compra",
        "exito"
    );

}


/* =========================================================
   MARCAR TODOS COMO COMPRADOS
========================================================= */

function marcarTodosComprados() {

    if (listaCompra.length === 0) {

        return;

    }


    const pendientes =
        listaCompra.filter(
            item =>
                !item.comprado
        );


    /*
     * Si hay pendientes, los marcamos todos.
     *
     * Si ya están todos comprados,
     * volvemos a ponerlos todos pendientes.
     */

    const marcarComoComprados =
        pendientes.length > 0;


    listaCompra.forEach(item => {

        item.comprado =
            marcarComoComprados;

    });


    guardarDatos();

    dibujarListaCompra();

    actualizarContadores();


    mostrarNotificacion(
        marcarComoComprados
            ? "Toda la compra está marcada como comprada"
            : "Toda la compra está pendiente",
        "exito"
    );

}


/* =========================================================
   CONFIRMAR VACIAR COMPRA
========================================================= */

function confirmarVaciarCompra() {

    if (listaCompra.length === 0) {

        return;

    }


    abrirConfirmacion(

        "Vaciar lista",

        "Se eliminarán todos los productos de la lista de compra. El catálogo no se eliminará.",

        vaciarListaCompra

    );

}


/* =========================================================
   VACIAR LISTA
========================================================= */

function vaciarListaCompra() {

    listaCompra = [];


    guardarDatos();

    dibujarTodo();


    mostrarNotificacion(
        "Lista de compra vaciada",
        "exito"
    );

}


/* =========================================================
   RESUMEN DE COMPRA
========================================================= */

function actualizarResumenCompra() {

    const total =
        listaCompra.length;


    const comprados =
        listaCompra.filter(
            item =>
                item.comprado
        ).length;


    const pendientes =
        total -
        comprados;


    if (total === 0) {

        resumenCompra.textContent =
            "0 productos";

        return;

    }


    let texto =
        total === 1
            ? "1 producto"
            : `${total} productos`;


    if (pendientes > 0) {

        texto +=
            ` · ${pendientes} pendientes`;

    }


    if (comprados > 0) {

        texto +=
            ` · ${comprados} comprados`;

    }


    resumenCompra.textContent =
        texto;

}


/* =========================================================
   ACTUALIZAR CONTADORES
========================================================= */

function actualizarContadores() {

    const pendientes =
        listaCompra.filter(
            item =>
                !item.comprado
        ).length;


    contadorCompra.textContent =
        pendientes > 0
            ? pendientes
            : "";


    actualizarResumenCompra();

}


/* =========================================================
   MODAL DE CONFIRMACIÓN
========================================================= */

function abrirConfirmacion(
    titulo,
    texto,
    accion
) {

    document
        .getElementById("tituloConfirmacion")
        .textContent =
        titulo;


    document
        .getElementById("textoConfirmacion")
        .textContent =
        texto;


    accionConfirmacion =
        accion;


    modalConfirmacion.classList.add(
        "visible"
    );


    modalConfirmacion.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CERRAR CONFIRMACIÓN
========================================================= */

function cerrarModalConfirmacion() {

    modalConfirmacion.classList.remove(
        "visible"
    );


    modalConfirmacion.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    accionConfirmacion =
        null;

}


/* =========================================================
   EJECUTAR CONFIRMACIÓN
========================================================= */

function ejecutarConfirmacion() {

    if (
        typeof accionConfirmacion ===
        "function"
    ) {

        const accion =
            accionConfirmacion;


        cerrarModalConfirmacion();


        accion();

    } else {

        cerrarModalConfirmacion();

    }

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTeclado(event) {

    if (event.key !== "Escape") {

        return;

    }


    if (
        modalProducto.classList.contains(
            "visible"
        )
    ) {

        cerrarModalProducto();

        return;

    }


    if (
        modalConfirmacion.classList.contains(
            "visible"
        )
    ) {

        cerrarModalConfirmacion();

    }

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacion(
    mensaje,
    tipo = "exito"
) {

    clearTimeout(
        temporizadorNotificacion
    );


    textoNotificacion.textContent =
        mensaje;


    notificacion.classList.remove(
        "exito",
        "error",
        "aviso"
    );


    notificacion.classList.add(
        tipo
    );


    if (tipo === "error") {

        iconoNotificacion.textContent =
            "×";

    } else if (tipo === "aviso") {

        iconoNotificacion.textContent =
            "⚠";

    } else {

        iconoNotificacion.textContent =
            "✓";

    }


    notificacion.classList.add(
        "visible"
    );


    temporizadorNotificacion =
        setTimeout(() => {

            notificacion.classList.remove(
                "visible"
            );

        }, 2500);

}


/* =========================================================
   ESTADO DE CONEXIÓN
========================================================= */

function actualizarEstadoConexion() {

    if (
        navigator.onLine
    ) {

        estadoConexion.classList.remove(
            "sin-conexion",
            "error"
        );


        textoConexion.textContent =
            "Guardado local";

    } else {

        estadoConexion.classList.remove(
            "error"
        );


        estadoConexion.classList.add(
            "sin-conexion"
        );


        textoConexion.textContent =
            "Sin conexión · Guardado local";

    }

}


/* =========================================================
   EXPORTACIÓN MANUAL DE DATOS
   Se deja preparada para pruebas.
========================================================= */

function exportarDatos() {

    const datos = {

        catalogo:
            catalogo,

        listaCompra:
            listaCompra,

        fechaExportacion:
            new Date().toISOString()

    };


    const contenido =
        JSON.stringify(
            datos,
            null,
            2
        );


    const blob =
        new Blob(
            [contenido],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const enlace =
        document.createElement("a");


    enlace.href =
        url;


    enlace.download =
        "mi-compra-backup.json";


    document.body.appendChild(
        enlace
    );


    enlace.click();


    enlace.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORTACIÓN MANUAL DE DATOS
   Se deja preparada para futuras copias de seguridad.
========================================================= */

function importarDatosDesdeArchivo(archivo) {

    if (!archivo) {

        return;

    }


    const lector =
        new FileReader();


    lector.onload = function(event) {

        try {

            const datos =
                JSON.parse(
                    event.target.result
                );


            if (
                !datos ||
                !Array.isArray(
                    datos.catalogo
                ) ||
                !Array.isArray(
                    datos.listaCompra
                )
            ) {

                throw new Error(
                    "Formato no válido"
                );

            }


            catalogo =
                datos.catalogo;

            listaCompra =
                datos.listaCompra;


            guardarDatos();

            dibujarTodo();


            mostrarNotificacion(
                "Datos importados correctamente",
                "exito"
            );


        } catch (error) {

            console.error(
                error
            );


            mostrarNotificacion(
                "El archivo no es válido",
                "error"
            );

        }

    };


    lector.readAsText(
        archivo
    );

}


/* =========================================================
   FUNCIONES DE PRUEBA / DEBUG
   Las dejamos disponibles desde la consola.
========================================================= */

window.miCompra = {

    obtenerCatalogo: function() {

        return catalogo;

    },


    obtenerLista: function() {

        return listaCompra;

    },


    guardar: function() {

        guardarDatos();

    },


    exportar: function() {

        exportarDatos();

    },


    borrarTodosLosDatos: function() {

        localStorage.removeItem(
            CLAVE_DATOS
        );


        catalogo = [];

        listaCompra = [];


        dibujarTodo();

        mostrarNotificacion(
            "Todos los datos locales han sido eliminados",
            "exito"
        );

    }

};


/* =========================================================
   FIN DEL JAVASCRIPT
========================================================= */