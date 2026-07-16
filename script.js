// Esperamos a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- FONDO ANIMADO DE CORAZONES ---
    function crearCorazon() {
        const fondo = document.getElementById('fondo-corazones');
        if (!fondo) return;

        const corazon = document.createElement('div');
        corazon.classList.add('corazon-flotante');
        corazon.innerText = '💖'; 

        // Posición horizontal y tamaño aleatorio
        corazon.style.left = Math.random() * 100 + 'vw';
        corazon.style.fontSize = (Math.random() * 20 + 10) + 'px';
        
        // Velocidad aleatoria
        const duracion = Math.random() * 5 + 6;
        corazon.style.animationDuration = duracion + 's';

        fondo.appendChild(corazon);

        setTimeout(() => {
            corazon.remove();
        }, duracion * 1000);
    }
    // Creamos corazones cada 400ms
    setInterval(crearCorazon, 400);

    // --- 1. CONFIGURACIÓN DEL CANDADO ---
    const diaSecreto = "01"; 
    const mesSecreto = "01";
    const anioSecreto = "01";

    // Conectamos los elementos
    const inputDia = document.getElementById('dia');
    const inputMes = document.getElementById('mes');
    const inputAnio = document.getElementById('anio');
    const btnDesbloquear = document.getElementById('btn-desbloquear');
    const mensajeError = document.getElementById('mensaje-error');
    const pantallaCandado = document.getElementById('pantalla-candado');
    const pantallaPrincipal = document.getElementById('pantalla-principal');

    if (!inputDia || !btnDesbloquear || !pantallaCandado || !pantallaPrincipal) {
        console.error("¡ERROR! JavaScript no encuentra los elementos del HTML.");
        return; 
    }

    // --- LÓGICA DE LAS RUEDAS DEL CANDADO ---
    document.querySelectorAll('.btn-girar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const esArriba = e.target.classList.contains('arriba');
            
            let valorActual = parseInt(input.value) || 0;
            let max = parseInt(input.max);
            let min = parseInt(input.min);

            if (esArriba) {
                valorActual = valorActual >= max ? min : valorActual + 1;
            } else {
                valorActual = valorActual <= min ? max : valorActual - 1;
            }
            
            input.value = valorActual.toString().padStart(2, '0');
        });
    });

    // Acción de Desbloquear
    btnDesbloquear.addEventListener('click', () => {
        const diaIngresado = inputDia.value.padStart(2, '0');
        const mesIngresado = inputMes.value.padStart(2, '0');
        const anioIngresado = inputAnio.value.padStart(2, '0');
        
        if (diaIngresado === diaSecreto && mesIngresado === mesSecreto && anioIngresado === anioSecreto) {
            pantallaCandado.classList.add('oculto');
            pantallaPrincipal.classList.remove('oculto');
        } else {
            mensajeError.classList.remove('oculto');
            setTimeout(() => {
                mensajeError.classList.add('oculto');
            }, 3000);
        }
    });

    // --- LÓGICA DEL CARRUSEL 3D ---
    const tarjetas = Array.from(document.querySelectorAll('.tarjeta-3d'));
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    let indiceActivo = 0;

    function actualizarCarrusel3D() {
        if(tarjetas.length === 0) return;
        tarjetas.forEach((tarjeta, i) => {
            tarjeta.classList.remove('activa', 'izquierda', 'derecha');
            tarjeta.style.transform = ''; 
            tarjeta.style.opacity = '';

            if (i === indiceActivo) {
                tarjeta.classList.add('activa');
            } else if (i === (indiceActivo - 1 + tarjetas.length) % tarjetas.length) {
                tarjeta.classList.add('izquierda');
            } else if (i === (indiceActivo + 1) % tarjetas.length) {
                tarjeta.classList.add('derecha');
            }
        });
    }

    if(btnNext) {
        btnNext.addEventListener('click', () => {
            indiceActivo = (indiceActivo + 1) % tarjetas.length;
            actualizarCarrusel3D();
        });
    }

    if(btnPrev) {
        btnPrev.addEventListener('click', () => {
            indiceActivo = (indiceActivo - 1 + tarjetas.length) % tarjetas.length;
            actualizarCarrusel3D();
        });
    }

    tarjetas.forEach((tarjeta, i) => {
        tarjeta.addEventListener('click', () => {
            indiceActivo = i;
            actualizarCarrusel3D();
        });
    });

    actualizarCarrusel3D();

    // AUTOPLAY DEL CARRUSEL
    let intervaloCarrusel = setInterval(() => {
        if(tarjetas.length > 0) {
            indiceActivo = (indiceActivo + 1) % tarjetas.length;
            actualizarCarrusel3D();
        }
    }, 2000); 

    const contenedorCarrusel = document.querySelector('.carrusel-3d-contenedor');
    if (contenedorCarrusel) {
        contenedorCarrusel.addEventListener('mouseenter', () => clearInterval(intervaloCarrusel));
        contenedorCarrusel.addEventListener('mouseleave', () => {
            intervaloCarrusel = setInterval(() => {
                if(tarjetas.length > 0) {
                    indiceActivo = (indiceActivo + 1) % tarjetas.length;
                    actualizarCarrusel3D();
                }
            }, 2000); 
        });
    }

    // --- LÓGICA DEL CONTADOR DE TIEMPO ---
    const fechaInicio = new Date('2020-07-16T00:00:00'); 

    function actualizarContador() {
        const ahora = new Date();
        const diferencia = ahora - fechaInicio;
        if (diferencia < 0) return; 

        let anios = ahora.getFullYear() - fechaInicio.getFullYear();
        let meses = ahora.getMonth() - fechaInicio.getMonth();
        let dias = ahora.getDate() - fechaInicio.getDate();
        let horas = ahora.getHours() - fechaInicio.getHours();
        let minutos = ahora.getMinutes() - fechaInicio.getMinutes();
        let segundos = ahora.getSeconds() - fechaInicio.getSeconds();

        if (segundos < 0) { segundos += 60; minutos--; }
        if (minutos < 0) { minutos += 60; horas--; }
        if (horas < 0) { horas += 24; dias--; }
        if (dias < 0) {
            meses--;
            const diasMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
            dias += diasMesAnterior;
        }
        if (meses < 0) { meses += 12; anios--; }

        if (document.getElementById('anios')) {
            document.getElementById('anios').innerText = anios;
            document.getElementById('meses').innerText = meses;
            document.getElementById('dias').innerText = dias;
            document.getElementById('horas').innerText = horas;
            document.getElementById('minutos').innerText = minutos;
            document.getElementById('segundos').innerText = segundos;
        }
    }
    actualizarContador();
    setInterval(actualizarContador, 1000);

    // --- LÓGICA DE LA CARTA DE AMOR ---
    const btnAbrirCarta = document.getElementById('btn-abrir-carta');
    const btnCerrarCarta = document.getElementById('btn-cerrar-carta');
    const modalCarta = document.getElementById('modal-carta');

    if (btnAbrirCarta && modalCarta) {
        btnAbrirCarta.addEventListener('click', () => {
            modalCarta.classList.remove('oculto');
        });
    }

    if (btnCerrarCarta && modalCarta) {
        btnCerrarCarta.addEventListener('click', () => {
            modalCarta.classList.add('oculto');
        });
    }
});