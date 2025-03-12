//Declaración del mapa y control de capas
const map = L.map('map', {
    zoomControl: false,
    dragging: false,      // Deshabilita el arrastre
    scrollWheelZoom: false,  // Deshabilita el zoom con la rueda del mouse
    doubleClickZoom: false,  // Deshabilita el zoom con doble clic
    touchZoom: false,    // Deshabilita el zoom táctil en móviles
    boxZoom: false,      // Deshabilita el zoom con caja
    keyboard: false      // Deshabilita la navegación con teclado
}).setView([39.464398, -6.37877], 14);

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

let marcardores = new Map();

//Funciones Mapa
L.control.layers(baseMaps).addTo(map);

map.on('click', onMapClick);
