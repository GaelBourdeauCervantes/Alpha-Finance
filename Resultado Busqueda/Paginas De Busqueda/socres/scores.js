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
	dataGeneral = data['General']
	dataHighlights = data['Highlights']
	data = data['Financials']
	// Sacar sector para valuacion mi indicador
	sector = dataGeneral['Sector']
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
	arrayEps = []
	arrayRoic = []
	arrayPuntuacion = []
	labelsGrafica = []
	arrayAnualPrice = []
	arrayAnualClose.then(arrayAnualClose => {
		// Invertir y eliminar ultimo valor de array precio
		arrayAnualClose.reverse()
		arrayAnualClose.shift()
		// Poner el precio mas reciente en el ano mas reciente
		if(largoFechas - arrayAnualClose.length >= 2) {
			largoLoop = arrayAnualClose.length
		} else {
			largoLoop = largoFechas
		}
		for(i = 0; i < largoLoop - 1; i++) {
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
				totalDebt / totalAssets,
				balanceSheetAtras['shortLongTermDebtTotal'] / totalAssetsAtras,
				currentRatio,
				currentRatioAtras,
				sharesOutstannding,
				balanceSheetAtras['commonStockSharesOutstanding'],
				grossMargin,
				grossMarginAtras,
				assetsTurnOver,
				assetsTurnOverAtras
			);

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
				incomeStatementATras['sellingGeneralAdministrative'],
				balanceSheetAtras['totalCurrentLiabilities'],
				balanceSheetAtras['longTermDebt'],
				balanceSheetAtras['capitalLeaseObligations']
			)
			eps = netIncome / sharesOutstannding

			roic = ROIC(
				incomeStatement['operatingIncome'],
				incomeStatement['taxProvision'],
				incomeStatement['incomeBeforeTax'],
				balanceSheet['totalStockholderEquity'],
				totalDebt,
				balanceSheet['shortTermInvestments'],
				balanceSheet['goodWill']
			)[0]
			
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
					pegRatio,
					sector
				)
				arrayPuntuacion.push(puntuacion)
				arrayZscore.push(zScore)
				arrayFscore.push(fScore)
				arrayMscore.push(mScore)
				arrayEps.push(eps)
				arrayRoic.push(roic)
				labelsGrafica.push(incomeStatement['date'].split("-")[0])
				arrayAnualPrice.push(arrayAnualClose[i]['adjustedClose'])
			}
		}
		// Invertir Arrays Para Graficas
		arrayZscore.reverse()
		arrayFscore.reverse()
		arrayMscore.reverse()
		arrayEps.reverse()
		arrayRoic.reverse()
		arrayPuntuacion.reverse()
		labelsGrafica.reverse()
		arrayAnualPrice.reverse()
		
		// Calcular TTM------------------------------------------------------------------------------------------------------------------------
		labelsGrafica.push('TTM')
		marketCap = dataHighlights['MarketCapitalization']
		// Trabajar data TTM function
		function hacerTTM(closePriceAperturaCitio){
			arrayAnualPrice.push(closePriceAperturaCitio)
			// Tomar Income Statment atras
			incomeStatementATras = data['Income_Statement']['yearly'][arrayLlaves[1]]
			if(arrayLlaves.length < 5) {
				llav5Atras = arrayLlaves[arrayLlaves.length - 1]
			} else {
				llav5Atras = arrayLlaves[4]
				numero5Atras = 5
			}
			incomeStatement5ATras = data['Income_Statement']['yearly'][llav5Atras]
			// Tomar fecga actual
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			// Balance Sheet MRQ------
			balanceSheetsQuarterly = data['Balance_Sheet']['quarterly'];
			nombreDeObjetos = Object.keys(balanceSheetsQuarterly);
			ultimoQuarterAno = obtenerUltimoQuarterDeAno(nombreDeObjetos, currentYear - 2)
			ultimoQuarterAnoPasado = obtenerUltimoQuarterDeAno(nombreDeObjetos, currentYear -3)
			balanceSheetMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]
			balanceSheetAtras = data['Balance_Sheet']['yearly'][arrayLlaves[1]]
			// Ultimo Cash Flow STtament
			cashFlowStatement =  data['Cash_Flow']['yearly'][arrayLlaves[0]]
			cashFlowStatementAtras =  data['Cash_Flow']['yearly'][arrayLlaves[1]]
			// Sacar data TTM and MRQ
			priceStock = arrayAnualClose[0]['adjustedClose']
			sharesOutstannding = balanceSheetMRQ['commonStockSharesOutstanding']
			totalRevenueTTM = calcularTTM(data,'Income_Statement','totalRevenue')
			totalRevenueAtras = incomeStatementATras['totalRevenue'] 
			grossProfit = incomeStatement['grossProfit']
			totalLiabilitiesMRQ = balanceSheetMRQ['totalLiab']
			totalAssetsBeginigOfYear= balanceSheetsQuarterly[ultimoQuarterAno]['totalAssets']; // Tomar el assets al prinicpio del ano
			totalAssetsBeginigOfYearPasado = balanceSheetsQuarterly[ultimoQuarterAnoPasado]['totalAssets']; // Tomar el ultimo quart al principio del ano del ano pasado
			totalAssetsAtras = balanceSheetAtras['totalAssets']
			netIncomeAtras = incomeStatementATras['netIncome']
			currentAssetsMRQ = balanceSheetMRQ['totalCurrentAssets']
			currentLiabilitiesMRQ = balanceSheetMRQ['totalCurrentLiabilities']
			netIncomeTTM = calcularTTM(data,'Income_Statement','netIncome')
			longTermDebtMRQ = balanceSheetMRQ['longTermDebt']
			totalDebtMRQ = balanceSheetMRQ['shortLongTermDebtTotal']
			freeCashFlowTTM = calcularTTM(data,'Cash_Flow','freeCashFlow')
			dividendsPaid = calcularTTM(data,'Cash_Flow', 'dividendsPaid')
			dividenPerShare = dividendsPaid / sharesOutstannding
			dividenYield = dataHighlights['DividendYield']
			pe = marketCap / netIncomeTTM
			if(numero5Atras != 1) {
				totalRevenueG = (totalRevenueTTM  / incomeStatement5ATras['totalRevenue']) ** (1/numero5Atras) -1
				netIncomeG = (netIncomeTTM / incomeStatement5ATras['netIncome']) ** (1/numero5Atras) -1
			} 
			pegRatioTTM = dataHighlights['PEGRatio']

			// Calcular Scores------------------
			// Calcular Scores
			// Z scores
			zScoreTTM = Zscore(
				currentAssetsMRQ,
				currentLiabilitiesMRQ,
				totalAssetsBeginigOfYear,
				balanceSheetMRQ['retainedEarnings'],
				calcularTTM(data,'Income_Statement','ebit'),
				marketCap,
				totalLiabilitiesMRQ,
				totalRevenueTTM
			);
			arrayZscore.push(zScoreTTM)

			// Calcular F-score
			roaTTM = netIncomeTTM / totalAssetsBeginigOfYear
			roaAtras = netIncomeAtras / totalAssetsAtras
			oparatingCashFlowTTM = calcularTTM(data,'Cash_Flow','totalCashFromOperatingActivities')
			currentRatioMRQ = currentAssetsMRQ/currentLiabilitiesMRQ
			currentRatioAtras = balanceSheetAtras['totalCurrentAssets']/balanceSheetAtras['totalCurrentLiabilities']
			grossMarginTTM = calcularTTM(data,'Income_Statement','grossProfit') / totalRevenueTTM
			grossMarginAtras = incomeStatementATras['grossProfit'] / totalRevenueAtras
			assetsTurnOverTTM =  totalRevenueTTM / totalAssetsBeginigOfYear
			assetsTurnOverAtras = totalRevenueAtras / totalAssetsBeginigOfYearPasado
			fScoreTTM = Fscore(
				roaTTM,
				roaAtras,
				oparatingCashFlowTTM / totalAssetsBeginigOfYear,
				longTermDebtMRQ / balanceSheetMRQ['totalAssets'],
				balanceSheetAtras['longTermDebt'] / balanceSheetAtras['totalAssets'],
				currentRatioMRQ,
				currentRatioAtras,
				sharesOutstannding,
				balanceSheetAtras['commonStockSharesOutstanding'],
				grossMarginTTM,
				grossMarginAtras,
				assetsTurnOverTTM,
				assetsTurnOverAtras
			);	
			arrayFscore.push(fScoreTTM)

			// Calcular M score
			mScoreTTM = Mscore(
				balanceSheetMRQ['netReceivables'],
				totalRevenueTTM,
				calcularTTM(data,'Income_Statement','grossProfit'),
				currentAssetsMRQ,
				totalAssetsBeginigOfYear,
				balanceSheetMRQ['propertyPlantAndEquipmentNet'],
				calcularTTM(data,'Cash_Flow','depreciation'),
				calcularTTM(data,'Income_Statement','sellingGeneralAdministrative'),
				currentLiabilitiesMRQ,
				balanceSheetMRQ['capitalLeaseObligations'],
				balanceSheetMRQ['longTermDebt'],
				calcularTTM(data,'Cash_Flow','totalCashFromOperatingActivities'),
				netIncomeTTM,
				calcularTTM(data,'Income_Statement','nonOperatingIncomeNetOther'),
				balanceSheetAtras['netReceivables'],
				totalRevenueAtras,
				incomeStatementATras['grossProfit'],
				balanceSheetAtras['totalCurrentAssets'],
				totalAssetsAtras,
				balanceSheetAtras['propertyPlantAndEquipmentNet'],
				cashFlowStatementAtras['depreciation'],
				incomeStatementATras['sellingGeneralAdministrative'],
				balanceSheetAtras['totalCurrentLiabilities'],
				balanceSheetAtras['longTermDebt'],
				balanceSheetAtras['capitalLeaseObligations']
			)
			arrayMscore.push(mScoreTTM)
			// Calcular EPS
			epsTTM = netIncomeTTM / balanceSheetMRQ['commonStockSharesOutstanding']
			arrayEps.push(epsTTM)
			
			roicTTM = ROIC(
				calcularTTM(data,'Income_Statement','operatingIncome'),
				calcularTTM(data,'Income_Statement','taxProvision'),
				calcularTTM(data,'Income_Statement','incomeBeforeTax'),
				balanceSheetMRQ['totalStockholderEquity'],
				totalDebtMRQ,
				balanceSheetMRQ['shortTermInvestments'],
				balanceSheetMRQ['goodWill']
			)[0]
			arrayRoic.push(roicTTM)
			
			puntuacionTTM = miIndicador(
				marketCap,
				totalRevenueTTM,
				totalLiabilitiesMRQ,
				totalAssetsBeginigOfYear,
				totalAssetsAtras,
				netIncomeAtras,
				currentAssetsMRQ,
				currentLiabilitiesMRQ,
				netIncomeTTM,
				totalDebtMRQ,
				zScoreTTM,
				fScoreTTM,
				mScoreTTM,
				roicTTM,
				freeCashFlowTTM,
				totalRevenueG,
				netIncomeG,
				dividenYield,
				dividendsPaid,
				pegRatioTTM, 
				sector
			)
			arrayPuntuacion.push(puntuacionTTM)

			// Poner data en citio web-------------------------------------------------------------------------
			// Poner ticker en todos lo que tengan la clase ticker
			var elements = document.getElementsByClassName("tickerEmpresa");
			for (var i = 0; i < elements.length; i++) {
				elements[i].textContent = '(' + ticker + ')';
			}
			// Alpha Score seccion-----------------------------
			// Sacar array de colores scores
			arrayColoresAlpha = []
			for(i=0;i<arrayPuntuacion.length;i++) {
				puntuacion = Math.round(arrayPuntuacion[i])
				arrayColoresAlpha.push(colorPuntuacion(puntuacion))
			}
			// Grafica Alpha Score
			graficaAlpha('graficaAlphaScore', arrayAnualPrice, arrayPuntuacion,arrayColoresAlpha,labelsGrafica, [100,0])
			// Piatrosky score seccion-------------------------
			// Poner puntuacion en score value
			colorPositivo = '#56ab00'
			colorMedio = '#ffe81a'
			colorNegativo = '#ff4700'
			elementoValueScore = document.getElementById('puntuacionFScore')
			elementoValueScore.textContent = fScoreTTM + ' / 9'
			circuloFcore = document.getElementById('circuloFcore')
			if(fScoreTTM <= 3) {
				circuloFcore.style.backgroundColor = colorNegativo
			} else if(fScoreTTM <= 6) {
				circuloFcore.style.backgroundColor = colorMedio
			} else {
				circuloFcore.style.backgroundColor = colorPositivo
			}
			// Gradiate 
			numeroGradiante = document.getElementById('cajaBarraNotas' + fScoreTTM)
			numeroGradiante.style.outline = '3px solid'
			// Tablas de  F score
			// Tomar elementos tablas
			// Profitability Table
			currentROA = document.getElementById("currentROA");
			cashFlowReturnOnAssets = document.getElementById("cashFlowReturnOnAssets");
			changeInReturnOnAssets = document.getElementById("changeInReturnOnAssets");
			currentQualityOfEarnings = document.getElementById("currentQualityOfEarnings");
		
			// Funding Table
			changeInLeverage = document.getElementById("changeInLeverage");
			changeInWorkingCapital = document.getElementById("changeInWorkingCapital");
			sharesIssue = document.getElementById("sharesIssue");
		
			// Efficiency Table
			changeInGrossMargin = document.getElementById("changeInGrossMargin");
			changeInAssetTurnover = document.getElementById("changeInAssetTurnover");
			// Roa
			if(roaTTM > 0) {
				currentROA.textContent = '+1'
				currentROA.style.backgroundColor = colorPositivo
			} else {
				currentROA.textContent = '+0'
				currentROA.style.backgroundColor = colorNegativo
			}
			// CFRO
			if(oparatingCashFlowTTM / totalAssetsBeginigOfYear > 0) {
				cashFlowReturnOnAssets.textContent = '+1'
				cashFlowReturnOnAssets.style.backgroundColor = colorPositivo
			} else {
				cashFlowReturnOnAssets.textContent = '+0'
				cashFlowReturnOnAssets.backgroundColor = colorNegativo
			}
			// Change in ROA
			if(roaTTM > roaAtras) {
				changeInReturnOnAssets.textContent = '+1'
				changeInReturnOnAssets.style.backgroundColor = colorPositivo
			} else {
				changeInReturnOnAssets.textContent = '+0'
				changeInReturnOnAssets.style.backgroundColor = colorNegativo
			}
			// Quality of Earnings (Accrual)
			if(oparatingCashFlowTTM / totalAssetsBeginigOfYear > roaTTM) {
				currentQualityOfEarnings.textContent = '+1'
				currentQualityOfEarnings.style.backgroundColor = colorPositivo
			} else {
				currentQualityOfEarnings.textContent = '+0'
				currentQualityOfEarnings.style.backgroundColor = colorNegativo
			}
			// Change in Gearing or Leverage
			if(longTermDebtMRQ / balanceSheetMRQ['totalAssets'] < balanceSheetAtras['longTermDebt'] / balanceSheetAtras['totalAssets']) {
				changeInLeverage.textContent = '+1'
				changeInLeverage.style.backgroundColor = colorPositivo
			} else {
				changeInLeverage.textContent = '+0'
				changeInLeverage.style.backgroundColor = colorNegativo
			}
			// Change in Working Capital (Liquidity)
			if(currentRatioMRQ > currentRatioAtras) {
				changeInWorkingCapital.textContent = '+1'
				changeInWorkingCapital.style.backgroundColor = colorPositivo
			} else {
				changeInWorkingCapital.textContent = '+0'
				changeInWorkingCapital.style.backgroundColor = colorNegativo
			}
			// Shares
			if(sharesOutstannding <= balanceSheetAtras['commonStockSharesOutstanding']) {
				sharesIssue.textContent = '+1'
				sharesIssue.style.backgroundColor = colorPositivo
			} else {
				sharesIssue.textContent = '+0'
				sharesIssue.style.backgroundColor = colorNegativo
			}
			// Gross margin
			if(grossMarginTTM > grossMarginAtras) {
				changeInGrossMargin.textContent = '+1'
				changeInGrossMargin.style.backgroundColor = colorPositivo
			} else {
				changeInGrossMargin.textContent = '+0'
				changeInGrossMargin.style.backgroundColor = colorNegativo
			}
			// Change in asset turnover
			if(assetsTurnOverTTM > assetsTurnOverAtras) {
				changeInAssetTurnover.textContent = '+1'
				changeInAssetTurnover.style.backgroundColor = colorPositivo
			} else {
				changeInAssetTurnover.textContent = '+0'
				changeInAssetTurnover.style.backgroundColor = colorNegativo
			}
			// Altman Z score seccion----------------------------------------
			// Poner valor del score en docs
			opinionZscore = document.getElementById('opinionZscore')
			if(zScoreTTM <= 1.8) {
				opinionZscore.textContent = 'HIgh risk of bankruptcy!'
				opinionZscore.style.color = colorNegativo
				piquitoDistress = document.getElementById('piquitoDistress')
				circuloZcoreOrange = document.getElementById('circuloZcoreOrange')
				puntuacionZScoreOrange = document.getElementById('puntuacionZScoreOrange')
				piquitoDistress.style.visibility = 'visible'
				circuloZcoreOrange.style.visibility = 'visible'
				puntuacionZScoreOrange.textContent = arondir(zScoreTTM)
			} else if (zScoreTTM <= 3) {
				opinionZscore.textContent = 'Might be headed for bankruptcy'
				opinionZscore.style.color = 'rgb(127, 119, 119)'
				piquitoGrayZone = document.getElementById('piquitoGrayZone')
				circuloZcoreGray = document.getElementById('circuloZcoreGray')
				puntuacionZScoreGray = document.getElementById('puntuacionZScoreGray')
				piquitoGrayZone.style.visibility = 'visible'
				circuloZcoreGray.style.visibility = 'visible'
				puntuacionZScoreGray.textContent = arondir(zScoreTTM)
			} else {
				opinionZscore.textContent = 'No risk of bankruptcy, very solid financial positioning'
				opinionZscore.style.color = colorPositivo
				piqitoGreenZone = document.getElementById('piqitoGreenZone')
				circuloZcoreGreen = document.getElementById('circuloZcoreGreen')
				puntuacionZScoreGreen = document.getElementById('puntuacionZScoreGreen')
				piqitoGreenZone.style.visibility = 'visible'
				circuloZcoreGreen.style.visibility = 'visible'
				puntuacionZScoreGreen.textContent = arondir(zScoreTTM)
			}
			// Hacer Grafica Z score
			arrayColoresZScore = []
			for (i=0; i < arrayZscore.length; i++) {
				zScore = arrayZscore[i]
				if(zScore <= 1.8) {
					arrayColoresZScore.push('rgb(255, 165, 0)')
				} else if(zScore <= 3) {
					arrayColoresZScore.push('rgb(127, 119, 119)')
				} else {
					arrayColoresZScore.push('rgb(0, 128, 0)')
				}
			}
			graficaZscore('graficaZScore',arrayZscore,labelsGrafica,arrayColoresZScore)
			// Benish M-Score------------------------------------
			// Poner valor del score en docs
			opinionMScore = document.getElementById('opinionMscore')
			if(mScoreTTM <= -2.22) {
				opinionMScore.textContent = 'The copmany has a low likley hood of manipulation'
				opinionMScore.style.color = colorPositivo
				piquitoNoManipulation = document.getElementById('piquitoNoManipulation')
				circuloMScoreNoManipulator = document.getElementById('circuloMScoreNoManipulator')
				puntuacionMScoreNoManipulator = document.getElementById('puntuacionMScoreNoManipulator')
				piquitoNoManipulation.style.visibility = 'visible'
				circuloMScoreNoManipulator.style.visibility = 'visible'
				puntuacionMScoreNoManipulator.textContent = arondir(mScoreTTM)
			} else if (mScoreTTM <= -1.78) {
				opinionMScore.textContent = 'The copmany has a medium likley hood of manipulation'
				opinionMScore.style.color = 'rgb(255 223 0)'
				piquitoMIghtManipulate = document.getElementById('piquitoMIghtManipulate')
				circuloMScoreMightManipulate = document.getElementById('circuloMScoreMightManipulate')
				puntuacionMScoreMightManipulate = document.getElementById('puntuacionMScoreMightManipulate')
				piquitoMIghtManipulate.style.visibility = 'visible'
				circuloMScoreMightManipulate.style.visibility = 'visible'
				puntuacionMScoreMightManipulate.textContent = arondir(mScoreTTM)
			} else {
				opinionMScore.textContent = 'The copmany has a high likley hood of manipulation!'
				opinionMScore.style.color = colorNegativo
				piqitoManipulator = document.getElementById('piqitoManipulator')
				circuloZcManipulate = document.getElementById('circuloZcManipulate')
				puntuacionMScoreManipulate = document.getElementById('puntuacionMScoreManipulate')
				piqitoManipulator.style.visibility = 'visible'
				circuloZcManipulate.style.visibility = 'visible'
				puntuacionMScoreManipulate.textContent = arondir(mScoreTTM)
			}
			// Hacer grafica
			arrayColoresMScore = []
			for (i=0; i < arrayMscore.length; i++) {
				mScore = arrayMscore[i]
				if(mScore <= -2.22) {
					arrayColoresMScore.push('#56ab00')
				} else if(mScore <= -1.78) {
					arrayColoresMScore.push('rgb(255 223 0)')
				} else {
					arrayColoresMScore.push('#ff4700')
				}
			}
			
			graficaMscore('graficaMScore',arrayMscore,arrayEps,labelsGrafica,arrayColoresMScore)
		}
		// Si valor no existe abrir un .then pero si existe no abrir
		if(checkIfPending(closePriceAperturaCitio) == true) {
			closePriceAperturaCitio.then((closePriceAperturaCitio) => {
				hacerTTM(closePriceAperturaCitio)
			})
		} else {
			hacerTTM(closePriceAperturaCitio)
		}
	})
}

