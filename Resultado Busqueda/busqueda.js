// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = 'demo'
//60c184d42ae3a5.75307084

// Sakar info general----------------------------------------------------------------------------------------------------------------------------------------------------------
// Defining async function para data general
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}

// Trbajar data general
function trabajarData(data) {
	// Tomar Data-----------------------------------------------------------------------------------------------
	// General-------------------------------
	general = data['General'];
	fullName = general['Name'];
	ticker = general['Code'];
	webUrl = general['WebURL'];
	logoURL = `https://eodhistoricaldata.com/${general['LogoURL']}`;
	sector = general['Sector']

	// Highlights---------------------------
	highlights = data['Highlights'];
	marketCap = highlights['MarketCapitalization'];
	wallStreetTargetPrice = highlights['WallStreetTargetPrice'];
	dividenShare = highlights['DividendShare'];
	dividenYield = highlights['DividendYield'];
	eps = highlights['EarningsShare'];


	// Analysts Ratings
	// Si no existe analyst rating
	if(Object.keys(data).includes('AnalystRatings') == false) {
		hayAnalystOpinion = 'no'
	} else {
		hayAnalystOpinion = 'si'
		analystRatings = data['AnalystRatings'];
		strongBuyAnalysts = analystRatings['StrongBuy'];
		if(analystRatings == null) {
			console.log('er')
		}
		buyAnalysts = analystRatings['Buy'];
		holdAnalysts = analystRatings['Hold'];
		sellAnalysts = analystRatings['Sell'];
		strongSellAnalysts = analystRatings['StrongSell'];
	}


	// TTM numbers from Finanacials------------------------------------------
	// Tomar fecga actual
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	// Income Statment
	incomeStatementMRQ = data['Financials']['Income_Statement']['quarterly'];
	totalRevenueTTM = calcularTTM(data,'Income_Statement', 'totalRevenue');
	grossProfitTTM = calcularTTM(data,'Income_Statement', 'grossProfit');
	ebitTTM = calcularTTM(data,'Income_Statement', 'ebit');
	netIncomeTTM = calcularTTM(data,'Income_Statement', 'netIncome');
	// Balance Sheets
	balanceSheetsQuarterly = data['Financials']['Balance_Sheet']['quarterly'];
	nombreDeObjetos = Object.keys(balanceSheetsQuarterly);
	balanceSheetMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]
	ultimoQuarterAno = obtenerUltimoQuarterDeAno(nombreDeObjetos, currentYear - 2)
	ultimoQuarterAnoPasado = obtenerUltimoQuarterDeAno(nombreDeObjetos, currentYear - 3)
	totalAssetsBeginigOfYear= balanceSheetsQuarterly[ultimoQuarterAno]['totalAssets']; // Tomar el assets al prinicpio del ano
	totalAssetsBeginigOfYearPasado = balanceSheetsQuarterly[ultimoQuarterAnoPasado]['totalAssets']; // Tomar el ultimo quart al principio del ano del ano pasado
	totalAssetsMQ = balanceSheetMRQ['totalAssets']
	totalLiabilitiesMRQ = balanceSheetMRQ['totalLiab'];
	currentAssetsMRQ = balanceSheetMRQ['totalCurrentAssets'];
	currentLiabilitiesMRQ = balanceSheetMRQ['totalCurrentLiabilities'];
	totalCashMRQ = balanceSheetMRQ['cashAndShortTermInvestments'];
	totalDebtMRQ = balanceSheetMRQ['shortLongTermDebtTotal'];
	longTermDebtMRQ = balanceSheetMRQ['longTermDebt']
	// Cash Flow
	oparatingCashFlowTTM = calcularTTM(data,'Cash_Flow', 'totalCashFromOperatingActivities');
	freeCashFlowTTM = calcularTTM(data,'Cash_Flow', 'freeCashFlow');

	// Valuetion-----------------------------
	valuation = data['Valuation'];
	enterpriseValue = numero(valuation['EnterpriseValue']);
	pe = valuation['TrailingPE'];
	pb = valuation['PriceBookMRQ'];
	ps = valuation['PriceSalesTTM'];
	pegRatio = highlights['PEGRatio'];
	evSales = valuation['EnterpriseValueRevenue'];
	evEbitda = valuation['EnterpriseValueEbitda'];
	evEbit = enterpriseValue / ebitTTM;
	evFcf = enterpriseValue / freeCashFlowTTM;

	// Avarge sector
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
		evSlaes: {
			'Energy': 1.05,
			'Real Estate': 6.48,
			'Financial Services': 4.72,
			'Utilities': 5.58,
			'Basic Materials': 2,
			'Consumer Cyclical': 1.49,
			'Consumer Defensive': 1.67,
			'Communication Services': 1.75,
			'Industrials': 1.71,
			'Healthcare': 2.78,
			'Technology': 2.54,
		},
		evEbitda: {
			'Energy': 1.05,
			'Real Estate': 9.49,
			'Financial Services': 6.85,
			'Utilities': 5.78,
			'Basic Materials': 5.41,
			'Consumer Cyclical': 8.67,
			'Consumer Defensive': 5.81,
			'Communication Services': 3.78,
			'Industrials': 10.33,
			'Healthcare': 1.86,
			'Technology': 4.77,
		},
		evEbit: {
			'Energy': 1.05,
			'Real Estate': 24.22,
			'Financial Services': 6.45,
			'Utilities': 9.57,
			'Basic Materials': 6.86,
			'Consumer Cyclical': 10.39,
			'Consumer Defensive': 6.26,
			'Communication Services': 2.96,
			'Industrials': 14.02,
			'Healthcare': 3.26,
			'Technology': 1.31,
		},
		evFCF: {
			'Energy': 8.66,
			'Real Estate': 12.15,
			'Financial Services': 9.86,
			'Utilities': 5,
			'Basic Materials': 15.52,
			'Consumer Cyclical': 14.53,
			'Consumer Defensive': 24.39,
			'Communication Services': 15.95,
			'Industrials': 21.94,
			'Healthcare': 22.56,
			'Technology': 24.78,
		}
	};
	
	priceToSalesAverageSector = libroAverageValuationSector['ps'][sector]
	priceToBookAverageSector = libroAverageValuationSector['pb'][sector]
	priceToearnigsAverageSector = libroAverageValuationSector['pe'][sector]
	evToSalesAverageSector = libroAverageValuationSector['evSlaes'][sector]
	evToEbitdaSector = libroAverageValuationSector['evEbitda'][sector]
	evToEbitAverageSector = libroAverageValuationSector['evEbit'][sector]
	evToFCFAverageSector = libroAverageValuationSector['evFCF'][sector]


	// Puntuacion Valuation------
	puntuacionValuation = 0
	// PE
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(pe, priceToearnigsAverageSector)
	// PB
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(pb, priceToBookAverageSector)
	// PS
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(ps, priceToearnigsAverageSector)
	// EV/Sales
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(evSales, evToSalesAverageSector)
	// EV/Ebitda
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(evEbitda, evToEbitdaSector)
	// EV/Ebit
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(evEbit, evToEbitAverageSector)
	// Ev/FCF
	puntuacionValuation = puntuacionValuation + darPorcentajeValuacion(evFcf, evToFCFAverageSector)
	
	// Poner puntuacion sobre 10 porque esta sobre 7
	puntuacionValuation = (puntuacionValuation * 10)/7
	if(puntuacionValuation > 10) {
		puntuacionValuation = 10
	}

	function darPorcentajeValuacion(multiploCompania, multiploSector) {
		// Si esta abajo del multiplo el porcentaje sera 1 mas por cuanto esta abjo, Si esta arriba por 30% el porcentaje sera 60%, si esta arriba por 50% el porcentaje sera 30%, y mas arriba es 0
		if(multiploCompania <= 0) {
			porcentajePunto = 0
		} else if(multiploCompania/multiploSector <= 1) {
			porcentajePunto = 1 + (1 - multiploCompania/multiploSector)
		} else if ((multiploCompania/multiploSector - 1) <= 0.3) {
			porcentajePunto = 0.6
		} else if ((multiploCompania/multiploSector - 1) <= 0.5) {
			porcentajePunto = 0.3
		} else {
			porcentajePunto = 0
		}
		return porcentajePunto
	}

	// Poner puntuacion en documento
	puntuacionValuation = Math.round(puntuacionValuation)
	puntuacionTablaValuationDoc = document.getElementById('puntuacionTablaValuation')
	puntuacionTablaValuationDoc.textContent = puntuacionValuation + ' / 10'

	
	//Profitability---------------------------------------------------------------------------------------------------------------
	
	// Valores extras necesarios para ROIC
	operatingIncomeTTM = calcularTTM(data,'Income_Statement', 'operatingIncome');
	taxProvisionTTM = calcularTTM(data,'Income_Statement', 'taxProvision');
	pretaxIncomeTTM = calcularTTM(data,'Income_Statement', 'incomeBeforeTax');
	totalStockholderEquityMRQ = balanceSheetMRQ['totalStockholderEquity'];
	shortLongTermDebtTotalMRQ = balanceSheetMRQ['shortLongTermDebtTotal'];
	shortTermInvestmentsMRQ =  balanceSheetMRQ['shortTermInvestments'];
	goodWillMRQ = balanceSheetMRQ['goodWill'];
	longTermDebtAtras = añoEspecifico(data,'Balance_Sheet', 'longTermDebt', 1);
	grossMarginTTM = grossProfitTTM / totalRevenueTTM;
	netMargin = netIncomeTTM / totalRevenueTTM;
	freeCashFlowMargin = freeCashFlowTTM / totalRevenueTTM;
	roaTTM = netIncomeTTM / totalAssetsBeginigOfYear;
	roe = netIncomeTTM / (totalAssetsBeginigOfYear - totalLiabilitiesMRQ);

	// Calcular WACC
	totalDebtAtras = añoEspecifico(data,'Balance_Sheet', 'shortLongTermDebtTotal', 1);
	riskFreeRateOfReturn = 0.0432;
	beta = data['Technicals']['Beta'];
	expectedReturnOfTheMarket = 0.1;
	intrestExpensesTTM = calcularTTM(data,'Income_Statement', 'interestExpense');

	wacc = WACC(
		marketCap,
		shortLongTermDebtTotalMRQ,
		riskFreeRateOfReturn,
		beta,
		expectedReturnOfTheMarket,
		intrestExpensesTTM,
		taxProvisionTTM,
		pretaxIncomeTTM
	);
	roicTTM = ROIC(
		operatingIncomeTTM,
		taxProvisionTTM,
		pretaxIncomeTTM,
		totalStockholderEquityMRQ,
		shortLongTermDebtTotalMRQ,
		shortTermInvestmentsMRQ,
		goodWillMRQ
	)[0];
	roicVsWacc = roicTTM - wacc;

	// Puntuacion Profitability------
	puntuacionProfitability = 0
	// Gross Margin
	if(grossMarginTTM >= 0.6) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if (grossMarginTTM >= 0.5) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if (grossMarginTTM >= 0.45) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	}
	// Net Margin
	if(netMargin >= 0.2) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if(netMargin >= 0.15) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if(netMargin >= 0.10) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	} else if(netMargin > 0) {
		puntuacionProfitability = puntuacionProfitability + 0.3
	}
	// FRee Cach Flow Margin
	if(freeCashFlowMargin >= 0.1) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if(freeCashFlowMargin >= 0.05) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if(freeCashFlowMargin > 0) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	}
	// ROE 
	if(roe >= 0.2) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if(roe >= 0.15) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if(roe > 0.10) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	} else if(roe > 0) {
		puntuacionProfitability = puntuacionProfitability + 0.3
	}
	// ROA
	if(roaTTM >= 0.2) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if(roaTTM >= 0.10) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if(roaTTM > 0.5) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	} else if(roaTTM > 0) {
		puntuacionProfitability = puntuacionProfitability + 0.3
	}
	// ROIC
	if(roicTTM >= 0.12) {
		puntuacionProfitability = puntuacionProfitability + 1
	} else if(roicTTM >= 0.10) {
		puntuacionProfitability = puntuacionProfitability + 0.75
	} else if(roicTTM >= 0.5) {
		puntuacionProfitability = puntuacionProfitability + 0.5
	} else if(roicTTM > 0) {
		puntuacionProfitability = puntuacionProfitability + 0.3
	}
	// ROIC vs WACC
	if(roicVsWacc > 0) {
		puntuacionProfitability = puntuacionProfitability + 1
	}

	// Poner puntuacion sobre 10 porque esta sobre 7
	puntuacionProfitability = (puntuacionProfitability * 10)/7
	// Poner puntuacion en documento
	puntuacionProfitability = Math.round(puntuacionProfitability)
	puntuacionTablaProfitabilityDoc = document.getElementById('puntuacionTablaProfitability')
	puntuacionTablaProfitabilityDoc.textContent = puntuacionProfitability + ' / 10'
	

	
	
	// Scores-------------------------------------------------------------------
	// Valores extras necesarios para Fscore
	roaAtras =  añoEspecifico(data,'Income_Statement', 'netIncome', 1)/ añoEspecifico(data,'Balance_Sheet', 'totalAssets', 1)
	currentRatioAtras = añoEspecifico(data,'Balance_Sheet', 'totalCurrentAssets', 1) / añoEspecifico(data,'Balance_Sheet', 'totalCurrentLiabilities', 1);
	sharesOutstanndingMRQ = balanceSheetMRQ['commonStockSharesOutstanding']
	sharesOutstanndingAtras = añoEspecifico(data,'Balance_Sheet', 'commonStockSharesOutstanding', 1);
	grossMarginAtras = añoEspecifico(data,'Income_Statement', 'grossProfit', 1) / añoEspecifico(data,'Income_Statement', 'totalRevenue', 1);
	assetsTurnOverTTM = totalRevenueTTM / totalAssetsBeginigOfYear;
	assetsTurnOverAtras = añoEspecifico(data,'Income_Statement', 'totalRevenue', 1) / totalAssetsBeginigOfYearPasado;
	currentRatioMRQ= currentAssetsMRQ / currentLiabilitiesMRQ;
	fScore = Fscore(
		roaTTM,
		roaAtras,
		oparatingCashFlowTTM / totalAssetsBeginigOfYear,
		longTermDebtMRQ / totalAssetsMQ,
		longTermDebtAtras / añoEspecifico(data,'Balance_Sheet', 'totalAssets', 1),
		currentRatioMRQ,
		currentRatioAtras,
		sharesOutstanndingMRQ,
		sharesOutstanndingAtras,
		grossMarginTTM,
		grossMarginAtras,
		assetsTurnOverTTM,
		assetsTurnOverAtras
	);
	// Valores extras necesarios para Zscore
	retainedEarningsMRQ = balanceSheetMRQ['retainedEarnings'];
	zScore = Zscore(
		currentAssetsMRQ,
		currentLiabilitiesMRQ,
		totalAssetsBeginigOfYear,
		retainedEarningsMRQ,
		ebitTTM,
		marketCap,
		totalLiabilitiesMRQ,
		totalRevenueTTM
	);
	// Valores extras necesarios para Mscore
	acountReceivablesMRQ = balanceSheetMRQ['netReceivables'];
	acountReceivablesAtras = añoEspecifico(data,'Balance_Sheet', 'netReceivables', 1);
	totalRevenueAtras = añoEspecifico(data,'Income_Statement', 'totalRevenue', 1);
	grossProfitAtras = añoEspecifico(data,'Income_Statement', 'grossProfit', 1);
	currentAssetsAtras = añoEspecifico(data,'Balance_Sheet', 'totalCurrentAssets', 1);
	totalAssetsAtras = añoEspecifico(data,'Balance_Sheet', 'totalAssets', 1);
	propertyPlantAndEquipmentMRQ =
		balanceSheetMRQ['propertyPlantAndEquipmentNet'];
	propertyPlantAndEquipmentAtras = añoEspecifico(data,
		'Balance_Sheet',
		'propertyPlantAndEquipmentNet',
		1
	);
	depreciationTTM = calcularTTM(data,'Cash_Flow', 'depreciation');
	depreciationAtras = añoEspecifico(data,'Cash_Flow', 'depreciation', 1);
	sellingGeneralAdministrativeTTM = calcularTTM(data,'Income_Statement', 'sellingGeneralAdministrative');
	sellingGeneralAdministrativeAtras = añoEspecifico(data,
		'Income_Statement',
		'sellingGeneralAdministrative',
		1
	);
	currentLiabilitiesAtras = añoEspecifico(data,'Balance_Sheet', 'totalCurrentLiabilities', 1);
	capitalLeaseObligationsMRQ = balanceSheetMRQ['capitalLeaseObligations'];
	capitalLeaseObligationsAtras = añoEspecifico(data,'Balance_Sheet', 'capitalLeaseObligations', 1);
	nonOparatingIncomeTTM = calcularTTM(data,'Income_Statement', 'nonOperatingIncomeNetOther');

	mScore = Mscore(
		acountReceivablesMRQ,
		totalRevenueTTM,
		grossProfitTTM,
		currentAssetsMRQ,
		totalAssetsBeginigOfYear,
		propertyPlantAndEquipmentMRQ,
		depreciationTTM,
		sellingGeneralAdministrativeTTM,
		currentLiabilitiesMRQ,
		capitalLeaseObligationsMRQ,
		longTermDebtMRQ,
		oparatingCashFlowTTM,
		netIncomeTTM,
		nonOparatingIncomeTTM,
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
	);

	// Financial Strenght------------------------------------------------------------------------------------------------------------------
	totalRatioTTM = totalAssetsBeginigOfYear / totalLiabilitiesMRQ;
	cashToDebt = totalCashMRQ / totalDebtMRQ;
	debtToEquity = totalDebtMRQ / (totalAssetsBeginigOfYear - totalLiabilitiesMRQ);

	// Puntuacion Financial Strenght
	puntuacionFinancials = 0
	// Total Ratio
	if(totalRatioTTM >= 1.5) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// Current Ratio
	if(currentRatioMRQ >= 2) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// Cash to Debt
	if(cashToDebt >= 0.5) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// Debt to Equity
	if(debtToEquity <= 1.5) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// F-Score
	if(fScore >= 7) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// Z-Score
	if(zScore >= 3) {
		puntuacionFinancials = puntuacionFinancials + 1
	}
	// M-Score
	if(mScore <= -2.22) {
		puntuacionFinancials = puntuacionFinancials + 1
	}

	// Poner puntuacion sobre 10 porque esta sobre 7
	puntuacionFinancials = (puntuacionFinancials * 10)/7
	// Poner puntuacion en documento
	puntuacionFinancials = Math.round(puntuacionFinancials)
	puntuacionTablaFinancialDoc = document.getElementById('puntuacionFinancialStrength')
	puntuacionTablaFinancialDoc.textContent = puntuacionFinancials + ' / 10'
	


	// Function para tomar el valor de hace diez años o el mas antigua si no hay mas de 10 function devuelve el valor[0] y los años asia atras[1] y si se puede 11 años [2]------------
	function maximo5Años(enDonde, cual) {
		financialsYoy = data['Financials'][enDonde]['yearly'];
		// Obtener nombres de objetos
		nombresObjetos = Object.keys(financialsYoy);
		if (nombresObjetos.length > 5) {
			sePuedeMasDe5 = true;
		} else {
			sePuedeMasDe5 = false;
		}
		if (nombresObjetos.length >= 5) {
			valor = financialsYoy[nombresObjetos[4]][cual];
			numeroAños = 5;
		} else if ((nombresObjetos.length = 4)) {
			valor = financialsYoy[nombresObjetos[3]][cual];
			numeroAños = 4;
		} else if ((nombresObjetos.length = 3)) {
			valor = financialsYoy[nombresObjetos[2]][cual];
			numeroAños = 3;
		} else if ((nombresObjetos.length = 2)) {
			valor = financialsYoy[nombresObjetos[1]][cual];
			numeroAños = 2;
		} else {
			valor = financialsYoy[nombresObjetos[0]][cual];
			numeroAños = 1;
		}
		return [numero(valor), parseInt(numeroAños), sePuedeMasDe5];
	}

	
	// Maximo los numeros 10 años atras numbers from Finanacials------------------------------------------
	totalRevenuePasado = maximo5Años('Income_Statement', 'totalRevenue')[0];
	netIncomePasado = maximo5Años('Income_Statement', 'netIncome')[0];
	oparatingCashFlowPasado = maximo5Años('Cash_Flow', 'totalCashFromOperatingActivities')[0];
	freeCashFlowPasado = maximo5Años('Cash_Flow', 'freeCashFlow');
	totalAssetsPasado = maximo5Años('Balance_Sheet', 'totalAssets');
	totalLiabilitiesPasado = maximo5Años('Balance_Sheet', 'totalLiab');

	// Valores pasados necesarios para ROIC
	if (maximo5Años('Income_Statement', 'totalRevenue')[2]) {
		año = maximo5Años('Income_Statement', 'totalRevenue')[1] - 1;
	} else {
		año = maximo5Años('Income_Statement', 'totalRevenue')[1] - 2;
	}

	// Obtener valores de 10 años atras o menos
	operatingIncomePasado = añoEspecifico(data,'Income_Statement', 'operatingIncome', año);
	taxProvisionPasado = añoEspecifico(data,'Income_Statement', 'taxProvision', año);
	pretaxIncomePasado = añoEspecifico(data,'Income_Statement', 'incomeBeforeTax', año);
	totalStockholderEquityPasado =  añoEspecifico(data,'Balance_Sheet', 'totalStockholderEquity', año);
	shortLongTermDebtTotalPasado =  añoEspecifico(data,'Balance_Sheet', 'shortLongTermDebtTotal', año);
	shortTermInvestmentsPasado =  añoEspecifico(data,'Balance_Sheet', 'shortTermInvestments', año);
	goodWillPasado =  añoEspecifico(data,'Balance_Sheet', 'goodWill', año);

	// Obtener valores de 11 años atras o menos si no hay 11 se toma el valor del año y se calcula el roic del penultimo año
	totalAssetsPasadoAtras = añoEspecifico(data,'Balance_Sheet', 'totalAssets', año - 1);
	accountsPayablePasadoAtras = añoEspecifico(data,'Balance_Sheet', 'accountsPayable', año - 1);
	cashAndShortTermInvestmentsPasadoAtras = añoEspecifico(data,
		'Balance_Sheet',
		'cashAndShortTermInvestments',
		año - 1
	);
	currentLiabilitiesPasadoAtras = añoEspecifico(data,
		'Balance_Sheet',
		'totalCurrentLiabilities',
		año - 1
	);
	currentAssetsPasadoAtras = añoEspecifico(data,'Balance_Sheet', 'totalCurrentAssets', año - 1);

	roicPasado = ROIC(
		operatingIncomePasado,
		taxProvisionPasado,
		pretaxIncomePasado,
		totalStockholderEquityPasado,
		shortLongTermDebtTotalPasado,
		shortTermInvestmentsPasado,
		goodWillPasado
	)[0];


	// Grwoth--------------------------------------------------------------------------------------------------------------------------(10 years)
	numeroAños = maximo5Años('Income_Statement', 'totalRevenue')[1];
	totalRevenueG = CAGR(totalRevenueTTM, totalRevenuePasado, numeroAños);
	netIncomeG = CAGR(netIncomeTTM, netIncomePasado, numeroAños);
	oparatingCashFlowG = CAGR(oparatingCashFlowTTM, oparatingCashFlowPasado, numeroAños);
	freeCashFlowG = CAGR(freeCashFlowTTM, freeCashFlowPasado, numeroAños);
	roicG = CAGR(roicTTM, roicPasado, año + 1);
	assetsG = CAGR(totalAssetsBeginigOfYear, totalAssetsPasado, numeroAños);
	liabilitiesG = CAGR(totalLiabilitiesMRQ, totalLiabilitiesPasado, numeroAños);

	// Valores extras necesario para mi indicador
	netIncomeAtras = añoEspecifico(data,'Income_Statement', 'netIncome', 1);
	dividendsPaidTTM = calcularTTM(data,'Cash_Flow', 'dividendsPaid');

	// Puntuacion Grwoth------

	puntuacionGrwoth = 0 
	// Total Revenue Grwoth
	if(totalRevenueG >= 0.2) {
		puntuacionGrwoth = puntuacionGrwoth + 1
	} else if(totalRevenueG >= 0.1) {
		puntuacionGrwoth = puntuacionGrwoth + 0.75
	} else if(totalRevenueG >= 0.05) {
		puntuacionGrwoth = puntuacionGrwoth + 0.5
	} 
	// Net Incomme Grwoth
	if(netIncomeG >= 0.2) {
		puntuacionGrwoth = puntuacionGrwoth + 1
	} else if(netIncomeG >= 0.1) {
		puntuacionGrwoth = puntuacionGrwoth + 0.75
	} else if(netIncomeG >= 0.05) {
		puntuacionGrwoth = puntuacionGrwoth + 0.5
	} else if(netIncomeG > 0) {
		puntuacionGrwoth = puntuacionGrwoth + 0.3
	} 
	// Oparating Cash Flow Grwoth
	if(oparatingCashFlowG >= 0.2) {
		puntuacionGrwoth = puntuacionGrwoth + 1
	} else if(oparatingCashFlowG >= 0.1) {
		puntuacionGrwoth = puntuacionGrwoth + 0.75
	} else if(oparatingCashFlowG >= 0.05) {
		puntuacionGrwoth = puntuacionGrwoth + 0.5
	} else if(oparatingCashFlowG > 0) {
		puntuacionGrwoth = puntuacionGrwoth + 0.3
	} 
	// Free Cash Flow Grwoth
	if(freeCashFlowG >= 0.15) {
		puntuacionGrwoth = puntuacionGrwoth + 1
	} else if(oparatingCashFlowG >= 0.1) {
		puntuacionGrwoth = puntuacionGrwoth + 0.75
	} else if(oparatingCashFlowG >= 0.05) {
		puntuacionGrwoth = puntuacionGrwoth + 0.5
	} else if(oparatingCashFlowG > 0) {
		puntuacionGrwoth = puntuacionGrwoth + 0.3
	} 
	// ROIC
	if(roicG >= 0.12) {
		puntuacionGrwoth = puntuacionGrwoth + 1
	} else if(roicG >= 0.1) {
		puntuacionGrwoth = puntuacionGrwoth + 0.75
	} else if(roicG >= 0.05) {
		puntuacionGrwoth = puntuacionGrwoth + 0.5
	} else if(roicG > 0) {
		puntuacionGrwoth = puntuacionGrwoth + 0.3
	} 


	// Poner puntuacion sobre 10 porque esta sobre 7
	puntuacionGrwoth = (puntuacionGrwoth * 10)/5
	// Poner puntuacion en documento
	puntuacionGrwoth = Math.round(puntuacionGrwoth)
	puntuacionGrwothDoc = document.getElementById('puntuacionGrwoth')
	puntuacionGrwothDoc.textContent = puntuacionGrwoth + ' / 10'




	// Puntuacion final mi indicador ----------------------------------------------------------------------------
	puntuacionMiFormula = miIndicador(
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
		zScore,
		fScore,
		mScore,
		roicTTM,
		freeCashFlowTTM,
		totalRevenueG,
		netIncomeG,
		dividenYield,
		dividendsPaidTTM,
		pegRatio,
		sector
	);


	// Craecion de graficas-----------------------------------------------------------------------------------
	// Grafica Rank----------------------------------
	labelsRank = [
		'Grwoth',
		'Profitability',
		'Financial Strenght',
		'Valuation',
	]
	dataRank =  [puntuacionGrwoth, puntuacionProfitability, puntuacionFinancials, puntuacionValuation]
	graficaRanks = hacerGraficaCircularPolar('circuloDePuntuaciones',labelsRank,dataRank,puntuacionMiFormula)
	// Grafica Analystas-----------------------------
	labelsDegraficaAnalystas = [
		'Strong Buy',
		'Buy' ,
		'Hold' ,
		'sell' ,
		'Strong Sell',
	]
	if(hayAnalystOpinion == 'si') {
		dataDeGraficaAnalystas = [strongBuyAnalysts,buyAnalysts,holdAnalysts,sellAnalysts,strongSellAnalysts]
		grafaicaBarraAnaystas = hacerGraficaBarras('graficaBarras',labelsDegraficaAnalystas,dataDeGraficaAnalystas,['rgb(0 ,143 ,136)','rgb(0 ,192 ,115)','rgb(255, 220, 72)','rgb(255 ,163 ,62)','rgb(255 51 58)'])
	}
	// Grafica ROIC y Tabla ROIC---------------------------------
	arrayRoic = []
	arrayInvestedCapital = []
	arrayGrwoth = []
	arrayNopat = []
	años = Object.keys(data['Financials']['Income_Statement']['yearly'])
	for(i=0;i<años.length;i++) {
		// Data use for calculation of grwoth (Total Revenue Grwoth)
		if(años.length-2-i >= 0) {
			totalRevenue0 = añoEspecifico(data,'Income_Statement', 'totalRevenue', años.length-1-i)
			totalRevenue1 = añoEspecifico(data,'Income_Statement', 'totalRevenue', años.length-2-i)
			grwothYear = totalRevenue1/totalRevenue0 - 1
			if(grwothYear > 1) {
				grwothYear = 0
			} 
			arrayGrwoth.push(grwothYear)
		} 

		// Data use for calculation of roic
		operatingIncome  = añoEspecifico(data,'Income_Statement', 'operatingIncome', i); 
		taxProvision = añoEspecifico(data,'Income_Statement', 'taxProvision', i); 
		pretaxIncome = añoEspecifico(data,'Income_Statement', 'incomeBeforeTax', i); 
		totalStockholderEquity = añoEspecifico(data,'Balance_Sheet', 'totalStockholderEquity',i); 
		shortLongTermDebtTotal = añoEspecifico(data,'Balance_Sheet', 'shortLongTermDebtTotal',i); 
		shortTermInvestments = añoEspecifico(data,'Balance_Sheet', 'shortTermInvestments',i); 
		goodWill = añoEspecifico(data,'Balance_Sheet', 'goodWill',i); 
		roic = ROIC(
			operatingIncome,
			taxProvision,
			pretaxIncome,
			totalStockholderEquity,
			shortLongTermDebtTotal,
			shortTermInvestments,
			goodWill
		)
		arrayRoic.push(roic[0])
		arrayNopat.push(millonesBillonesTrillones(roic[1]))
		arrayInvestedCapital.push(millonesBillonesTrillones(roic[2]))
	}
	años.reverse()
	arrayRoic.reverse()
	arrayGrwoth.unshift(NaN)
	hacerGraficaROIC('graficaROIC',arrayRoic,arrayGrwoth,años,2)
	// Hacer Tabla ROIC
	// Invertir arrays
	arrayRoic.reverse()
	arrayGrwoth.reverse()
	// Tomar 5 años de info si es posible
	años5años = []
	arrayInvestedCapital5años = []
	arrayNopat5años = []
	arrayRoic5años = []
	arrayGrwoth5años = []
	añosParaTablaRoic = tomar5añosSiEsPosible(arrayRoic)
	for(i=0;i<añosParaTablaRoic;i++) {
		años5años.push(años[años.length - 1 - i])
		arrayInvestedCapital5años.push(arrayInvestedCapital[i])
		arrayNopat5años.push(arrayNopat[i])
		arrayRoic5años.push(arrayRoic[i])
		arrayGrwoth5años.push(arrayGrwoth[i])
	}
	años5años.reverse()
	arrayInvestedCapital5años.reverse()
	arrayNopat5años.reverse()
	arrayRoic5años.reverse()
	arrayGrwoth5años.reverse()


	// Tomar Elementos padre
	elementoTablaRoicDate = document.getElementById('tablaRoicDate')
	elementoTablaRoicInvestedCapital = document.getElementById('tablaRoicInvestedCapital')
	elementoTablaRoicNopat  =document.getElementById('tablaRoicNopat')
	elementoTablaRoicRoic = document.getElementById('tablaRoicRoic')
	elementoTablaRoicGrwoth = document.getElementById('tablaRoicGrwoth')
	// Tomar 5 años de info si es posible
	añosParaTablaRoic = tomar5añosSiEsPosible(arrayRoic)
	for(i=0;i<añosParaTablaRoic;i++) {
		año = años5años[i].split('-')[0]
		investedCapital = arrayInvestedCapital5años[i]
		nopat = arrayNopat5años[i]
		roic = porcentaje(arrayRoic5años[i])
		grwoth = porcentaje(arrayGrwoth5años[i])
		// Craer Elementos
		añoTh = document.createElement("th");
		investedCapitalTd = document.createElement("td");
		nopatTd = document.createElement("td");
		roicTd = document.createElement("td");
		grwothTd = document.createElement('td')
		// Craer Nodos de data
		añoNodo = document.createTextNode(año);
		investedCapitaNodo = document.createTextNode(investedCapital);
		nopatNodo = document.createTextNode(nopat);
		roicNodo = document.createTextNode(roic);
		growthNodo = document.createTextNode(grwoth)
		// Agregar Nodo a elemntos
		añoTh.appendChild(añoNodo)
		investedCapitalTd.appendChild(investedCapitaNodo)
		nopatTd.appendChild(nopatNodo)
		roicTd.appendChild(roicNodo)
		grwothTd.appendChild(growthNodo)
		// Agregar Clase a fecha y roic
		añoTh.setAttribute('class','fecha')
		roicTd.setAttribute('class','roicValor')
		// Agregar Elementos a padres
		elementoTablaRoicDate.appendChild(añoTh)
		elementoTablaRoicInvestedCapital.appendChild(investedCapitalTd)
		elementoTablaRoicNopat.appendChild(nopatTd)
		elementoTablaRoicRoic.appendChild(roicTd)
		elementoTablaRoicGrwoth.appendChild(grwothTd)
	}
    // Grafica Earnings----------------------------
	function añoEspecificoEarnings(enDonde, cual, año) {
		earnings = data['Earnings'][enDonde];
		// Obtener nombres de objetos
		nombresObjetos = Object.keys(earnings);
		// OBtener valor
		valor = earnings[nombresObjetos[año]][cual];
		return valor;
	}
	fechaDeReporteHistorico = []
	epsEstimateHistorico = []
	actualEpsHistorico = []
	for(i=0;i<Object.keys(data['Earnings']['History']).length;i++) {
		fechaDeReporte = añoEspecificoEarnings('History', 'reportDate', i)
		epsEstimate = añoEspecificoEarnings('History', 'epsEstimate', i)
		actualEps = añoEspecificoEarnings('History','epsActual',i)
		if(epsEstimate != null) {
			fechaDeReporteHistorico.push(fechaDeReporte)
			epsEstimateHistorico.push(epsEstimate)
			actualEpsHistorico.push(actualEps)
		}
	}
	fechaDeReporte5Trimestres = []
	epsEstimate5Trimestres = []
	actualEps5Trimestres = []
	// Tomar primeros 5 earnings
	for(i=0;i<5;i++) {
		fechaDeReporte5Trimestres.push(fechaDeReporteHistorico[i])
		epsEstimate5Trimestres.push(epsEstimateHistorico[i])
		actualEps5Trimestres.push(actualEpsHistorico[i])
	}
	fechaDeReporte5Trimestres.reverse()
	epsEstimate5Trimestres.reverse()
	actualEps5Trimestres.reverse()
	hacerGraficaEarnings('graficaEarnings',actualEps5Trimestres,epsEstimate5Trimestres,fechaDeReporte5Trimestres)
	

	// Poner info en sitio------------------------------------------------------------------------------------------------------

	// Tomar elementos
	documentNombreEmpresaCentro = document.getElementById('nombreEmpresaCentro')
	documentoLinEmpresa = document.getElementById('linkPaginaEmpresa')
	documentoLogoEmpresa = document.getElementById('logoEmpresa');
	documentoNombreEmpresa = document.getElementById('nombreEmpresa');
	documentoTickerEmpresa = document.getElementById('tickerEmpresa');
	// Valuation Rank Tabla 
	documentoPeTabla = document.getElementById('peTabla')
	documentoPbTabla = document.getElementById('pbTabla')
	documentoPsTabla = document.getElementById('psTabla')
	documentoEvSTabla = document.getElementById('ev/sTabla')
	documentoEvEbitdaTabla = document.getElementById('ev/EbitdaTabla')
	documentoEvEbitTabla = document.getElementById('ev/EbitTabla')
	documentoEvFcfTabla = document.getElementById('ev/FcfTabla')
	// Grwoth Rank
	documentoGrwothRankTituloTabla = document.getElementById('grwothRankTitulo')
	documentoTotalRevenueTabla = document.getElementById('totalRevenueTabla')
	documentoNetIncommeTabal = document.getElementById('netIncommeTabla')
	documentoOparatingCashFlowTabla = document.getElementById('oparatingCashFlowTabla')
	documentoFreeCashFlowTabla  = document.getElementById('freeCashFlowTabla')
	documentoRoicGTabla = document.getElementById('roicGTabla')
	documentoAssetsTabla  = document.getElementById('assetsTabla')
	documentoLiabilitiesTabla  = document.getElementById('liabilitiesTabla')
	// Financial Strength Rank
	documentoTotalRatioTabla = document.getElementById('totalRatioTabla')
	documentoCurrentRatioTabla = document.getElementById('currentRatioTabla')
	documentoCashToDebtTabla  = document.getElementById('cashToDebtTabla')
	documentoDebtToEquityTabla = document.getElementById('debtToEquityTabla')
	documentoFScoreTabla = document.getElementById('f-ScoreTabla')
	documentoZScoreTabla  = document.getElementById('z-ScoreTabla')
	documentoMScoreTabla = document.getElementById('m-ScoreTabla')
	// Profitability Rank
	documentoGrossMarginTabla = document.getElementById('grossMarginTabla')
	documentoNetMarginTabla = document.getElementById('netMarginTabla') 
	documentoFcfMarginTabla  =document.getElementById('fcfMarginTabla')
	documentoRoeTabla = document.getElementById('roeTabla')
	documentoRoaTabla = document.getElementById('roaTabla')
	documentoRoicTabla = document.getElementById('roicTabla')
	documentoRoicvaWaacTabla  = document.getElementById('roicvaWaacTabla')


	lugarMarketCap = document.getElementById('infoMarketCap') 
	lugarbeta = document.getElementById('infoBeta') 
	lugarPE = document.getElementById('infoPe') 
	lugarDividendo = document.getElementById('infoDividendo') 
	lugarTotalRatio = document.getElementById('infoTotalRatio') 
	lugarEPS = document.getElementById('infoEPS') 
	lugarNetMargin = document.getElementById('infoNetMargin') 
	lugar1yEstimation = document.getElementById('info1yEstimation') 

	// Rellenar elementos
	documentNombreEmpresaCentro = fullName
	documentoLinEmpresa.href = webUrl
	documentoLogoEmpresa.src = logoURL;
	documentoNombreEmpresa.innerHTML = fullName;
	documentoTickerEmpresa.innerHTML = `(${ticker})`;
	lugarMarketCap.innerHTML = millonesBillonesTrillones(marketCap)
	lugarbeta.innerHTML = arondir(beta)
	lugarPE.innerHTML = `${arondir(pe)}x`
	lugarDividendo.innerHTML = `${arondir(dividenShare)}(${arondir(dividenYield*100)}%)`
	lugarTotalRatio.innerHTML = arondir(totalRatioTTM)
	lugarEPS.innerHTML = arondir(eps)
	lugarNetMargin.innerHTML = `${arondir(netMargin*100)}%`
	lugar1yEstimation.innerHTML = wallStreetTargetPrice
	// Valuation Rank Tabla
	documentoPeTabla.innerHTML = multiplicador(pe)
	documentoPbTabla.innerHTML = multiplicador(pb)
	documentoPsTabla.innerHTML = multiplicador(ps)
	documentoEvSTabla.innerHTML = multiplicador(evSales)
	documentoEvEbitdaTabla.innerHTML = multiplicador(evEbitda)
	documentoEvEbitTabla.innerHTML = multiplicador(evEbit)
	documentoEvFcfTabla.innerHTML = multiplicador(evFcf)
	// Grwoth Rank
	documentoGrwothRankTituloTabla.innerHTML = 'Grwoth ' + numeroAños + ' years'
	documentoTotalRevenueTabla.innerHTML = porcentaje(totalRevenueG)
	documentoNetIncommeTabal.innerHTML = porcentaje(netIncomeG)
	documentoOparatingCashFlowTabla.innerHTML = porcentaje(oparatingCashFlowG)
	documentoFreeCashFlowTabla.innerHTML = porcentaje(freeCashFlowG)
	documentoRoicGTabla.innerHTML = porcentaje(roicG)
	documentoAssetsTabla.innerHTML = porcentaje(assetsG)
	documentoLiabilitiesTabla.innerHTML = porcentaje(liabilitiesG)
	// Financial Strength Rank
	documentoTotalRatioTabla.innerHTML = multiplicador(totalRatio)
	documentoCurrentRatioTabla.innerHTML = multiplicador(currentRatio)
	documentoCashToDebtTabla.innerHTML = multiplicador(cashToDebt)
	documentoDebtToEquityTabla.innerHTML = multiplicador(debtToEquity)
	documentoFScoreTabla.innerHTML = fScore + '/9'
	documentoZScoreTabla.innerHTML = arondir(zScore)
	documentoMScoreTabla.innerHTML = arondir(mScore)
	// Profitability Rank
	documentoGrossMarginTabla.innerHTML = porcentaje(grossMarginTTM)
	documentoNetMarginTabla.innerHTML = porcentaje(netMargin)
	documentoFcfMarginTabla.innerHTML = porcentaje(freeCashFlowMargin)
	documentoRoeTabla.innerHTML = porcentaje(roe)
	documentoRoaTabla.innerHTML = porcentaje(roa)
	documentoRoicTabla.innerHTML = porcentaje(roicTTM)
	documentoRoicvaWaacTabla.innerHTML = porcentaje(roicVsWacc)
	// Poner grafica circular
	indicadorCicular = hcaerIndicador('circuloDePuntuacion', 'puntuacion', Math.round(puntuacionMiFormula));
}


trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token='+apiToken)




// Sakar precio de accion cada minuto-----------------------------------------------------------------------------------------------------------------------------------------
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
	openPrice = data['open'];
	lowPrice = data['low'];
	highPrice = data['high'];
	nominalChange = data['change'];
	percentilChange = data['change_p'];
	volume = data['volume'];
	gmtoffset = data['gmtoffset'];
	timestamp = data['timestamp'];
	fecha = tranformUnix(timestamp)[0];
	hora = tranformUnix(timestamp)[1];

	// Poner info en sitio------------------------------------------------------------------------------------------------------

	// Tomar elementos
	documentoPrecio = document.getElementById('precioAccion');
	documentoCambioNominal = document.getElementById('cambioNominal');
	documentoCambioPorcentual = document.getElementById('cambioPorcentual');

	// Rellenar elementos
	documentoPrecio.innerHTML = arondir(closePriceMinuto);
	documentoCambioNominal.innerHTML = masMenos(arondir(nominalChange));
	documentoCambioPorcentual.innerHTML = `(${masMenos(arondir(percentilChange))}%)`;
	agregarPositivoNegativoUno('cambioNominal');
	agregarPositivoNegativoUno('cambioPorcentual');
	closePriceAperturaCitio = closePriceMinuto;
	return closePriceAperturaCitio;
}

