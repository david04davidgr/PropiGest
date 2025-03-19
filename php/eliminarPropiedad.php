<?php

require_once 'conexion.php';

    if (isset($_GET['id_propiedad'])) {
        $id_propiedad = intval($_GET['id_propiedad']); // Seguridad: Convertir a número entero

        
        try{
            echo $id_propiedad;
            $pdo->beginTransaction(); // Iniciar transacción para evitar errores de integridad referencial

            // Obtener imágenes asociadas
            $stmt = $pdo->prepare("SELECT imagenes FROM propiedades WHERE id = ?");
            $stmt->execute([$id_propiedad]);
            $imagenes = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
            // Eliminar imágenes de la carpeta
            foreach ($imagenes as $imagen) {
                $rutaCompleta = "../uploads/" . $imagen;
                if (file_exists($rutaCompleta)) {
                    unlink($rutaCompleta);
                }
            } 

            // Eliminar la propiedad
            $stmt = $pdo->prepare("DELETE FROM propiedades WHERE id = ?");
            $stmt->execute([$id_propiedad]);

            $pdo->commit(); // Confirmar cambios en la base de datos

            echo json_encode(["success" => true, "message" => "Propiedad eliminada correctamente"]);
        } catch (Exception $e){
            $pdo->rollBack();
            echo json_encode(["success" => false, "message" => "Error al eliminar: " . $e->getMessage()]);
        }
    }
    else{
        echo json_encode(["success" => false, "message" => "Solicitud no válida"]);
    }
?>