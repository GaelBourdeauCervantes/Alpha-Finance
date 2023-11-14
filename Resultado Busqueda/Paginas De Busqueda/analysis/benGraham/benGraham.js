// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}


function trabajarData(data) {
    // Tomar Info
    equityLastYear = añoEspecifico(data,'Balance_Sheet','totalStockholderEquity',0)
    totalRevenueLastYear = añoEspecifico(data,'Income_Statement','totalRevenue',0) 
    sharesOutstanding = data['SharesStats']['SharesOutstanding']
    reportedEps = data['Highlights']['EarningsShare']
    añosAtras = tomar5añosSiEsPosible(Object.keys(data['Financials']['Income_Statement']['yearly']))
    ultimoNetIncomme = añoEspecifico(data,'Income_Statement','netIncome',0)
	netIncommeAtras = añoEspecifico(data,'Income_Statement','netIncome',añosAtras)
	// Calcular CAGR de ultimos 5 años si se puede
	netIncomeCAGR = (ultimoNetIncomme/netIncommeAtras)**(1/añosAtras) - 1 
    
    // Loop para calcular promedios
    arrayRoe = []
    arrayRoic = []
    arrayNetMargin = []
    arrayInvestedCapital = []
    for(i = 0; i<añosAtras; i++) {
        // Calcular ROE
        netIncome = añoEspecifico(data,'Income_Statement','netIncome',i) 
        equity = añoEspecifico(data,'Balance_Sheet','totalStockholderEquity',i)
        roe = ROE(netIncome,equity)
        arrayRoe.push(roe)
        // Calcular ROIC
        operatingIncome  = añoEspecifico(data,'Income_Statement', 'operatingIncome', i); 
		taxProvision = añoEspecifico(data,'Income_Statement', 'taxProvision', i); 
		pretaxIncome = añoEspecifico(data,'Income_Statement', 'incomeBeforeTax', i); 
		shortLongTermDebtTotal = añoEspecifico(data,'Balance_Sheet', 'shortLongTermDebtTotal',i); 
		shortTermInvestments = añoEspecifico(data,'Balance_Sheet', 'shortTermInvestments',i); 
		goodWill = añoEspecifico(data,'Balance_Sheet', 'goodWill',i); 
        dataRoic = ROIC(operatingIncome, taxProvision, pretaxIncome, equity, shortLongTermDebtTotal, shortTermInvestments, goodWill)
        roic = dataRoic[0]
        investedCapital  = dataRoic[2]
        arrayRoic.push(roic)
        arrayInvestedCapital.push(investedCapital)
        // Calcular Net Margin
        totalRevenue = añoEspecifico(data,'Income_Statement','totalRevenue',i) 
        netMargin = netIncome / totalRevenue 
        arrayNetMargin.push(netMargin)
    }
    promedioROE = calculateMean(arrayRoe)
    promedioROIC = calculateMean(arrayRoic)
    promedioNetMargin = calculateMean(arrayNetMargin)
    investedCapitalLastYear = arrayInvestedCapital[0]

    // Calcular Normalized Incomme
    // ROE
    normalizedIncomeROE = promedioROE * equityLastYear
    nomralizedEPSROE = normalizedIncomeROE / sharesOutstanding
    // ROIC
    normalizedIncomeROIC = promedioROIC * investedCapitalLastYear
    nomralizedEPSROIC = normalizedIncomeROIC / sharesOutstanding
    // Net Income Margin
    normalizedIncomeNetMargin = promedioNetMargin * totalRevenueLastYear
    nomralizedEPSNetMargin = normalizedIncomeNetMargin / sharesOutstanding
    // Promedio EPS normalizado
    normalizedEPS = (nomralizedEPSNetMargin + nomralizedEPSROIC + nomralizedEPSROE)/3

    // Para Graham Number
    BVPS = equityLastYear / sharesOutstanding

    // Poner Info en el sitio
    // ROE
    // Tomar Elementos
    avrageROEDocument = document.getElementById('avrageRoe')
    equityDocument = document.getElementById('equity')
    normIncomeROEDocument  = document.getElementById('normIncomeROE')
    sharesROEDocument = document.getElementById('sharesROE')
    nomrEPSROEDocument = document.getElementById('nomrEPSROE')
    // Rellenar Elementos
    avrageROEDocument.textContent = porcentaje(promedioROE)
    equityDocument.textContent = millonesBillonesTrillones(equityLastYear)
    normIncomeROEDocument.textContent = millonesBillonesTrillones(normalizedIncomeROE)
    sharesROEDocument.textContent = millonesBillonesTrillones(sharesOutstanding)
    nomrEPSROEDocument.textContent = arondir(nomralizedEPSROE)
    // ROIC
    // Tomar Elementos
    avrageROICDocument = document.getElementById('avrageROIC')
    investedCapitalDocument = document.getElementById('investedCapital')
    normIncomeNIROICDocument  = document.getElementById('normIncomeNIROIC')
    sharesROICDocument = document.getElementById('sharesROIC')
    nomrEPSROICDocument = document.getElementById('nomrEPSROIC')
    // Rellenar Elementos
    avrageROICDocument.textContent  = porcentaje(promedioROIC)
    investedCapitalDocument.textContent = millonesBillonesTrillones(investedCapitalLastYear)
    normIncomeNIROICDocument.textContent = millonesBillonesTrillones(normalizedIncomeROIC)
    sharesROICDocument.textContent = millonesBillonesTrillones(sharesOutstanding)
    nomrEPSROICDocument.textContent  = arondir(nomralizedEPSROIC)
    // Net Incomme 
    // Tomar Elementos
    avrageNetMarginDocument = document.getElementById('avrageNetMargin')
    revenueDocument = document.getElementById('revenue')
    normNINetMarginDocument = document.getElementById('normNINetMargin')
    sharesNetMarginDocument = document.getElementById('sharesNetMargin')
    normEPSNetMarginDocument = document.getElementById('normEPSNetMargin')
    // Rellenar Elementos
    avrageNetMarginDocument.textContent  = porcentaje(promedioNetMargin)
    revenueDocument.textContent = millonesBillonesTrillones(totalRevenueLastYear)
    normNINetMarginDocument.textContent = millonesBillonesTrillones(normalizedIncomeNetMargin)
    sharesNetMarginDocument.textContent = millonesBillonesTrillones(sharesOutstanding)
    normEPSNetMarginDocument.textContent = arondir(nomralizedEPSNetMargin)

    // Tomar elementos y rellenar para inputs promedio eps y graham number
    // Mensaje error
    constenedorMensajeError = document.getElementById('marcarError')
	mensajeError = document.getElementById('errorMessage')
    // Inputs
    // Tomar Elementos
    grwothRateEPSDocumento = document.getElementById('grwothRateEPS')
    epsForIntrinsicValueDocumento = document.getElementById('epsForIntrinsicValue')
    bondYeildAAADocumento = document.getElementById('bondYeildAAA')
    // Rellenar Elementos
    if(tomarValorLocalStorage(ticker + ': grwothRateEPS') == 'undefined') {
        grwothRateEPSDocumento.value = porcentaje(netIncomeCAGR)
    } else {
        grwothRateEPSDocumento.value = tomarValorLocalStorage(ticker + ': grwothRateEPS')
    }
    if(tomarValorLocalStorage(ticker + ': epsForIntrinsicValue') == 'undefined') {
        epsForIntrinsicValueDocumento.value = arondir(normalizedEPS)
    } else {
        epsForIntrinsicValueDocumento.value = tomarValorLocalStorage(ticker + ': epsForIntrinsicValue')
    }
    if(tomarValorLocalStorage(ticker + ': bondYeildAAA') == 'undefined') {
        bondYeildAAADocumento.value = '4.35%'
    } else {
        bondYeildAAADocumento.value = tomarValorLocalStorage(ticker + ': bondYeildAAA')
    }

    // Promedio EPS y coriente EPS
    // Tomar Elementos
    normalizedEPSDocumento = document.getElementById('normalizedEPS')
    reportedEPSDocumento  = document.getElementById('reportedEPS')
    // Rellenar elementos
    normalizedEPSDocumento.textContent = arondir(normalizedEPS)
    reportedEPSDocumento.textContent  = arondir(reportedEps)

    // Graham Number
    epsForGrahamNumberDocumento  = document.getElementById('epsForGrahamNumber')
    bookValuePerShareDocumento = document.getElementById('bookValuePerShare')
    grahamNumberDocumento  = document.getElementById('grahamNumber')
    // Rellenar Elementos
    if(tomarValorLocalStorage(ticker + ': epsForGrahamNumber') == 'undefined') {
        epsForGrahamNumberDocumento.value  = arondir(normalizedEPS)
    } else {
        epsForGrahamNumberDocumento.value  = tomarValorLocalStorage(ticker + ': epsForGrahamNumber')
    }
    bookValuePerShareDocumento.textContent  = arondir(BVPS)
    // Calcular Graham Number
    grahamNumber = Math.sqrt(22.5 * epsForGrahamNumberDocumento.value * BVPS)
    grahamNumberDocumento.textContent = arondir(grahamNumber)

    // Calcular intrinsic Value
    intrinsicValue = (epsForIntrinsicValueDocumento.value * (8.5 + 2 * (verPorcentaje(grwothRateEPSDocumento.value)*100))*4.4)/(verPorcentaje(bondYeildAAADocumento.value)*100)

    // Tomar precio al abrir citio
	precioInfoRefresh(
		'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',intrinsicValue
	);

	// Ejecutar cada vez que se cambia un input----------------------------------------
	inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('change', () => {
			// Tomar Elementos
            grwothRateEPSDocumento = document.getElementById('grwothRateEPS').value
            epsForIntrinsicValueDocumento = document.getElementById('epsForIntrinsicValue').value
            bondYeildAAADocumento = document.getElementById('bondYeildAAA').value
            epsForGrahamNumberDocumento  = document.getElementById('epsForGrahamNumber').value
            quitarMensajeError([grwothRateEPSDocumento,bondYeildAAADocumento])
            // Guardar Valores en local storage
            guardarValorLocalStorage(ticker + ': grwothRateEPS',grwothRateEPSDocumento)
            guardarValorLocalStorage(ticker + ': epsForIntrinsicValue',epsForIntrinsicValueDocumento)
            guardarValorLocalStorage(ticker + ': bondYeildAAA',bondYeildAAADocumento)
            guardarValorLocalStorage(ticker + ': epsForGrahamNumber',epsForGrahamNumberDocumento)

			// Ver si la info esta en porcentaje y adaptarla en valor numerico
			grwothRateEPSDocumento = verPorcentaje(grwothRateEPSDocumento)
			bondYeildAAADocumento = verPorcentaje(bondYeildAAADocumento)
			
            // Calcular intrinsic Value
            intrinsicValue = (epsForIntrinsicValueDocumento * (8.5 + 2 * (grwothRateEPSDocumento*100))*4.4)/(bondYeildAAADocumento*100)

            // Graham Number
            grahamNumber = Math.sqrt(22.5 * epsForGrahamNumberDocumento * BVPS)
            grahamNumberDocumento.textContent = arondir(grahamNumber)
			precioInfoRefresh(
				'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',intrinsicValue
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



// ROIC function roic[0] nopat[1] investedCapital[2] 
function ROIC(
    operatingIncome,
    taxProvision,
    incomeBeforeTax,
    totalStockholderEquity,
    shortLongTermDebtTotal,
    shortTermInvestments,
    goodWill
) {
    if (numero(taxProvision) / numero(incomeBeforeTax) > 1) {
        taxRate = 1;
    } else if (numero(taxProvision) / numero(incomeBeforeTax) < 0) {
        taxRate = 0;
    } else {
        taxRate = numero(taxProvision) / numero(incomeBeforeTax);
    }
    nopat = numero(operatingIncome) * (1 - taxRate);
    investedCapital = numero(totalStockholderEquity) + numero(shortLongTermDebtTotal) + numero(shortTermInvestments)  - numero(goodWill)
    let roic = nopat / investedCapital;
    return [roic,nopat,investedCapital];
}

// ROE function
function ROE(netIncome,equity) {
    roe = netIncome / equity;
    return roe
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

// Function para escoger un año especifico
function añoEspecifico(data,enDonde, cual, año) {
	financialsYoy = data['Financials'][enDonde]['yearly'];
	// Obtener nombres de objetos
	nombresObjetos = Object.keys(financialsYoy);
	if(año >= nombresObjetos.length)  {
		valor = null
	} else {
		// OBtener valor
		valor = financialsYoy[nombresObjetos[año]][cual];
	}
	return numero(valor);
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

// Function para calcular pormedio de un array
function calculateMean(array) {
    if (array.length === 0) {
      return 0;
    }
  
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue);
    const mean = sum / array.length;
  
    return mean;
}

// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
}

// Function porcentaje
function porcentaje(valor) {
    return arondir(valor*100) + '%'
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
