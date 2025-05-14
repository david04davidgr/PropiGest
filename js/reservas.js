const infoContainer = document.querySelector('#infoContainer'); 

fetch('./../php/obtenerPropiedades.php')
.then(response => {
    if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
        window.location.href = '../index.html';
        return;
    }
    return response.json();
})
.then(data => {
    console.log(data);
    mostrarPropiedades(data);
    mostarTotalPropiedades(data);
})
.catch(error => console.error('Error al obtener las propiedades: ',error));


fetch('./../php/obtenerAllReservas.php')
    .then(response => {
        if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
            window.location.href = '../index.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        reservas = data;

        let reservasPorMes = Array(12).fill(0);

        if (reservas.length > 0) {
            reservas.forEach(reserva => {
                const fecha = new Date(reserva.fechaInicio);
                const mes = fecha.getMonth();
                reservasPorMes[mes]++;
            });
        }
        
        //Grafico actividad de propiedades
        let graficoActividad = document.querySelector('#graphActividad');

        const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const dataReservas = {
            labels: labels,
            datasets: [{
                label: 'Número de Reservas',
                data: reservasPorMes,
                fill: false,
                borderColor: '#4caf50',
                tension:0.1
            }]
        };

        const config = {
            type: 'line',
            data: dataReservas,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                        }
                    },
                    tooltip: {
                        titleColor: '#f5f5f5',
                        bodyColor: '#333',
                        backgroundColor: '#4caf50',
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'white'
                        }
                    }
                }
            }
        };

        new Chart(graficoActividad, config);//Crea grafico de reservas

        reservas = data;

        let cabeceraTabla = '';
        let datosReservas = '';
        let pieTabla = '';

            const eventosCalendario = reservas.map(reserva => {
                return {
                    title: `${reserva.nombre} - ${reserva.nombreInquilino} ${reserva.apellidosInquilino}`,
                    start: reserva.fechaInicio,
                    end: reserva.fechaFin,
                    color: '#4CAF50',
                };
            });
            
            cabeceraTabla = `
                <div class="tablaReservas">
                                <table class="table table-striped table-bordered" id="tablaReservas">
                                    <thead class="cabeceraTabla">
                                    <tr>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Nombre Inq.</th>
                                        <th>Apellidos Inq.</th>
                                        <th>Teléfono Inq.</th>
                                        <th>DNI Inq.</th>
                                        <th>Email Inq.</th>
                                        <th>Cobro</th>
                                        <th>Notas</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                `;        

                if (reservas.length > 0) {
                    console.log(reservas);
                    
                    reservas.forEach(reserva => {
                        console.log(reserva);
                        
                        datosReservas += `
                            <tr>
                                <td>${reserva.fechaInicio}</td>
                                <td>${reserva.fechaFin}</td>
                                <td>${reserva.nombreInquilino}</td>
                                <td>${reserva.apellidosInquilino}</td>
                                <td>${reserva.telefonoInquilino}</td>
                                <td>${reserva.dniInquilino}</td>
                                <td>${reserva.emailInquilino}</td>
                                <td class="cobro">${reserva.cobro}€</td>
                                <td>${reserva.notas}</td>
                            </tr>
                        `
                    });                    
                }else{
                    datosReservas = `
                        <tr class="table-secondary fw-bold">
                            <td colspan="10" class="text-center">No hay reservas todavia</td>
                        </tr>
                    `
                }
                
                pieTabla = `
                                    </tbody>
                                </table>
                    </div>
                `;

                 $(document).ready(function() {
                    $('#tablaReservas').DataTable({
                        pageLength: 5,
                        lengthMenu: [5, 10, 20, 50],
                        language: {
                            url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
                        }
                    });
                });

                infoContainer.innerHTML = `
                        </div>
                        <div class="calendarContainer">
                            <div id="calendar"></div>
                        </div>
                        ${cabeceraTabla}
                        ${datosReservas}
                        ${pieTabla}
                `;

                const calendarEl = document.getElementById('calendar');
            
                const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'esLocale',
                firstDay: 1,
                height: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                buttonText:{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Agenda'
                },
                selectable: true,
                editable: true,
                dayMaxEvents: true, // muestra un "+X más" si hay muchos eventos
                eventColor: 'red', // color por defecto

                dateClick: function(info) {
                    alert('Fecha seleccionada: ' + info.dateStr);
                },
                eventClick: function(info) {
                    alert('Evento: ' + info.event.title);
                },
                events: eventosCalendario,  
                });
            
                calendar.render();
    })
    .catch(error => console.error('Error al obtener las reservas: ',error));

    function mostrarPropiedades(propiedades){
        let disponibles = 0;
        let noDisponibles = 0;     

        if (propiedades.length >=1 && propiedades) {
            propiedades.forEach(prop => {
                let status;   
    
                if(prop.disponibilidad === 1){
                    status = `<i class="fa-solid fa-check" style="color: #4CAF50;"></i><span style="color:#4CAF50"> Disponible</span>`;
                    disponibles += 1;  
                }
                if(prop.disponibilidad === 0){
                    status = `<i class="fa-solid fa-x" style="color: #ff0000;"></i><span style="color:#ff0000"> No Disponible</span>`;
                    noDisponibles += 1;
                };
            });
        }

        mostarPropiedadesDisponibles(disponibles);
        mostarPropiedadesNoDisponibles(noDisponibles);
    }

    function mostarTotalPropiedades(propiedades){
        const totalContainer = document.querySelector('#totalPropiedades'); 
        let total = 0;
        if (propiedades.length >= 0) {
            total = propiedades.length;
        }else{
            total = 0
        }       
        totalContainer.innerHTML = total;
    }

    function mostarPropiedadesDisponibles(disponibles){
        const disponiblesContainer = document.querySelector('#propiedadesDisponibles');        
        disponiblesContainer.innerHTML = `${disponibles}`;
    }

    function mostarPropiedadesNoDisponibles(noDisponibles){       
        const noDisponiblesContainer = document.querySelector('#propiedadesNoDisponibles');        
        noDisponiblesContainer.innerHTML = `${noDisponibles}`;
    }