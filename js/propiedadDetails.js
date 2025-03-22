
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
    const contenedor = document.querySelector('#info_container');

    contenedor.innerHTML = '';

    let status;

    let imagen = propiedad.imagenes ? propiedad.imagenes : '../uploads/imagenes/default.png';

    if (propiedad.disponibilidad == 1) {
        status = `Disponible <i class="fa-solid fa-check" style="color: #4CAF50;"></i>`;
        }
    if (propiedad.disponibilidad == 0) {
        status = `No Disponible <i class="fa-solid fa-x" style="color: #ff0000;"></i>`;
    }

    contenedor.innerHTML = `
        <div class="carrusel_imagenes">
                <img src="${imagen}" alt="Imagen ${propiedad.nombre}">
            </div>
            <div class="datos_container">
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
                    <button class="editar"><i class="fa-solid fa-square-pen" style="color: #ffffff;"></i> Editar</button>
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
            </div>
    `
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
        let marcador = L.marker([`${propiedad.latitud}`, `${propiedad.longitud}`], { icon: houseIcon }).addTo(map).bindPopup(`<div class="tarjeta_propiedad"><img src="${imagen}" width="100%" alt="${propiedad.nombre}"><p class="contenido"><b>${propiedad.nombre}</b><br><b>${propiedad.precio}€/${propiedad.frecuencia_pago}</b><br><b class="status">${status}</b></p></div>`);
        
        marcador.openPopup();
    }else{
        console.error('No se ha podido generar correctamente el marcador');
    }
    
}

//Apertura del modal de confirmacion
function openDeleteModal(propiedad_id){
    var modal = new bootstrap.Modal(document.getElementById('deleteModal'), {
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
            alert("Propiedad eliminada correctamente");
            window.location.href = '../html/inicio.html';
        } else {
            alert("Error al eliminar la propiedad")
        }
    })
    .catch(error => console.error("Error:", error));
}