// Ejecutar function async
asyncTrabajarMiIndicador('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?&api_token='+apiToken)


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



// Precio actual----------------------------
// Tomar precio al abrir citio
// Defining async function
async function precioInfoRefresh(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	closePriceAperturaCitio = trabajarInfoPrecioRefresh(data);
	return closePriceAperturaCitio;
}

// Trabaja data de precio
function trabajarInfoPrecioRefresh(data) {
	closePriceMinuto = data['close'];
	return closePriceMinuto;
}
closePriceAperturaCitio = precioInfoRefresh(
	'https://eodhistoricaldata.com/api/real-time/'+ ticker +'?api_token='+apiToken+'&fmt=json'
);


// Tomar valores de valuacion promedio
// Data de ratios promedios po sector -> https://finviz.com/groups.ashx?g=sector&v=120&o=pe
libroAverageValuationSector = {
	ps: {
		'Energy': 1.05,
		'Real Estate': 4.24,
		'Financial Services': 1.98,
		'Utilities': 1.92,
		'Basic Materials': 1.74,
		'Consumer Cyclical': 1.65,
		'Consumer Defensive': 1.32,
		'Communication Services': 3.28,
		'Industrials': 2.05,
		'Healthcare': 2.06,
		'Technology': 6.05
    },
	pb: {
		'Energy': 1.89,
		'Real Estate': 2.19,
		'Financial Services': 1.75,
		'Utilities': 1.74,
		'Basic Materials': 2.21,
		'Consumer Cyclical': 4.53,
		'Consumer Defensive': 4.45,
		'Communication Services': 3.98,
		'Industrials': 4.71,
		'Healthcare': 4.51,
		'Technology': 8.51
    },
    pe: {
		'Energy': 10.47,
		'Real Estate': 11.98,
		'Financial Services': 13.93,
		'Utilities': 17.73,
		'Basic Materials': 21.78,
		'Consumer Cyclical': 24.31,
		'Consumer Defensive': 24.47,
		'Communication Services': 24.98,
		'Industrials': 25.85,
		'Healthcare': 35.76,
		'Technology': 38.91
    },
};



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
	pegRatio,
	sector
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

	// Calcular ratios de valuacion
	priceToSales = marketCap / totalRevenue;
	priceToBook = marketCap / (totalAssets - totalLiabilities);
	priceToearnigs = marketCap / netIncome;
	// Tomar ratios promedios de valuacion
	priceToSalesAverageSector = libroAverageValuationSector['ps'][sector]
	priceToBookAverageSector = libroAverageValuationSector['pb'][sector]
	priceToearnigsAverageSector = libroAverageValuationSector['pe'][sector]

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
	if (priceToSales <= priceToSalesAverageSector) {
		puntuacion = puntuacion + 5.22;
	}
	if (priceToBook <= priceToBookAverageSector) {
		puntuacion = puntuacion + 8.7;
	}
	if (priceToearnigs <= priceToearnigsAverageSector) {
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
	if (dividenPayoutRatio*-1 < 0.45) {
		puntuacion = puntuacion + 2.17;
	}
	return puntuacion;
}