// Tomar precio al abrir citio
closePriceAperturaCitio = precioInfoRefresh(
	'https://eodhistoricaldata.com/api/real-time/'+ ticker +'?api_token='+apiToken+'&fmt=json'
);

// Tomar Precio cada minuto verificar que no sea fin de semana para no ejecutar funcion
m0 = moment();
if ((m0.day() != 6) & (m0.day() != 0)) {
	refreshPrecio = setInterval(function () {
		precioInfoRefresh(
			'https://eodhistoricaldata.com/api/real-time/'+ ticker +'?api_token='+apiToken+'&fmt=json'
		);
	}, 60000);
}

// Cracion garfica-------------------------------------------------------------------------------------------------------------------------------------------------------
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
	graficaPrincipal = hacerGraficaHistorica(
		'graficaUnica',
		'graficaPrecio',
		closePriceArray,
		dateArray,
		1,
		500,
		0,
	);
	return [closePriceArray[0],graficaPrincipal]
}

// Tomar info desde max y guardar la variable time frame d
async function trabajarDataHistoricaGraficaGuardarVariableD(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	diccionarioGraficaD = trabajarDataGraficaGuardarVariableD(data);
}

function trabajarDataGraficaGuardarVariableD(data) {
	// Separara Info
	closePriceArrayMax = [];
	dateArrayMax = [];
	for (i = 0; i < data.length; i++) {
		closePriceArrayMax.push(data[i]['adjusted_close']);
		dateArrayMax.push(data[i]['date']);
	}
	return { labelsFechas: dateArrayMax, closePrice: closePriceArrayMax };
}

