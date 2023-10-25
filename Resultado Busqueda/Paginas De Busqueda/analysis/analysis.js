// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
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

// Function hacer grafica barras 
function hacerGraficaBarras(idContexto,labels,data1,data2,color) {
	ctx = document.getElementById(idContexto).getContext('2d');

	// Craecion de grafica
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					data: data1,
					label: 'Cash Flow Proyection',
					borderColor: color[0],
					backgroundColor: color[0],
					borderRadius: 10,
					order: 1,
				},
				{
					data: data2,
					label: 'Net Present Value',
					borderColor: color[1],
					backgroundColor: color[1],
					borderRadius: 10,
					type: 'line',
					order: 0,
				},
			],
		},
		options: {
			responsive: true,
			beginAtZero: true,
			interaction: {
				intersect: false,
				mode: 'index',
			},
			plugins: {
				legend: {
					display: true,
				},
				title: {
					display: true,
					text: 'Cash Flow',
					color: 'rgb(30, 30, 30)',
					font: {
						size: 20,
						family: 'Poppins',
						weight: 800,
					},
					padding: {
						bottom: 10,
					}
				},
				tooltip: {
					enabled: true,
                    displayColors: false,
                    boxPadding: 10,
					backgroundColor: 'rgb(255, 255, 255)',
					padding: {
						top: 10,
						bottom: 10,
						left: 20,
						right: 20,
					},
					titleColor: '#666666',
					titleFont: {
						size: 17,
						family: 'Poppins',
						weight: 'bold',
					},
                    titleAlign: 'center',
					bodyColor: '#666666',
					bodyFont: {
						size: 15,
						family: 'Poppins',
						weight: 500,
					},
					borderWidth: 1,
					borderColor: '#cfcfcf',
					cornerRadius: 10,
					callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
    
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += millonesBillonesTrillones(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
			},
			scales: {
				xAxes: {
					display: true,
					ticks: {
						color: 'rgb(30, 30, 30)',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 800,
						},
						autoSkip: false,
						maxRotation: 0,
						minRotation: 0,
					},
					grid: {
						display: false,
					},
				},
				yAxes: {
					display: true,
					ticks: {
						color: 'rgb(30, 30, 30)',
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 500,
                        },
						callback: function(value, index, ticks) {
							return millonesBillonesTrillones(value);
						},
					},
					grid: {
						display: false,
					},
				},
			},
		},
	});
	return myChart
}

// Ver si la info esta en porcetanje o no
function isPercentage(value) {
	if (typeof value !== 'string') {
	  return false; // value is not a string
	}
  
	const percentageRegex = /^-?\d+(\.\d+)?%$/; // regular expression to match percentages
	return percentageRegex.test(value);
}
// Function ver si es porcentaje si si devolver forma numerica si no mensaje error
function verPorcentaje(valor) {
	if(isPercentage(valor)) {
		valor = valor.split('%')[0]/100
	} else {
		mensajeError.textContent  = 'Only % values'
		constenedorMensajeError.style.display = 'flex'
		valor = NaN
	}
	return valor
}
// Function quitar mensaje error si no hay
function quitarMensajeError(arrayValores) {
	for(i=0;i<arrayValores.length;i++) {
		errores = 0
		if(isPercentage(arrayValores[i]) != true) {
			errores = errores + 1
		} 

		if(errores == 0) {
			mensajeError.textContent  = ''
			constenedorMensajeError.style.display = 'none'
		}
	}
}


// Function porcentaje
function porcentaje(valor) {
    return arondir(valor*100) + '%'
}

// Function para adicionar array
function sumArray(arr) {
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
	  if (typeof arr[i] === 'number') {
		sum += arr[i];
	  }
	}
	return sum;
}

// Tomar 5 años si es posible
function tomar5añosSiEsPosible(array) {
	if ((array.length >= 5)) {
		valor = 5;
	} else if ((array.length >= 4)) {
		valor = 4;
	} else if ((array.length >= 3)) {
		valor = 3;
	} else if ((array.length >= 2)) {
		valor = 2;
	} else {
		valor = 1;
	}
	return valor
}



// Function crear y agregar elemento
function crearYAgregarElemento(elementoPadre,tipoDeElementoCreacion,textoDeElementoCreacion) {
	nuevoElemento = document.createElement(tipoDeElementoCreacion)
	textoNodo = document.createTextNode(textoDeElementoCreacion)
	nuevoElemento.appendChild(textoNodo)
	elementoPadre.appendChild(nuevoElemento)
	return nuevoElemento
}

async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}

// codigo----------------------------------------------------------

