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
    fetch('./../php/inicio.php')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        mostrarPropiedades(data);
        mostarTotalPropiedades(data);
    })
    .catch(error => console.error('Error al obtener las propiedades: ',error));
    
    let disponibles = 0;
    let noDisponibles = 0;         

//Funciones
    new Chart(graficoBalance, configBal);//Crea grafico de balance
    new Chart(graficoActividad, config);//Crea grafico de actividad

    function mostrarPropiedades(propiedades){
        const contenedor = document.querySelector('#propiedades_container');
        contenedor.innerHTML = '';

        propiedades.forEach(prop => {
            const div = document.createElement('div');
            let status;   

            let imagen = prop.imagenes ? prop.imagenes : '../uploads/imagenes/default.png';

            if(prop.disponibilidad === "1"){
                status = `Disponible<i class="fa-solid fa-check" style="color: #4CAF50;"></i>`;
                disponibles += 1;  
            }
            if(prop.disponibilidad === "0"){
                status = `No Disponible<i class="fa-solid fa-x" style="color: #ff0000;"></i>`;
                noDisponibles += 1;
            }

            div.classList.add('tarjeta_propiedad');
            div.innerHTML = `
                <img src="${imagen}" width="100%" alt="casa villanueva">
                <p class="contenido">
                    <b>${prop.nombre}</b><br>
                    <b>${prop.precio}€/${prop.frecuencia_pago}</b><br>
                    <b class="status">${status}</b>
                </p>
                <div class="foot_tarjeta">
                    <a href="">
                        <button class="btn_izqd"><i class="fa-regular fa-pen-to-square"></i> Administrar</button>
                    </a>
                    <a href="../html/vistaMapa.html?id_propiedad=${prop.id}">
                        <button class="btn_drch"><i class="fa-regular fa-map"></i> Ver en mapa</button>
                    </a>
                </div>
            `;
            contenedor.appendChild(div);
        });

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
