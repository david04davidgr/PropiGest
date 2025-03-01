<?php
require 'conexion.php'; // Asegúrate de conectar a la BD

if (isset($_GET['id_propiedad'])) {
    $id = intval($_GET['id_propiedad']); // Seguridad: Convertir a número entero

    $stmt = $pdo->prepare("SELECT latitud, longitud FROM propiedades WHERE id = ?");
    $stmt->execute([$id]);
    $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($propiedad) {
        echo json_encode($propiedad);
    } else {
        echo json_encode(["error" => "Propiedad no encontrada"]);
    }
} else {
    echo json_encode(["error" => "ID no proporcionado"]);
}
?>