// Tomar info desde max y guardar la variable time frame w
async function trabajarDataHistoricaGraficaGuardarVariableW(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	diccionarioGraficaW = trabajarDataGraficaGuardarVariableW(data);
}

function trabajarDataGraficaGuardarVariableW(data) {
	// Separara Info
	closePriceArrayMax = [];
	dateArrayMax = [];
	for (i = 0; i < data.length; i++) {
		closePriceArrayMax.push(data[i]['adjusted_close']);
		dateArrayMax.push(data[i]['date']);
	}
	return { labelsFechas: dateArrayMax, closePrice: closePriceArrayMax };
}

// Definir fecha de hoy de data------
m1 = moment();
const fechaHoy = transformarFechaMoment(moment());

// DefinirOtras Fechas----
// 5j
m2 = moment();
// Definir dia de la semana si es viernes sabado o domingo empezar el lunes
if (m2.day() == 5 || m2.day() == 6) {
	diaDeLaSemana = 1;
	semana = m2.week();
} else if (m2.day() == 0) {
	diaDeLaSemana = 1;
	semana = m2.week() - 1;
} else {
	diaDeLaSemana = m2.day() + 1;
	semana = m2.week() - 1;
}
const fecha5Dias = transformarFechaMoment(m2.week(semana).day(diaDeLaSemana));
// 1m
m3 = moment();
const fecha1m = transformarFechaMoment(m3.week(m3.week() - 4).day(m3.day()));
// 6m
m4 = moment();
const fecha6m = transformarFechaMoment(m4.month(m4.month() - 6).day(m4.day()));
// YTD
m5 = moment();
const fechaYTD = transformarFechaMoment(m5.startOf('year').day(1));
// 1y
m6 = moment();
const fecha1y = transformarFechaMoment(m6.year(m6.year() - 1).day(m6.day()));
// 5y
m7 = moment();
const fecha5y = transformarFechaMoment(m7.year(m7.year() - 5).day(m7.day()));
// MAX
const fechaMax = '1900-01-01';

