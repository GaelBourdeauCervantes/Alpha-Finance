// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');

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
// Finction para convertir en numero y en caso de null devolver 0
function numero(valor) {
	if (isNaN(parseFloat(valor))) {
		resultado = 0;
	} else {
		resultado = parseFloat(valor);
	}
	return resultado;
}
// Function most recent quartes
function mostRecentQuarter(data, cual) {
	financialsYoy = data['Financials']['Balance_Sheet']['quarterly'];
	// Obtener nombres de objetos
	nombresObjetos = Object.keys(financialsYoy);
	valor = financialsYoy[nombresObjetos[0]][cual];
	return numero(valor);
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

// Function para tranformar numeor en millones billones o trillones
function millonesBillonesTrillones(numero) {
	if(numero > 1000000000000) {
		numero = `${arondir(numero/1000000000000)}T`
	} else if(numero > 1000000000) {
		numero = `${arondir(numero/1000000000)}B`
	} else if(numero > 1000000) {
		numero = `${arondir(numero/1000000)}M`
	}
	return numero
}

async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}

function trabajarData(data) {
    // Tomar Data----------------------------------------------------------------------------------------------
	// Identidad
	general = data['General'];
	fullName = general['Name'];
	ticker = general['Code'];
	webUrl = general['WebURL'];
	logoURL = `https://eodhistoricaldata.com/${general['LogoURL']}`;
	// General
	highlights = data['Highlights'];
    valuation = data['Valuation'];
    general = data['General'];
	shares = data['SharesStats'];
	technicals = data['Technicals']
	splitsDividends = data['SplitsDividends']
	// Valuation mesures
	marketCap = millonesBillonesTrillones(highlights['MarketCapitalization']);
    enterpriseValue = millonesBillonesTrillones(valuation['EnterpriseValue'])
    trailingPE = multiplicador(valuation['TrailingPE'])
    forwardPE = multiplicador(valuation['ForwardPE'])
    pegRatio = arondir(highlights['PEGRatio'])
	ps = multiplicador(valuation['PriceSalesTTM']);
    pb = multiplicador(valuation['PriceBookMRQ']);
    evSales = multiplicador(valuation['EnterpriseValueRevenue']);
	evEbitda = multiplicador(valuation['EnterpriseValueEbitda']);
	// Financial Highlightshighlights
    ficalYearEnd = general['FiscalYearEnd']
    mostRecentQuarterDate  =highlights['MostRecentQuarter']
    profitMargin = porcentaje(highlights['ProfitMargin'])
    oparatingMargin = porcentaje(highlights['OperatingMarginTTM'])
    roa = porcentaje(highlights['ReturnOnAssetsTTM'])
    roe = porcentaje(highlights['ReturnOnEquityTTM'])
	// Income Statment
	revenueTTM = millonesBillonesTrillones(highlights['RevenueTTM'])
	revenuePerShareTTM = arondir(highlights['RevenuePerShareTTM'])
	quarterlyRevenueGrowthYOY = porcentaje(highlights['QuarterlyRevenueGrowthYOY'])
	grossProfitTTM = millonesBillonesTrillones(highlights['GrossProfitTTM'])
	ebitda = millonesBillonesTrillones(highlights['EBITDA'])
	netIncome = millonesBillonesTrillones(calcularTTM(data,'Income_Statement', 'netIncome'))
	dilutedEpsTTM = millonesBillonesTrillones(highlights['DilutedEpsTTM'])
	quarterlyEarningsGrowthYOY = porcentaje(highlights['QuarterlyEarningsGrowthYOY'])
	// Balance Sheets MRQ
	totalCash = millonesBillonesTrillones(mostRecentQuarter(data,'cashAndShortTermInvestments'))
	cashPerShare = arondir(mostRecentQuarter(data,'cashAndShortTermInvestments')/shares['SharesOutstanding'])
	totalDebt = millonesBillonesTrillones(mostRecentQuarter(data,'shortLongTermDebtTotal'))
	totalDebtEquity = arondir(mostRecentQuarter(data,'shortLongTermDebtTotal')/mostRecentQuarter(data,'totalStockholderEquity'))
	currentRatio = multiplicador(mostRecentQuarter(data,'totalCurrentAssets')/mostRecentQuarter(data,'totalCurrentLiabilities'))
	bookValuePerShare  = arondir((mostRecentQuarter(data,'totalAssets')-mostRecentQuarter(data,'totalLiab'))/shares['SharesOutstanding'])
	// Cash Flow TTM
	oparatingCashFlow = millonesBillonesTrillones(calcularTTM(data,'Cash_Flow', 'totalCashFromOperatingActivities'))
	freeCashFlow = millonesBillonesTrillones(calcularTTM(data,'Cash_Flow','freeCashFlow'))

	// Tecnicals
	beta = arondir(technicals['Beta'])
	week52High = arondir(technicals['52WeekHigh'])
	week52Low = arondir(technicals['52WeekLow'])
	movingAvrage50 = arondir(technicals['50DayMA'])
	movingAvrage200 = arondir(technicals['200DayMA'])
	// Shares
	sharesOutstanding = millonesBillonesTrillones(shares['SharesOutstanding'])
	sharesFloat = millonesBillonesTrillones(shares['SharesFloat'])
	percentHeldByInsiders = porcentaje(shares['PercentInsiders']/100)
	percentHeldByInstiturions = porcentaje(shares['PercentInstitutions']/100)
	sharesShort = millonesBillonesTrillones(technicals['SharesShort'])
	shortRatio = arondir(technicals['ShortRatio'])
	shortPercentFloat = porcentaje(technicals['SharesShort']/shares['SharesFloat'])
	shortPercentOutstanding = porcentaje(technicals['SharesShort']/shares['SharesOutstanding'])
	sharesShortPriorMonth = millonesBillonesTrillones(technicals['SharesShortPriorMonth'])
	// Dividends & Splits
	forwardAnnualDividendRate = arondir(splitsDividends['ForwardAnnualDividendRate']/100)
	forwardAnnualDividendYield = porcentaje(splitsDividends['ForwardAnnualDividendYield'])
	payoutRatio = porcentaje(splitsDividends['PayoutRatio'])
	dividendDate = splitsDividends['DividendDate']
	exDividendDate = splitsDividends['ExDividendDate']
	lastSplitDate = splitsDividends['LastSplitDate']
	lastSplitFactor = splitsDividends['LastSplitFactor']

	
	// Obtener elementos---------------------------------------------------------------------------------------
	// Identidad-----------------
	documentoLinEmpresa = document.getElementById('linkPaginaEmpresa')
	documentoLogoEmpresa = document.getElementById('logoEmpresa');
	documentoNombreEmpresa = document.getElementById('nombreEmpresa');
	documentoTickerEmpresa = document.getElementById('tickerEmpresa');
	// Financials-----------------
	documentFiscalYearEnds = document.getElementById('fiscalYearEnds')
	documentMostRecentQuarter = document.getElementById('mostRecentQuarter')
	documentProfitMargin = document.getElementById('profitMargin')
	documentOparatingMargin = document.getElementById('oparatingMargin')
	documentReturnOnAssets = document.getElementById('returnOnAssets')
	documentReturnOnEquity = document.getElementById('returnOnEquity')
	documentTotalRevenue = document.getElementById('totalRevenue')
	documentRevenuePerShare = document.getElementById('revenuePerShare')
	documentQuarterlyRevenueGrowth = document.getElementById('quarterlyRevenueGrowth')
	documentGrossProfit = document.getElementById('grossProfit')
	documentEbitda = document.getElementById('ebitda')
	documentNetIncome= document.getElementById('netIncome')
	documentDilutedEps = document.getElementById('dilutedEps')
	documentQuarterlyEarningsGrowth = document.getElementById('quarterlyEarningsGrowth')
	documentTotalCash = document.getElementById('totalCash')
	documentTotalCashPerShare = document.getElementById('totalCashPerShare')
	documentTotalDebt = document.getElementById('totalDebt')
	documentTotalDebtEquity = document.getElementById('totalDebtEquity')
	documentCurrentRatio = document.getElementById('currentRatio')
	documentBookValuePerShare = document.getElementById('bookValuePerShare')
	documentOparatingCashFlow= document.getElementById('oparatingCashFlow')
	documentFreeCashFlow = document.getElementById('freeCashFlow')
	//Trading Information------------
	documentBeta = document.getElementById('beta')
	document52WeekChange = document.getElementById('52WeekChange')
	document52WeekHigh = document.getElementById('52WeekHigh')
	document52WeekLow = document.getElementById('52WeekLow')
	document50DayMovingAverage = document.getElementById('50DayMovingAverage')
	document200DayMovingAverage = document.getElementById('200DayMovingAverage')
	documentSharesOutstandig = document.getElementById('sharesOutstandig')
	documentFloat = document.getElementById('float')
	documentHeldbyInsiders = document.getElementById('heldbyInsiders')
	documentHeldbyInstitutions = document.getElementById('heldbyInstitutions')
	documentSharesShort = document.getElementById('sharesShort')
	documentShortRatio = document.getElementById('shortRatio')
	documentShortofFloat = document.getElementById('shortofFloat')
	documentShortofSharesOutstanding = document.getElementById('shortofSharesOutstanding')
	docuementSharesShortPriorMonth  =document.getElementById('sharesShortPriorMonth')
	documentForwardAnnualDividendRate = document.getElementById('forwardAnnualDividendRate')
	documentForwardAnnualDividendYield = document.getElementById('forwardAnnualDividendYield')
	documentPayoutRatio = document.getElementById('payoutRatio')
	documentDividendDate = document.getElementById('dividendDate')
	documentExDividendDate = document.getElementById('exDividendDate')
	documentLastSplitFactor = document.getElementById('lastSplitFactor')
	documentLastSplitDate = document.getElementById('lastSplitDate')
	// Valuation Mesures----------------
	documentMarketCap = document.getElementById('marketCap')
	documentEnterpriseValue = document.getElementById('enterpriseValue')
	documentTrailingPE = document.getElementById('trailingPE')
	documentForwardPE = document.getElementById('forwardPE')
	documentPegRatio = document.getElementById('pegRatio')
	documentPriceSales = document.getElementById('priceSales')
	documentPriceBook = document.getElementById('priceBook')
	documentEvRevenue = document.getElementById('evRevenue')
	documentEvEbitda = document.getElementById('evEbitda')
	
	// Rellenar elementos---------------------------------------------------------------------------------------
	// Identidad
	documentoLinEmpresa.href = webUrl
	documentoLogoEmpresa.src = logoURL;
	documentoNombreEmpresa.innerHTML = fullName;
	documentoTickerEmpresa.innerHTML = `(${ticker})`;

	// Financials---------
	documentFiscalYearEnds.innerHTML = ficalYearEnd
	documentMostRecentQuarter.innerHTML = mostRecentQuarterDate
	documentProfitMargin.innerHTML = profitMargin
	documentOparatingMargin.innerHTML = oparatingMargin
	documentReturnOnAssets.innerHTML = roa
	documentReturnOnEquity.innerHTML = roe
	documentTotalRevenue.innerHTML = revenueTTM
	documentRevenuePerShare.innerHTML = revenuePerShareTTM
	documentQuarterlyRevenueGrowth.innerHTML = quarterlyRevenueGrowthYOY
	documentGrossProfit.innerHTML = grossProfitTTM
	documentEbitda.innerHTML = ebitda
	documentNetIncome.innerHTML = netIncome
	documentDilutedEps.innerHTML = dilutedEpsTTM
	documentQuarterlyEarningsGrowth.innerHTML = quarterlyEarningsGrowthYOY
	documentTotalCash.innerHTML = totalCash
	documentTotalCashPerShare.innerHTML = cashPerShare
	documentTotalDebt.innerHTML = totalDebt
	documentTotalDebtEquity.innerHTML = totalDebtEquity
	documentCurrentRatio.innerHTML = currentRatio
	documentBookValuePerShare.innerHTML = bookValuePerShare
	documentOparatingCashFlow.innerHTML = oparatingCashFlow
	documentFreeCashFlow.innerHTML = freeCashFlow
	//Trading Information------------
	documentBeta.innerHTML = beta
	document52WeekChange.innerHTML = ' '
	document52WeekHigh.innerHTML = week52High
	document52WeekLow.innerHTML = week52Low
	document50DayMovingAverage.innerHTML = movingAvrage50
	document200DayMovingAverage.innerHTML = movingAvrage200
	documentSharesOutstandig.innerHTML = sharesOutstanding
	documentFloat.innerHTML = sharesFloat
	documentHeldbyInsiders.innerHTML = percentHeldByInsiders
	documentHeldbyInstitutions.innerHTML = percentHeldByInstiturions
	documentSharesShort.innerHTML = sharesShort
	documentShortRatio.innerHTML = shortRatio
	documentShortofFloat.innerHTML = shortPercentFloat
	documentShortofSharesOutstanding.innerHTML = shortPercentOutstanding
	docuementSharesShortPriorMonth.innerHTML = sharesShortPriorMonth
	documentForwardAnnualDividendRate.innerHTML = forwardAnnualDividendRate
	documentForwardAnnualDividendYield.innerHTML = forwardAnnualDividendYield
	documentPayoutRatio.innerHTML = payoutRatio
	documentDividendDate.innerHTML = dividendDate
	documentExDividendDate.innerHTML = exDividendDate
	documentLastSplitFactor.innerHTML = lastSplitFactor
	documentLastSplitDate.innerHTML = lastSplitDate
	// Valuation Mesures----------------
	documentMarketCap.innerHTML  = marketCap
	documentEnterpriseValue.innerHTML  = enterpriseValue
	documentTrailingPE.innerHTML  = trailingPE
	documentForwardPE.innerHTML  = forwardPE
	documentPegRatio.innerHTML  = pegRatio
	documentPriceSales.innerHTML  = ps
	documentPriceBook.innerHTML  = pb
	documentEvRevenue.innerHTML  = evSales
	documentEvEbitda.innerHTML  = evEbitda
}


trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')





