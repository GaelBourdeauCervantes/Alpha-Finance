// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}

// Caluclar Promedio Valor Intrinsico
dcfIntrinsicValue = parseFloat(tomarValorLocalStorage(ticker + ': DCF intrinsic value: '))
benGrahamIntrinsicValue = parseFloat(tomarValorLocalStorage(ticker + ': Ben Graham intrinsic value: '))
valuationMultiplesIntrinsicValue = parseFloat(tomarValorLocalStorage(ticker + ': Valuation Multiples intrinsic value: '))
intrinsicValue = calculateArrayAverage([dcfIntrinsicValue,benGrahamIntrinsicValue,valuationMultiplesIntrinsicValue])
// Poner intrinsic value en tabla
// Tomar elementos
dcfIntrinsicValueElement = document.getElementById('intrinsicValueDCF')
benGrahamIntrinsicValueElement = document.getElementById('intrinsicValueBenGraham')
valuationMultiplesIntrinsicValueElement = document.getElementById('intrinsicValueMultiplesValue')
// Rellenar Elementos
dcfIntrinsicValueElement.innerText  = arondir(dcfIntrinsicValue)
benGrahamIntrinsicValueElement.innerText = arondir(benGrahamIntrinsicValue)
valuationMultiplesIntrinsicValueElement.innerText = arondir(valuationMultiplesIntrinsicValue)

// Poner el valor intrinsico promedio al abirir el citio
precioInfoRefresh(
    'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',intrinsicValue
);

// Trabjar grafica
// Defining async function para data YTD y hacer grafica
async function trabajarDataHistoricaGrafica(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	precioInicialYTD = trabajarDataGrafica(data);
	return precioInicialYTD
}

function trabajarDataGrafica(data) {
	// Separara Info
	closePriceArray = [];
	dateArray = [];
	for (i = 0; i < data.length; i++) {
		closePriceArray.push(data[i]['adjusted_close']);
		dateArray.push(data[i]['date']);
	}
	// Hacer Grafica
	graficaPrincipal = hacerGraficaValorIntrinsico(
		'graficaPrecio',
		closePriceArray,
		dateArray,
        intrinsicValue,
        dcfIntrinsicValue,
        benGrahamIntrinsicValue,
        valuationMultiplesIntrinsicValue,
		2,
		500,
		0,
	);
    // Poner primera y ultima fecha de la grafica en los elementos de abajo de la grafica
    // Tomar elementos
    elementoFechaInicial = document.getElementById('elementoFechaInicial')
    elementoFechaFinal = document.getElementById('elementoFechaFinal')
    // Rellenar elemntos
    elementoFechaInicial.textContent = dateArray[0]
    elementoFechaFinal.textContent = dateArray[dateArray.length-1]
	return [closePriceArray[0],graficaPrincipal]
}

// tomar fecha incial de 1y y fecha hoy
// Definir fecha de hoy de data------
const fechaHoy = transformarFechaMoment(moment());
m1 = moment();
const fecha1y = transformarFechaMoment(m1.year(m1.year() - 1).day(m1.day()));

// Hacer grafica
urlInicial =
	'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fecha1y +
	'&to=' +
	fechaHoy +
	'&period=d&fmt=json&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX';
precioInicialYTDyGrafica = trabajarDataHistoricaGrafica(urlInicial);





















// Functiones ----------------------------------------------------------------------------------------------------------------------------
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

