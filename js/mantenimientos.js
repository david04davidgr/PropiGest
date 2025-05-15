const infoContainer = document.querySelector('#infoContainer');

infoContainer.innerHTML = '';
let tarjetasMantenimiento = '';
let estadoMantenimiento = '';

fetch(`./../php/obtenerAllMantenimientos.php`)
.then(response => {
    if (response.status === 401) { //Si el usuario no esta autenticado lo devuelve al index(login)
        window.location.href = '../index.html';
        return;
    }
    return response.json();
})
.then(data => {
    mantenimientos = data;
    console.log(mantenimientos);
      
    let mantenimientosCalendario = '';
    let factura = '';
    
    if (mantenimientos.length > 0) {
        mantenimientosCalendario = mantenimientos.map(mantenimiento => {
            return {
                title: `${mantenimiento.titulo}`,
                start: mantenimiento.fechaProgramada,
                end: mantenimiento.fechaRealizacion,
                color: '#333',
            };
        });
        
        mantenimientos.forEach(mantenimiento => {
            estadoMantenimiento = '';
            factura = '';

            if (mantenimiento.estado === "pendiente") {
                estadoMantenimiento = `
                    <p style="color: red;font-weight:bold">${mantenimiento.estado}</p>
                `;
            }

            if (mantenimiento.estado === "en proceso") {
                estadoMantenimiento = `
                    <p style="color: orange;font-weight:bold">${mantenimiento.estado}</p>
                `;
            }

            if (mantenimiento.estado === "completado") {
                estadoMantenimiento = `
                    <p style="color: green;font-weight:bold">${mantenimiento.estado}</p>
                `;
            }

            if (mantenimiento.rutaDocumento) {
                factura = `<p><a href="${mantenimiento.rutaDocumento}" target="_blank" class="verDocumentoBtn">Ver Factura</a></p>`
            }else{
                factura = `<p><a class="sinFactura">No Disponible</a></p>`
            }
            
            tarjetasMantenimiento += `
                <div class="tarjeta ${mantenimiento.estado.toLowerCase().replace(/\s+/g, '-')}">
                    <div class="tarjeta-header">
                        <h2 class="nombre-propiedad">${mantenimiento.nombrePropiedad}</h2>
                        <div class="estado-badge ${mantenimiento.estado.toLowerCase().replace(/\s+/g, '-')}">
                            <i class="fas ${
                                mantenimiento.estado === 'pendiente' ? 'fa-clock' :
                                mantenimiento.estado === 'en proceso' ? 'fa-spinner fa-pulse' :
                                'fa-check-circle'
                            }"></i>
                            ${mantenimiento.estado}
                        </div>
                    </div>

                    <div class="tarjeta-body">
                        <div class="tipo-intervencion">
                            <span class="tipo-badge ${mantenimiento.tipo.toLowerCase()}">
                                <i class="fas ${mantenimiento.tipo === 'Correctivo' ? 'fa-bolt' : 'fa-shield-alt'}"></i>
                                ${mantenimiento.tipo}
                            </span>
                        </div>
                        <div class="titulo-empresa">
                            <h3 class="titulo-intervencion">${mantenimiento.titulo}</h3>
                            <p class="nombre-empresa"><i class="fas fa-building"></i> ${mantenimiento.empresa}</p>
                        </div>
                        
                        <div class="descripcion-intervencion">
                            <h4 class="subtitulo"><i class="fas fa-align-left"></i> Descripción</h4>
                            <p>${mantenimiento.descripcion}</p>
                        </div>
                        
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-calendar-check"></i>
                                <div>
                                    <span class="info-label">Programada</span>
                                    <span class="info-value">${formatearFecha(mantenimiento.fechaProgramada)}</span>
                                </div>
                            </div>
                            
                            <div class="info-item">
                                <i class="fas fa-calendar-day"></i>
                                <div>
                                    <span class="info-label">Realización</span>
                                    <span class="info-value">${formatearFecha(mantenimiento.fechaRealizacion)}</span>
                                </div>
                            </div>
                            
                            <div class="info-item">
                                <i class="fas fa-euro-sign"></i>
                                <div>
                                    <span class="info-label">Coste</span>
                                    <span class="info-value precio">${mantenimiento.coste} €</span>
                                </div>
                            </div>
                            
                            <div class="info-item">
                                <i class="fas fa-file-invoice"></i>
                                <div>
                                    <span class="info-label">Factura</span>
                                    ${factura}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                function formatearFecha(fechaString) {
                    if(!fechaString || fechaString === '0000-00-00 00:00:00') {
                        return '<span class="fecha-no-asignada">No asignada</span>';
                    }
                    const opciones = { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    };
                    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
                }
        });  

    }else{
        tarjetasMantenimiento = `
            <p>No hay mantenimientos disponibles todavía</p>
        `
    }

    infoContainer.innerHTML = `
        <div class="calendarContainer">
            <div id="calendar"></div>
        </div>
        <div class="tarjetasContainer">
            ${tarjetasMantenimiento}
        </div>
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
        // editable: true,
        dayMaxEvents: true, // muestra un "+X más" si hay muchos eventos
        eventColor: '#333', // color por defecto

        // dateClick: function(info) {
        //     alert('Fecha seleccionada: ' + info.dateStr);
        // },
        // eventClick: function(info) {
        //     alert('Evento: ' + info.event.title);
        // },
        events: mantenimientosCalendario,  
    });

    calendar.render();            
})