// F score function
function Fscore(
	roa,
	roaAtras,
	cfroa, 
	longTermDebtOverAssets,
	longTermDebOverAssetsAtras,
	currentRatio,
	currentRatioAtras,
	sharesOutstanndingAtras,
	sharesOutstanndingAtrasAtras,
	grossMargin,
	grossMarginAtras,
	assetsTurnOver,
	assetsTurnOverAtras
) {
	puntuacion = 0;
	if (numero(roa) > 0) {
		puntuacion = puntuacion + 1;
	}
	if (numero(cfroa) > 0) {
		puntuacion = puntuacion + 1;
	}
	if (roa > roaAtras) {
		puntuacion = puntuacion + 1;
	}
	if (numero(cfroa) > numero(roa)) {
		puntuacion = puntuacion + 1;
	}
	if (longTermDebtOverAssets < longTermDebOverAssetsAtras) {
		puntuacion = puntuacion + 1;
	}
	if (numero(currentRatio) > numero(currentRatioAtras)) {
		puntuacion = puntuacion + 1;
	}
	if (numero(sharesOutstanndingAtras) <= numero(sharesOutstanndingAtrasAtras)) {
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

// Z score function---------------------------------------------------------------------------
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
	A = dividir0((numero(totalCurrentAssets) - numero(totalCurrentLiabilities)) , numero(totalAssets))
	B = dividir0(numero(retainedEarnings) , numero(totalAssets))
	C = dividir0(numero(ebit) , numero(totalAssets))
	D = dividir0(numero(marketCap) , numero(totalLiabilities))
	E = dividir0(numero(totalRevenue) , numero(totalAssets))
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
	DSRI = dividir0(numero(acountReceivables) / numero(totalRevenue) , (numero(acountReceivablesAtras) / numero(totalRevenueAtras)))
	GMI = dividir0(numero(grossProfitAtras) / numero(totalRevenueAtras) , (numero(grossProfit) / numero(totalRevenue)))
	AQI =
			dividir0(
				(1 - (numero(currentAssets) + numero(propertyPlantAndEquipment)) / numero(totalAssets)) ,
				(1 - (numero(currentAssetsAtras) + numero(propertyPlantAndEquipmentAtras)) / numero(totalAssetsAtras))
			)
	SGI = dividir0(numero(totalRevenue) , numero(totalRevenueAtras))
	DEPI =
			dividir0(
				numero(depreciationAtras) / (numero(depreciationAtras) + numero(propertyPlantAndEquipmentAtras)) ,
				(numero(depreciation) / (numero(depreciation) + numero(propertyPlantAndEquipment)))
			)
	SGAI = 
			dividir0(
				numero(sellingGeneralAdministrative) /
				numero(totalRevenue) ,
				(numero(sellingGeneralAdministrativeAtras) / numero(totalRevenueAtras))
			)
	LVGI =
			dividir0(
				(numero(longTermDebt) + numero(capitalLeaseObligations) + numero(currentLiabilities)) /
				numero(totalAssets) ,
				((numero(longTermDebtAtras) +
					numero(capitalLeaseObligationsAtras) +
					numero(currentLiabilitiesAtras)) /
					numero(totalAssetsAtras))
			)
	TATA =
			dividir0(
				(numero(netIncome) - numero(nonOparatingIncome) - numero(oparatingCashFlow)) ,
				numero(totalAssetsAtras)
			)

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

function dividir0(valor1, valor2) {
	if(valor2 == 0) {
		resultado = 0
	} else {
		resultado = valor1 / valor2
	}
	return resultado
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
function graficaAlpha(idGrafica, lineData, barData, barColors, labels, maxMinimo) {
	var ctx = document.getElementById(idGrafica).getContext('2d');
	max = maxMinimo[0]
	min = maxMinimo[1]
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
			{
				label: 'Stock Price',
				data: lineData,
				fill: false,
				type: 'line',
				borderColor: 'rgba(54, 162, 235, 1)',
				pointBorderColor: 'rgba(54, 162, 235, 1)',
				tension: 0.1,
				yAxisID: 'linea',
			},
			{
				label: 'Alpha Score',
				data: barData,
				backgroundColor: barColors,
				borderColor: barColors,
				borderWidth: 1,
				yAxisID: 'barra',
			}
			]
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
// Grafica Z Score
function graficaZscore(idGrafica, barData, labels, colores) {
	var ctx = document.getElementById(idGrafica).getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		labels: labels,
		data: {
			labels: labels,
			datasets: [
			{
				label: 'Altman Z Score',
				data: barData,
				backgroundColor: colores,
				borderColor: colores,
			}
			]
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				}
			}
		}
	});
}

