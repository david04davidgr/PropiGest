<?php 
include 'verificarSesion.php';
include 'conexion.php';

// Validación básica de campos obligatorios
$campos_obligatorios = ['nombre', 'tipo', 'precio', 'frecuencia', 'disponibilidad', 'direccion', 'ciudad', 'codigo_postal', 'latitud', 'longitud', 'tamaño', 'año_construccion'];

foreach ($campos_obligatorios as $campo) {
    if (!isset($_POST[$campo]) || $_POST[$campo] === '') {
        if($campo === 'latitud' || 'longitud'){
            die("Error: La ubicación es obligatoria.");
        }else{
            die("Error: El campo '$campo' es obligatorio.");
        }
    }
}

// Asignación de variables desde POST
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

$permitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Crear la carpeta si no existe
$directorio = '../uploads/imagenes/';
if (!is_dir($directorio)) {
    mkdir($directorio, 0777, true);
}

$rutas_imagenes = [];

if (isset($imagenes) && $imagenes['error'][0] == 0) {
    foreach ($imagenes['tmp_name'] as $key => $tmp_name) {
        // Validar tipo MIME
        $tipo_mime = mime_content_type($tmp_name);
        if (!in_array($tipo_mime, $permitidos)) {
            die("Error: El archivo '" . $imagenes['name'][$key] . "' no es una imagen válida.");
        }

        $nombre_imagen = basename($imagenes['name'][$key]);
        $ruta_destino = $directorio . $nombre_imagen;

        if (move_uploaded_file($tmp_name, $ruta_destino)) {
            $rutas_imagenes[] = '../uploads/imagenes/' . $nombre_imagen;
        }
    }
}

// Imagen por defecto si no se subieron válidas
if (empty($rutas_imagenes)) {
    $rutas_imagenes[] = '../uploads/imagenes/default.png';
}

$rutas_imagenes_str = implode(',', $rutas_imagenes);

$sql = "INSERT INTO propiedades 
        (imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion, idUsuario) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Error en prepare: " . $conn->error);
}

$stmt->bind_param("ssssdsdsssssiiisi", 
    $rutas_imagenes_str, $nombre, $direccion, $ciudad, $codigo_postal, $tipo, $latitud, $longitud, $precio, $frecuencia_pago, $disponibilidad, $tamanio, $habitaciones, $banios, $planta, $anioConstruccion, $_SESSION['usuario_id']
);

if ($stmt->execute()) {
    $id_propiedad = $conn->insert_id;
    header("Location: ../html/inicio.html");
    exit;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>