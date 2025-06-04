<?php
include 'verificarSesion.php';
require_once 'conexion.php';


$idMantenimiento = $_POST['id'];
$titulo = $_POST['titulo'];
$empresa = $_POST['empresa'];
$descripcion = $_POST['descripcion'];
$tipo = $_POST['tipo'];
$estado = $_POST['estado'];
$fechaProgramada = $_POST['fechaProgramada'];
$fechaRealizacion = $_POST['fechaRealizacion'];
$coste = $_POST['coste'];

$idDocumento = $_POST['idDocumento'] ?? null;
$rutaExistente = $_POST['ruta_existente'] ?? null;
$idPropiedad = $_POST['idPropiedad'] ?? null; // Lo necesitas para crear documento si no existe

// Procesar archivo nuevo si se subió
if (isset($_FILES['factura']) && $_FILES['factura']['error'] === UPLOAD_ERR_OK) {
    $nombreArchivo = $_FILES['factura']['name'];
    $rutaTemporal = $_FILES['factura']['tmp_name'];
    $rutaDestino = '../uploads/archivos/' . uniqid() . '_' . $nombreArchivo;

    if (move_uploaded_file($rutaTemporal, $rutaDestino)) {
        // Borrar el anterior si existe
        if ($rutaExistente && file_exists($rutaExistente)) {
            unlink($rutaExistente);
        }

        // Insertar o actualizar el documento
        if ($idDocumento) {
            $stmt = $conn->prepare("UPDATE documentos SET ruta = ?, subidoEn = NOW() WHERE id = ?");
            $stmt->bind_param("si", $rutaDestino, $idDocumento);
            $stmt->execute();
        } else {
            $tituloDocumento = "Factura de mantenimiento";
            $tipoDocumento = "factura";
            $stmt = $conn->prepare("INSERT INTO documentos (idPropiedad, titulo, ruta, tipo, subidoEn) VALUES (?, ?, ?, ?, NOW())");
            $stmt->bind_param("isss", $idPropiedad, $tituloDocumento, $rutaDestino, $tipoDocumento);
            $stmt->execute();
            $idDocumento = $conn->insert_id;
        }
    }
}

// Actualizar mantenimiento
$stmt = $conn->prepare("UPDATE mantenimientos SET titulo = ?, empresa = ?, descripcion = ?, tipo = ?, estado = ?, fechaProgramada = ?, fechaRealizacion = ?, coste = ?, idDocumento = ? WHERE id = ?");
$stmt->bind_param("sssssssidi", $titulo, $empresa, $descripcion, $tipo, $estado, $fechaProgramada, $fechaRealizacion, $coste, $idDocumento, $idMantenimiento);
$stmt->execute();
?>