// Hacer grafica
urlInicial =
	'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fechaYTD +
	'&to=' +
	fechaHoy +
	'&period=d&fmt=json&api_token='+apiToken+'';
precioInicialYTDyGrafica = trabajarDataHistoricaGrafica(urlInicial);
// Guardar data desde max time frame d
urlMaxD =
	'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fechaMax +
	'&to=' +
	fechaHoy +
	'&period=d&fmt=json&api_token='+apiToken+'';
trabajarDataHistoricaGraficaGuardarVariableD(urlMaxD);

// Guardar data desde max time frame W
urlMaxW =
	'https://eodhistoricaldata.com/api/eod/' +
	ticker +
	'?from=' +
	fechaMax +
	'&to=' +
	fechaHoy +
	'&period=w&fmt=json&api_token='+apiToken+'';
trabajarDataHistoricaGraficaGuardarVariableW(urlMaxW);



// Obtener botones
boton5j = document.getElementById('boton5j');
boton1m = document.getElementById('boton1m');
boton6m = document.getElementById('boton6m');
botonYTD = document.getElementById('botonYTD');
boton1a = document.getElementById('boton1a');
boton5a = document.getElementById('boton5a');
botonMax = document.getElementById('botonMax');

// Obtener lugar de cambio y desde cuando
cambioNominalPorcentual = document.getElementById('cambioNominalPorcentual');


// Poner Cambio YTD en la grafica con flecha al inicio de la pagina
precioInicialYTDyGrafica.then((precioInicialYTD) => {
	precioInicialYTD = precioInicialYTD[0]
	if(typeof closePriceAperturaCitio == 'object') {
		closePriceAperturaCitio.then((closePriceAperturaCitio) => {
			cambioNominal = masMenos(arondir(closePriceAperturaCitio - precioInicialYTD));
			cambioPorcentual = masMenos(arondir((closePriceAperturaCitio / precioInicialYTD - 1) * 100));
			cambio = `${cambioNominal} (${cambioPorcentual}%)`;
			// Agregar Cambio arriba de grafica
			cambioNominalPorcentual.innerHTML = cambio;
			// Poner color positivo o negativo a cmabio
			agregarPositivoNegativoUno('cambioNominalPorcentual');
			// Poner flecha arriba abajo
			ponerFlecha('flechaArribaAbajo', cambioNominal);
			// Agrgar desde cuando
			agregarDesdeCuando('desdeCuando', 'ytd', cambioNominal);
		})
	} else {
		cambioNominal = masMenos(arondir(closePriceAperturaCitio - precioInicialYTD));
		cambioPorcentual = masMenos(arondir((closePriceAperturaCitio / precioInicialYTD - 1) * 100));
		cambio = `${cambioNominal} (${cambioPorcentual}%)`;
		// Agregar Cambio arriba de grafica
		cambioNominalPorcentual.innerHTML = cambio;
		// Poner color positivo o negativo a cmabio
		agregarPositivoNegativoUno('cambioNominalPorcentual');
		// Poner flecha arriba abajo
		ponerFlecha('flechaArribaAbajo', cambioNominal);
		// Agrgar desde cuando
		agregarDesdeCuando('desdeCuando', 'ytd', cambioNominal);
	}
})
// Agrgar precio de hoy a grafica
closePriceAperturaCitio.then((value) => {
	if(graficaPrincipal == undefined) {
		precioInicialYTDyGrafica.then((graficaPrincipal) => {
			agregarHoyEnGrafica(graficaPrincipal, value);
		})
	} else {
		agregarHoyEnGrafica(graficaPrincipal, value);
	}
});

// Cambio en parte de arriba y agregar nuevo precio a graficacada minuto si no es fin de semana

if ((moment().day() != 6) & (moment().day() != 0)) {
	refreshParteArriba = setInterval(async function () {
		if (graficaPrincipal.data.datasets.length == 3) {
			precioInicialGrafica = graficaPrincipal.data.datasets[2].data[0];
		} else {
			precioInicialGrafica = graficaPrincipal.data.datasets[0].data[0];
		}
		cambioNominal = masMenos(arondir(closePriceMinuto - precioInicialGrafica));
		cambioPorcentual = masMenos(arondir((closePriceMinuto / precioInicialGrafica - 1) * 100));
		cambio = `${cambioNominal} (${cambioPorcentual}%)`;
		// Trabajar parte de arriba-----------------
		// Agregar Cambio arriba de grafica
		cambioNominalPorcentual.innerHTML = cambio;
		// Poner color positivo o negativo a cmabio
		agregarPositivoNegativoUno('cambioNominalPorcentual');
		// Poner flecha arriba abajo
		ponerFlecha('flechaArribaAbajo', cambioNominal);
		// Poner rojo o verde la fecha desde cuando
		agregarPositivoNegativoConValorAparte('desdeCuando', cambioNominal);
		// Agrgar precio de hoy a la grafica
		agregarHoyEnGrafica(graficaPrincipal, closePriceMinuto);
	}, 60000);
}

// Eliminar toda actividas de boton excepto YTD
boton5j.classList.remove('botonActivo');
boton1m.classList.remove('botonActivo');
boton6m.classList.remove('botonActivo');
boton1a.classList.remove('botonActivo');
boton5a.classList.remove('botonActivo');
botonMax.classList.remove('botonActivo');
// Hcer functiones de que pasa cuando se pica
async function functionBoton5j() {
	boton5j.classList.add('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.remove('botonActivo');
	// Agregar Cambio a cambio
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaD, fecha5Dias);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', '5d', cambioNominal);
}
async function functionboton1m() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.add('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.remove('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaD, fecha1m);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', '1m', cambioNominal);
}
async function functionBoton6m() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.add('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.remove('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaD, fecha6m);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', '6m', cambioNominal);
}
async function functionBotonYTD() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.add('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.remove('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaD, fechaYTD);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', 'ytd', cambioNominal);
}
async function functionBoton1a() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.add('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.remove('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaD, fecha1y);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', '1y', cambioNominal);
}
async function functionBoton5a() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.add('botonActivo');
	botonMax.classList.remove('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaW, fecha5y);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', '5y', cambioNominal);
}
async function functionBotonMax() {
	boton5j.classList.remove('botonActivo');
	boton1m.classList.remove('botonActivo');
	boton6m.classList.remove('botonActivo');
	botonYTD.classList.remove('botonActivo');
	boton1a.classList.remove('botonActivo');
	boton5a.classList.remove('botonActivo');
	botonMax.classList.add('botonActivo');
	cambio = changeDataGrafica(graficaPrincipal, diccionarioGraficaW, fechaMax);
	cambioNominalPorcentual.innerHTML = cambio;
	// Poner color positivo o negativo a cmabio
	agregarPositivoNegativoUno('cambioNominalPorcentual');
	// Poner flecha arriba abajo
	cambioNominal = parseFloat(cambio.split('(')[0]);
	ponerFlecha('flechaArribaAbajo', cambioNominal);
	// Agregar fecha a desde cuando
	agregarDesdeCuando('desdeCuando', 'begining', cambioNominal);
}