// Function para hacer la grafica
// Function para hacer grafica historica de acciones falta tooltip para grafica dual
function hacerGraficaValorIntrinsico(
	idContexto,
	data,
	labels,
    valorIntrinsico,
    valorIntrinsicoDCF,
    valorIntrinsicoBenGraham,
    valorIntrinsicoMultiples,
	anchoLinea,
	alturaContexto,
	duracionAnimacion
) {
	ctx = document.getElementById(idContexto).getContext('2d');
	// Definir animaciones
	const totalDuration = duracionAnimacion;
	const delayBetweenPoints = totalDuration / data.length;
	const previousY = (ctx) =>
		ctx.index === 0
			? ctx.chart.scales.y.getPixelForValue(100)
			: ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

	// Hacer Gradiante--------------
	// Obtener color de fondo
	fondo = document.body.style.backgroundColor;
	if (fondo == '') {
		fondo = 'rgb(255,255,255)';
	}
	// Hacer Difuminado positivo
	gradiantePositivo = ctx.createLinearGradient(0, 0, 0, alturaContexto);
	gradiantePositivo.addColorStop(0, 'rgba(68,136,238)');
	gradiantePositivo.addColorStop(1, fondo);
	// Hacer Difuminado Negativo
	gradientNegativo = ctx.createLinearGradient(0, 0, 0, alturaContexto);
	gradientNegativo.addColorStop(0, 'rgba(137,137,137)');
	gradientNegativo.addColorStop(1, fondo);


    // Separar data 
    let lineaValorIntrinsico = [];
    let lineaDcfInrinsicValue = [];
    let lineaBenGrahamINtrinsicValue = [];
    let lineaINtrinsicValueMultiples = [];
    let lineaPositiva = [];
    let lineaNegativa = [];

    // Hacer Linea de apertura
    for (i = 0; i < data.length; i++) {
        lineaValorIntrinsico.push(valorIntrinsico);
        lineaDcfInrinsicValue.push(valorIntrinsicoDCF)
        lineaBenGrahamINtrinsicValue.push(valorIntrinsicoBenGraham)
        lineaINtrinsicValueMultiples.push(valorIntrinsicoMultiples)
        if (data[i] > valorIntrinsico) {
            lineaNegativa.push(data[i]);
            lineaPositiva.push(NaN);
        } else {
            lineaNegativa.push(NaN);
            lineaPositiva.push(data[i]);
        }
    }
    juntarArray(lineaPositiva, lineaNegativa);
    // custom tooltip block
    const getOrCreateToolTip = (chart) => {
        let tooltipEL = chart.canvas.parentNode.querySelector('div')
        if(!tooltipEL) {
            tooltipEL = document.createElement('div')
            tooltipEL.classList.add('tooltipGraficaPrincipalDesign')
            tooltipUL = document.createElement('ul')
            tooltipUL.classList.add('tooltipul')

            // append to parent
            tooltipEL.appendChild(tooltipUL)
            chart.canvas.parentNode.appendChild(tooltipEL)
        }
        return tooltipEL
    }
    // 1 trigger
    const externalToolTip = (context) => {
        const {chart, tooltip} = context;
        const tooltipEL = getOrCreateToolTip(chart);

        // 3 hide if mouseout
        if(tooltip.opacity == 0) {
            tooltipEL.style.opacity = 0 
            return
        }

        // 4 tooltip text
        // tomo body 0 porque ese es el array de precio que cambia el 1
        if(tooltip.body[0]) {
            const arrayLabels = tooltip.title  || []
            const arrayPrecios = tooltip.body[0]['lines']
            const arrayIntrinsicValue = tooltip.body[1]['lines']
            const tooltipLI = document.createElement('li')
            // 4a title loop
            arrayLabels.forEach(title => {
                tooltipUL.appendChild(tooltipLI)
                // creat span
                const tooltipSPAN = document.createElement('span')
                tooltipLI.appendChild(tooltipSPAN)
                // creat a text node with the title
                const tooltipTitle = document.createTextNode(title)
                tooltipSPAN.appendChild(tooltipTitle)
            })

            // 4b body loop
            const tooltipPrecioP = document.createElement('p')
            const tooltipCambioP = document.createElement('p')
            tooltipPrecioP.classList.add('textoPrecio')
            tooltipCambioP.classList.add('textoCambio')
            arrayPrecios.forEach((body,i) => {
                priceEnLugar = parseFloat(body.split(',')[0] + '.' + body.split(',')[1])
                priceIntrinsicValue = parseFloat(arrayIntrinsicValue[0].split(',')[0] + '.' + arrayIntrinsicValue[0].split(',')[1])
                margenOfSafety = arondir((priceIntrinsicValue/priceEnLugar-1)*100)
                const textLabelPrecio = document.createTextNode(`Price: ${arondir(priceEnLugar)}`)
                const textLabelCambio = document.createTextNode(`Margin of safety: ${margenOfSafety}%`)
                // append text label
                tooltipPrecioP.appendChild(textLabelPrecio)
                tooltipCambioP.appendChild(textLabelCambio)
                // Cambiar color de tooltip
                if(margenOfSafety > 0) {
                    tooltipEL.style.backgroundColor = 'rgba(68,136,238, 0.8)'
                } else {
                    tooltipEL.style.backgroundColor = 'rgba(137,137,137, 0.8)'
                }
            })
            const ULnode = tooltipEL.querySelector('ul')
            // remove old children
            while(ULnode.firstChild) {
                ULnode.firstChild.remove()
            }
            // add new childre
            ULnode.appendChild(tooltipLI)
            tooltipLI.appendChild(tooltipPrecioP)
            tooltipLI.appendChild(tooltipCambioP)
            tooltipEL.style.opacity = 1

            // positioning of the tooltip
            const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas
            tooltipEL.style.left = positionX + tooltip.caretX + 'px'
            tooltipEL.style.top = positionY + tooltip.caretY - ((positionY + tooltip.caretY)*0.1) + 'px' 
        }
    },

    // Hacer grafica
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
               
                {
                    data: lineaPositiva,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointBackgroundColor: 'rgb(68,136,238)',
                    pointBorderColor: 'rgb(68,136,238)',
                    borderColor: 'rgb(68,136,238)',
                    tension: 0.5,
                    fill: '+2',
                    backgroundColor: gradiantePositivo,
                    borderWidth: anchoLinea,
                },
                {
                    data: lineaNegativa,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointRadius: 0,
                    pointBackgroundColor: 'rgba(137,137,137)',
                    pointBorderColor: 'rgba(137,137,137)',
                    borderColor: 'rgba(137,137,137)',
                    tension: 0.5,
                    fill: '+1',
                    backgroundColor: gradientNegativo,
                    borderWidth: anchoLinea,
                },
                {
                    data: lineaValorIntrinsico,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderColor: '#F4CE14',
                    borderWidth: 5,
                },
            ],
        },
        options: {
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    },
                },
                y: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    },
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                    external: externalToolTip ,
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: true
                    },
                }
            },
        },
    });
    return myChart;

}

