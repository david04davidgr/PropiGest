<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header("Content-Type: application/json");

//Comprueba si se recibió la solicitud correctamente con el id
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['id_propiedad'])) {
    $id_propiedad = intval($_POST['id_propiedad']); //Convertir a entero para mayor seguridad

    try {
        $pdo->beginTransaction();

        //Obtiene imágenes de la propiedad
        $stmt = $pdo->prepare("SELECT imagenes FROM propiedades WHERE id = ?");
        $stmt->execute([$id_propiedad]);
        $imagenes = $stmt->fetch(PDO::FETCH_ASSOC);

        //Comprueba si hay imagenes
        if ($imagenes && !empty($imagenes['imagenes'])) {
            $listaImagenes = explode(",", $imagenes['imagenes']);

            //Eliminar imágenes de la carpeta
            foreach ($listaImagenes as $imagen) {
                $nombreArchivo = basename(trim($imagen)); // Solo el nombre del archivo
                if ($nombreArchivo === 'default.png') {
                    continue; // No eliminar la imagen por defecto
                }

                $rutaCompleta = "../uploads/" . $nombreArchivo;
                if (file_exists($rutaCompleta)) {
                    unlink($rutaCompleta);
                }
            }
        }

        //Eliminar la propiedad de la base de datos
        $stmt = $pdo->prepare("DELETE FROM propiedades WHERE id = ?");
        $stmt->execute([$id_propiedad]);

        $pdo->commit(); //Confirmar cambios

        echo json_encode(["success" => true, "message" => "Propiedad eliminada correctamente"]);
    } catch (Exception $e) {
        $pdo->rollBack(); //Revertir cambios si hay error
        echo json_encode(["success" => false, "message" => "Error al eliminar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Solicitud no válida"]);
}
?>
