<?php
// Incluir archivo de conexión a la base de datos
include 'conexion.php';

// Consulta SQL para obtener todas las propiedades
$sql = "SELECT id, imagenes, nombre, direccion, ciudad, codigo_postal, tipo, latitud, longitud, precio, frecuencia_pago, disponibilidad, tamanio, numeroHabitaciones, numeroBanios, planta, anioConstruccion FROM propiedades";
$result = $conn->query($sql);

// Verificar si la consulta es válida
if (!$result) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $conn->error]);
    exit();
}

$propiedades = [];

//Guardo todas las propiedades en el array de propiedades, si quiero solo por un id determinado tengo que modificar la consulta??
if ($result->num_rows > 0) {
    // // Mostrar las propiedades
    // while($row = $result->fetch_assoc()) {
    //     echo '<div class="propiedad">';
    //     echo '<h2>' . $row["id"] . '</h2>';
    //     echo '<img src="' . $row["imagen"] . '" alt="Imagen de propiedad">';
    //     echo '<h2>' . $row["nombre"] . '</h2>';
    //     echo '<h2>' . $row["direccion"] . '</h2>';
    //     echo '<p>Tipo: ' . $row["tipo"] . '</p>';
    //     echo '<h2>' . $row["latitud"] . '</h2>';
    //     echo '<h2>' . $row["longitud"] . '</h2>';
    //     echo '<p>Precio: ' . $row["precio"] . '€</p>';
    //     echo '<p>Superficie: ' . $row["tamaño"] . ' m²</p>';
    //     echo '<p>Habitaciones: ' . $row["numeroHabitaciones"] . '</p>';
    //     echo '<p>Habitaciones: ' . $row["numeroBanios"] . '</p>';
    //     echo '<p>Habitaciones: ' . $row["planta"] . '</p>';
    //     echo '<p>Descripción: ' . $row["anioConstruccion"] . '</p>';
    //     echo '</div>';
    //     echo(json_encode($row,JSON_FORCE_OBJECT));
    // }

    while ($row = $result->fetch_assoc()){
        $propiedades[] = $row;
    }

} else {
    $propiedades = ["error" => "No hay propiedades disponibles"];
}

//Conversion a JSON y envio
header('Content-Type: application/json');
echo json_encode($propiedades);

// Cerrar la conexión
$conn->close();
?>
