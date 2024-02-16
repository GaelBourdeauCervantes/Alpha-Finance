// Codigo para louder de incio
var loader = document.querySelector(".loader")

window.addEventListener("load", vanish);

function vanish() {
  loader.classList.add("disapear");
}

// Token para API
apiToken = '60c184d42ae3a5.75307084'



// Widgets-----------------------------------------------------------

// Definir lista de tickers de empresas a poner en widgets
tickersWidgets = ['MSFT','AAPL','NVDA','GOOG','AMZN','META','BRK-B','LLY']


// Definir funcion para trabajar data del widget dado sin incluir precio----------------
async function trabajarDataWidget(url,idWidget) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarWidget(data,idWidget)
}

// Function trabajar widget 
function trabajarWidget(data,idWidget) {
	// Tomar elementos en widget
	// Tomar widget
	eWidget = document.getElementById(idWidget)
	// Tomar identidad
	eIdentidad = eWidget.children[0]
	eTicker = eIdentidad.children[0]
	eNombre = eIdentidad.children[1]
	// Tomar imagen
	eImagen = eWidget.children[2].children[0]

	// Tomar data de la data
	// Identidad
	tickerEmpresa = data['General']['Code']
	nombreEmpresa = data['General']['Name']
	// Imagen
	urlImagen = 'https://eodhistoricaldata.com/' + data['General']['LogoURL']

	// Rellenar elementos
	eTicker.textContent = tickerEmpresa
	eNombre.textContent = nombreEmpresa
	eImagen.src = urlImagen

	// Trabajar con el indicador--------------------------------------------------------
	// Tomar seccion de indicador
	widgetIndicador = eWidget.children[3]
	idGraficaWidget = widgetIndicador.children[0].children[0].id
	idPuntuacion = widgetIndicador.children[1].id
	// Tomar data para el indicador




	// Poner data en fucion de mi indicador


	// Hacer Grafica
	hcaerIndicador(idGraficaWidget, idPuntuacion, Math.round(Math.random() * 100));
}

//Ejecutar funciones con respectivos widgets para data no incnluyendo precio
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[0] +'?api_token='+ apiToken, 'widget1')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[1] +'?api_token='+ apiToken, 'widget2')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[2] +'?api_token='+ apiToken, 'widget3')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[3] +'?api_token='+ apiToken, 'widget4')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[4] +'?api_token='+ apiToken, 'widget5')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[5] +'?api_token='+ apiToken, 'widget6')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[6] +'?api_token='+ apiToken, 'widget7')
trabajarDataWidget('https://eodhistoricaldata.com/api/fundamentals/'+ tickersWidgets[7] +'?api_token='+ apiToken, 'widget8')

// Definir funcion para sacar precio de accion y cambio----------------------------------
async function tomarPrecioCambio(url,idWidget) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarInfoPrecioCambio(data,idWidget);
}

// Trabaja data de precio
function trabajarInfoPrecioCambio(data,idWidget) {
	closePriceMinuto = data['close'];
	nominalChange = data['change'];
	percentilChange = data['change_p'];

	// Poner info en sitio------------------------------------------------------------------------------------------------------
	// Tomar elementos
	// Tomar widget
	eWidget = document.getElementById(idWidget)
	// Tomar seccion precio
	// Tomar data precios 
	ePrecios = eWidget.children[1]
	ePrecio = ePrecios.children[0]
	eCambioNominal = ePrecios.children[1].children[0]
	eCambioPorcentual = ePrecios.children[1].children[1]

	// Rellenar elementos
	ePrecio.innerHTML = arondir(closePriceMinuto);
	eCambioNominal.innerHTML = masMenos(arondir(nominalChange));
	eCambioPorcentual.innerHTML = `(${masMenos(arondir(percentilChange))}%)`;
	// Tomar ID de elementos precio y cambio
	idCambioNominal = eCambioNominal.id
	idCambioPorcentual = eCambioPorcentual.id
	agregarPositivoNegativoUno(idCambioNominal);
	agregarPositivoNegativoUno(idCambioPorcentual);
}

