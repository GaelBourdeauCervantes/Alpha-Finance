// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = '60c184d42ae3a5.75307084'



// Sacar Data Identidad------------------------------------------------------------------
// Definir async
async function asyncTrabajarIdentidad(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarIdentidad(data)
}
// Defirnir function para trabajar Identida
function trabajarIdentidad(data) {
	// Tomar elemntos
	fullName = data['Name'];
	ticker = data['Code'];
	webUrl = data['WebURL'];
	logoURL = `https://eodhistoricaldata.com/${data['LogoURL']}`;
	// Obetener elementos a rellenar
	documentoLinEmpresa = document.getElementById('linkPaginaEmpresa')
	documentoLogoEmpresa = document.getElementById('logoEmpresa');
	documentoNombreEmpresa = document.getElementById('nombreEmpresa');
	documentoTickerEmpresa = document.getElementById('tickerEmpresa');
	// Rellenar Elementos
	documentoLinEmpresa.href = webUrl;
	documentoLogoEmpresa.src = logoURL;
	documentoNombreEmpresa.innerHTML = fullName;
	documentoTickerEmpresa.innerHTML = `(${ticker})`;
}
// Ejecutar async funtcion
asyncTrabajarIdentidad('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?filter=General&api_token='+apiToken)



// Calcular inicadores historicos----------------------------------------------------------
// Definir Async function
async function asyncTrabajarMiIndicador(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	tarabajarMiIndicador(data)
}

