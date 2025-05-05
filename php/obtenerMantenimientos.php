<?php
include 'verificarSesion.php';

// Incluir archivo de conexión a la base de datos
include 'conexion.php';

if (isset($_GET['id_propiedad'])) {
    $id = intval($_GET['id_propiedad']);

    try {
        $stmt = $pdo->prepare("SELECT m.*, d.ruta AS rutaDocumento, d.titulo AS tituloDocumento, d.tipo AS tipoDocumento FROM mantenimientos m LEFT JOIN documentos d ON m.idDocumento = d.id WHERE m.idPropiedad = ? ORDER BY m.creadoEn DESC");
        $stmt->execute([$id]);
        $mantenimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($mantenimientos && count($mantenimientos) > 0) {
            echo json_encode($mantenimientos);
        } else {
            echo json_encode(["error" => "No hay movimientos disponibles para esta propiedad"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["error" => "ID no proporcionado"]);
}
?>
