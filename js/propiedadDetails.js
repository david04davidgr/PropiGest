const title = document.querySelector('#title');
const carrusel = document.querySelector('#carrusel_imagenes');
const datosContainer = document.querySelector('#datosContainer');
const balanceButton = document.querySelector('#balanceButton');
const reservaButton = document.querySelector('#reservaButton')

let totalIngresos = 0;
let totalGastos = 0;
let balance = 0;

function getQueryParam(param){
    const urlParams = new URLSearchParams(window.location.search);
    
    return urlParams.get(param);
}

//Verificacion de seguridad acceso
fetch('./../php/verificarSesion.php')
  .then(res => {
    if (res.status === 401) {
      window.location.href = '../index.html';
    }
  })
  .catch(err => {
    console.error('Error de sesión:', err);
    window.location.href = '../index.html';
  });

//Obtencion de datos BD
let id = getQueryParam("id_propiedad");

if(id){
    fetch(`./../php/obtenerPropiedadById.php?id_propiedad=${id}`)
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    
    .then(data => {
        propiedad = data;
        mostrarPropiedad(propiedad);
    })
    .catch(error => console.error('Error al obtener las propiedades: ',error));
}else{
    console.log('no se pasa el id, ', id);
}

function mostrarPropiedad(propiedad){

    console.log(propiedad.imagenes);
    
    let imagenes = propiedad.imagenes;
    imagenes = imagenes ? imagenes.split(',') : [];
    console.log(imagenes);
    
    title.innerHTML = '';
    title.innerHTML = `
        PropiGest - ${propiedad.nombre}
    `

    carrusel.innerHTML = '';

    datosContainer.innerHTML = '';

    let status;

    let imagenDefault = '../uploads/imagenes/default.png';

    if (imagenes.length === 0) {
        imagenes = [imagenDefault];
    }

    if (propiedad.disponibilidad == 1) {
        status = `<i class="fa-solid fa-check" style="color: #4CAF50;"></i><span style="color:#4CAF50"> Disponible</span>`;
        }
    if (propiedad.disponibilidad == 0) {
        status = `<i class="fa-solid fa-x" style="color: #ff0000;"></i><span style="color:#ff0000"> No Disponible</span>`;
    }

    // Crear el carrusel de imágenes
    let carruselHTML = '';
    imagenes.forEach((imagen, index) => {
        carruselHTML += `
            <div class="carousel-item carrusel_imagenes ${index === 0 ? 'active' : ''}">
                <img src="${imagen}" alt="Imagen ${propiedad.nombre}" class="img_carrusel">
            </div>
        `;
    });

    carrusel.innerHTML = `
        <head>
            <title>PropieGest - ${propiedad.nombre}</title>
        </head>
        <div id="carruselImagenes" class="carousel slide">
                <div class="carousel-inner">
                    ${carruselHTML}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carruselImagenes" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carruselImagenes" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
        </div>
    `;

    datosContainer.innerHTML=`
                <div class="datos">
                    <div class="izqd">
                        <div class="nombre_info">
                            <p>Nombre</p>
                            <h4>${propiedad.nombre}</h4>
                        </div>
                        <div class="tipo_info">
                            <p>Tipo</p>
                            <h4>${propiedad.tipo}</h4>
                        </div>
                    </div>
                    <div class="centro">
                        <div class="precio_info">
                            <p>Precio</p>
                            <h4>${propiedad.precio}€/${propiedad.frecuencia_pago}</h4>
                        </div>
                        <div class="tamanio_info">
                            <p>Tamaño (m2)</p>
                            <h4>${propiedad.tamanio} m2</h4>
                        </div>
                    </div>
                    <div class="drch">
                        <div class="dispo_info">
                            <p>Disponibilidad</p>
                            <h4>${status}</h4>
                        </div>
                        <div class="anio_info">
                            <p>Año Construcción</p>
                            <h4>${propiedad.anioConstruccion}</h4>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="datos">
                    <div class="izqd">
                        <div class="habitaciones_info">
                            <p>Habitaciones</p>
                            <h4>${propiedad.numeroHabitaciones}</h4>
                        </div>
                    </div>
                    <div class="centro">
                        <div class="banios_info">
                            <p>Baños</p>
                            <h4>${propiedad.numeroBanios}</h4>
                        </div>
                    </div>
                    <div class="drch">
                        <div class="plantas_info">
                            <p>Plantas</p>
                            <h4>${propiedad.planta}</h4>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="datos">
                    <div class="izqd">
                        <div class="direccion_info">
                            <p>Dirección</p>
                            <h4>${propiedad.direccion}</h4>
                        </div>
                    </div>
                    <div class="centro">
                        <div class="ciudad_info">
                            <p>Ciudad</p>
                            <h4>${propiedad.ciudad}</h4>
                        </div>
                    </div>
                    <div class="drch">
                        <div class="codPostal_info">
                            <p>Código Postal</p>
                            <h4>${propiedad.codigo_postal}</h4>
                        </div>
                    </div>
                </div>
                <div class="map_container">
                    <a href="vistaMapa.html?id_propiedad=${propiedad.id}" class="btn_container">
                        <button>Abrir Mapa</button>
                    </a>
                    <div id="map"></div>
                </div>
                <div class="botones">
                    <button 
                        class="editar"
                        class="editar"
                        data-bs-toggle="modal" 
                        onclick='openEditModal(${JSON.stringify(propiedad)})'
                        ><i class="fa-solid fa-square-pen" style="color: #ffffff;"></i> 
                        Editar
                    </button>
                    <button 
                        type="button"
                        class="eliminar" 
                        data-bs-toggle="modal" 
                        onclick="openDeleteModal(${propiedad.id})"
                        >
                        <i class="fa-solid fa-trash" style="color: #ff0000;"></i> 
                        Eliminar
                    </button>
                </div>
            </div>
            <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header py-2">
                    <h6 class="modal-title">Editar Propiedad</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-2 formEdicion">
                  <div class="row g-2 mb-3">
                    <div class="col-md-8">
                      <label for="nombre" class="form-label mb-1">Nombre</label>
                      <input type="text" id="editNombre" class="form-control" name="nombre" placeholder="Casa villaCerro" required>
                    </div>
                    <div class="col-md-4">
                      <label for="tipo" class="form-label mb-1">Tipo</label>
                      <select name="tipo" id="editTipo" class="form-select" required>
                        <option selected disabled value="">Seleccione un tipo</option>
                        <option value="Casa">Casa</option>
                        <option value="Piso">Piso</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Chalet">Chalet</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label for="precio" class="form-label mb-1">Precio</label>
                      <input type="number" class="form-control" id="editPrecio" name="precio" placeholder="----€" required>
                    </div>
                    <div class="col-md-4">
                      <label for="frecuencia" class="form-label mb-1">Frecuencia</label>
                      <select name="frecuencia" id="editFrecuencia_pago" class="form-select" required>
                      <option value="mes">Mes</option>
                        <option value="noche">Noche</option>
                        <option value="semana">Semana</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label for="disponibilidad" class="form-label mb-1">¿Disponible?</label>
                      <select name="disponibilidad" id="editDisponibilidad" class="form-select" required>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                  </div>
          
                  <hr class="my-2 border border-success border-1 opacity-50">

                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="direccion" class="form-label mb-1">Dirección</label>
                      <input type="text" class="form-control" id="editDireccion" name="direccion" required>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-8">
                      <label for="ciudad" class="form-label mb-1">Ciudad</label>
                      <input type="text" class="form-control" id="editCiudad" name="ciudad" required>
                    </div>
                    <div class="col-md-4">
                      <label for="codigo_postal" class="form-label mb-1">C.P.</label>
                      <input type="number" class="form-control" id="editCodigo_postal" name="codigo_postal" required>
                    </div>
                  </div>

                  <!--Añadir aqui el mapa para el cambio de latitud y longitud-->

                  <hr class="my-2 border border-success border-1 opacity-50">

                  <div class="row mb-3">
                    <!-- Tamaño y Planta -->
                    <div class="col-md-6">
                      <label for="tamaño" class="form-label mb-1">Tamaño (m²)</label>
                      <input type="number" class="form-control" id="editTamanio" name="tamaño" required>
                    </div>
                    <div class="col-md-6">
                      <label for="planta" class="form-label mb-1">Planta</label>
                      <input type="text" class="form-control" id="editPlanta" name="planta">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label for="habitaciones" class="form-label mb-1">Habitaciones</label>
                      <input type="number" class="form-control" id="editHabitaciones" name="habitaciones" min="0">
                    </div>
                    <div class="col-md-4">
                      <label for="baños" class="form-label mb-1">Baños</label>
                      <input type="number" class="form-control" id="editBanios" name="baños" min="0" >
                    </div>
                    <div class="col-md-4">
                      <label for="año_construccion" class="form-label mb-1">Año const.</label>
                      <input type="number" class="form-control" id="editAnio" name="año_construccion" min="1500" max="2100">
                    </div>
                  </div>

                </div>
                <div class="modal-footer py-1">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-sm btn-primary" id="btnSaveChanges">Guardar Cambios</button>
                </div>
                </div>
            </div>
            </div>
            <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header py-2">
                      <h6 class="modal-title">Confirmar eliminación</h6>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-2">
                        ¿Realmente desea eliminar esta propiedad?
                    </div>
                    <div class="modal-footer py-1">
                      <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                      <button type="button" class="btn btn-sm btn-danger" id="btnConfirm" data-bs-dismiss="modal" onclick="eliminarPropiedad(${propiedad.id})" >Confirmar</button>
                    </div>
                  </div>
                </div>
            </div>
    `;

    //Declaración del mapa y control de capas
    const map = L.map('map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,      // Deshabilita el zoom con caja
        keyboard: false      // Deshabilita la navegación con teclado
    }).setView([`${propiedad.latitud + 0.006}`, `${propiedad.longitud}`], 14);

    let normalView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    let satelliteView = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri &mdash; Source: Esri, USGS, NOAA'
    });
    
    // Capa de etiquetas (CartoDB Positron)
    var labelsView = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© CartoDB'
    });
    
    let hybridView = L.layerGroup([
        satelliteView, // Imágenes satelitales
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Labels © Esri &mdash; Source: Esri, HERE, Garmin'
        })
    ]);
    
    let baseMaps = {
        "Vista Predeterminada": normalView,
        "Vista Satélite": hybridView,
        "Vista Urbana": labelsView
    };
    
    //Icono propiedad
    var houseIcon = L.icon({
        iconUrl: '../src/casa (1).png',
        iconSize: [64, 64],       // Tamaño reducido
        iconAnchor: [32, 64],     // Mitad del ancho y base del ícono
        popupAnchor: [0, -64]     // Popup sobre el ícono
    });
        
    //Funciones Mapa
    L.control.layers(baseMaps).addTo(map);

    //Creado de marcador
    if (propiedad.latitud || propiedad.longitud != null) {
        let marcador = L.marker([`${propiedad.latitud}`, `${propiedad.longitud}`], { icon: houseIcon }).addTo(map).bindPopup(`<div class="tarjeta_propiedad"><img src="${imagenes[0]}" width="100%" alt="${propiedad.nombre}"><p class="contenido"><b>${propiedad.nombre}</b><br><b>${propiedad.precio}€/${propiedad.frecuencia_pago}</b><br><b class="status">${status}</b></p></div>`);
        
        marcador.openPopup();
    }else{
        console.error('No se ha podido generar correctamente el marcador');
    }
    
}