// Ejecutar funcion para cada widget al abrir el citio
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[0] +'?api_token='+apiToken+'&fmt=json', 'widget1');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[1] +'?api_token='+apiToken+'&fmt=json', 'widget2');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[2] +'?api_token='+apiToken+'&fmt=json', 'widget3');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[3] +'?api_token='+apiToken+'&fmt=json', 'widget4');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[4] +'?api_token='+apiToken+'&fmt=json', 'widget5');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[5] +'?api_token='+apiToken+'&fmt=json', 'widget6');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[6] +'?api_token='+apiToken+'&fmt=json', 'widget7');
tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[7] +'?api_token='+apiToken+'&fmt=json', 'widget8');

// Tomar Precio cada minuto verificar que no sea fin de semana para no ejecutar funcion

m0 = moment();
if ((m0.day() != 6) & (m0.day() != 0)) {
	refreshPrecio = setInterval(function () {
		tomarPrecioCambio('https://eodhistoricaldata.com/api/real-time/'+ tickersWidgets[0] +'?api_token='+apiToken+'&fmt=json', 'widget1');
		
	}, 60000);
}


// Funcion para que cuando un widget es selecionado se guarde el ticker de ese widget en local store
widget1 = document.getElementById('widget1')
widget2 = document.getElementById('widget2')
widget3 = document.getElementById('widget3')
widget4 = document.getElementById('widget4')
widget5 = document.getElementById('widget5')
widget6 = document.getElementById('widget6')
widget7 = document.getElementById('widget7')
widget8 = document.getElementById('widget8')

widget1.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[0])
})
widget2.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[1])
})
widget3.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[2])
})
widget4.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[3])
})
widget5.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[4])
})
widget6.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[5])
})
widget7.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[6])
})
widget8.addEventListener("click", function() { 
	localStorage.setItem('ticker',tickersWidgets[7])
})



// Funcion para hacer la grafica circular de widget
function hcaerIndicador(idGrafica, idPuntuacion, puntuacion) {
	// funciones para colores

	function colorPuntuacion(puntuacion) {
		if (puntuacion <= 10) {
			return 'rgb(230, 30, 30)';
		} else if (puntuacion <= 30) {
			return 'rgb(244, 67, 54)';
		} else if (puntuacion <= 40) {
			return 'rgb(255, 152, 30)';
		} else if (puntuacion <= 50) {
			return 'rgb(255, 232, 26)';
		} else if (puntuacion < 60) {
			return 'rgb(221, 244, 16)';
		} else if (puntuacion < 70) {
			return 'rgb(100, 216, 104)';
		} else {
			return 'rgb(66, 179, 66)';
		}
	}

	// Insercion de puntuacion
	documentoPuntuacion = document.getElementById(idPuntuacion);
	documentoPuntuacion.innerHTML = `${puntuacion}%`;

	// Insercion de grafica
	ctx = document.getElementById(idGrafica).getContext('2d');

	let delayed;
	grafica = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['er', 'err'],
			datasets: [
				{
					data: [puntuacion, 100 - puntuacion],
					backgroundColor: [colorPuntuacion(puntuacion), restoColor],
					borderColor: bordeColor,
					hoverBackgroundColor: [colorPuntuacion(puntuacion), restoColor],
					hoverBorderColor: [colorPuntuacion(puntuacion), bordeColor],
					hoverBorderWidth: [2, 0],
					spacing: 0,
					borderRadius: [30, 0],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
				tooltip: {
					enabled: false,
				},
			},
			animation: {
				animationRotate: true,
				duration: 3000,
			},
			showTooltips: false,
			cutout: '75%',
		},
	});
	return grafica
}