// Definir Function tomar trabajar data
function tarabajarMiIndicador(data) {
	// Tomar llaves de array
	arrayLlaves = Object.keys(data['Cash_Flow']['yearly'])
	largoFechas = arrayLlaves.length
	// Crear array de precios anuales desde fecha inicial a hoiy
	fechaPrecioInicio = arrayLlaves[largoFechas-1]
	fechaPrecioFinal = new Date().toISOString().split('T')[0]
	urlPrecio = 'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fechaPrecioInicio +
	'&to=' +
	fechaPrecioFinal +
	'&period=d&fmt=json&api_token='+apiToken+'';
	arrayAnualClose = asynctrabajarDataPrecio(urlPrecio)
	
	// Iniziar loop desde el penultimo ano de data adentro de arrayPrecio
	arrayZscore = []
	arrayFscore = []
	arrayMscore = []
	arrayRoic = []
	arrayPuntuacion = []
	labelsGrafica = []
	arrayAnualPrice = []
	arrayAnualClose.then(arrayAnualClose => {
		arrayAnualClose.reverse()
		for(i = 0; i < largoFechas - 1; i++) {
			// Definir Llave de ano i
			llave = arrayLlaves[i]
			llaveAtras = arrayLlaves[i + 1]
			if(i + 5 >= arrayLlaves.length) {
				llav5Atras = arrayLlaves[arrayLlaves.length - 1]
				numero5Atras = arrayLlaves.length - 1 - i
			} else {
				llav5Atras = arrayLlaves[i + 5]
				numero5Atras = 5
			}
			// Entrar en valor precio
			// Tomar Income Statment
			incomeStatement = data['Income_Statement']['yearly'][llave]
			incomeStatementATras = data['Income_Statement']['yearly'][llaveAtras]
			incomeStatement5ATras = data['Income_Statement']['yearly'][llav5Atras]
			// Tomar Balance sheets
			balanceSheet = data['Balance_Sheet']['yearly'][llave]
			balanceSheetAtras = data['Balance_Sheet']['yearly'][llaveAtras]
			// Tomar Cash Flow Statment
			cashFlowStatement = data['Cash_Flow']['yearly'][llave]
			cashFlowStatementAtras = data['Cash_Flow']['yearly'][llaveAtras]
			// Tomar Data para indicadores---------------------------
			priceStock = arrayAnualClose[i]['adjustedClose']
			sharesOutstannding = balanceSheet['commonStockSharesOutstanding']
			marketCap = priceStock * sharesOutstannding
			totalRevenue = incomeStatement['totalRevenue']
			totalRevenueAtras = incomeStatementATras['totalRevenue'] 
			grossProfit = incomeStatement['grossProfit']
			totalLiabilities = balanceSheet['totalLiab']
			totalAssets = balanceSheet['totalAssets']
			totalAssetsAtras = balanceSheetAtras['totalAssets']
			netIncomeAtras = incomeStatementATras['netIncome']
			currentAssets = balanceSheet['totalCurrentAssets']
			currentLiabilities = balanceSheet['totalCurrentLiabilities']
			netIncome = incomeStatement['netIncome']
			totalDebt = balanceSheet['shortLongTermDebtTotal']
			freeCashFlow = cashFlowStatement['freeCashFlow']
			dividendsPaid = cashFlowStatement['dividendsPaid']
			dividenPerShare = dividendsPaid / sharesOutstannding
			dividenYield = dividenPerShare / priceStock
			pe = marketCap / netIncome
			if(numero5Atras != 1) {
				totalRevenueG = (incomeStatementATras['totalRevenue']  / incomeStatement5ATras['totalRevenue']) ** (1/numero5Atras) -1
				netIncomeG = (incomeStatement['netIncome'] / incomeStatement5ATras['netIncome']) ** (1/numero5Atras) -1
			} 
			pegRatio = pe / (netIncomeG*100)
			// Calcular Scores
			// Z scores
			zScore = Zscore(
				currentAssets,
				currentLiabilities,
				totalAssets,
				balanceSheet['retainedEarnings'],
				incomeStatement['ebit'],
				marketCap,
				totalLiabilities,
				totalRevenue
			);
			arrayZscore.push(zScore)
	
			// Calcular F-score
			roa = netIncome / totalAssets
			roaAtras = netIncomeAtras / totalAssetsAtras
			cfroa = cashFlowStatement['totalCashFromOperatingActivities'] / totalAssets
			currentRatio = currentAssets/currentLiabilities
			currentRatioAtras = balanceSheetAtras['totalCurrentAssets']/balanceSheetAtras['totalCurrentLiabilities']
			grossMargin = grossProfit / totalRevenue 
			grossMarginAtras = incomeStatementATras['grossProfit'] / totalRevenueAtras
			assetsTurnOver =  totalRevenue / totalAssets
			assetsTurnOverAtras = totalRevenueAtras / totalAssetsAtras
			fScore = Fscore(
				roa,
				roaAtras,
				cfroa,
				cashFlowStatement['totalCashFromOperatingActivities'],
				totalDebt,
				balanceSheetAtras['shortLongTermDebtTotal'],
				currentRatio,
				currentRatioAtras,
				sharesOutstannding,
				balanceSheetAtras['commonStockSharesOutstanding'],
				grossMargin,
				grossMarginAtras,
				assetsTurnOver,
				assetsTurnOverAtras
			);
			arrayFscore.push(fScore)

			// Calcular M score
			mScore = Mscore(
				balanceSheet['netReceivables'],
				totalRevenue,
				grossProfit,
				currentAssets,
				totalAssets,
				balanceSheet['propertyPlantAndEquipmentNet'],
				cashFlowStatement['depreciation'],
				incomeStatement['sellingGeneralAdministrative'],
				currentLiabilities,
				balanceSheet['capitalLeaseObligations'],
				balanceSheet['longTermDebt'],
				cashFlowStatement['totalCashFromOperatingActivities'],
				netIncome,
				incomeStatement['nonOperatingIncomeNetOther'],
				balanceSheetAtras['netReceivables'],
				totalRevenueAtras,
				incomeStatementATras['grossProfit'],
				balanceSheetAtras['totalCurrentAssets'],
				totalAssetsAtras,
				balanceSheetAtras['propertyPlantAndEquipmentNet'],
				cashFlowStatementAtras['depreciation'],
				incomeStatement['sellingGeneralAdministrative'],
				balanceSheetAtras['totalCurrentLiabilities'],
				balanceSheetAtras['longTermDebt'],
				balanceSheetAtras['capitalLeaseObligations']
			)
			arrayMscore.push(mScore)

			roic = ROIC(
				incomeStatement['operatingIncome'],
				incomeStatement['taxProvision'],
				incomeStatement['incomeBeforeTax'],
				balanceSheet['totalStockholderEquity'],
				totalDebt,
				balanceSheet['shortTermInvestments'],
				balanceSheet['goodWill']
			)
			arrayRoic.push(roic)
			
			// Ejecutar function puntuacion
			if(numero5Atras != 1) {
				puntuacion = miIndicador(
					marketCap,
					totalRevenue,
					totalLiabilities,
					totalAssets,
					totalAssetsAtras,
					netIncomeAtras,
					currentAssets,
					currentLiabilities,
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
				)
				arrayPuntuacion.push(puntuacion)
			}
			labelsGrafica.push(arrayAnualClose[i]['year'])
			arrayAnualPrice.push(arrayAnualClose[i]['adjustedClose'])
		}
		// Invertir Arrays Para Graficas
		arrayZscore.reverse()
		arrayFscore.reverse()
		arrayMscore.reverse()
		arrayRoic.reverse()
		arrayPuntuacion.reverse()
		labelsGrafica.reverse()
		arrayAnualPrice.reverse()
		// Calcular Indicador TTM








		// Hacer graficas---------------------------------
		// Grafica Alpha Score
		drawBarLineChart('graficaAlphaScore', 'Alpha Score', arrayPuntuacion, 'StcokPrice', arrayAnualPrice,labelsGrafica, [100,0])
		// Grafica F score
		drawBarLineChart('graficaFscore', 'Piatroski Score', arrayFscore, 'StcokPrice', arrayAnualPrice,labelsGrafica, [9,0])
	})
}