//Apertura del modal de confirmacion
function openDeleteModal(propiedad_id){    
    let modal = new bootstrap.Modal(document.getElementById('deleteModal'), {
        keyboard: false
    });
    modal.show();

    //En el click del boton usa la funcion
    document.getElementById('btnConfirm').onclick = function() {
        eliminarPropiedad(propiedad_id);
    };
}

//Funcion que elimina la propiedad por su id
function eliminarPropiedad(propiedad_id) {

    let formData = new FormData();
    formData.append("id_propiedad", propiedad_id) //Almacena el id como cuerpo de la solicitud

    fetch(`../php/eliminarPropiedad.php`, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    
    .then(data => {
        console.log(data);            
        
        if (data.success) {
            window.location.href = '../html/inicio.html';
        }
    })
    .catch(error => console.error("Error:", error));
}

function openEditModal(propiedad){
    console.log(propiedad);
    
    //Cambio de valores
    document.getElementById('editNombre').value = propiedad.nombre;
    document.getElementById('editTipo').value = propiedad.tipo;
    document.getElementById('editPrecio').value = propiedad.precio;
    document.getElementById('editFrecuencia_pago').value = propiedad.frecuencia_pago;
    document.getElementById('editDisponibilidad').value = propiedad.disponibilidad;
    document.getElementById('editDireccion').value = propiedad.direccion;
    document.getElementById('editCiudad').value = propiedad.ciudad;
    document.getElementById('editCodigo_postal').value = propiedad.codigo_postal;
    // document.getElementById('editLatitud').value = propiedad.latitud;
    // document.getElementById('editLongitud').value = propiedad.longitud;
    document.getElementById('editTamanio').value = propiedad.tamanio;
    document.getElementById('editPlanta').value = propiedad.planta;
    document.getElementById('editHabitaciones').value = propiedad.numeroHabitaciones;
    document.getElementById('editBanios').value = propiedad.numeroBanios;
    document.getElementById('editAnio').value = propiedad.anioConstruccion;

    //Abrir modal
    let modal = new bootstrap.Modal(document.getElementById('editModal'), {
        keyboard: false
    });
    modal.show();

    //Guardar
    document.getElementById('btnSaveChanges').onclick = function() {
        guardarCambios(propiedad.id);
        console.log('Voy a guardar');
        
    };
}

function guardarCambios(propiedad_id){
    //Obtener los datos del formulario
    const nombre = document.getElementById('editNombre').value;
    const tipo = document.getElementById('editTipo').value;
    const precio = document.getElementById('editPrecio').value;
    const frecuencia_pago = document.getElementById('editFrecuencia_pago').value;
    const disponibilidad = document.getElementById('editDisponibilidad').value;
    const direccion = document.getElementById('editDireccion').value;
    const ciudad = document.getElementById('editCiudad').value;
    const codigo_postal = document.getElementById('editCodigo_postal').value;
    // const latitud = document.getElementById('editLatitud').value;
    // const longitud = document.getElementById('editLongitud').value;
    const tamanio = document.getElementById('editTamanio').value;
    const planta = document.getElementById('editPlanta').value;
    const habitaciones = document.getElementById('editHabitaciones').value;
    const banios = document.getElementById('editBanios').value;
    const anioConstruccion = document.getElementById('editAnio').value;

    //seteo de valores en objeto
    const propiedadActualizada = {
        id: propiedad_id,
        nombre: nombre,
        tipo: tipo,
        precio: precio,
        frecuencia_pago: frecuencia_pago,
        disponibilidad: disponibilidad,
        direccion: direccion,
        ciudad: ciudad,
        codigo_postal: codigo_postal,
        // latitud: latitud,
        // longitud: longitud,
        tamanio: tamanio,
        planta: planta,
        numeroHabitaciones: habitaciones,
        numeroBanios: banios,
        anioConstruccion: anioConstruccion
    };

    //Envio de datos
    fetch('../php/editarPropiedad.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(propiedadActualizada)
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    .then(data => {
        if (data.success) {
            window.location.reload(); // Recargar la página para reflejar los cambios
        }
    })
    .catch(error => console.error("Error:", error));
}

//Funcion para esconder el menu con click fuera
document.addEventListener("click", function (event) {
    const menu = document.getElementById("circularMenu");
    const btn = document.querySelector(".floating-btn");

    // Si el menú está abierto y el clic NO es dentro del menú ni del botón, lo cierra
    if (menu.classList.contains("active") && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove("active");
    }
});

//Movimientos
function cargarMovimientos(id){
    if(id){
        fetch(`./../php/obtenerMovimientos.php?id_propiedad=${id}`)
        .then(response => {
            if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
                window.location.href = '../index.html';
                return;
            }
            return response.json();
        })
        .then(data => {
            movimientos = data;

            const mes = new Date().getMonth();
            let ingresosPorMes = Array(12).fill(0);
            let gastosPorMes = Array(12).fill(0);
            let balancePorMes = Array(12).fill(0)

                let cabeceraTabla = `
                <div class="tablaMovimientos">
                                <table class="table table-striped table-bordered">
                                    <thead class="cabeceraTabla">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Concepto</th>
                                        <th>Tipo</th> <!-- Ingreso o Gasto -->
                                        <th>Comentarios</th> <!-- Alquiler, mantenimiento, luz, etc -->
                                        <th>Importe (€)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                `
                
                let datosMovimientos = '';
                let tipo = '';
                let cantidad = '';

                if (movimientos.length > 0) {
                    movimientos.forEach(movimiento => {

                        if (movimiento.tipo.toLowerCase() == "ingreso") {
                            tipo = 'bg-success';
                            cantidad = `class="cantidadIngreso">`
                            ingresosPorMes[mes] += Number(movimiento.cantidad);
                            balancePorMes[mes] = ingresosPorMes[mes] - gastosPorMes[mes];
                        }else{
                            tipo = 'bg-danger';
                            cantidad = `class="cantidadGasto">-`
                            gastosPorMes[mes] += Number(movimiento.cantidad);
                            balancePorMes[mes] = ingresosPorMes[mes] - gastosPorMes[mes];
                        }

                        datosMovimientos += `
                            <tr>
                                <td>${movimiento.fecha}</td>
                                <td>${movimiento.concepto}</td>
                                <td><span class="badge ${tipo}">${movimiento.tipo}</span></td>
                                <td>${movimiento.comentarios}</td>
                                <td ${cantidad}${movimiento.cantidad}€</td>
                            </tr>
                        `
                    });
                }else{
                    datosMovimientos = `
                        <tr class="table-secondary fw-bold">
                            <td colspan="5" class="text-center">No hay movimientos todavia</td>
                        </tr>
                    `
                }

                let pieTabla = `
                                    </tbody>
                                </table>
                    </div>
                `;

                datosContainer.innerHTML = '';
            
                datosContainer.innerHTML = `
                            <div class="balanceContainer">
                                <div class="volverButton">
                                    <a href="propiedadDetails.html?id_propiedad=${id}"><i class="fa-solid fa-arrow-left" style="color: #4CAF50;"></i> Volver a detalles</a>
                                </div>
                                <div class="datosPrincipales">
                                    <div class="balance">
                                        <h4>Balance</h4>
                                        <p>${balancePorMes[mes]}€</p>
                                    </div>
                                    <div class="ingresos">
                                        <h4>Ingresos totales</h4>
                                        <p>+${ingresosPorMes[mes]}€</p>
                                    </div>
                                    <div class="gastos">
                                        <h4>Gastos totales</h4>
                                        <p>-${gastosPorMes[mes]}€</p>
                                    </div>
                                </div>
                                <div class="graficosContainer">
                                    <canvas id="donutBalance"></canvas>
                                    <canvas id="barrasVersus"></canvas>
                                </div>
                                <hr>
                                <div class="balanceButtons">
                                    <button id="btnIngreso" class="btnIngreso" data-bs-toggle="modal" 
                                    data-bs-target="#ingresoModal"><i class="fa-solid fa-plus"></i> Ingreso</button>
                                    <button id="btnGasto" class="btnGasto" data-bs-toggle="modal" 
                                    data-bs-target="#gastoModal"><i class="fa-solid fa-minus"></i> Gasto</button>
                                </div>
                                ${cabeceraTabla}
                                ${datosMovimientos}
                                ${pieTabla}
                            </div>
                            <div class="modal fade" id="ingresoModal" tabindex="-1" aria-hidden="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                    <div class="modal-header py-2">
                                        <h6 class="modal-title">Añadir ingreso</h6>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body p-2">
                                        <form id="addIngreso">
                                            <div class="mb-3">
                                                <label for="concepto" class="form-label">Concepto *</label>
                                                <input type="text" class="form-control" id="conceptoIngrs" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="cantidad" class="form-label">Cantidad (€)*</label>
                                                <input type="number" class="form-control" id="cantidadIngrs" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="comentarios" class="form-label">Comentarios</label>
                                                <input type="text" class="form-control" id="comentariosIngrs">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer py-1">
                                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal" onclick="guardarIngresos(${id})">+ Añadir</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="gastoModal" tabindex="-1" aria-hidden="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                    <div class="modal-header py-2">
                                        <h6 class="modal-title">Añadir gasto</h6>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body p-2">
                                        <form id="addGasto">
                                            <div class="mb-3">
                                                <label for="concepto" class="form-label">Concepto *</label>
                                                <input type="text" class="form-control" id="conceptoGasto" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="cantidad" class="form-label">Cantidad (€)*</label>
                                                <input type="number" class="form-control" id="cantidadGasto" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="comentarios" class="form-label">Comentarios</label>
                                                <input type="text" class="form-control" id="comentariosGasto">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer py-1">
                                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal" onclick="guardarGastos(${id})">- Añadir</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                `;
            
                //Grafico Balance
                let graficoBalance = document.querySelector('#donutBalance');
                const labelsBal = ['Ingresos', 'Gastos'];
                const colorsBal = ['#4caf50','rgb(255, 0, 0)'];
            
                const dataBal = {
                    labels: labelsBal,
                    datasets: [{
                        data: [ingresosPorMes[mes],gastosPorMes[mes]],
                        backgroundColor: colorsBal,
                    }]
                };
                
                const configBal = {
                    type: 'doughnut',
                    data: dataBal,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color:'#333',
                                    font:{
                                        size:14,
                                        weight: 'bold'
                                    }
                                }
                            }
                        }
                    }
                };
            
                new Chart(graficoBalance, configBal);//Crea grafico de balance
            
                //Grafico doble barras
            
                let barrasBalance = document.querySelector('#barrasVersus');
            
                
                const DATA_COUNT = 12;
                const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 1000};
            
                const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const dataBarras = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: ingresosPorMes,
                            borderColor: 'rgba(75, 192, 192)',
                            backgroundColor: 'rgb(75, 192, 192, 0.5)',
                            borderWidth: 1
                        },
                        {
                            label: 'Gastos',
                            data: gastosPorMes,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderWidth: 1
                        }
                    ]
                };
                
                const configBarras = {
                    type: 'bar',
                    data: dataBarras,
                    options: {
                    responsive: true,
                    plugins: {
                        legend: {
                        position: 'bottom',
                        },
                        title: {
                        display: true,
                        text: 'Balance Anual'
                        }
                    }
                    },
                };
            
                new Chart(barrasBalance, configBarras);//Crea grafico de balance
        })
    }
}

