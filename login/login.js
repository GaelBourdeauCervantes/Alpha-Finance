// Poner Login o sing In
botonLogInSingIn = document.getElementById('botonLogInSingIn');

// Elementos a agregar

var elementos = ['Name','Last Name','Email','Year of Birth']
var fragment = document.createDocumentFragment();



function selecionarIcono1(idIcono1,idIcono2) {
    let primerIcono = document.getElementById(idIcono1)
    let segundoIcono = document.getElementById(idIcono2)
    primerIcono.classList.add('selecionado')
    segundoIcono.classList.remove('selecionado')

    segundoIcono.style.color = 'rgb(153,153,153)' 
    primerIcono.style.color = 'rgb(95,95,95)'
}

function selecionarIcono2(idIcono1,idIcono2) {
    let primerIcono = document.getElementById(idIcono1)
    let segundoIcono = document.getElementById(idIcono2)
    segundoIcono.classList.add('selecionado')
    primerIcono.classList.remove('selecionado')

    primerIcono.style.color = 'rgb(153,153,153)'
    segundoIcono.style.color = 'rgb(95,95,95)'

}



// Funcion para detectar errores en el registro


function detectarError(idContenedor) {
    // Tomar info
    contenedor = document.getElementById(idContenedor)
    input = contenedor.children[0]
    icono = contenedor.children[1]
    valor = input.value
    id = input.id
    mensajeError = document.getElementById(`mensajeError${id}`)

    // Lo que paso con malo
    function malo() {
        icono.classList = 'fas fa-exclamation-circle'
        agregarMaloBueno(icono,'malo')
    }
    // Lo que pasa con bueno
    function bueno() {
        icono.classList = 'fas fa-check-circle'
        agregarMaloBueno(icono,'bueno')
    }
    // Secion inputs

    // Ver si es login o sing in
    if (botonLogInSingIn.textContent  == 'Log In') {
        if (valor == '') {
            icono.classList = ''
            mensajeError.textContent = ''
        } else {
            // Error para nombre
            if (id == 'Name' || id == 'LastName') {
                if (valor.length < 4 || valor.length > 16 || /^[a-zA-ZÀ-ÿ\s]+$/.test(valor) == false || /^[\S]+$/.test(valor) == false) {
                    malo()
                    if (valor.length < 4) {
                        mensajeError.textContent = 'minimum 4 letters required'
                    }
                    if (valor.length > 16) {
                        mensajeError.textContent = 'maximum 16 letters required'
                    }
                    if (/^[a-zA-ZÀ-ÿ\s]+$/.test(valor) == false) {
                        mensajeError.textContent = 'non-special characters values ​​are required'
                    } 
                    if (/^[\S]+$/.test(valor) == false) {
                        mensajeError.textContent = 'spaces not requird'
                    }
                } else if(valor.length > 4 || valor.length < 16|| /^[a-zA-ZÀ-ÿ\s]+$/.test(valor) || /^[\S]+$/.test(valor)) {
                    bueno()
                    mensajeError.textContent = ''
                }
            }

            if (id == 'Email') {
                let expresionEmail = 
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                if(expresionEmail.test(valor) == false) {
                    malo()
                    mensajeError.textContent = 'invalid email'
                } else if(expresionEmail.test(valor)) {
                    bueno()
                    mensajeError.textContent = ''
                }
            }

            if(id == 'usernameEmail') {
                if(/^[a-zA-Z0-9\_\-]{4,16}$/.test(valor)  == false) {
                    malo()
                    if(valor.length < 4) {
                        mensajeError.textContent = 'minimum 4 letters required'
                    }
                    if(valor.length > 16) {
                        mensajeError.textContent = 'maximum 16 letters required'
                    }
                } else if(/^[a-zA-Z0-9\_\-]{4,16}$/.test(valor)) {
                    bueno()
                    mensajeError.textContent = ''
                }
            }

            if(id == 'password') {
                if (valor.length < 5 || valor.length > 10 || /\d/.test(valor) == false) {
                    malo()
                    if(valor.length < 5) {
                        mensajeError.textContent = 'minimum 5 letters required'
                    }
                    if(valor.length > 16) {
                        mensajeError.textContent = 'maximum 16 letters required'
                    }
                    if(/\d/.test(valor) == false) {
                        mensajeError.textContent = 'minimum 1 number required'
                    }
                } else if (valor.length > 5 || valor.length < 10 || /\d/.test(valor)) {
                    bueno()
                    mensajeError.textContent = ''
                }
            }
        }
    } else if(botonLogInSingIn.textContent  == 'Register') {
        // Ver si elemento esta presente en la base de datos
    }
}