// Obtener la lupa de busqueda
const lupa = document.getElementById('lupaBuscar');
// Obtener el modo actual para las graficas widget
if (localStorage.getItem('dark-mode') === 'true') {
	// Resto de colores para widget circular
	restoColor = 'rgb(40,40,40)'
	bordeColor = 'rgb(49,49,49)'
	// Imagen de lupa busqueda
	lupa.src = 'imagenes/buscarcirculonegro.png';
	// Cambiar background del body a negro
	document.body.style.backgroundColor = '#222020';
} else {
	// Resto de colores para widget circular
	restoColor = 'rgb(240,240,240)'
	bordeColor = 'rgb(255,255,255)'
	// Imagen de lupa busqueda
	lupa.src = 'imagenes/buscarcirculo.png';
	// Cambiar background del body a blanco
	document.body.style.backgroundColor = 'rgb(255,255,255)';
}





// Boton de dark-------------------------------------------------------------
const btnSwitch = document.querySelector('#switch');


// Condicion si el boton es apretado
btnSwitch.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	btnSwitch.classList.toggle('active');

	// Guardar el modo en local storage
	if (document.body.classList.contains('dark')) {
		localStorage.setItem('dark-mode', 'true');
		// Cambiar lupa de busqueda
		lupa.src = 'imagenes/buscarcirculonegro.png';
		// Cambiar background del body a negro
		document.body.style.backgroundColor = '#222020';
	} else {
		localStorage.setItem('dark-mode', 'false');
		// Cambiar lupa de busuqeda
		lupa.src = 'imagenes/buscarcirculo.png';
		// Cambiar background del body a negro
		document.body.style.backgroundColor = 'rgb(255,255,255)';
	}
});

// Obtener el modo actual
if (localStorage.getItem('dark-mode') === 'true') {
	document.body.classList.add('dark');
	btnSwitch.classList.add('active');
	// Cambiar background del body a negro
	document.body.style.backgroundColor = '#222020';
} else {
	document.body.classList.remove('dark');
	btnSwitch.classList.remove('active');
	// Cambiar background del body a blanco
	document.body.style.backgroundColor = 'rgb(255,255,255)';
}

btnSwitch.addEventListener('click', 
	// Cambiar Grafiaca
	function cambiarGrafica() {
		if (document.body.classList.contains('dark')) {
			circuloDewidget1.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget1.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget1.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget1.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget1.update();

			circuloDewidget2.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget2.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget2.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget2.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget2.update();

			circuloDewidget3.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget3.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget3.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget3.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget3.update();

			circuloDewidget4.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget4.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget4.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget4.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget4.update();

			circuloDewidget5.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget5.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget5.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget5.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget5.update();

			circuloDewidget6.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget6.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget6.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget6.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget6.update();

			circuloDewidget7.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget7.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget7.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget7.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget7.update();

			circuloDewidget8.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget8.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget8.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget8.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget8.update();

		} else {
			circuloDewidget1.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget1.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget1.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget1.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget1.update();

			circuloDewidget2.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget2.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget2.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget2.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget2.update();

			circuloDewidget3.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget3.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget3.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget3.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget3.update();

			circuloDewidget4.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget4.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget4.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget4.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget4.update();

			circuloDewidget5.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget5.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget5.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget5.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget5.update();

			circuloDewidget6.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget6.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget6.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget6.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget6.update();

			circuloDewidget7.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget7.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget7.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget7.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget7.update();

			circuloDewidget8.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget8.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget8.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget8.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget8.update();
		}
	}
)







// Codigo para barra de busqueda----------------------------------------------------------------------------------

// Obtener Array de acciones----

// Sacar lista de todas las acciones que cotizan en estads unidos
// Defining async function para data general
async function trabajarDataAcciones(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	arrayAcciones = trabajarAcciones(data)
}
function trabajarAcciones(data) {
	arrayAcciones = []
	for(i=0;i<Object.keys(data).length;i++) {
		stockInfo = data[i]
		stockTicker = stockInfo['Code']
		stockName = stockInfo['Name']
		valorSearchBar = '(' + stockTicker + ') ' + stockName
		arrayAcciones.push(valorSearchBar)
	}
	// Convert array to JSON string and store in local storage
	localStorage.setItem('arrayAcciones', JSON.stringify(arrayAcciones));
	return arrayAcciones
}