function guardarIngresos(id){
    const conceptoIngrs = document.querySelector('#conceptoIngrs').value;
    const cantidadIngrs = document.querySelector('#cantidadIngrs').value;
    const comentariosIngrs = document.querySelector('#comentariosIngrs').value;

    const ingreso = {
        idPropiedad: id,
        concepto: conceptoIngrs,
        cantidad: cantidadIngrs,
        tipo: 'Ingreso',
        comentarios: comentariosIngrs,
    }    

    //Envio de datos
    fetch('../php/guardarMovimientos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingreso)
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    .then(data => {
        if (data.success) {
            cargarMovimientos(id);
            conceptoIngrs = '';
            cantidadIngrs = '';
            comentariosIngrs = '';
        }
    })
    .catch(error => console.error("Error:", error));
}

function autoIngreso(id, concepto, cantidad){

    const autoIngreso = {
        idPropiedad: id,
        concepto: concepto,
        cantidad: cantidad,
        tipo: 'Ingreso',
        comentarios: '',
    }
    
    //Envio de datos
    fetch('../php/guardarMovimientos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(autoIngreso)
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })
    .catch(error => console.error("Error:", error));
}

function guardarGastos(id){
    const conceptoGasto = document.querySelector('#conceptoGasto').value;
    const cantidadGasto = document.querySelector('#cantidadGasto').value;
    const comentariosGasto = document.querySelector('#comentariosGasto').value;

    const gasto = {
        idPropiedad: id,
        concepto: conceptoGasto,
        cantidad: cantidadGasto,
        tipo: 'Gasto',
        comentarios: comentariosGasto,
    }
    
    //Envio de datos
    fetch('../php/guardarMovimientos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gasto)
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    .then(data => {
        if (data.success) {
            cargarMovimientos(id);
            conceptoGasto = '';
            cantidadGasto = '';
            comentariosGasto = '';
        }
    })
    .catch(error => console.error("Error:", error));
}

// Reservas
function cargarReservas(id){

    let reservas = [];
    let cabeceraTabla = '';
    let datosReservas = '';
    let pieTabla = '';

    datosContainer.innerHTML = '';
    
    if (id) {
        fetch(`./../php/obtenerReservas.php?id_propiedad=${id}`)
        .then(response => {
            if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
                window.location.href = '../index.html';
                return;
            }
            return response.json();
        })
        .then(data => {
            reservas = data  

            const eventosCalendario = reservas.map(reserva => {
                return {
                    title: `${reserva.nombreInquilino} ${reserva.apellidosInquilino}`,
                    start: reserva.fechaInicio,
                    end: reserva.fechaFin,
                    color: '#4CAF50', // Puedes personalizar el color según el tipo de reserva
                };
            });
            
            cabeceraTabla = `
                <div class="tablaReservas">
                                <table class="table table-striped table-bordered">
                                    <thead class="cabeceraTabla">
                                    <tr>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Nombre Inq.</th>
                                        <th>Apellidos Inq.</th>
                                        <th>Teléfono Inq.</th>
                                        <th>DNI Inq.</th>
                                        <th>Email Inq.</th>
                                        <th>Cobro</th>
                                        <th>Notas</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                `;        

                if (reservas.length > 0) {
                    console.log(reservas);
                    
                    reservas.forEach(reserva => {
                        console.log(reserva);
                        
                        datosReservas += `
                            <tr>
                                <td>${reserva.fechaInicio}</td>
                                <td>${reserva.fechaFin}</td>
                                <td>${reserva.nombreInquilino}</td>
                                <td>${reserva.apellidosInquilino}</td>
                                <td>${reserva.telefonoInquilino}</td>
                                <td>${reserva.dniInquilino}</td>
                                <td>${reserva.emailInquilino}</td>
                                <td class="cobro">${reserva.cobro}€</td>
                                <td>${reserva.notas}</td>
                            </tr>
                        `
                    });                    
                }else{
                    datosReservas = `
                        <tr class="table-secondary fw-bold">
                            <td colspan="9" class="text-center">No hay reservas todavia</td>
                        </tr>
                    `
                }
                
                pieTabla = `
                                    </tbody>
                                </table>
                    </div>
                `;

                datosContainer.innerHTML = `
                    <div class="reservasContainer">
                        <div class="volverButton">
                            <a href="propiedadDetails.html?id_propiedad=${id}"><i class="fa-solid fa-arrow-left" style="color: #4CAF50;"></i> Volver a detalles</a>
                        </div>
                        <div class="buttonContainer">
                            <button id="newReserva" class="newReserva" data-bs-toggle="modal" data-bs-target="#newReservaModal">+ Añadir Reserva</button>
                        </div>
                        <div class="calendarContainer">
                            <div id="calendar"></div>
                        </div>
                        <div class="modal fade" id="newReservaModal" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="modal-header py-2">
                                    <h6 class="modal-title">Añadir nueva reserva</h6>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body p-2">
                                    <div class="formReservaContainer">
                                        <form id="formReserva">
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="fechaIni" class="form-label mb-1">Fecha Inicio</label>
                                                    <input id="fechaIni" type="dateTime-local" class="form-control mb-1">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="fechaFin" class="form-label mb-1">Fecha Fin</label>
                                                    <input id="fechaFin" type="dateTime-local" class="form-control mb-1">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="cobro" class="form-label mb-1">A cobrar (€):</label>
                                                    <input id="cobro" type="number" class="form-control mb-1">
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="row mb-3">
                                                <div class="col-md-5">
                                                    <label for="nombreInquilino" class="form-label mb-1 mt-1">Nombre Inquilino</label>
                                                    <input type="text" id="nombreInquilino" class="form-control mb-1">
                                                </div>
                                                <div class="col-md-7">
                                                    <label for="apellidosInquilino" class="form-label mb-1 mt-1">Apellidos Inquilino</label>
                                                    <input type="text" id="apellidosInquilino" class="form-control mb-1">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="dniInquilino" class="form-label mb-1">DNI/NIE Inquilino</label>
                                                    <input type="text" id="dniInquilino" class="form-control mb-1">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="telefonoInquilino" class="form-label mb-1">Teléfono Inquilino</label>
                                                    <input type="tel" id="telefonoInquilino" class="form-control mb-1">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-12">
                                                    <label for="emailInquilino" class="form-label mb-1">Email Inquilino</label>
                                                    <input type="email" id="emailInquilino" class="form-control mb-1">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-12">
                                                    <label for="notas" class="form-label mb-1">Notas</label>
                                                    <textarea name="notas" id="notasReserva" class="form-control mb-1"></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="modal-footer py-1">
                                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" class="btn btn-sm btn-danger" id="btnConfirm" data-bs-dismiss="modal" onClick="guardarReserva(${id})">+ Añadir</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        ${cabeceraTabla}
                        ${datosReservas}
                        ${pieTabla}
                    </div>
                `;

                const calendarEl = document.getElementById('calendar');
            
                const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'esLocale',
                firstDay: 1,
                height: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                buttonText:{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Agenda'
                },
                selectable: true,
                editable: true,
                dayMaxEvents: true, // muestra un "+X más" si hay muchos eventos
                eventColor: '#378006', // color por defecto

                dateClick: function(info) {
                    alert('Fecha seleccionada: ' + info.dateStr);
                },
                eventClick: function(info) {
                    alert('Evento: ' + info.event.title);
                },
                events: eventosCalendario,  
                });
            
                calendar.render();
            })
        }
}