// Function recortar data
function changeDataGrafica(grafica, diccionarioCompleto, fechaInicial) {
	closePriceArray = diccionarioCompleto['closePrice'];
	dateArray = diccionarioCompleto['labelsFechas'];
	// asta donde recortar array----
	// si el dia no exite en el array tomar dias anteriores asta encontrar el array si el dia no existe en todo el array tomar ultima fecha de array
	if (fechaInicial != '1900-01-01') {
		if (dateArray.indexOf(fechaInicial) == -1) {
			m10 = moment();
			m10
				.year(fechaInicial.split('-')[0])
				.month(fechaInicial.split('-')[1] - 1)
				.date(fechaInicial.split('-')[2]);
			fechaInicial = transformarFechaMoment(m10);
			numeroDeIntentos = 0;
			while ((dateArray.indexOf(fechaInicial) == -1) & (numeroDeIntentos < dateArray.length+1)) {
				m10.add(1, 'days');
				fechaInicial = transformarFechaMoment(m10);
				numeroDeIntentos = numeroDeIntentos + 1;
			}
			//error
			if (numeroDeIntentos > dateArray.length) {
				fechaInicial = dateArray[0];
			}
		}
	}
	recortarArray = dateArray.indexOf(fechaInicial);
	// Tomar info desde recorte si la info ya esta en max no recortar
	if (fechaInicial == '1900-01-01') {
		nuevoClosePriceArray = closePriceArray;
		nuevoDateArray = dateArray;
	} else {
		nuevoClosePriceArray = [];
		nuevoDateArray = [];
		for (i = 1; i <= dateArray.length - recortarArray; i++) {
			nuevoClosePriceArray.push(closePriceArray[dateArray.length - i]);
			nuevoDateArray.push(dateArray[dateArray.length - i]);
		}

		// Reinvertir data
		nuevoClosePriceArray.reverse();
		nuevoDateArray.reverse();
	}

	// Agregar o remplasar close price del momento
	hoy = transformarFechaMoment(moment());
	if (nuevoDateArray[nuevoDateArray.length - 1] != hoy) {
		nuevoDateArray.push(hoy);
		nuevoClosePriceArray.push(closePriceMinuto);
	} else if (nuevoDateArray[nuevoDateArray.length - 1] == hoy) {
		nuevoClosePriceArray[nuevoClosePriceArray.length - 1] = closePriceMinuto;
	}

	// Ver si la grafica es de dos colores o uno---------
	if (grafica.data.datasets.length == 3) {
		// Separar Data
		let lineaApertura = [];
		let lineaPositiva = [];
		let lineaNegativa = [];

		// Hacer Linea de apertura
		for (i = 0; i < nuevoClosePriceArray.length; i++) {
			lineaApertura.push(nuevoClosePriceArray[0]);
			if (nuevoClosePriceArray[i] < nuevoClosePriceArray[0]) {
				lineaNegativa.push(nuevoClosePriceArray[i]);
				lineaPositiva.push(NaN);
			} else {
				lineaNegativa.push(NaN);
				lineaPositiva.push(nuevoClosePriceArray[i]);
			}
		}
		juntarArray(lineaPositiva, lineaNegativa);
		// Agregar data a la grafica
		grafica.config.data.datasets[0].data = lineaPositiva;
		grafica.config.data.datasets[1].data = lineaNegativa;
		grafica.config.data.datasets[2].data = lineaApertura;
		grafica.config.data.labels = nuevoDateArray;
		grafica.config.options.animation.duration = 0;
	}
	// Si es de un solo color
	else {
		// Hacer  linea de apertura
		let lineaApertura = [];
		for (i = 0; i < nuevoClosePriceArray.length; i++) {
			lineaApertura.push(nuevoClosePriceArray[0]);
		}
		// Ver de que color hacer la linea
		if (nuevoClosePriceArray[nuevoClosePriceArray.length - 1] > nuevoClosePriceArray[0]) {
			colorLinea = 'rgb(52,168,83)';
			colorFondo = gradiantePositivo;
		} else if (nuevoClosePriceArray[nuevoClosePriceArray.length - 1] < nuevoClosePriceArray[0]) {
			colorLinea = 'rgb(234 67 53)';
			colorFondo = gradientNegativo;
		} else {
			colorLinea = 'rgb(100,100,100)';
		}
		grafica.config.data.datasets[0].data = lineaApertura;
		grafica.config.data.datasets[1].data = nuevoClosePriceArray;
		grafica.config.data.datasets[1].borderColor = colorLinea;
		grafica.config.data.datasets[1].backgroundColor = colorFondo;
		grafica.config.data.labels = nuevoDateArray;
		grafica.config.options.animation.duration = 0;
	}

	grafica.update();
	// Definir cambio nominal porcentual entre esas fechas
	cambioNominal = masMenos(arondir(closePriceMinuto - nuevoClosePriceArray[0]));
	cambioPorcentual = masMenos(arondir((closePriceMinuto / nuevoClosePriceArray[0] - 1) * 100));
	return `${cambioNominal} (${cambioPorcentual}%)`;
}

// Function para poner flecha arriba abajo
function ponerFlecha(idLugar, cambio) {
	flechaArribaAbajo = document.getElementById(idLugar);
	if (cambio < 0) {
		flechaArribaAbajo.classList = 'fa-solid fa-arrow-down';
	} else {
		flechaArribaAbajo.classList = 'fa-solid fa-arrow-up';
	}
}

// Function para agregar desde cuando
function agregarDesdeCuando(idElemento, desdeCuando, valorCambio) {
	elemento = document.getElementById(idElemento);
	if (valorCambio < 0) {
		elemento.classList.add('negativo');
		elemento.classList.remove('positivo');
	} else {
		elemento.classList.add('positivo');
		elemento.classList.remove('negativo');
	}
	elemento.innerHTML = `from ${desdeCuando}`;
}



// Function agregar hoy en grafica
function agregarHoyEnGrafica(grafica, valorHoy) {
	hoy = transformarFechaMoment(moment());
	// Ver si se tiene que agregar hoy o remplazar si ya esta
	ultimaFechaEnGrafica = grafica.config.data.labels[grafica.config.data.labels.length - 1];
	if (ultimaFechaEnGrafica != hoy) {
		// Agregar fecha de hoy a grafica
		grafica.config.data.labels.push(hoy);
		// Ver si la grafica es de dos colores o uno---------
		if (grafica.data.datasets.length == 3) {
			lineaPositiva = grafica.config.data.datasets[0].data;
			lineaNegativa = grafica.config.data.datasets[1].data;
			lineaApertura = grafica.data.datasets[2].data;
			lineaApertura.push(lineaApertura[0]);
			if (valorHoy < lineaApertura[0]) {
				lineaNegativa.push(valorHoy);
				lineaPositiva.push(NaN);
			} else {
				lineaPositiva.push(valorHoy);
				lineaNegativa.push(NaN);
			}
		}
		// Si es de un solo color
		else {
			lineaApertura = grafica.config.data.datasets[0].data;
			lineaData = grafica.config.data.datasets[1].data;
			lineaData.push(valorHoy);
			lineaApertura.push(lineaApertura[0]);
			if (valorHoy > lineaApertura[0]) {
				colorLinea = 'rgb(52,168,83)';
				colorFondo = gradiantePositivo;
			} else {
				colorLinea = 'rgb(234 67 53)';
				colorFondo = gradientNegativo;
			}
			grafica.config.data.datasets[1].borderColor = colorLinea;
			grafica.config.data.datasets[1].backgroundColor = colorFondo;
		}
	} else if (ultimaFechaEnGrafica == hoy) {
		// Ver si la grafica es de dos colores o uno---------
		if (grafica.data.datasets.length == 3) {
			lineaPositiva = grafica.config.data.datasets[0].data;
			lineaNegativa = grafica.config.data.datasets[1].data;
			lineaApertura = grafica.data.datasets[2].data;
			if (valorHoy < lineaApertura[0]) {
				lineaNegativa[lineaNegativa.length - 1] = valorHoy;
				lineaPositiva[lineaPositiva.length - 1] = NaN;
			} else {
				lineaPositiva[lineaPositiva.length - 1] = valorHoy;
				lineaNegativa[lineaNegativa.length - 1] = NaN;
			}
		}
		// Si es de un solo color
		else {
			lineaApertura = grafica.config.data.datasets[0].data;
			lineaData = grafica.config.data.datasets[1].data;
			lineaData[lineaData.length - 1] = valorHoy;
			if (valorHoy > lineaApertura[0]) {
				colorLinea = 'rgb(52,168,83)';
				colorFondo = gradiantePositivo;
			} else {
				colorLinea = 'rgb(234 67 53)';
				colorFondo = gradientNegativo;
			}
			grafica.config.data.datasets[1].borderColor = colorLinea;
			grafica.config.data.datasets[1].backgroundColor = colorFondo;
		}
	}
	grafica.update();
}




// Functiones--------------------------------------------------------------------------------------------------------------
// Function para calcular mi indicador
// Data de ratios promedios po sector -> https://finviz.com/groups.ashx?g=sector&v=120&o=pe

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

// Function para calcular CAGR
function CAGR(valorDeLlegada, valorDePrincipio, numeroDeAños) {
	if(valorDePrincipio < 0 & valorDeLlegada>0) {
		return 1
	}
	return (numero(valorDeLlegada) / numero(valorDePrincipio)) ** (1 / numeroDeAños) - 1;
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

// WAAC function
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
	if(D == 0) {
		costOfDebt = 0;
	} else {
		costOfDebt = intrestExpenses / D;
	}
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

// Z score function
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
			window.location.href = "../Resultado Busqueda/busqueda.html"
		})
		a.setAttribute('href','../Resultado Busqueda/busqueda.html')
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
		window.location.href = "../Resultado Busqueda/busqueda.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});