function crearElementos(form) {
    // Creacion de genero
    {
    let divContenedorGenero = document.createElement('div')
    let textoGenero = document.createElement('b')
    let divContenedorIconosGenero = document.createElement('div')
    let iconoHombreGenero = document.createElement('i')
    let iconoMujerGenero = document.createElement('i')
    let divBuenoMalo = document.createElement('div')
    let textoBuenoMalo = document.createElement('b')
    let iconoBuenoMalo = document.createElement('i')

    // Mesclar Elementos
    divContenedorGenero.appendChild(textoGenero)
    divContenedorGenero.appendChild(divContenedorIconosGenero)
    divContenedorIconosGenero.appendChild(iconoHombreGenero)
    divContenedorIconosGenero.appendChild(iconoMujerGenero)
    divContenedorGenero.appendChild(divBuenoMalo)
    divBuenoMalo.appendChild(textoBuenoMalo)
    divBuenoMalo.appendChild(iconoBuenoMalo)
    
    // Poner nombres y clases
    divContenedorGenero.classList = 'opcionesGender'
    divContenedorGenero.setAttribute('id','opcionesGender')
    textoGenero.classList = 'textoGender'
    textoGenero.textContent = 'Gender'
    divContenedorIconosGenero.classList = 'contenedorIconos'
    iconoHombreGenero.classList = 'fas fa-male iconoHombre'
    iconoHombreGenero.setAttribute('id','iconoHombre')
    iconoMujerGenero.classList = 'fas fa-female iconoMujer'
    iconoMujerGenero.setAttribute('id','iconoMujer')
    divBuenoMalo.classList = 'contenedorMensaje'
    textoBuenoMalo.classList = 'mensajeError'
    textoBuenoMalo.setAttribute('id','mensajeErrorGenero')
    textoBuenoMalo.setAttribute('mensaje',"error")
    iconoBuenoMalo.setAttribute('id','iconoErrorGenero')

    // Condicion para iconos
    iconoHombreGenero.setAttribute('onclick', "selecionarIcono1('iconoHombre','iconoMujer')")
    iconoMujerGenero.setAttribute('onclick', "selecionarIcono2('iconoHombre','iconoMujer')")

    fragment.appendChild(divContenedorGenero);
    }

    // Creacion de inputs y iconos
    elementos.forEach(nombre => {
        // Craer contenedor de input
        contenedorInput = document.createElement('div');
        // Crear input
        input = document.createElement('input'); 
        // Craer icono 
        icono = document.createElement('i')
        // Craer mensaje error
        mensajeError = document.createElement('b')

        contenedorInput.classList = 'contenedorInputRegistro';
        contenedorInput.setAttribute('id',`contenedorRegistroDe${nombre.replace(/\s+/g, '')}`)
        contenedorInput.setAttribute('onkeyup',`detectarError("contenedorRegistroDe${nombre.replace(/\s+/g, '')}")`)

        if (nombre == 'Year of Birth') {
            input.type = 'date'
            input.value = '2005-06-27'
            input.setAttribute('id', nombre.replace(/\s+/g, '')) 
            input.setAttribute('class', nombre.replace(/\s+/g, '')) 
            input.setAttribute('class', 'inputTexto')
        } else if (nombre == 'Email') {
            input.type = 'email'
            input.placeholder = nombre
            input.setAttribute('id', nombre.replace(/\s+/g, ''))
            input.setAttribute('class', nombre.replace(/\s+/g, ''))
            input.setAttribute('class', 'inputTexto')
            contenedorInput.classList.add('contenedorInputEmail');
        } else {
            input.type = 'text'
            input.placeholder = nombre
            input.setAttribute('id', nombre.replace(/\s+/g, ''))
            input.setAttribute('class', nombre.replace(/\s+/g, ''))
            input.setAttribute('class', 'inputTexto')
        }
        
        icono.setAttribute('id',`icono${nombre.replace(/\s+/g, '')}`);
        icono.setAttribute('class','iconoBuenoMalo')
        icono.setAttribute('icono','error')
        mensajeError.setAttribute('id',`mensajeError${nombre.replace(/\s+/g, '')}`)
        mensajeError.classList = 'registroMensajeError'
        mensajeError.setAttribute('mensaje',"error")

        contenedorInput.appendChild(input)
        contenedorInput.appendChild(icono)
        fragment.appendChild(contenedorInput)
        fragment.appendChild(mensajeError)
    });
    form.prepend(fragment);
}


function agregarMaloBueno(elemento,maloBueno) {
    if (maloBueno == 'malo') {
        elemento.classList.add('malo')
        elemento.classList.remove('bueno')
    } else {
        elemento.classList.add('bueno')
        elemento.classList.remove('malo')
    }
}


// Funcion para ver si un array tiene un sierto valor

function arrayContiene(array,valor) {
    contiene = 0
    x = []
    for(i=0;i<=array.length;i++) {
        x.push(array[i])
        if(array[i] == valor) {
            contiene = contiene + 1
        }
    }


    if(contiene>0) {
        return 'contiene'
    } else {
        return 'noContiene'
    }
}


// Lugar donde agregar

form = document.querySelector('.form')