function guardarReserva(id){
    const fechaInicio = document.querySelector('#fechaIni').value;
    const fechaFin = document.querySelector('#fechaFin').value;
    const cobro = document.querySelector('#cobro').value;
    const nombreInquilino = document.querySelector('#nombreInquilino').value;
    const apellidosInquilino = document.querySelector('#apellidosInquilino').value;
    const dniInquilino = document.querySelector('#dniInquilino').value;
    const emailInquilino = document.querySelector('#emailInquilino').value;
    const telefonoInquilino = document.querySelector('#telefonoInquilino').value;
    const notas = document.querySelector('#notasReserva').value;

    const reserva = {
        idPropiedad: id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        cobro: cobro,
        nombreInquilino: nombreInquilino,
        apellidosInquilino: apellidosInquilino,
        dniInquilino: dniInquilino,
        telefonoInquilino: telefonoInquilino,
        emailInquilino: emailInquilino,
        notasReserva: notas,
    }

    let concepto = 'Reserva '+ nombreInquilino + ' ' + fechaInicio + '/' + fechaFin;
    
    //Envio de datos
    fetch('../php/guardarReservas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
    })
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })    .then(data => {
        if (data.success) {
            cargarReservas(id);
            autoIngreso(id, concepto, cobro);
            fechaInicio = '';
            fechaFin = '';
            cobro = '';
            nombreInquilino = '';
            apellidosInquilino = '';
            dniInquilino = '';
            emailInquilino = '';
            telefonoInquilino = '';
            notas = '';
        }
    })
    .catch(error => console.error("Error:", error));
}

//Llamadas menú
balanceButton.addEventListener('click', function (){  
    cargarMovimientos(id);
})

reservaButton.addEventListener('click', function (){  
    cargarReservas(id);
})
