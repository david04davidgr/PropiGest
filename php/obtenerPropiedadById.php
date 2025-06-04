<?php
include 'verificarSesion.php';
include 'conexion.php';

if (isset($_GET['id_propiedad']) && isset($_SESSION['usuario_id'])) {
    $idPropiedad = intval($_GET['id_propiedad']);
    $idUsuario = $_SESSION['usuario_id'];

    $stmt = $pdo->prepare("SELECT id, imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion
                           FROM propiedades
                           WHERE id = ? AND idUsuario = ?");
    $stmt->execute([$idPropiedad, $idUsuario]);
    $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($propiedad) {
        echo json_encode($propiedad);
    } else {
        http_response_code(403);
        echo json_encode(["error" => "Propiedad no encontrada"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "ID de propiedad o sesión no válida."]);
}
?>