// Ejecutar function async
asyncTrabajarMiIndicador('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?filter=Financials&api_token='+apiToken)


// Sacar precio
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
    let arrayAnualClose = [];
    // Agrupar los datos mensuales en datos anuales
    let yearData = {};
    dataPrecio.forEach(item => {
        const year = item.date.slice(0, 4); // Obtener el año de la fecha
        const month = item.date.slice(5, 7); // Obtener el mes de la fecha
        if (!yearData[year]) {
            yearData[year] = {
                lastMonth: null // Inicialmente, el último mes es null
            };
        }
        // Actualizar el precio de cierre ajustado del último mes del año
        if (!yearData[year].lastMonth || parseInt(month) > parseInt(yearData[year].lastMonth.month)) {
            yearData[year].lastMonth = {
                month: month,
                adjustedClose: item.adjusted_close
            };
        }
    });

    // Guardar el precio de cierre ajustado del último mes para cada año
    for (const year in yearData) {
        arrayAnualClose.push({
            year: year,
            adjustedClose: yearData[year].lastMonth.adjustedClose // Guardar el precio de cierre ajustado del último mes del año
        });
    }

    return arrayAnualClose;
}





// Functiones indicadores
// Mi indicador--------------------------------------------------------------------------------
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
		puntuacion = puntuacion + 0;
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