// Functiones de graficas-----------------------------------------------------------------------------
// Function para hacer circulo de puntuacion
function hcaerIndicador(idGrafica, idPuntuacion, puntuacion) {
	// Insercion de puntuacion
	documentoPuntuacion = document.getElementById(idPuntuacion);
	documentoPuntuacion.innerHTML = arondir(puntuacion);

	// Insercion de grafica
	ctx = document.getElementById(idGrafica).getContext('2d');
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
	return grafica;
}
// Grafica de precio de accion
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
// Function para hacer grafica historica de acciones falta tooltip para grafica dual
function hacerGraficaHistorica(
	tipoDeGrafica,
	idContexto,
	data,
	labels,
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
	gradiantePositivo.addColorStop(0, 'rgb(52 168 83)');
	gradiantePositivo.addColorStop(1, fondo);
	// Hacer Difuminado Negativo
	gradientNegativo = ctx.createLinearGradient(0, 0, 0, alturaContexto);
	gradientNegativo.addColorStop(0, 'rgb(234 67 53)');
	gradientNegativo.addColorStop(1, fondo);



	if (tipoDeGrafica == 'graficaDual') {
		let lineaApertura = [];
		let lineaPositiva = [];
		let lineaNegativa = [];

		// Hacer Linea de apertura
		for (i = 0; i < data.length; i++) {
			lineaApertura.push(data[0]);
			if (data[i] < data[0]) {
				lineaNegativa.push(data[i]);
				lineaPositiva.push(NaN);
			} else {
				lineaNegativa.push(NaN);
				lineaPositiva.push(data[i]);
			}
		}
		juntarArray(lineaPositiva, lineaNegativa);
		myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						data: lineaPositiva,
						pointRadius: 0,
						pointBackgroundColor: 'rgb(52,168,83)',
						pointBorderColor: 'rgb(52,168,83)',
						borderColor: 'rgb(52 168 83)',
						tension: 0.5,
						fill: '+2',
						backgroundColor: gradiantePositivo,
						borderWidth: anchoLinea,
					},
					{
						data: lineaNegativa,
						pointRadius: 0,
						pointBackgroundColor: 'rgb(234 67 53)',
						pointBorderColor: 'rgb(234 67 53)',
						borderColor: 'rgb(234 67 53)',
						tension: 0.5,
						fill: '+1',
						backgroundColor: gradientNegativo,
						borderWidth: anchoLinea,
					},
					{
						data: lineaApertura,
						pointRadius: 0,
						borderColor: 'rgb(80,80,80)',
						borderDash: [5, 10],
						borderWidth: anchoLinea,
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
						display: false,
						grid: {
							display: false,
						},
					},
					y: {
						ticks: {
							color: 'rgb(30, 30, 30)',
							font: {
								size: 10,
								family: 'Poppins',
								weight: 500,
							},
							callback: function(value, index, ticks) {
								return value;
							},
						},
					}
				},
			},
		});
		return myChart;
	} else if (tipoDeGrafica == 'graficaUnica') {
		let lineaApertura = [];
		// Hacer Linea de apertura y labels
		for (i = 0; i < data.length; i++) {
			lineaApertura.push(data[0]);
		}

		if (data[data.length - 1] > data[0]) {
			colorLinea = 'rgb(52,168,83)';
			colorFondo = gradiantePositivo;
		} else if (data[data.length - 1] < data[0]) {
			colorLinea = 'rgb(234 67 53)';
			colorFondo = gradientNegativo;
		} else {
			colorLinea = 'rgb(100,100,100)';
		}

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
			// tomo body 1 porque ese es el array de precio que cambia el 1
			if(tooltip.body[1]) {
				const arrayLabels = tooltip.title  || []
				const arrayPrecios = tooltip.body[1]['lines']
				const arrayPrecioAperura = tooltip.body[0]['lines']
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
					priceApertura = parseFloat(arrayPrecioAperura[0].split(',')[0] + '.' + arrayPrecioAperura[0].split(',')[1])
					cambioNominal = arondir(priceEnLugar-priceApertura)
					cambioPorcentual = arondir((priceEnLugar/priceApertura-1)*100)
					const textLabelPrecio = document.createTextNode(`Price: ${arondir(priceEnLugar)}`)
					const textLabelCambio = document.createTextNode(`Change: ${cambioNominal}(${cambioPorcentual}%)`)
					// append text label
					tooltipPrecioP.appendChild(textLabelPrecio)
					tooltipCambioP.appendChild(textLabelCambio)
					// Cambiar color de tooltip
					if(cambioNominal < 0) {
						tooltipEL.style.backgroundColor = 'rgba(234, 67, 53, 0.8)'
					} else {
						tooltipEL.style.backgroundColor = 'rgba(52,168,83, 0.8)'
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


		// Craecion de grafica----------------------------------
		myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						data: lineaApertura,
						pointRadius: 0,
						pointHoverRadius: 0,
						borderColor: 'rgb(80,80,80)',
						borderDash: [5, 10],
						borderWidth: anchoLinea,
					},
					{
						data: data,
						pointRadius: 0,
						pointHoverRadius: 8,
						pointHoverBackgroundColor: '#fff',
						borderColor: colorLinea,
						tension: 0.5,
						fill: true,
						backgroundColor: colorFondo,
						borderWidth: anchoLinea,
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
						display: true,
						grid: {
							display: false,
						},
					},
					y: {
						grid: {
							display: true,
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
}
// Function para hacer grafica de roic
function hacerGraficaROIC(
	idContextoROIC,
	dataRoic,
	dataGrwoth,
	labels,
	anchoLinea,
	
) {
	ctxROIC = document.getElementById(idContextoROIC).getContext('2d');
	
	
	// Craecion de grafica----------------------------------
	graficaROIC = new Chart(ctxROIC, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					data: dataRoic,
					pointRadius: 0,
					pointHoverRadius: 8,
					pointHoverBackgroundColor: '#fff',
					borderColor: 'rgb(250, 196, 0)',
					tension: 0.5,
					backgroundColor: 'rgb(250, 196, 0)',
					borderWidth: anchoLinea,
				},
				{
					data: dataGrwoth,
					pointRadius: 0,
					pointHoverRadius: 8,
					pointHoverBackgroundColor: '#fff',
					borderColor: '#188038',
					tension: 0.5,
					backgroundColor: '#188038',
					borderWidth: anchoLinea,
				},
			],
		},
		options: {
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
					display: true,
					text: 'Roic vs Grwoth',
					color: 'rgb(30, 30, 30)',
					font: {
						size: 18,
						family: 'Poppins',
						weight: 800,
					},
					padding: {
						bottom: 30,
					}
				},
				tooltip: {
					display: true,
					displayColors: false,
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
						label: function(tooltipItem, data) { 
							const datasetIndex = tooltipItem.datasetIndex;
							const value = tooltipItem.formattedValue;
							let label = '';
							
							if (datasetIndex === 0) {
								label = 'ROIC: ';
							} else if (datasetIndex === 1) {
								label = 'Growth: ';
							}
							
							
							label += porcentaje(value)
							
							return label;
						}
					}
				}
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
				},
				y: {
					grid: {
						display: true
					},
					ticks: {
						color: 'rgb(30, 30, 30)',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 500,
						},
						callback: function(value, index, ticks) {
							return  arondir(value*100) + '%';
						},
					},
				},
			},
		},
	});
	return graficaROIC;
}
// Function hacer grafica polar con opion de titulo
function hacerGraficaCircularPolar(idContexto,labels,data,puntuacionMiFormula) {
	
	colorBordeCirculo = colorPuntuacion(Math.round(puntuacionMiFormula))
	colorCentroCirculo = convertRGBtoRGBA(colorBordeCirculo,0.5)
	ctx = document.getElementById(idContexto).getContext('2d');
	myChart = new Chart(ctx, {
		type: 'radar',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					pointRadius: 0,
					pointHitRadius: 30,
					borderColor: colorBordeCirculo,
					backgroundColor: colorCentroCirculo,
					tension: 0.5,
					borderWidth: 4,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					display: true,
					displayColors: false,
					backgroundColor: 'rgb(255, 255, 255)',
					padding: {
						top: 0,
						bottom: 20,
						left: 20,
						right: 20,
					},
					bodyColor: '#666666',
					bodyFont: {
						size: 20,
						family: 'Poppins',
						weight: 'bold',
					},
					borderWidth: 1,
					borderColor: '#cfcfcf',
					cornerRadius: 10,
					callbacks: {
						label: function(tooltipItems, data) { 
							puntuacion = parseFloat(tooltipItems['formattedValue'].split(',')[0] + '.' + tooltipItems['formattedValue'].split(',')[1])
							return tooltipItems['label'] + ': ' + arondir(puntuacion) + ' / 10';
						}
					}
				}
			},
			scales: { 
				r: {
					max: 10,
					min: 0,
					beginAtZero: true,
					angleLines: {
						display: false
					},
					grid: {
						circular: true,
					},
					ticks: {
						display: false,
					},
					pointLabels: {
						padding: 10,
						font: {
							size: 14,
							weight: 'bold',
							family: 'Poppins',
						}
					},
				}
			}
		},
	});
	return myChart
}
// Function hacer grafica barras con tooltip personas
function hacerGraficaBarras(idContexto,labels,data,color) {
	ctx = document.getElementById(idContexto).getContext('2d');
	// Creacion de cotum tootltip
	const getOrCreateToolTip = (chart) => {
		let tooltipEL = chart.canvas.parentNode.querySelector('div')
		if(!tooltipEL) {
			tooltipEL = document.createElement('div')
			tooltipEL.classList.add('tooltipGraficaBarraDesign')
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
		// tomo body 1 porque ese es el array de precio que cambia el 1
		if(tooltip.body) {
			const titleLines = tooltip.title  || []
			const bodyLines = tooltip.body.map(b => b.lines)
			const tooltipLI = document.createElement('li')

			// 4a title loop
			titleLines.forEach(title => {
				tooltipUL.appendChild(tooltipLI)
				// creat span
				const tooltipSPAN = document.createElement('span')
				tooltipLI.appendChild(tooltipSPAN)
				// creat a text node with the title
				const tooltipTitle = document.createTextNode(title)
				tooltipSPAN.appendChild(tooltipTitle)
			})

			// 4b body loop
			const tooltipBodyP = document.createElement('p')
			const tooltipIcon = document.createElement('i')
			tooltipBodyP.classList.add('textoLabel')
			tooltipIcon.classList.add('iconoTooltip')
			// Poner clase al icono de su icono
			tooltipIcon.classList.add('fa-solid')
			tooltipIcon.classList.add('fa-user-group')
			bodyLines.forEach((body,i) => {
				const textLabel = document.createTextNode(bodyLines)
				// Append icono
				tooltipBodyP.appendChild(tooltipIcon)
				// append text label
				tooltipBodyP.appendChild(textLabel)
			})
			const ULnode = tooltipEL.querySelector('ul')
			// remove old children
			while(ULnode.firstChild) {
				ULnode.firstChild.remove()
			}
			// add new childre
			ULnode.appendChild(tooltipLI)
			tooltipLI.appendChild(tooltipBodyP)
			tooltipEL.style.opacity = 1

			// positioning of the tooltip
			const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas
			tooltipEL.style.left = positionX + tooltip.caretX + 'px'
			tooltipEL.style.top = positionY + tooltip.caretY - ((positionY + tooltip.caretY)*0.1) + 'px' 
		}
	},

	// Craecion de grafica
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					borderColor: color,
					backgroundColor: color,
					borderRadius: 10,
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
					display: false,
				},
				title: {
					display: true,
					text: 'Analyst Opinions',
					color: 'rgb(30, 30, 30)',
					font: {
						size: 18,
						family: 'Poppins',
						weight: 800,
					},
					padding: {
						bottom: 10,
					}
				},
				tooltip: {
					enabled: false,
					external: externalToolTip ,
					position: 'nearest',
				}
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
// Hacer Grafica Earnings con tooltip personalizado
function hacerGraficaEarnings(
	idContexto,
	dataEarnigs,
	dataEstimate,
	labels,) {
	// Crear colores de puntos segun logrado o no
	coloresPuntos = []
	for(i=0;i<dataEarnigs.length-1;i++) {
		if(dataEarnigs[i] > dataEstimate[i]) {
			coloresPuntos.push('#188038')
		} else if(dataEarnigs[i] < dataEstimate[i]) {
			coloresPuntos.push('#d93025')
		} else {
			coloresPuntos.push('#666666')
		}
	}

	// Tooltip personalizado
	const getOrCreateToolTip = (chart) => {
		let tooltipEL = chart.canvas.parentNode.querySelector('div')
		if(!tooltipEL) {
			tooltipEL = document.createElement('div')
			tooltipEL.classList.add('tooltipGraficaEarnings')
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
		if(tooltip.body[0]) {
			if(tooltip.body[0] == undefined) {
				arrayEarnings = '-'
			} else {
				arrayEarnings =  tooltip.body[0]['lines']
			}
			if(tooltip.body[1] == undefined) {
				arrayEstimate = '-'
			} else {
				arrayEstimate =  tooltip.body[1]['lines']
			}
			const tooltipLI = document.createElement('li')
			// 4b body loop
			const tooltipEarnings = document.createElement('p')
			const tooltipEarningsValor = document.createElement('b')
			const tooltipEstimacion = document.createElement('p')
			tooltipEarnings.classList.add('textoEarnings')
			tooltipEarningsValor.setAttribute('id','valorEarnings')
			tooltipEstimacion.classList.add('textoEstimate')
			arrayEarnings.forEach((body,i) => {
				if(arrayEstimate == '-') {
					textLabelEarnings = document.createTextNode(`Actual: `)
					textoEarningsValor = document.createTextNode('-')
					textLabelEstimate = document.createTextNode(`Estimate: ${arrayEarnings}`)
				} else {
					textLabelEarnings = document.createTextNode(`Actual: `)
					textoEarningsValor = document.createTextNode(arrayEarnings)
					textLabelEstimate = document.createTextNode(`Estimate: ${arrayEstimate}`)
				}
				// append text label
				tooltipEarnings.appendChild(textLabelEarnings)
				tooltipEarningsValor.appendChild(textoEarningsValor)
				tooltipEarnings.appendChild(tooltipEarningsValor)
				tooltipEstimacion.appendChild(textLabelEstimate)
				// Poner color de actual earnings 
				if(arrayEstimate != '-') {
					earningsNumerico = parseFloat(arrayEarnings[0].split(',')[0] + '.' + arrayEarnings[0].split(',')[1])
					estimateNumerico = parseFloat(arrayEstimate[0].split(',')[0] + '.' + arrayEstimate[0].split(',')[1])
					if(arrayEarnings > arrayEstimate) {
						colorEarnings = '#188038'
					} else if(arrayEarnings < arrayEstimate) {
						colorEarnings = '#d93025'
					} else {
						colorEarnings = '#666666'
					}
					tooltipEarningsValor.style.color = colorEarnings
				}
			})
			const ULnode = tooltipEL.querySelector('ul')
			// remove old children
			while(ULnode.firstChild) {
				ULnode.firstChild.remove()
			}
			// add new childre
			ULnode.appendChild(tooltipLI)
			tooltipLI.appendChild(tooltipEarnings)
			tooltipLI.appendChild(tooltipEstimacion)
			tooltipEL.style.opacity = 1

			// positioning of the tooltip
			const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas
			tooltipEL.style.left = positionX + tooltip.caretX + 'px'
			tooltipEL.style.top = positionY + tooltip.caretY - ((positionY + tooltip.caretY)*0.1) + 'px' 
		}
	},


	ctx = document.getElementById(idContexto).getContext('2d');
	grafica = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					data: dataEarnigs,
					pointRadius: 7,
					pointBackgroundColor: coloresPuntos,
					pointHoverRadius: 10,
					borderColor: document.body.style.backgroundColor,
					backgroundColor: document.body.style.backgroundColor,
				},
				{
					data: dataEstimate,
					pointRadius: 7,
					pointBackgroundColor: document.body.style.backgroundColor,
					pointBorderColor: '#666666',
					pointBorderWidth: 2,
					pointHoverRadius: 10,
					borderColor: document.body.style.backgroundColor,
					backgroundColor: document.body.style.backgroundColor,
				},
			],
		},
		options: {
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
					display: true,
					text: 'Earnings',
					color: 'rgb(30, 30, 30)',
					font: {
						size: 18,
						family: 'Poppins',
						weight: 800,
					},
					padding: {
						bottom: 10,
					}
				},
				tooltip: {
					enabled: false,
					external: externalToolTip ,
				}
			},
			scales: {
				x: {
					display: true,
					grid: {
						display: false,
					},
				},
				y: {
					grid: {
						display: false
					},
					ticks: {
						color: 'rgb(30, 30, 30)',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 500,
						},
					},
				},
			},
		},
	})
}

