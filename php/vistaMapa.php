<?php
include 'verificarSesion.php';
require 'conexion.php'; // Asegúrate de conectar a la BD

if (isset($_GET['id_propiedad']) && isset($_SESSION['usuario_id'])) {
    $id = intval($_GET['id_propiedad']); // Seguridad: Convertir a número entero
    $idUsuario = $_SESSION['usuario_id'];

    $stmt = $pdo->prepare("SELECT latitud, longitud FROM propiedades WHERE id = ? AND idUsuario = ?");
    $stmt->execute([$id, $idUsuario]);
    $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($propiedad) {
        echo json_encode($propiedad);
    } else {
        http_response_code(403);
        echo json_encode(["error" => "Propiedad no encontrada"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "ID no proporcionado"]);
}
?>