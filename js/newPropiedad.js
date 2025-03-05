//Variables
  const btnEnviar = document.querySelector('#añadir');

  let latitud;
  let longitud;

  //Declaración del mapa y control de capas
  let map;

  document.getElementById("mapaModal").addEventListener("shown.bs.modal", function () {
      setTimeout(() => {
          if (!map) {
              // Crear el mapa SOLO si no existe
              map = L.map("map").setView([40.416927, -3.703384], 5);
              
              let normalView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        
            let satelliteView = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 19,
                attribution: 'Tiles © Esri &mdash; Source: Esri, USGS, NOAA'
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
            };

            L.control.layers(baseMaps).addTo(map);

            //Icono propiedad
            let houseIcon = L.icon({
              iconUrl: '../src/casa (1).png',
              iconSize: [64, 64],       // Tamaño reducido
              iconAnchor: [32, 64],     // Mitad del ancho y base del ícono
              popupAnchor: [0, -64]     // Popup sobre el ícono
            });

            //Obtencion de propiedades y creado automatico de tarjetas
              //Obtencion de datos BD
              fetch('./../php/obtenerPropiedades.php')
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  createCards(data);
                })
                .catch(error => console.error('Error al obtener las propiedades: ', error));

            //Marcadores del mapa
              function createCards(propiedades) {

                console.log(propiedades);

                propiedades.forEach(propiedad => {

                  let status;
                  if (propiedad.disponibilidad === "1") {
                    status = `Disponible<i class="fa-solid fa-check" style="color: #4CAF50;"></i>`;
                  }
                  if (propiedad.disponibilidad === "0") {
                    status = `No Disponible<i class="fa-solid fa-x" style="color: #ff0000;"></i>`;
                  }

                  if (propiedad.latitud || propiedad.longitud != null) {
                    L.marker([`${propiedad.latitud}`, `${propiedad.longitud}`], { icon: houseIcon }).addTo(map).bindPopup(`<div class="tarjeta_propiedad"><img src="${propiedad.imagen}" width="100%" alt="${propiedad.nombre}"><p class="contenido"><b>${propiedad.nombre}</b><br><b>${propiedad.precio}€/Mes</b><br><b class="status">${status}</b></p></div>`);
                  } else {
                    console.error(`La propiedad ${propiedad.nombre} no tiene ubicacion definida`)
                  }
                });
              }

            const popup = L.popup();

            function onMapClick(e) {
              popup
                .setLatLng(e.latlng) // Configura la posición del popup
                .setContent(`Ubicacion Guardada ✅`) // Configura el contenido
                .openOn(map); // Muestra el popup en el mapa

                latitud = e.latlng.lat;
                longitud = e.latlng.lng;
                console.log(latitud, longitud);
                
            }

            map.on('click', onMapClick);
            
          } else {
              // Si ya existe, redibujar el mapa para que se vea bien
              map.invalidateSize();
          }
      }, 200); // Esperar un poco para evitar errores
  });

  btnEnviar.addEventListener('click', function(e){
    e.preventDefault;

    document.querySelector('#latitud').value = latitud;
    document.querySelector('#longitud').value = longitud;

    document.querySelector('#propiedadForm').submit();
  });

  