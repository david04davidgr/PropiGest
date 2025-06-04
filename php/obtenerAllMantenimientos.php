<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    // Obtener todos los mantenimientos de las propiedades del usuario logueado
    $stmt = $pdo->prepare("
        SELECT m.*, 
               d.ruta AS rutaDocumento, 
               d.titulo AS tituloDocumento, 
               d.tipo AS tipoDocumento,
               p.nombre AS nombrePropiedad
        FROM mantenimientos m
        LEFT JOIN documentos d ON m.idDocumento = d.id
        INNER JOIN propiedades p ON m.idPropiedad = p.id
        WHERE p.idUsuario = ?
        ORDER BY m.creadoEn DESC
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $mantenimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($mantenimientos && count($mantenimientos) > 0) {
        echo json_encode($mantenimientos);
    } else {
        echo json_encode(["error" => "No hay mantenimientos disponibles para este usuario"]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}
?>