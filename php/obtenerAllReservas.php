<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM reservas ORDER BY fechaInicio DESC");
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($reservas && count($reservas) > 0) {
        echo json_encode($reservas);
    } else {
        echo json_encode($reservas);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}

?>