// F score--------------------------------------------------------------------------------
function Fscore(
	roa,
	roaAtras,
	cfroa,
	oparatingCashFlow,
	longTermDebt,
	longTermDebAtras,
	currentRatio,
	currentRatioAtras,
	sharesOutstannding,
	sharesOutstanndingAtras,
	grossMargin,
	grossMarginAtras,
	assetsTurnOver,
	assetsTurnOverAtras
) {
	puntuacion = 0;
	if (numero(oparatingCashFlow) > 0) {
		puntuacion = puntuacion + 1;
	}
	if (numero(roa) > 0) {
		puntuacion = puntuacion + 1;
	}
	if (numero(roa) > numero(roaAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(cfroa) > numero(roa)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(longTermDebt) < numero(longTermDebAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(currentRatio) > numero(currentRatioAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(sharesOutstannding) <= numero(sharesOutstanndingAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(grossMargin) > numero(grossMarginAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(assetsTurnOver) > numero(assetsTurnOverAtras)) {
		puntuacion = puntuacion + 1;
	}
	return puntuacion;
}

// Z score--------------------------------------------------------------------------------
function Zscore(
	totalCurrentAssets,
	totalCurrentLiabilities,
	totalAssets,
	retainedEarnings,
	ebit,
	marketCap,
	totalLiabilities,
	totalRevenue
) {
	A = (numero(totalCurrentAssets) - numero(totalCurrentLiabilities)) / numero(totalAssets);
	B = numero(retainedEarnings) / numero(totalAssets);
	C = numero(ebit) / numero(totalAssets);
	D = numero(marketCap) / numero(totalLiabilities);
	E = numero(totalRevenue) / numero(totalAssets);
	let zScore = 1.2 * A + 1.4 * B + 3.3 * C + 0.6 * D + 1.0 * E;
	return zScore;
}

// M score--------------------------------------------------------------------------------
function Mscore(
	acountReceivables,
	totalRevenue,
	grossProfit,
	currentAssets,
	totalAssets,
	propertyPlantAndEquipment,
	depreciation,
	sellingGeneralAdministrative,
	currentLiabilities,
	capitalLeaseObligations,
	longTermDebt,
	oparatingCashFlow,
	netIncome,
	nonOparatingIncome,
	acountReceivablesAtras,
	totalRevenueAtras,
	grossProfitAtras,
	currentAssetsAtras,
	totalAssetsAtras,
	propertyPlantAndEquipmentAtras,
	depreciationAtras,
	sellingGeneralAdministrativeAtras,
	currentLiabilitiesAtras,
	longTermDebtAtras,
	capitalLeaseObligationsAtras
) {
	DSRI =
		numero(acountReceivables) /
		numero(totalRevenue) /
		(numero(acountReceivablesAtras) / numero(totalRevenueAtras));
	GMI =
		numero(grossProfitAtras) /
		numero(totalRevenueAtras) /
		(numero(grossProfit) / numero(totalRevenue));
	AQI =
		(1 - (numero(currentAssets) + numero(propertyPlantAndEquipment)) / numero(totalAssets)) /
		(1 -
			(numero(currentAssetsAtras) + numero(propertyPlantAndEquipmentAtras)) /
				numero(totalAssetsAtras));
	SGI = numero(totalRevenue) / numero(totalRevenueAtras);
	DEPI =
		numero(depreciationAtras) /
		(numero(depreciationAtras) + numero(propertyPlantAndEquipmentAtras)) /
		(numero(depreciation) / (numero(depreciation) + numero(propertyPlantAndEquipment)));
	SGAI =
		numero(sellingGeneralAdministrative) /
		numero(totalRevenue) /
		(numero(sellingGeneralAdministrativeAtras) / numero(totalRevenueAtras));
	LVGI =
		(numero(longTermDebt) + numero(capitalLeaseObligations) + numero(currentLiabilities)) /
		numero(totalAssets) /
		((numero(longTermDebtAtras) +
			numero(capitalLeaseObligationsAtras) +
			numero(currentLiabilitiesAtras)) /
			numero(totalAssetsAtras));
	TATA =
		(numero(netIncome) - numero(nonOparatingIncome) - numero(oparatingCashFlow)) /
		numero(totalAssetsAtras);

	M =
		-4.84 +
		0.92 * numero(DSRI) +
		0.528 * numero(GMI) +
		0.404 * numero(AQI) +
		0.892 * numero(SGI) +
		0.115 * numero(DEPI) -
		0.172 * numero(SGAI) +
		4.679 * numero(TATA) -
		0.327 * numero(LVGI);
	return M;
}

// WACC--------------------------------------------------------------------------------
function WACC(
	marketCap,
	shortLongTermDebtTotalMRQ,
	riskFreeRateOfReturn,
	beta,
	expectedReturnOfTheMarket,
	intrestExpenses,
	taxProvision,
	incomeBeforeTax
) {
	E = numero(marketCap);
	D = numero(shortLongTermDebtTotalMRQ)
	weightOfEquity = E / (E + D);
	weightOfDebt = D / (E + D);
	costOfEquity = riskFreeRateOfReturn + beta * (expectedReturnOfTheMarket - riskFreeRateOfReturn);
	costOfDebt = intrestExpenses / D;
	if (numero(taxProvision) / numero(incomeBeforeTax) > 1) {
		taxRate = 1;
	} else if (numero(taxProvision) / numero(incomeBeforeTax) < 0) {
		taxRate = 0;
	} else {
		taxRate = numero(taxProvision) / numero(incomeBeforeTax);
	}

	let WACC = (E / (E + D)) * costOfEquity + (D / (E + D)) * costOfDebt * (1 - taxRate);
	return WACC;
}

// ROIC function roic[0] nopat[1] investedCapital[2]-------------------------------------
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


// Functiones graficas--------------------------------------------------------------------
// Grafica barra linea
function drawBarLineChart(idGrafica, tituloBarra ,barData, tituloLinea,lineData, labels, maxMinimo) {
	var ctx = document.getElementById(idGrafica).getContext('2d');
	max = maxMinimo[0]
	min = maxMinimo[1]
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: tituloBarra,
				data: barData,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
				yAxisID: 'barra',
			}, {
				label: tituloLinea,
				data: lineData,
				fill: false,
				type: 'line',
				borderColor: 'rgba(54, 162, 235, 1)',
				tension: 0.1,
				yAxisID: 'linea',
			}]
		},
		options: {
			scales: {
				barra: {
				  type: 'linear',
				  display: true,
				  position: 'right',
				  grid: {
                    display: false
				  },
					max: max,
					min: min,
				},
				linea: {
				  type: 'linear',
				  display: true,
				  position: 'left',
				  grid: {
                    display: false
				  }
				},
				x: {
					grid: {
						display: false
					}
				}
			}
		}
	});
}





// Otras functiones--------------------------------------------------------------------
// Finction para convertir en numero y en caso de null devolver 0
function numero(valor) {
	if (isNaN(parseFloat(valor))) {
		resultado = 0;
	} else {
		resultado = parseFloat(valor);
	}
	return resultado;
}

// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
}









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
			window.location.href = "../socres/scores.html"
		})
		a.setAttribute('href','../socres/scores.html')
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
		window.location.href = "../socres/scores.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});