// Functiones practicas------------------------------------------------------------------------------
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
// Function multiplicador
function multiplicador(valor) {
    return arondir(valor) + 'x'
}
// Function porcentaje
function porcentaje(valor) {
    return arondir(valor*100) + '%'
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

// Funcion converit color en rgba
function convertRGBtoRGBA(rgbString, alpha) {
    // Separar los componentes RGB
    var rgbArray = rgbString.match(/\d+/g);

    // Convertir a RGBA
    var rgbaString = 'rgba(' + rgbArray[0] + ', ' + rgbArray[1] + ', ' + rgbArray[2] + ', ' + alpha + ')';

    return rgbaString;
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
// Funcion agregar positivo o negativo a un elemento con un valor aparte
function agregarPositivoNegativoConValorAparte(idElemento, valor) {
	let elemento = document.getElementById(idElemento);
	let contenido = valor;
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
// Function avrage of array
function avrageOfArray(array) {
	return array.reduce((a,b) => a+b,0) / array.length
}
// Function sum of array
function sumOfArray(array) {
	return array.reduce((partialSum, a) => partialSum + a, 0);
}
// Function para calcular tred line [0] = trend Line | [1] = slope | [2] = interceptionx
function trendLineOfArray(array) {
	x = []
	for(i=1;i<=array.length;i++) {
		x.push(i)
	}
	// Calcular avrage de puntos x y y 
	avrageX = avrageOfArray(x)
	avrageY = avrageOfArray(array)
	// Hacer primeras dos columnas de diferencia
	diferenciaX = []
	diferenciaY = []
	for(i=0;i<array.length;i++) {
		diferenciaX.push(x[i] - avrageX)
		diferenciaY.push(array[i] - avrageY)
	}
	// Hacer ultimas dos columnas multiplicacion entre columnas
	multiplicacionXY = []
	multiplicarXX = []
	for(i=0;i<diferenciaX.length;i++) {
		multiplicacionXY.push(diferenciaX[i] * diferenciaY[i])
		multiplicarXX.push(diferenciaX[i] * diferenciaX[i])
	}
	// Find the slope 
	slopeM = sumOfArray(multiplicacionXY) / sumOfArray(multiplicarXX)
	// Find the array interception
	interceptionB = avrageY - (slopeM * avrageX)
	// Creando Array de trend Line
	trendLine = []
	for(i=0;i<diferenciaX.length;i++) {
		trendLine.push(slopeM * i + interceptionB)
	}
	return [trendLine,slopeM,interceptionB]
}

// Functiones para timepo moment()------------------------------------------------------------------
// Devuelve la fecha en [0] y la hora en [1]
function tranformUnix(unix_timestamp) {
	let a = new Date(unix_timestamp * 1000);
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	let year = a.getFullYear();
	let month = months[a.getMonth()];
	let date = a.getDate();
	let hour = a.getHours();
	let min = a.getMinutes();
	let sec = a.getSeconds();
	let fecha = date + ' ' + month + ' ' + year + ' ';
	let hora = hour + ':' + min + ':' + sec;
	return [fecha, hora];
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

// Functiones que trabajan con la data--------------------------------------------------------------
async function marketCapAnual(urlPrecio,urlGeneral) {
	// Storing response
	const responsePrecio = await fetch(urlPrecio);
	const responseGeneral = await fetch(urlGeneral);

	// Storing data in form of JSON
	let dataPrecio = await responsePrecio.json();
	let dataGeneral = await responseGeneral.json();

	function sakarMarketCap(dataPrecio,dataGeneral) {
		// Tomar numero de acciones anual
		arrayNumeroAccionesAnual = []
		for(i=0;i<Object.keys(dataGeneral['outstandingShares']['annual']).length;i++) {
			arrayNumeroAccionesAnual.push(dataGeneral['outstandingShares']['annual'][i]['shares'])
		}
		// Tomar precio anual
		arrayAnualClosePrice = []
		for(i=0;i<dataPrecio.length;i++) {
			if(i+1 == dataPrecio.length) {
				arrayAnualClosePrice.push(dataPrecio[i-1]['adjusted_close'])
			} else {
				if(dataPrecio[i]['date'].split('-')[0] != dataPrecio[i+1]['date'].split('-')[0]) {
					arrayAnualClosePrice.push(dataPrecio[i]['adjusted_close'])
				}
			}
		}
		arrayAnualClosePrice.reverse()

		// Multiplicar acciones y precio
		arrayMarketCapHistorico = []
		if(arrayAnualClosePrice.length < arrayNumeroAccionesAnual.length) {
			for(i=0;i<arrayAnualClosePrice.length;i++) {
				arrayMarketCapHistorico.push(arrayNumeroAccionesAnual[i]*arrayAnualClosePrice[i])
			}
		} else if(arrayAnualClosePrice.length > arrayNumeroAccionesAnual.length) {
			for(i=0;i<arrayNumeroAccionesAnual.length;i++) {
				arrayMarketCapHistorico.push(arrayNumeroAccionesAnual[i]*arrayAnualClosePrice[i])
			}
		} else {
			for(i=0;i<arrayNumeroAccionesAnual.length;i++) {
				arrayMarketCapHistorico.push(arrayNumeroAccionesAnual[i]*arrayAnualClosePrice[i])
			}
		}
		return arrayMarketCapHistorico
	}
	return sakarMarketCap(dataPrecio,dataGeneral)
}
// Function para calcular TTM
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

















// Parte estetica-----------------------}

// Hacer que se quite el label de la grafica cuando quitas el mous
document.addEventListener('touchstart', function (event) {
    var isOutsideChart = !event.target.closest('#graficaPrecio');
    var tooltip = document.getElementsByClassName('.tooltipul');

    if (isOutsideChart && tooltip.style.display !== 'none') {
      // Ocultar el tooltip si se toca fuera de la gráfica
      tooltip.style.display = 'none';
    }
});


// color de fondo
// Obtener el modo actual
if (localStorage.getItem('dark-mode') === 'true') {
	// Resto de colores para widget circular
	restoColor = 'rgb(40,40,40)';
	bordeColor = 'rgb(49,49,49)';
	// Cambiar background del body a negro
	document.body.style.backgroundColor = '#222020';
} else {
	// Resto de colores para widget circular
	restoColor = 'rgb(240,240,240)';
	bordeColor = 'rgb(255,255,255)';
	// Cambiar background del body a blanco
	document.body.style.backgroundColor = 'rgb(255,255,255)';
}

// Boton dark white-----------
const btnSwitch = document.querySelector('#switch');

// Condicion si el boton es apretado
btnSwitch.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	btnSwitch.classList.toggle('active');

	// Que hacer si es negro
	if (document.body.classList.contains('dark')) {
		localStorage.setItem('dark-mode', 'true');
		// Cambiar lupa de busqueda
		// lupa.src = 'imagenes/buscarcirculonegro.png';
		// Cambiar background del body a negro
		document.body.style.backgroundColor = '#222020';
		// CambiarFondoDegraficas a negro ----------------
	}
	// Que hacer si es blanco
	else {
		localStorage.setItem('dark-mode', 'false');
		// Cambiar lupa de busuqeda
		// lupa.src = 'imagenes/buscarcirculo.png';
		// Cambiar background del body a blanco
		document.body.style.backgroundColor = 'rgb(255,255,255)';
		// CambiarFondoDegraficas a blanco ----------------
	}
});



