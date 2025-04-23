<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM movimientos ORDER BY fecha DESC");
    $stmt->execute();
    $movimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($movimientos && count($movimientos) > 0) {
        echo json_encode($movimientos);
    } else {
        echo json_encode(["error" => "No hay movimientos disponibles para esta propiedad"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}

?>
