<?php
include 'conexion.php'; // Conexión a la base de datos

// Consulta para obtener los usuarios
$sql = "SELECT * FROM usuarios";
$result = $conn->query($sql);

echo "<h1>Lista de Usuarios</h1>";
if ($result->num_rows > 0) {
    // Mostrar cada fila en una tabla
    echo "<table border='1' cellpadding='10'>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha Registro</th>
            </tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["id"] . "</td>
                <td>" . $row["nombre"] . "</td>
                <td>" . $row["apellidos"] . "</td>
                <td>" . $row["email"] . "</td>
                <td>" . $row["telefono"] . "</td>
                <td>" . $row["direccion"] . "</td>
                <td>" . $row["fecha_registro"] . "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "No hay usuarios registrados.";
}

$conn->close();
?>