// Ver si el array acciones existe en local stor, si existe usar el del local store si no tomar el de la api
if(localStorage.getItem('arrayAcciones' == null)) {
	arrayAcciones = trabajarDataAcciones('https://eodhd.com/api/exchange-symbol-list/US?api_token='+ apiToken +'&type=common_stock&fmt=json')
} else {
	arrayAcciones = JSON.parse(localStorage.getItem('arrayAcciones'));
}


// Function autocompletar
result = document.getElementById('autocompleteItems')
let list = []
const startsWith = (keword, inputKeword) => 
	keword.toLowerCase().startsWith(inputKeword.toLowerCase())

const includes = (keword, inputKeword) => 
	keword.toLowerCase().includes(inputKeword.toLowerCase())

const filter = (inputKeword) => {
	list = arrayAcciones.filter((keyword) => startsWith(keyword, inputKeword) || includes(keyword, inputKeword))
}
// Function para cuando selecionas una opcion
function handleClick(event) {
    // Get the clicked element's text content
    const selectedValue = event.target.textContent.match(/\((.*?)\)/)[1];
	
    
    // Store the selected value in local storage
    localStorage.setItem('ticker', selectedValue);
}
function showResults(arrayPosibleResults) {
	while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
	if(arrayPosibleResults.length <= 7) {
		repetir = arrayPosibleResults.length
	} else {
		repetir = 6
	}
	for(i = 0; i < repetir; i++) {
		div = document.createElement("DIV");
		a = document.createElement('a')
        div.setAttribute("class", "posibleResult");
		// Add click event listener to each child element
        div.addEventListener('click', handleClick);
		a.setAttribute('href','Resultado Busqueda/busqueda.html')
		a.innerHTML = arrayPosibleResults[i]
		// Poner en gris el primer div
		if(i == 0) {
			div.style.backgroundColor = '#e9e9e9'
		}
		div.appendChild(a)
		result.appendChild(div)
	} 
}

const search = (e) => {
	let keword = e.target.value
	if(keword) {
		filter(keword)
		showResults(list)
	} else {
		while (result.firstChild) {
			result.removeChild(result.firstChild);
		}
	}
}

// Guardar ticker en local storage y dirigir al citio
input = document.getElementById('barraBusqueda')
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        // Get the input value
        valorMasCercano = result.firstChild.firstChild.textContent;
        
		// Go to busqueda.html
		window.location.href = "Resultado Busqueda/busqueda.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});


// Function para agregar classe positivo negativo a cambio segun dos valores
function agregarPositivoNegativoDos(idElemento) {
	let elemento = document.getElementById(idElemento)
	let contenido = elemento.innerText
	let cambio = contenido.split(' ')
	if (parseFloat(cambio[0]) >= 0) {
		elemento.classList.add('positivo')
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo')
		}
	} else {
		elemento.classList.add('negativo')
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo')
		}
	}
}


// Finction para agregar texto a elemento
function agregarTexto(idElemento,texto) {
	document.getElementById(idElemento).innerText = texto
}

// Function para around a dos numero despues
function around2(num) {
	let resultado = Math.round((num + Number.EPSILON) * 100) / 100
	return resultado
}


// Function para agregar  cambio nominal/porcentual
function cambioNomialPorcentual(principio,ultimo) {
	cambioNominal = around2(ultimo-principio);
	cambioPorcentual = around2((ultimo/principio-1)*100);
	let resultado = `${cambioNominal} (${cambioPorcentual}%)`
	return resultado
}


