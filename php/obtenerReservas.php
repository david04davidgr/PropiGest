<?php
include 'verificarSesion.php';

// Incluir archivo de conexión a la base de datos
include 'conexion.php';

if (isset($_GET['id_propiedad'])) {
    $id = intval($_GET['id_propiedad']);

    try {
        $stmt = $pdo->prepare("SELECT * FROM reservas WHERE idPropiedad = ? ORDER BY fechaInicio DESC");
        $stmt->execute([$id]);
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($reservas && count($reservas) > 0) {
            echo json_encode($reservas);
        } else {
            echo json_encode($reservas);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["error" => "ID no proporcionado"]);
}
?>
