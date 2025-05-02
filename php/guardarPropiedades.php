<?php 
include 'verificarSesion.php';
include 'conexion.php';

$imagenes = $_FILES['imagenes'];
$nombre = $_POST['nombre'];
$tipo = $_POST['tipo'];
$precio = $_POST['precio'];
$frecuencia_pago = $_POST['frecuencia'];
$disponibilidad = $_POST['disponibilidad'];
$direccion = $_POST['direccion'];
$ciudad = $_POST['ciudad'];
$codigo_postal = $_POST['codigo_postal'];
$latitud = $_POST['latitud'];
$longitud = $_POST['longitud'];
$tamanio = $_POST['tamaño'];
$planta = $_POST['planta'];
$habitaciones = $_POST['habitaciones'];
$banios = $_POST['baños'];
$anioConstruccion = $_POST['año_construccion'];

// Crear la carpeta si no existe
$directorio = '../uploads/imagenes/';
if (!is_dir($directorio)) {
    mkdir($directorio, 0777, true);
}

$rutas_imagenes = [];  // Array para almacenar rutas de imágenes

if (isset($imagenes) && $imagenes['error'][0] == 0) {
    foreach ($imagenes['tmp_name'] as $key => $tmp_name) {
        $nombre_imagen = basename($imagenes['name'][$key]);
        $ruta_destino = $directorio . $nombre_imagen;

        // Mover la imagen a la carpeta "uploads"
        if (move_uploaded_file($tmp_name, $ruta_destino)) {
            $rutas_imagenes[] = '../uploads/imagenes/' . $nombre_imagen;
        }
    }
}

if (empty($rutas_imagenes)) {
    $rutas_imagenes[] = '../uploads/imagenes/default.png';
}

// Convertir el array de rutas a un string separado por comas (para almacenarlo en la BD)
$rutas_imagenes_str = implode(',', $rutas_imagenes);

$sql = "INSERT INTO propiedades 
        (imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion, idUsuario) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

// Ajustar el tipo de datos en el bind_param según la columna
$stmt->bind_param("ssssdsdsssssiiisi", 
    $rutas_imagenes_str, $nombre, $direccion, $ciudad, $codigo_postal, $tipo, $latitud, $longitud, $precio, $frecuencia_pago, $disponibilidad, $tamanio, $habitaciones, $banios, $planta, $anioConstruccion, $_SESSION['usuario_id']
);

if ($stmt->execute()) {
    $id_propiedad = $conn->insert_id;
    header("Location: ../html/vistaMapa.html?id_propiedad=". $id_propiedad);
} else {
    echo "Error: " . $stmt->error;
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>