// Function para agregar clase positiva negativa o neutra a un valor
function agregarPositivoNegativoUno(idElemento) {
	let elemento = document.getElementById(idElemento);
	let contenido = elemento.innerText.replace('(', '').replace(')', '').replace('%', '');
	if (parseFloat(contenido) > 0) {
		elemento.classList.add('positivo');
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo');
		}
		if (elemento.classList.contains('neutro')) {
			elemento.classList.remove('neutro');
		}
	} else if (parseFloat(contenido) < 0) {
		elemento.classList.add('negativo');
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo');
		}
		if (elemento.classList.contains('neutro')) {
			elemento.classList.remove('neutro');
		}
	} else {
		elemento.classList.add('neutro');
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo');
		}
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo');
		}
	}
}

// Function para poner un + si el numero es positivo y menos si es negativo
function masMenos(valor) {
	parseFloat(valor);
	if (valor < 0) {
		resultado = valor;
	} else {
		resultado = `+${valor}`;
	}
	return resultado;
}

// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
}


// Function para calcular mi indicador
function miIndicador(
	marketCap,
	totalRevenue,
	totalLiabilities,
	totalAssets,
	totalAssetsAtras,
	netIncomeAtras,
	totalCurrentAssets,
	totalCurrentLiabilities,
	netIncome,
	totalDebt,
	zScore,
	fScore,
	mScore,
	roic,
	freeCashFlow,
	totalRevenueG,
	netIncomeG,
	dividenYield,
	dividendsPaid,
	pegRatio
) {
	puntuacion = 0;
	marketCap = numero(marketCap);
	totalRevenue = numero(totalRevenue);
	totalLiabilities = numero(totalLiabilities);
	totalAssets = numero(totalAssets);
	totalAssetsAtras = numero(totalAssetsAtras);
	netIncome = numero(netIncome);
	netIncomeAtras = numero(netIncomeAtras);
	totalCurrentAssets = numero(totalCurrentAssets);
	totalCurrentLiabilities = numero(totalCurrentLiabilities);
	totalDebt = numero(totalDebt);
	freeCashFlow = numero(freeCashFlow);
	dividenYield = numero(dividenYield);
	dividendsPaid = numero(dividendsPaid);

	priceToSales = marketCap / totalRevenue;
	priceToBook = marketCap / (totalAssets - totalLiabilities);
	priceToearnigs = marketCap / netIncome;
	totalRatio = totalAssets / totalLiabilities;
	currentRatio = totalCurrentAssets / totalCurrentLiabilities;
	netIncomeToDebt = netIncome / totalDebt;
	debtToEquity = totalDebt / (totalAssets - totalLiabilities);
	roa = netIncome / totalAssets;
	roa2 = netIncomeAtras / totalAssetsAtras;
	roe = netIncome / (totalAssets - totalLiabilities);
	cagr = (totalRevenueG + netIncomeG) / 2;
	rotacionCapital = totalRevenue / (totalAssets - totalLiabilities);
	dividenPayoutRatio = (dividendsPaid * -1) / netIncome;
	warrenBuffetRatio = ((netIncome / totalRevenue) * 100 + dividenYield * 100) / priceToBook;
	peterLynchRatio = ((pegRatio / priceToearnigs) * 100 + dividenYield * 100) / priceToearnigs;
	if (priceToSales <= 5) {
		puntuacion = puntuacion + 5.22;
	}
	if (priceToBook <= 3) {
		puntuacion = puntuacion + 8.7;
	}
	if (priceToearnigs <= 15) {
		puntuacion = puntuacion + 8.7;
	}
	if (totalRatio >= 2) {
		puntuacion = puntuacion + 5.22;
	}
	if (currentRatio >= 1.5) {
		puntuacion = puntuacion + 5.22;
	}
	if (netIncomeToDebt <= 1.5) {
		puntuacion = puntuacion + 4.35;
	}
	if (debtToEquity <= 0.5) {
		puntuacion = puntuacion + 4.35;
	}
	if (zScore > 2.99) {
		puntuacion = puntuacion + 4.35;
	}
	if (fScore >= 8) {
		puntuacion = puntuacion + 5.22;
	}
	if (mScore <= -2) {
		puntuacion = puntuacion + 4.35;
	}
	if (warrenBuffetRatio >= 10) {
		puntuacion = puntuacion + 4.35;
	}
	if (peterLynchRatio >= 2) {
		puntuacion = puntuacion + 4.35;
	}
	if (roic > 0.1) {
		puntuacion = puntuacion + 8.1;
	}
	if (roa > roa2) {
		puntuacion = puntuacion + 3.48;
	}
	if (roe > 0.25) {
		puntuacion = puntuacion + 6.96;
	}
	if (freeCashFlow > 0) {
		puntuacion = puntuacion + 3.48;
	}
	if (cagr > 0.1) {
		puntuacion = puntuacion + 4.35;
	}
	if (rotacionCapital > 1.5) {
		puntuacion = puntuacion + 4.35;
	}
	if (dividenYield > 0.01) {
		puntuacion = puntuacion + 1;
	}
	if (dividenPayoutRatio < 0.45) {
		puntuacion = puntuacion + 2.17;
	}
	return puntuacion;
}


