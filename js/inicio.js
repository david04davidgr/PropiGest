//Variables
//Grafico Balance
    let graficoBalance = document.querySelector('#graphBalance');
    const labelsBal = ['Ingresos', 'Gastos'];
    const colorsBal = ['#4caf50','rgb(255, 0, 0)'];

    const dataBal = {
        labels: labelsBal,
        datasets: [{
            data: [5000,350],
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
                    }
                }
            }
        }
    };

    //Grafico actividad de propiedades
    let graficoActividad = document.querySelector('#graphActividad');

    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Propiedades Activas',
            data: [5, 9, 0, 1, 6, 5, 20, 0, 1, 6, 5, 0],
            fill: false,
            borderColor: '#4caf50',
            tension:0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
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

    //Obtencion de datos BD
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
    
    
    //Funciones
    new Chart(graficoBalance, configBal);//Crea grafico de balance
    new Chart(graficoActividad, config);//Crea grafico de actividad
    
    function mostrarPropiedades(propiedades){
        let disponibles = 0;
        let noDisponibles = 0;     
            
        const contenedor = document.querySelector('#propiedades_container');
        contenedor.innerHTML = '';

        if (propiedades.length >=1 && propiedades) {
            propiedades.forEach(prop => {
                const div = document.createElement('div');
                let status;   
    
                let imagenes = prop.imagenes;
                imagenes = imagenes ? imagenes.split(',') : [];
    
                let imagenDefault = '../uploads/imagenes/default.png';
    
                if (imagenes.length === 0) {
                    imagenes[0] = [imagenDefault];
                }
    
                if(prop.disponibilidad === 1){
                    status = `<i class="fa-solid fa-check" style="color: #4CAF50;"></i><span style="color:#4CAF50"> Disponible</span>`;
                    disponibles += 1;  
                }
                if(prop.disponibilidad === 0){
                    status = `<i class="fa-solid fa-x" style="color: #ff0000;"></i><span style="color:#ff0000"> No Disponible</span>`;
                    noDisponibles += 1;
                }
    
                div.classList.add('tarjeta_propiedad');
                div.innerHTML = `
                    <img src="${imagenes[0]}" width="100%" alt="casa villanueva">
                    <div class="contenido">
                        <div class="izqd">
                            <div class="nombre_info">
                                <p>Nombre</p>
                                <h4>${prop.nombre}</h4>
                            </div>
                            <div class="precio_info">
                                <p>Precio</p>
                                <h4>${prop.precio}€/${prop.frecuencia_pago}</h4>
                            </div>
                        </div>
                        <div class="drch">
                            <div class="tipo_info">
                                <p>Tipo</p>
                                <h4>${prop.tipo}</h4>
                            </div>
                            <div class="dispo_info">
                                <p>Disponibilidad</p>
                                <h4>${status}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="foot_tarjeta">
                        <a href="../html/propiedadDetails.html?id_propiedad=${prop.id}">
                            <button class="btn_izqd"><i class="fa-regular fa-pen-to-square"></i> Administrar</button>
                        </a>
                        <a href="../html/vistaMapa.html?id_propiedad=${prop.id}">
                            <button class="btn_drch"><i class="fa-regular fa-map"></i> Ver en mapa</button>
                        </a>
                    </div>
                `;
                contenedor.appendChild(div);
            });
        }else{
            contenedor.innerHTML = `
                <div class="buttonContainer">
                    <p>¡Añade tu primera propiedad!</p>
                    <a href="../html/newPropiedad.html">
                        <button class="addPropiedadBtn">+ Añadir Propiedad</button>
                    </a>
                </div>
            `;
        }

        mostarPropiedadesDisponibles(disponibles);
        mostarPropiedadesNoDisponibles(noDisponibles);
    }

    function mostarTotalPropiedades(propiedades){
        const totalContainer = document.querySelector('#totalPropiedades');        
        totalContainer.innerHTML = `${propiedades.length}`;
    }

    function mostarPropiedadesDisponibles(disponibles){
        const disponiblesContainer = document.querySelector('#propiedadesDisponibles');        
        disponiblesContainer.innerHTML = `${disponibles}`;
    }

    function mostarPropiedadesNoDisponibles(noDisponibles){       
        const noDisponiblesContainer = document.querySelector('#propiedadesNoDisponibles');        
        noDisponiblesContainer.innerHTML = `${noDisponibles}`;
    }