function trabajarData(data) { 
	// Tomar Tresury Yield
	var tresuryYieldValue = tresuryYield('https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=IPEKTH6CFPNE7G3N')
	var añoHoy = new Date().getFullYear();
    // Tomar Ultimo Cahs Flow y asia atras si se puede 5 años
	añosAtras = tomar5añosSiEsPosible(Object.keys(data['Financials']['Balance_Sheet']['yearly']))
    financials = data['Financials']['Cash_Flow']['yearly']
    var ultimoCahsFlow = data['Financials']['Cash_Flow']['yearly'][Object.keys(financials)[0]]['freeCashFlow']
	cashFlowAtras = data['Financials']['Cash_Flow']['yearly'][Object.keys(financials)[añosAtras-1]]['freeCashFlow']
	// Calcular CAGR de ultimos 5 años si se puede
	cashFlowCAGR = (ultimoCahsFlow/cashFlowAtras)**(1/añosAtras) - 1 
 
	// Tomar mensaje error
	constenedorMensajeError = document.getElementById('marcarError')
	mensajeError = document.getElementById('errorMessage')
	// Hacer para el inicio-----------------------
	riskFreeRateElement = document.getElementById('riskFreeRate')
	expectedReturn = document.getElementById('expectedReturn').value
	añosAproyectar =  document.getElementById('añosProyectar').value
	grwothRate = document.getElementById('grwothRate').value  = porcentaje(cashFlowCAGR)
	perpetualGrwoth = document.getElementById('perpetualGrwothRate').value
	var requieredReturnElement  = document.getElementById('riquiredRateOfReturn')
	// Ver si la info esta en porcentaje y adaptarla en valor numerico
	grwothRate = verPorcentaje(grwothRate)
	perpetualGrwoth = verPorcentaje(perpetualGrwoth)
	expectedReturn = verPorcentaje(expectedReturn)


	// Craer Arrays de cash flows-----
    var arrayFechas = []
    var arrayCashFlow = []
    var arrayNetCashFlow = []
	// Push ultimo año de data reporatada
	arrayFechas.push(añoHoy - 1)
	arrayCashFlow.push(ultimoCahsFlow)
	arrayNetCashFlow.push(null)
	// Trabajar adentro del valor del bono
	tresuryYieldValue.then(value => {
		// Tomar Valor bono a 10 años
		riskFreeRate = verPorcentaje(value)
		// Calcular CAPM
		CAPM = riskFreeRate + data['Technicals']['Beta'] * (expectedReturn - riskFreeRate)
		requieredReturn = CAPM
		// Poner info en elementos
		riskFreeRateElement.value = porcentaje(riskFreeRate)
		requieredReturnElement.value = porcentaje(CAPM)

		// Calcukar cash flows y rellenar arrays
		for(i=0;i<añosAproyectar;i++) {
			ultimoCahsFlow = ultimoCahsFlow * (1+grwothRate)
			discountRate = (1+requieredReturn)**(i+1)
			netPresentValue  = ultimoCahsFlow/discountRate
			// Agregar a arrays
			arrayFechas.push(añoHoy + i)
			arrayCashFlow.push(ultimoCahsFlow)
			arrayNetCashFlow.push(netPresentValue)
			// Agregar elementos
			crearYAgregarElemento(trFechas,'th',añoHoy + i)
			crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(ultimoCahsFlow))
			crearYAgregarElemento(trDiscountRate,'td',arondir(discountRate))
			crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(netPresentValue))
		}
		// Crear terminal value----
		terminalValue = (ultimoCahsFlow*(1+perpetualGrwoth))/(requieredReturn - perpetualGrwoth)
		terminalDiscountRate = (1+requieredReturn)**(i+1)
		npvTerminalValue = terminalValue/terminalDiscountRate
		
		// Valor de la empresa
		sharesOutstanding = data['SharesStats']['SharesOutstanding']
		npv = (sumArray(arrayNetCashFlow) + npvTerminalValue) /  sharesOutstanding

		// Agregar elementos
		crearYAgregarElemento(trFechas,'th','Terminal Value')
		crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(terminalValue))
		crearYAgregarElemento(trDiscountRate,'td',arondir(terminalDiscountRate))
		crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(npvTerminalValue))

		// Crear Grafica
		graficaPrincipal = hacerGraficaBarras('graficaPrincipal',arrayFechas,arrayCashFlow,arrayNetCashFlow,['#60c4ad','#df6948'])

		// Poner resultados con precio actual 
		precioInfoRefresh(
			'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',npv
		);
	})



	// Ejecutar cada vez que se cambia un input----------------------------------------
	inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('change', () => {
			// Borrar contenido de la tabla
			function removeAllChildNodes(parent) {
				while (parent.lastChild) {
					parent.removeChild(parent.lastChild);
				}
			}
			
			removeAllChildNodes(trFechas)
			removeAllChildNodes(trFreeCashFlow)
			removeAllChildNodes(trDiscountRate)
			removeAllChildNodes(trNetPresentValue)
			ultimoCahsFlow = data['Financials']['Cash_Flow']['yearly'][Object.keys(financials)[0]]['freeCashFlow']
			// Push ultimo año de data reporatada
			// Tomar Elementos
			riskFreeRate = document.getElementById('riskFreeRate').value
			expectedReturn = document.getElementById('expectedReturn').value
			añosAproyectar =  document.getElementById('añosProyectar').value
			grwothRate = document.getElementById('grwothRate').value
			perpetualGrwoth = document.getElementById('perpetualGrwothRate').value
			requieredReturnElement  =document.getElementById('riquiredRateOfReturn')
			quitarMensajeError([grwothRate,perpetualGrwoth,riskFreeRate,expectedReturn])
			// Ver si la info esta en porcentaje y adaptarla en valor numerico
			grwothRate = verPorcentaje(grwothRate)
			perpetualGrwoth = verPorcentaje(perpetualGrwoth)
			riskFreeRate = verPorcentaje(riskFreeRate)
			expectedReturn = verPorcentaje(expectedReturn)
			CAPM = riskFreeRate + data['Technicals']['Beta'] * (expectedReturn - riskFreeRate)
			requieredReturn = CAPM
			requieredReturnElement.value = porcentaje(CAPM)

			// Agregar elementos a tabla------------------------
			// Agregar años----
			arrayFechas = []
			arrayCashFlow = []
			arrayNetCashFlow = []
			// Push ultimo año de data reporatada
			arrayFechas.push(añoHoy - 1)
			arrayCashFlow.push(ultimoCahsFlow)
			arrayNetCashFlow.push(null)
			for(i=0;i<añosAproyectar;i++) {
				ultimoCahsFlow = ultimoCahsFlow * (1+grwothRate)
				discountRate = (1+requieredReturn)**(i+1)
				netPresentValue  = ultimoCahsFlow/discountRate
				// Agregar a arrays
				arrayFechas.push(añoHoy + i)
				arrayCashFlow.push(ultimoCahsFlow)
				arrayNetCashFlow.push(netPresentValue)
				// Agregar elementos
				crearYAgregarElemento(trFechas,'th',añoHoy + i)
				crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(ultimoCahsFlow))
				crearYAgregarElemento(trDiscountRate,'td',arondir(discountRate))
				crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(netPresentValue))
			}

			// Agregar terminal value----
			terminalValue = (ultimoCahsFlow*(1+perpetualGrwoth))/(requieredReturn - perpetualGrwoth)
			terminalDiscountRate = (1+requieredReturn)**(i+1)
			npvTerminalValue = terminalValue/terminalDiscountRate

			// Valor de la empresa
			npv = (sumArray(arrayNetCashFlow) + npvTerminalValue) /  sharesOutstanding

			// Agregar elementos
			crearYAgregarElemento(trFechas,'th','Terminal Value')
			crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(terminalValue))
			crearYAgregarElemento(trDiscountRate,'td',arondir(terminalDiscountRate))
			crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(npvTerminalValue))

			// Cambiar Valores Grafica
			graficaPrincipal.config.data.labels = arrayFechas
			graficaPrincipal.config.data.datasets[0].data = arrayCashFlow
			graficaPrincipal.config.data.datasets[1].data = arrayNetCashFlow
			graficaPrincipal.update()

			precioInfoRefresh(
				'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',npv
			);
			
		});
	});
}

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')


