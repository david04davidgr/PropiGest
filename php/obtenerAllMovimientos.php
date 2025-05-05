<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("
        SELECT m.* 
        FROM movimientos m
        JOIN propiedades p ON m.idPropiedad = p.id
        WHERE p.idUsuario = ?
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $stmt->execute();
    $movimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($movimientos && count($movimientos) > 0) {
        echo json_encode($movimientos);
    } else {
        echo json_encode(["error" => "No hay movimientos disponibles para este usuario"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}

?>
