<?php

    include 'conexion.php';

    if (isset($_GET['id_propiedad'])) {
        $id = intval($_GET['id_propiedad']); // Seguridad: Convertir a número entero
    
        $stmt = $pdo->prepare("SELECT id, imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion FROM propiedades WHERE id = ?");
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


    // $sql = "id, imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion FROM propiedades WHERE id = 1";

    // $result = $conn->query($sql);

    // if (!$result) {
    //     echo json_encode(["error" => "Error en la consulta SQL: " . $conn->error]);
    //     exit();
    // }
    
    // $propiedades = [];

    // if ($result->num_rows != 0) {
    //     $propiedades = $result;
    // } else {
    //     $propiedades = ["error" => "No hay propiedades disponibles"];
    // }

    // echo $result;
    
    // //Conversion a JSON y envio
    // header('Content-Type: application/json');
    // echo json_encode($propiedades);

    // // Cerrar la conexión
    // $conn->close();

?>