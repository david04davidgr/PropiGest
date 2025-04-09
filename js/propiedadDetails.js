const title = document.querySelector('#title');
const carrusel = document.querySelector('#carrusel_imagenes');
const datosContainer = document.querySelector('#datosContainer');
const balanceButton = document.querySelector('#balanceButton');

function getQueryParam(param){
    const urlParams = new URLSearchParams(window.location.search);
    
    return urlParams.get(param);
}

//Obtencion de datos BD
let id = getQueryParam("id_propiedad");

if(id){
    fetch(`./../php/obtenerPropiedadById.php?id_propiedad=${id}`)
    .then(response => response.json())
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
                <div class="modal-body p-2">
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
    .then(response => response.json())
    
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
    .then(response => response.json())
    .then(data => {
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

balanceButton.addEventListener('click', function (){  
    
    datosContainer.innerHTML = '';
    
    datosContainer.innerHTML = `
                <div class="balanceContainer">
                    <div class="graficosContainer">
                        <canvas id="donutBalance"></canvas>
                        <canvas id="barrasVersus"></canvas>
                    </div>
                    <hr>
                    <div class="balanceButtons">
                        <button id="btnIngreso" class="btnIngreso"><i class="fa-solid fa-plus"></i> Ingreso</button>
                        <button id="btnGasto" class="btnGasto"><i class="fa-solid fa-minus"></i> Gasto</button>
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
                data: [5000,350],
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
                            color:'#f5f5f5',
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
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: [400, 500, 300, 700, 600, 800, 450, 620, 300, 500, 650, 700],
                    borderColor: 'rgba(75, 192, 192)',
                    backgroundColor: 'rgb(75, 192, 192, 0.5)',
                    borderWidth: 1
                },
                {
                    label: 'Gastos',
                    data: [300, 400, 350, 600, 500, 700, 400, 500, 250, 400, 550, 600],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1
                }
            ]
        };
        
        const configBarras = {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Bar Chart'
                }
              }
            },
        };
    
        new Chart(barrasBalance, configBarras);//Crea grafico de balance
})