// Grafica M Score
function graficaMscore(idGrafica, barData, baraLinea, labels, colores) {
	var ctx = document.getElementById(idGrafica).getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		labels: labels,
		data: {
			labels: labels,
			datasets: [
			{
				label: 'EPS',
				type: 'line',
				data: baraLinea,
				backgroundColor: 'rgb(48, 54, 183)',
				borderColor: 'rgb(48, 54, 183)',
				yAxisID: 'linea',
			},
			{
				label: 'M-Score',
				data: barData,
				backgroundColor: colores,
				borderColor: colores,
				yAxisID: 'barra',
			},
			]
		},
		options: {
			plugins: {
				legend: {
					display: true,
				},
				title: {
					display: false,
				},
			},
			scales: {
				barra: {
				  type: 'linear',
				  display: true,
				  position: 'right',
				  grid: {
                    display: false
				  },
				  max: 1,
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

// Function para calcular TTM
function calcularTTM(data,enDonde, cual) {
	financialsQuarterly = data[enDonde]['quarterly'];
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

// Funcion para checar si un vallor esta pending
function checkIfPending(value) {
    return Promise.resolve(value) === value;
}

// funciones para colores segun puntuacion
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


// Function para tomar el ultimo quarto del ano pasado
function obtenerUltimoQuarterDeAno(fechas, ano) {
    // Convertir las fechas de texto a objetos Date
    const fechasDt = fechas.map(fecha => new Date(fecha));
    
    // Encontrar el último trimestre del año especificado
    const ultimoQuarter = fechasDt.reduce((ultimoQuarter, fecha) => {
        const year = fecha.getFullYear();
        const quarter = Math.ceil((fecha.getMonth() + 1) / 3);
        if (year === ano && quarter === 4) {
            return fecha > ultimoQuarter ? fecha : ultimoQuarter;
        }
        return ultimoQuarter;
    }, new Date(0));
    
    return ultimoQuarter.toISOString().split('T')[0];
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