// poner err en consola
console.log(
	`
	%c
	░░░░░░▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄▄
	░░░░░█░░░░░░░░░░░░░░░░░░▀▀▄
	░░░░█░░░░░░░░░░░░░░░░░░░░░░█
	░░░█░░░░░░▄██▀▄▄░░░░░▄▄▄░░░░█
	░▄▀░▄▄▄░░█▀▀▀▀▄▄█░░░██▄▄█░░░░█
	█░░█░▄░▀▄▄▄▀░░░░░░░░█░░░░░░░░░█
	█░░█░█▀▄▄░░░░░█▀░░░░▀▄░░▄▀▀▀▄░█
	░█░▀▄░█▄░█▀▄▄░▀░▀▀░▄▄▀░░░░█░░█
	░░█░░░▀▄▀█▄▄░█▀▀▀▄▄▄▄▀▀█▀██░█
	░░░█░░░░██░░▀█▄▄▄█▄▄█▄▄██▄░░█
	░░░░█░░░░▀▀▄░█░░░█░█▀█▀█▀██░█
	░░░░░▀▄░░░░░▀▀▄▄▄█▄█▄█▄█▄▀░░█
	░░░░░░░▀▄▄░░░░░░░░░░░░░░░░░░░█
	░░▐▌░█░░░░▀▀▄▄░░░░░░░░░░░░░░░█
	░░░█▐▌░░░░░░█░▀▄▄▄▄▄░░░░░░░░█
	░░███░░░░░▄▄█░▄▄░██▄▄▄▄▄▄▄▄▀
	░▐████░░▄▀█▀█▄▄▄▄▄█▀▄▀▄
	░░█░░▌░█░░░▀▄░█▀█░▄▀░░░█
	░░█░░▌░█░░█░░█░░░█░░█░░█
	░░█░░▀▀░░██░░█░░░█░░█░░█
	░░░▀▀▄▄▀▀░█░░░▀▄▀▀▀▀█░░█
	░░░░░░░░░░█░░░░▄░░▄██▄▄▀
	░░░░░░░░░░█░░░░▄░░████
	░░░░░░░░░░█▄░░▄▄▄░░▄█
	░░░░░░░░░░░█▀▀░▄░▀▀█
	░░░░░░░░░░░█░░░█░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█▄▄▄▐▄▄▄█
	░░░░░░░▄▄▄▄▀▄▄▀█▀▄▄▀▄▄▄▄
	░░░░░▄▀▄░▄░▄░░░█░░░▄░▄░▄▀▄
	░░░░░█▄▄▄▄▄▄▄▄▄▀▄▄▄▄▄▄▄▄▄█
	`, 
	'color:pink;'
)