// Sakar precio de accion ---------------
// Defining async function
async function precioInfoRefresh(url,valorEncontrado) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	closePriceAperturaCitio = trabajarInfoPrecioRefresh(data,valorEncontrado);
	return closePriceAperturaCitio;
}

// Trabaja data de precio
function trabajarInfoPrecioRefresh(data,valorEncontrado) {
	closePriceMinuto = data['close'];

	// Poner info en sitio---------
	// Tomar elementos
	documentoPrecio = document.getElementById('todayPrice');
	// Rellenar elementos
	documentoPrecio.innerHTML = arondir(closePriceMinuto);
	// Agregar info a resultados de dcf
	posibleCambioElemento = document.getElementById('posibleChange')
	dcfValuationElemento = document.getElementById('dcfValuation')
	textoPosibleChange = document.getElementById('textoPosibleChange')
	cambio = valorEncontrado/closePriceMinuto - 1
	posibleCambioElemento.textContent = porcentaje(cambio)
	if(cambio >= 0) {
		textoPosibleChange.textContent = 'Posible Upside'
		posibleCambioElemento.style.color = '#188038'
	} else {
		textoPosibleChange.textContent = 'Posible Downside'
		posibleCambioElemento.style.color = '#d93025'
	}
	dcfValuationElemento.textContent = arondir(valorEncontrado)


	return closePriceMinuto;
}

// Sakar 10 years tresury yield   https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=IPEKTH6CFPNE7G3N
// No tengo el premium maximo puedo sakar 5 madres por minuto tendre que comprar premium
async function tresuryYield(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	tresuryYieldValue = trabajasrTresuryYield(data)
	return tresuryYieldValue
}

function trabajasrTresuryYield(data) {
	if(data['Note'] != undefined) {
		tresuryYieldValue = '3.45%'
		console.log('Contrata el premium')
	} else {
		tresuryYieldValue = data['data'][0]['value'] + '%'
	}
	return tresuryYieldValue
}



