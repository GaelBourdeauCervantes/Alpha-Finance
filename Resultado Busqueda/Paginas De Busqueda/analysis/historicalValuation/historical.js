// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = 'demo'
//60c184d42ae3a5.75307084



// Poner valores en fechas de inico
startDateInput = document.getElementById('start-date');
endDateInput = document.getElementById('end-date');

// Obtener la fecha actual
const today = new Date();

// Formatear la fecha actual para el input de fecha (YYYY-MM-DD)
const todayFormatted = today.toISOString().split('T')[0];

// Calcular la fecha de inicio (hoy menos 5 años)
const startDate = new Date();
startDate.setFullYear(today.getFullYear() - 5);
const startDateFormatted = startDate.toISOString().split('T')[0];

// Asignar las fechas por defecto
startDateInput.value = startDateFormatted;
endDateInput.value = todayFormatted;


// Trabajar data
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}


function trabajarData(data) {
	// Tomar fechas de grafica
	startDateInput = document.getElementById('start-date').value;
    endDateInput = document.getElementById('end-date').value;
    // Logo de la empresa
    logoURL = 'https://eodhistoricaldata.com/' + data["General"]['LogoURL'] 
    // Poner logo en el document
    documentoLogoEmpresa = document.getElementById('documentoLogoEmpresa')
    documentoLogoEmpresa.src = logoURL;
    // Crear array de precios anuales desde fecha inicial a hoy
    // Tomar llaves de array
	arrayLlaves = Object.keys(data['Financials']['Cash_Flow']['yearly'])
	largoFechas = arrayLlaves.length
	fechaPrecioInicio = startDateInput
	fechaPrecioFinal = endDateInput
	urlPrecio = 'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fechaPrecioInicio +
	'&to=' +
	fechaPrecioFinal +
	'&period=d&fmt=json&api_token='+apiToken+'';
	arraySemanalClose = asynctrabajarDataPrecio(urlPrecio)

    arraySemanalClose.then(arraySemanalClose => { 

        // Tomar shares outsanding 
        arraySharesOutstanding = {}
        llavesShares = Object.keys(data['outstandingShares']['annual'])
        // el array shares va primero fecha reciente y luego para abajo!!!!
        for (i = 0; i<llavesShares.length; i++) {
            date = data['outstandingShares']['annual'][llavesShares[i]]['date']
            shares = data['outstandingShares']['annual'][llavesShares[i]]['shares']
            arraySharesOutstanding[date] = shares
        }

        arrayNetIncome = {}
        // Tomar net income
        llavesReportes = Object.keys(data['Financials']["Income_Statement"]["yearly"])
        for (i = 0; i<llavesReportes.length; i++) {
            ano = llavesReportes[i].split('-')[0]
            netIncome = data['Financials']["Income_Statement"]["yearly"][llavesReportes[i]]['netIncome']
            arrayNetIncome[ano] = netIncome
        }
        // Agregar TTM a net income
        netIncomeTTM = calcularTTM(data,'Income_Statement','netIncome')
        arrayNetIncome[numero(llavesReportes[0].split('-')[0]) + 1] = netIncomeTTM



        arrayFechas = []
        arrayPe = []
        arrayPrecioAccion = []

        // Creacion de Market Cap y indicadores
        for (i = 0; i<arraySemanalClose.length; i++) {
            // Hacer Market Cap
            fechaPrecioAccion = arraySemanalClose[i]['date']
            arrayFechas.push(fechaPrecioAccion)
            anoPrecioAccion = fechaPrecioAccion.split('-')[0]
            numeroAccionesAno = arraySharesOutstanding[anoPrecioAccion]
            precioPorAccion = arraySemanalClose[i]['adjustedClose']
            arrayPrecioAccion.push(precioPorAccion)
            marketCap = precioPorAccion * numeroAccionesAno

            // Hacer PE
            netIncome = arrayNetIncome[anoPrecioAccion]
            if(netIncome == null) {
                pe = NaN
            } else {
                pe = marketCap / netIncome
            }
            arrayPe.push(pe)
        }

        // Tomar Promedios y standard deviation
        // Tomar valores PE
        stArribaPe = arrayStatistics(arrayPe).oneStdAbove
        promedioPe = arrayStatistics(arrayPe).mean
        stAbajoPe = arrayStatistics(arrayPe).oneStdBelow
        // Crear array PE
        arrayStArribaPe = []
        arrayPromedioPe = []
        arrayStAbajoPe = []
        
        for(i = 0; i<arraySemanalClose.length; i++) {
            arrayStArribaPe.push(stArribaPe)
            arrayPromedioPe.push(promedioPe)
            arrayStAbajoPe.push(stAbajoPe)
        }

        // Hacer Graficas----
        // Hacer Grafica Quick Ratio
	    graficaMuliploHistorico('graficaPeHistorico', 'PE', arrayPe,arrayStArribaPe, arrayPromedioPe, arrayStAbajoPe, arrayPrecioAccion, arrayFechas)
    })
    
}


trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token=' + apiToken)









// Sacar precio--------------------------------------------------------------------------------------
// Precio Anual------------------------------
// Definir Async Precio
async function asynctrabajarDataPrecio(urlPrecio) {
    // Storing response
    const responsePrecio = await fetch(urlPrecio)

    // Storing data in form of JSON
    let dataPrecio = await responsePrecio.json()
    arrayAnualClose = trabajarDataPrecio(dataPrecio)
    return arrayAnualClose
}

// Function trabajar precio
function trabajarDataPrecio(dataPrecio) {
    let arraySemanalClose = [];

    // Agrupar los datos por semanas
    let weekData = {};
    dataPrecio.forEach(item => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const week = Math.ceil(((date - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);

        if (!weekData[year]) {
            weekData[year] = {};
        }

        if (!weekData[year][week]) {
            weekData[year][week] = {
                lastDate: null // Inicialmente, la última fecha es null
            };
        }

        // Actualizar el precio de cierre ajustado de la última fecha de la semana
        if (!weekData[year][week].lastDate || date > new Date(weekData[year][week].lastDate.date)) {
            weekData[year][week].lastDate = {
                date: item.date,
                adjustedClose: item.adjusted_close
            };
        }
    });

    // Guardar el precio de cierre ajustado de la última fecha para cada semana
    for (const year in weekData) {
        for (const week in weekData[year]) {
            arraySemanalClose.push({
                date: weekData[year][week].lastDate.date, // Fecha exacta de la última observación de la semana
                adjustedClose: weekData[year][week].lastDate.adjustedClose // Guardar el precio de cierre ajustado de la última fecha de la semana
            });
        }
    }

    return arraySemanalClose;

}


// Function barra busqueda
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
if(localStorage.getItem('arrayAcciones') == null) {
	console.log('cargandoAcciones')
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
		div.addEventListener('click', (event) => { 
			window.location.href = "../historicalValuation/historical.html"
		})
		a.setAttribute('href','../historicalValuation/historical.html')
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
		window.location.href = "../historicalValuation/historical.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});





// Funciones graficas
// Grafica Quick Ratiol
function graficaMuliploHistorico(idGrafica, nombreMultiplo, arrayMultiplo,  arrayOneStdAbove, arrayPromedioMultiplo, arrayOneStdBelow, arrayPrecioAccion, labels) {
	ctx = document.getElementById(idGrafica).getContext('2d');
	myChart = new Chart(ctx, {
		type: 'bar',
		labels: labels,
		data: {
			labels: labels,
			datasets: [
			{
				label: nombreMultiplo,
				type: 'line',
				data: arrayMultiplo,
				backgroundColor: '#000000',
				borderColor: '#000000',
                pointRadius: 0,
                borderWidth: 2,  
                tension: 0.4,
                yAxisID: 'Multiplo',
                pointHoverRadius: 6,
			},
			{
				label: 'Std Above',
				type: 'line',
				data: arrayOneStdAbove,
				backgroundColor: '#e1e63a',
				borderColor: '#e1e63a',
				borderDash: [4, 4],
				pointRadius: 0,
                borderWidth: 1.5, 
                yAxisID: 'Multiplo',
                pointHoverRadius: 0,
			},
            {
				label: 'Mean',
				type: 'line',
				data: arrayPromedioMultiplo,
				backgroundColor: '#e6443a',
				borderColor: '#e6443a',
				borderDash: [4, 4],
				pointRadius: 0,
                borderWidth: 1.5, 
                yAxisID: 'Multiplo',
                pointHoverRadius: 0,
			},
            {
				label: 'Std Bellow',
				type: 'line',
				data: arrayOneStdBelow,
				backgroundColor: '#e1e63a',
				borderColor: '#e1e63a',
				borderDash: [4, 4],
                borderWidth: 1.5, 
				pointRadius: 0,
                yAxisID: 'Multiplo',
                pointHoverRadius: 0,
			},
            {
				label: 'Price Per Share',
				type: 'line',
				data: arrayPrecioAccion,
				backgroundColor: 'rgba(0,0,0,0.1)',
				borderColor: 'rgba(0,0,0,0.1)',
                tension: 0.4,
				pointRadius: 0,
                yAxisID: 'Precio',
                pointHoverRadius: 0,
			},
			]
		},
		options: {
            interaction: {
                mode: 'nearest', 
                axis: 'x', 
                intersect: false 
            },
			plugins: {
				legend: {
					display: true,
				},
				title: {
					display: false,
				},
				tooltip: {
                    // Esteticos del tooltip
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    titleColor: 'black',
                    bodyColor: 'black',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: true,
                    padding: 15,
                    // Poner en (X)
					callbacks: {
						label: function(context) {
                            if(context.dataset.label == "Price Per Share") {
                                agregar = ''
                            } else {
                                agregar = ' X'
                            }
							return context.dataset.label + ': ' + arondir(context.parsed.y)  + agregar;
						},
					}
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					},
				},
				Multiplo: {
                    display: true,
				    position: 'left',
                    ticks: {
						callback: function(value) {
							return value + 'X'; // Añade el símbolo de porcentaje a las etiquetas del eje y
						}
					},
				},
                Precio: {
                    display: true,
				    position: 'right',
                    grid: {
						display: false
					}
                }
			},
		}
	});
}




// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	if(valor == '') {
		valor = ''
	} else {
		parseFloat(valor);
		valor = Math.round(valor * 100) / 100
	}
	return valor;
}


