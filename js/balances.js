let graficasContainer = document.getElementById('graficasContainer');
let infoContainer = document.getElementById('infoContainer');

function cargarMovimientos(){
    fetch(`./../php/obtenerAllMovimientos.php`)
        .then(response => {
            if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
                window.location.href = '../index.html';
                return;
            }
            return response.json();
        })
        .then(data =>{
            let movimientos = data;
            console.log(movimientos);

            const mesPalabra = new Date().toLocaleString('es-ES', { month: 'long' });
            const mes = new Date().getMonth();
            let ingresosPorMes = Array(12).fill(0);
            let gastosPorMes = Array(12).fill(0);
            let balancePorMes = Array(12).fill(0)

            let tipo = '';
            let cantidad = '';

            let datosMovimientos = '';

            if (movimientos.length > 0) {
                movimientos.forEach(movimiento => {

                    if (movimiento.tipo.toLowerCase() == "ingreso") {
                        tipo = 'bg-success';
                        cantidad = `class="cantidadIngreso">`
                        ingresosPorMes[mes] += Number(movimiento.cantidad);
                        balancePorMes[mes] = ingresosPorMes[mes] - gastosPorMes[mes];
                    }else{
                        tipo = 'bg-danger';
                        cantidad = `class="cantidadGasto">-`
                        gastosPorMes[mes] += Number(movimiento.cantidad);
                        balancePorMes[mes] = ingresosPorMes[mes] - gastosPorMes[mes];
                    }

                    datosMovimientos += `
                        <tr>
                            <td>${movimiento.fecha}</td>
                            <td>${movimiento.concepto}</td>
                            <td><span class="badge ${tipo}">${movimiento.tipo}</span></td>
                            <td>${movimiento.comentarios}</td>
                            <td ${cantidad}${movimiento.cantidad}€</td>
                        </tr>

                    `
                    //DATATABLE
                    //  $(document).ready(function() {
                    //     $('#tablaMovimientos').DataTable({
                    //     destroy: true,
                    //     pageLength: 5,
                    //     lengthMenu: [5, 10, 20],
                    //     language: {
                    //     url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
                    //     }
                    //     });
                    // });
                });
                
                graficasContainer.innerHTML = '';
                
                graficasContainer.innerHTML = `
                <div class="graficoDonut">
                    <canvas id="donutBalance"></canvas>
                    <div class="infoBalance">
                        <div class="ingresos" id="ingresos">
                            <p>${ingresosPorMes[mes]}€</p>
                            <h2>Ingresos</h2>
                        </div>
                        <div class="gastos" id="gastos">
                            <p>${gastosPorMes[mes]}€</p>
                            <h2>Gastos</h2>
                        </div>
                    </div>
                </div>
                <div class="graficoBarras">
                    <canvas id="barrasVersus"></canvas>
                </div>
                `;

                //Grafico Balance
                let graficoBalance = document.querySelector('#donutBalance');
                const labelsBal = ['Ingresos', 'Gastos'];
                const colorsBal = ['#4caf50','rgb(255, 0, 0)'];
            
                const dataBal = {
                    labels: labelsBal,
                    datasets: [{
                        data: [ingresosPorMes[mes],gastosPorMes[mes]],
                        backgroundColor: colorsBal,
                    }]
                };
                
                const configBal = {
                    type: 'doughnut',
                    data: dataBal,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color:'#f5f5f5',
                                    font:{
                                        size:12,
                                    }
                                }
                            },
                            title: {
                                display: true,
                                position: 'bottom',
                                text: `${mesPalabra.toLocaleUpperCase()}`,
                                color: '#4CAF50',
                                font: {
                                    size: 13
                                }
                            }
                        }
                    }
                };
            

                //Grafico doble barras
                let barrasBalance = document.querySelector('#barrasVersus');
            
                
                const DATA_COUNT = 12;
                const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 1000};
            
                const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const dataBarras = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: ingresosPorMes,
                            borderColor: 'rgba(75, 192, 192)',
                            backgroundColor: 'rgb(75, 192, 192, 0.5)',
                            borderWidth: 1
                        },
                        {
                            label: 'Gastos',
                            data: gastosPorMes,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderWidth: 1
                        }
                    ]
                };
                
                const configBarras = {
                    type: 'bar',
                    data: dataBarras,
                    options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color:'#f5f5f5',
                                font:{
                                    size:12,
                                }
                            }
                        },
                        title: {
                            display: true,
                            position: 'bottom',
                            text: 'Balance Anual',
                            color: '#4CAF50',
                            font: {
                                size: 15
                            }
                        }
                    },
                    scales:{
                        x:{
                            ticks:{
                                color:'#f5f5f5',
                                font: {
                                    size: 15
                                }
                            }
                        },
                        y:{
                            ticks:{
                                color:'#f5f5f5'
                            }
                        },
                    }
                    },
                };

                new Chart(graficoBalance, configBal);//Crea grafico de balance
                new Chart(barrasBalance, configBarras);//Crea grafico de balance    
            }else{
                // graficasContainer.innerHTML = '';
                // graficasContainer.innerHTML = `
                    
                // `

                datosMovimientos = `
                    <tr class="table-secondary fw-bold">
                    <td colspan="6" class="text-center">No hay movimientos todavia</td>
                    </tr>
                `
            }

            

            let cabeceraTabla = `
                <table id="tablaMovimientos" class="tablaMovimientos table table-striped table-bordered">
                    <thead class="cabeceraTabla">
                    <tr>
                        <th>Fecha</th>
                        <th>Concepto</th>
                        <th>Tipo</th>
                        <th>Comentarios</th>
                        <th>Importe (€)</th>
                    </tr>
                    </thead>
                    <tbody>
            `;

            let pieTabla = `
                                </tbody>
                            </table>
                </div>
            `;
        
            infoContainer.innerHTML = '';

                infoContainer.innerHTML = `
                    <div class="datosPrincipales">
                        <div class="balance">
                            <h4>Balance</h4>
                            <p>${balancePorMes[mes].toFixed(2)}€</p>
                        </div>
                        <div class="ingresos">
                            <h4>Ingresos totales</h4>
                            <p>+${ingresosPorMes[mes].toFixed(2)}€</p>
                        </div>
                        <div class="gastos">
                            <h4>Gastos totales</h4>
                            <p>-${gastosPorMes[mes].toFixed(2)}€</p>
                        </div>
                    </div>
                    <div class="tablaContainer">
                    ${cabeceraTabla}
                    ${datosMovimientos}
                    ${pieTabla}
                    </div>
                `

                            // <div class="balanceContainer">
                            //     <div class="volverButton">
                            //     <a href="propiedadDetails.html?id_propiedad=${idPropiedad}"><i class="fa-solid fa-arrow-left" style="color: #4CAF50;"></i> Volver a detalles</a>
                            //     </div>
                            //     
                            //     <div class="graficosContainer">
                            //         <canvas id="donutBalance"></canvas>
                            //         <canvas id="barrasVersus"></canvas>
                            //     </div>
                            //     <hr>
                            //     <div class="balanceButtons">
                            //         <button id="btnIngreso" class="btnIngreso" data-bs-toggle="modal" 
                            //         data-bs-target="#ingresoModal"><i class="fa-solid fa-plus"></i> Ingreso</button>
                            //         <button id="btnGasto" class="btnGasto" data-bs-toggle="modal" 
                            //         data-bs-target="#gastoModal"><i class="fa-solid fa-minus"></i> Gasto</button>
                            //     </div>
                            //     
                            // </div>
                            // <div class="modal fade" id="ingresoModal" tabindex="-1" aria-hidden="false">
                            //     <div class="modal-dialog">
                            //         <div class="modal-content">
                            //         <div class="modal-header py-2">
                            //             <h6 class="modal-title">Añadir ingreso</h6>
                            //             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            //         </div>
                            //         <div class="modal-body p-2">
                            //             <form id="addIngreso">
                            //                 <div class="mb-3">
                            //                     <label for="concepto" class="form-label">Concepto *</label>
                            //                     <input type="text" class="form-control" id="conceptoIngrs" required>
                            //                 </div>
                            //                 <div class="mb-3">
                            //                     <label for="cantidad" class="form-label">Cantidad (€)*</label>
                            //                     <input type="number" class="form-control" id="cantidadIngrs" required>
                            //                 </div>
                            //                 <div class="mb-3">
                            //                     <label for="comentarios" class="form-label">Comentarios</label>
                            //                     <input type="text" class="form-control" id="comentariosIngrs">
                            //                 </div>
                            //             </form>
                            //         </div>
                            //         <div class="modal-footer py-1">
                            //             <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            //             <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal" onclick="guardarIngresos(${idPropiedad})">+ Añadir</button>
                            //         </div>
                            //         </div>
                            //     </div>
                            // </div>
                            // <div class="modal fade" id="gastoModal" tabindex="-1" aria-hidden="false">
                            //     <div class="modal-dialog">
                            //         <div class="modal-content">
                            //         <div class="modal-header py-2">
                            //             <h6 class="modal-title">Añadir gasto</h6>
                            //             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            //         </div>
                            //         <div class="modal-body p-2">
                            //             <form id="addGasto">
                            //                 <div class="mb-3">
                            //                     <label for="concepto" class="form-label">Concepto *</label>
                            //                     <input type="text" class="form-control" id="conceptoGasto" required>
                            //                 </div>
                            //                 <div class="mb-3">
                            //                     <label for="cantidad" class="form-label">Cantidad (€)*</label>
                            //                     <input type="number" class="form-control" id="cantidadGasto" required>
                            //                 </div>
                            //                 <div class="mb-3">
                            //                     <label for="comentarios" class="form-label">Comentarios</label>
                            //                     <input type="text" class="form-control" id="comentariosGasto">
                            //                 </div>
                            //             </form>
                            //         </div>
                            //         <div class="modal-footer py-1">
                            //             <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            //             <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal" onclick="guardarGastos(${idPropiedad})">- Añadir</button>
                            //         </div>
                            //         </div>
                            //     </div>
                            // </div>
                            // <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                            // <div class="modal-dialog">
                            //     <div class="modal-content">
                            //         <div class="modal-header py-2">
                            //         <h6 class="modal-title">Confirmar eliminación</h6>
                            //         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            //         </div>
                            //         <div class="modal-body p-2">
                            //             ¿Realmente desea eliminar este movimiento?
                            //         </div>
                            //         <div class="modal-footer py-1">
                            //         <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                            //         <button type="button" class="btn btn-sm btn-danger" id="deleteMovimiento" data-bs-dismiss="modal">Confirmar</button>
                            //         </div>
                            //     </div>
                            //     </div>
                            // </div>
                            // <div class="modal fade" id="editMovimientoModal" tabindex="-1" aria-hidden="true">
                            //     <div class="modal-dialog">
                            //         <div class="modal-content">
                            //         <div class="modal-header py-2">
                            //             <h6 class="modal-title">Editar Movimiento</h6>
                            //             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            //         </div>
                            //         <div class="modal-body p-2 formEdicion">
                            //         <div class="row g-2 mb-3">
                            //             <div class="col-md-12">
                            //                 <label for="concepto" class="form-label mb-1">Concepto</label>
                            //                 <input type="text" id="editConcepto" class="form-control" name="nombre" placeholder="Casa villaCerro" required>
                            //             </div>
                            //         </div>
                            //         <div class="row mb-3">
                            //             <div class="col-md-6">
                            //             <label for="tipoMovimiento" class="form-label mb-1">Tipo</label>
                            //             <select name="tipo" id="editTipoMovimiento" class="form-select" required>
                            //                 <option value="Gasto">Gasto</option>
                            //                 <option value="Ingreso">Ingreso</option>
                            //             </select>
                            //             </div>
                            //             <div class="col-md-6">
                            //                 <label for="cantidadMovimiento" class="form-label mb-1">Cantidad</label>
                            //                 <input type="number" class="form-control" id="editCantidadMovimiento" name="cantidadMovimiento" placeholder="----€" required>
                            //             </div>
                            //         </div>
                            
                            //         <hr class="my-1 border border-success border-1 opacity-50">

                            //         <div class="row mb-3">
                            //             <div class="col-12">
                            //             <label for="comentario" class="form-label mb-1">Comentarios</label>
                            //             <input type="text" class="form-control" id="editComentario" name="comentario" required>
                            //             </div>
                            //         </div>
                            //         <div class="modal-footer py-1">
                            //             <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                            //             <button type="button" class="btn btn-sm btn-primary" id="btnSaveMovimientoChanges">Guardar Cambios</button>
                            //         </div>
                            //         </div>
                            //     </div>
                            // </div>
        })
}

cargarMovimientos();