// Funcion para Juntar Arrays Principio con Final para Graficas de Indices
function juntarArray(Array1, Array2) {
	for (i = 1; i <= Array1.length; i++) {
		if (isNaN(Array1[i]) && isNaN(Array1[i - 1]) == false) {
			var ultimoValorIndice = Array1[i - 1];
		} else if (isNaN(Array2[i]) && isNaN(Array2[i - 1]) == false) {
			var ultimoValorIndice = Array2[i - 1];
		}

		if (isNaN(Array1[i - 1]) && isNaN(Array1[i]) == false) {
			Array1[i - 1] = ultimoValorIndice;
		} else if (isNaN(Array2[i - 1]) && isNaN(Array2[i]) == false) {
			Array2[i - 1] = ultimoValorIndice;
		}
	}
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

// Function porcentaje
function porcentaje(valor) {
    return arondir(valor*100) + '%'
}

// Function to calcukate the avrage of an array
function calculateArrayAverage(arr) {
    if (!Array.isArray(arr)) {
      return "Input is not an array";
    }
  
    if (arr.length === 0) {
      return "Array is empty";
    }
  
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue);
    const average = sum / arr.length;
  
    return average;
  }

// Función para guardar el valor en el almacenamiento local
function guardarValorLocalStorage(nombre,valor) {
	localStorage.setItem(nombre, valor);
}
// Function para tomar valor en localstorage
function tomarValorLocalStorage(nombre) {
	valor = localStorage.getItem(nombre)
	if(valor == null) {
		valor = 'undefined'
	} else {
		valor = valor
	}
	return valor
}

// Function para transformar fecha bien en string de api moment()
function transformarFechaMoment(fechaMoment) {
	añoMoment = fechaMoment.get('year');
	if (fechaMoment.get('month') +1 < 10) {
		mesMoment = `0${fechaMoment.get('month') + 1}`;
	} else {
		mesMoment = fechaMoment.get('month') + 1;
	}
	if (fechaMoment.get('date') < 10) {
		diaMoment = `0${fechaMoment.get('date')}`;
	} else {
		diaMoment = fechaMoment.get('date');
	}
	fechaBien = `${añoMoment}-${mesMoment}-${diaMoment}`;
	return fechaBien;
}