// Funcion promedio y standard deviation
function arrayStatistics(arr) {
    // Filtrar los valores que no son NaN
    const filteredArr = arr.filter(val => !isNaN(val));

    // Calcular el promedio del array filtrado
    const mean = filteredArr.reduce((acc, val) => acc + val, 0) / filteredArr.length;
    
    // Calcular la desviación estándar del array filtrado
    const stdDev = Math.sqrt(filteredArr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / filteredArr.length);
    
    // Calcular una desviación estándar por encima y por debajo del promedio
    const oneStdAbove = mean + stdDev;
    const oneStdBelow = mean - stdDev;
    
    return {
        oneStdAbove: oneStdAbove,
        mean: mean,
        oneStdBelow: oneStdBelow
    };
}


// Function para tranformar numeor en millones billones o trillones
function millonesBillonesTrillones(numero) {
	negativo = 'no'
	if (numero < 0) {
		numero = numero*-1
		negativo = 'si'
	}
	if(numero >= 1000000000000) {
		numero = `${arondir(numero/1000000000000)}T`
	} else if(numero >= 1000000000) {
		numero = `${arondir(numero/1000000000)}B`
	} else if(numero >= 1000000) {
		numero = `${arondir(numero/1000000)}M`
	} else if(numero > 1000) {
		numero = `${arondir(numero/1000)}th`
	} 

	if(negativo == 'si') {
		numero = '-' + numero
	}
	return numero
}


// Finction para convertir en numero y en caso de null devolver 0
function numero(valor) {
	if (isNaN(parseFloat(valor))) {
		resultado = 0;
	} else {
		resultado = parseFloat(valor);
	}
	return resultado;
}


// Function caluclar TTM
function calcularTTM(data,enDonde, cual) {
	financialsQuarterly = data['Financials'][enDonde]['quarterly'];
	// Obtener nombres de objetos
	nombresObjetos = Object.keys(financialsQuarterly);
	// Tomar info de los ultimos 4 cuartos y sumar
	ttm =
		numero(financialsQuarterly[nombresObjetos[0]][cual]) +
		numero(financialsQuarterly[nombresObjetos[1]][cual]) +
		numero(financialsQuarterly[nombresObjetos[2]][cual]) +
		numero(financialsQuarterly[nombresObjetos[3]][cual]);
	return ttm;
}