function agregarSingIn() {
    let nodoMensajeError = form.querySelectorAll('[mensaje="error"]')
    for(i=0;i<nodoMensajeError.length;i++) {
        nodoMensajeError[i].textContent = ''
    }
    if(botonLogInSingIn.textContent  == 'Register') {
        form.setAttribute('id','formRegister')
        botonLogInSingIn.textContent  = 'Log In'
        document.getElementById('usernameEmail').placeholder = 'Username'
        document.getElementById('usernameEmail').value = ''
        document.getElementById('password').value = ''
        botonLogInSingIn.style.backgroundImage = 'linear-gradient(to right, #314755 0%, #26a0da  51%, #314755  100%)'
        crearElementos(form)
        detectarError('contenedorRegistroDeName');
    } else {
        form.setAttribute('id','formLogin')
        botonLogInSingIn.textContent  = 'Register'
        botonLogInSingIn.style.backgroundImage = 'linear-gradient(to right, #1A2980 0%, #26D0CE  51%, #1A2980  100%)'
        document.getElementById('opcionesGender').remove()
        elementos.forEach(nombre => {
            document.getElementById(nombre.replace(/\s+/g, '')).remove()
            document.querySelector('.contenedorInputRegistro').remove()
            document.querySelector('.registroMensajeError').remove()
        });
        document.getElementById('usernameEmail').placeholder = "Username / Email"
        document.getElementById('usernameEmail').value = ''
        document.getElementById('password').value = ''
    }
}

// Cambiar al cambiart el registro
botonLogInSingIn.addEventListener('click', agregarSingIn)




// Solo enviar info si esta bien
form.addEventListener('submit', (e) => {
	e.preventDefault();
    // Ver en que parte esta Login o Register
    if(document.getElementById('botonLogInSingIn').textContent == 'Log In') {
        // Chacar si el genero fue completado
        let iconoHombre = document.getElementById('iconoHombre')
        let iconoMujer = document.getElementById('iconoMujer')
        let mensajeErrorGenero = document.getElementById('mensajeErrorGenero')
        let iconoGenero = document.getElementById('iconoErrorGenero')
        // mensajeErrorGenero.setAttribute('mensaje','')
        if(iconoHombre.classList.contains('selecionado') == false && iconoMujer.classList.contains('selecionado') == false) {
            mensajeErrorGenero.textContent = 'One gender must be chosen'
            iconoGenero.classList = 'fas fa-exclamation-circle malo'
        } else {
            mensajeErrorGenero.textContent = ''
            iconoGenero.classList = ''
        }
    }

    // Otros elementos
    let nodoInput = form.querySelectorAll('input')
    let nodoMensajeError = form.querySelectorAll('[mensaje="error"]')
    for(i=1;i<=nodoInput.length;i++){
        if(nodoInput[i-1].value == '' && nodoMensajeError[i].textContent == '' || nodoMensajeError[i].textContent == 'add information') {
            nodoMensajeError[i].textContent = 'add information'
        } else if(nodoMensajeError[i].textContent == 'add information'){
            nodoMensajeError[i].textContent = ''
        }
    }
    
    campos = []
    for(i=0;i<nodoMensajeError.length;i++) {
        if(nodoMensajeError[i].textContent == '') {
            campos.push('corecto')
        } else {
            campos.push('error')
        }
    }

    if(arrayContiene(campos,'error') == 'noContiene') {
        window.location.replace("../index.html");
    }

});



// Cambiar icono de ver codigo
iconoMostrar = document.getElementById('iconoMostrar');
passwordInput = document.getElementById('password');

iconoMostrar.addEventListener('click', () => {
	if (iconoMostrar.classList.contains('fa-eye')) {
		iconoMostrar.classList.remove('fa-eye');
		iconoMostrar.classList.add('fa-eye-slash');
		passwordInput.type = 'password';
	} else {
		iconoMostrar.classList.remove('fa-eye-slash');
		iconoMostrar.classList.add('fa-eye');
		passwordInput.type = 'text';
	}
});









// Poner imagen en consola
console.log(
`
%c
    ──▄▀▀▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄
    ▄▀──────────────────▀▀▄
    █─────────────────────▀▀▄
    █───▄▀▀▀▀▀▀▄────────────█
    █─▄▀────────▀▀▀▄───▄▀▀▀▀▀▀▄
    █─█─────────────▀▀▄▀─▀▀▄───▀▄
    █─█─▀▀▄──▄████▄───█──────────█
    █─█──────██████▄──█─▀▀▀▄──────█
    █─█─▄▄▄──███████──█────────────█
    █─█▄─────▀██████──█───▄█████▄──█
    █──█──▄▄▀─▀████▀──█───███████──█
    █──▀▄───────────▄▀█───███████──█
    █────▀▀▄▄▄▄▄▄▄▄▀▀─█▄──▀█████▀──█
    █──────────────▄───█───────────█
    █──────────▄────▀▄─▀█▄▄▄▄▄▄▄▀▀▀
    █───────────▀▄───█──▄▄▄▄▀
    █────────────█───█──█
    █────────────█───█──█
    █───────────▄▀──█───█
    █─────────▄▀───█────█
    █─────────█───█─────█
    █─────────▀█▄▄▀─────█
    █──────────────────▄▀
    █─────▄▀▀▀▄▄───────▀▄
    █─────█────▀▀▀▀▄▄▄▄▄▀
    █─────▀▀▄
    █────────▀▀▄
    █─────▄▄▄▄▄▀
    █─▀▄─█
    █─▀──█
    █────█`, 
    ' background-color:black; color:green;'
)