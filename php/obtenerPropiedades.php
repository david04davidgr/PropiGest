<?php
include 'verificarSesion.php';

// Incluir archivo de conexión a la base de datos
include 'conexion.php';

$archivo_control = 'ultima_ejecucion.txt';
$ejecutar = false;

if (!file_exists($archivo_control)) {
    $ejecutar = true;
} else {
    $ultima = trim(file_get_contents($archivo_control)); // Ojo con los espacios en blanco
    $hoy = date('Y-m-d');
    if ($ultima !== $hoy) {
        $ejecutar = true;
    }
}

if ($ejecutar) {
    include 'actualizarDisponibilidad.php';
    file_put_contents($archivo_control, date('Y-m-d')); // Solo guardamos la fecha
    error_log("Actualización ejecutada: " . date('Y-m-d H:i:s') . "\n", 3, 'log_actualizacion.txt');
}

// Consulta SQL para obtener todas las propiedades
$sql = "SELECT id, imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion FROM propiedades where idUsuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['usuario_id']);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si la consulta es válida
if (!$result) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $conn->error]);
    exit();
}

$propiedades = [];

//Guardo todas las propiedades en el array de propiedades, si quiero solo por un id determinado tengo que modificar la consulta??
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()){
        $propiedades[] = $row;
    }

} else {
    $propiedades = ["error" => "No hay propiedades disponibles"];
}

//Conversion a JSON y envio
header('Content-Type: application/json');
echo json_encode($propiedades);

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
