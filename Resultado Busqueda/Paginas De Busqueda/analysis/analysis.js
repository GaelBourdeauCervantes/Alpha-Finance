// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = '60c184d42ae3a5.75307084'

async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}


function trabajarData(data) { 
	// Logo de la empresa
    logoURL = 'https://eodhistoricaldata.com/' + data["General"]['LogoURL'] 
    // Poner logo en el document
    documentoLogoEmpresa = document.getElementById('documentoLogoEmpresa')
    documentoLogoEmpresa.src = logoURL;
	// Tomar Tresury Yield
	var tresuryYieldValue = tresuryYield('https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=IPEKTH6CFPNE7G3N')
	// Tomar Ultimo Cahs Flow y asia atras si se puede 5 años
	añosAtras = tomar5añosSiEsPosible(Object.keys(data['Financials']['Balance_Sheet']['yearly']))
	// Hacer para el inicio-----------------------
	// Ver si valor ya esta guardado
	if(tomarValorLocalStorage(ticker + ': añosAproyectar') == 'undefined') {
		añosAproyectar =  document.getElementById('añosProyectar').value = 5
	} else {
		añosAproyectar =  document.getElementById('añosProyectar').value = tomarValorLocalStorage(ticker + ': añosAproyectar')
	}
	if(tomarValorLocalStorage(ticker + ': perpetualGrwoth') == 'undefined') {
		perpetualGrwoth = document.getElementById('perpetualGrwothRate').value
	} else {
		perpetualGrwoth = document.getElementById('perpetualGrwothRate').value = porcentaje(tomarValorLocalStorage(ticker + ': perpetualGrwoth'))
	}

	if(tomarValorLocalStorage(ticker + ': expectedReturn') == 'undefined') {
		expectedReturn = document.getElementById('expectedReturn').value = '10%'
	} else {
		expectedReturn = document.getElementById('expectedReturn').value = porcentaje(tomarValorLocalStorage(ticker + ': expectedReturn'))
	}
	riskFreeRateElement = document.getElementById('riskFreeRate')
	requieredReturnElement  = document.getElementById('requieredReturnElement')
	inputRiquiredRateOfReturn = document.getElementById('inputRiquiredRateOfReturn')
	// Ver si la info esta en porcentaje y adaptarla en valor numerico
	var perpetualGrwoth = verPorcentaje(perpetualGrwoth)
	var expectedReturn = verPorcentaje(expectedReturn)
	// Trabajar adentro del valor del bono
	tresuryYieldValue.then(value => {
		// Calcular WACC
		// Tomar Valor bono a 10 años
		riskFreeRate = verPorcentaje(value)
		// Poner info en elementos
		if(tomarValorLocalStorage(ticker + ': riskFreeRate') == 'undefined') {
			riskFreeRateElement.value = porcentaje(riskFreeRate)
		} else {
			riskFreeRateElement.value = porcentaje(tomarValorLocalStorage(ticker + ': riskFreeRate'))
		}
		beta = data['Technicals']['Beta']
		// Calcular WACC
		marketCap = data['Highlights']['MarketCapitalization']
		balanceSheetsQuarterly = data['Financials']['Balance_Sheet']['quarterly'];
		nombreDeObjetos = Object.keys(balanceSheetsQuarterly);
		shortLongTermDebtTotalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['shortLongTermDebtTotal'];
		intrestExpensesTTM = calcularTTM(data,'Income_Statement', 'interestExpense');
		taxProvisionTTM = calcularTTM(data,'Income_Statement', 'taxProvision');
		pretaxIncomeTTM = calcularTTM(data,'Income_Statement', 'incomeBeforeTax');

		wacc = WACC(marketCap,shortLongTermDebtTotalMRQ,riskFreeRate,beta,expectedReturn,intrestExpensesTTM,taxProvisionTTM,pretaxIncomeTTM)
		requieredReturnElement.textContent = porcentaje(wacc)
		if(tomarValorLocalStorage(ticker + ': requieredReturn') == 'undefined') {
			inputRiquiredRateOfReturn.value = porcentaje(wacc)
		} else {
			inputRiquiredRateOfReturn.value = tomarValorLocalStorage(ticker + ': requieredReturn')
		}
		requieredReturn = verPorcentaje(inputRiquiredRateOfReturn.value)
		console.log(requieredReturn)

		// Hacer Proyeccion Total Revenue-----------------------------------------------------------------------------------
		//Tomar Ultimos 5 anos total Revenue
		incomeStatement = data['Financials']['Income_Statement']['yearly']
		arrayTotalRevenue = []
		arrayFechasBien = []
		for(i=1;i<=añosAtras;i++) {
			// Tomar Elmentos
			date = takeYear(incomeStatement[Object.keys(incomeStatement)[añosAtras-i]]['date'])
			totalRevenue = incomeStatement[Object.keys(incomeStatement)[añosAtras-i]]['totalRevenue']
			// Agregar Elementos
			arrayFechasBien.push(date)
			arrayTotalRevenue.push(totalRevenue)
		}
		// Hacer Proyeccion
		// Calcular Crecimiento Pasado
		previousCAGR = (arrayTotalRevenue[añosAtras-1] / arrayTotalRevenue[0])**(1/añosAtras) - 1
		//Poner Crecimiento Pasado 
		//Poner como info
		previous5YearsCAGRTitle = document.getElementById('previous5YearsCAGRTitle')
		previous5YearsCAGRTitle.innerText = 'Previous ' + añosAtras + ' years CAGR'
		previous5YearsCAGRDoc = document.getElementById('previous5YearsCAGR')
		previous5YearsCAGRDoc.innerText = porcentaje(previousCAGR)
		// Poner en input
		estimatedNext5YearsCAGRTitle = document.getElementById('estimatedNext5YearsCAGRTitle')
		estimatedNext5YearsCAGRTitle.innerText = 'Next ' + añosAproyectar + ' years CAGR'
		totalRevenueGrwothInput = document.getElementById('totalRevenueGrwothInput')	
		// Ver si ya se cambio el estimado, si el estimado es diferente que el CAGR propuesto entonces poner el que se cambio
		if(tomarValorLocalStorage(ticker + ': totalRevenueGrwoth') == 'undefined') {
			totalRevenueGrwothInput.value = porcentaje(previousCAGR)
		} else {
			totalRevenueGrwothInput.value = porcentaje(tomarValorLocalStorage(ticker + ': totalRevenueGrwoth'))
		}
		// Hacer proximos 5 anostotal Revenue Y agregar a array
		totalRevenueGrwothInput = verPorcentaje(totalRevenueGrwothInput.value)
		lastDate = arrayFechasBien[añosAtras-1]
		for(i=1;i<=añosAproyectar;i++) {
			totalRevenue = totalRevenue * (1+totalRevenueGrwothInput)
			lastDate = lastDate + 1
			arrayTotalRevenue.push(totalRevenue)
			arrayFechasBien.push(lastDate)
		}
		// Crear Grafica
		graficaTotalRevenue = hacerGraficaBarrasProyeccion('graficaTotalrevenue','Total Revenue',5,arrayFechasBien,arrayTotalRevenue,'rgb(255, 109, 1)')
		// Rellenar Tabla
		for(i=0;i<arrayFechasBien.length;i++) {
			crearYAgregarElemento(trFechasTotalRevenue,'th',arrayFechasBien[i])
			crearYAgregarElemento(trTotalRevenue,'td',millonesBillonesTrillones(arrayTotalRevenue[i]))
		}

		// Hacer Proyeccion Oparating Cash Flow----------------------------------------------------------------------------------------
		//Tomar Ultimos 5 anos Oparating Cash Flow
		cashFlowStatment = data['Financials']['Cash_Flow']['yearly']
		arrayOCF = []
		arrayOCFMargin = []
		for(i=1;i<=añosAtras;i++) {
			// Tomar Elmentos
			ocf = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['totalCashFromOperatingActivities']
			ocfMargin = ocf / incomeStatement[Object.keys(incomeStatement)[añosAtras-i]]['totalRevenue']
			// Agregar Elementos
			arrayOCF.push(ocf)
			arrayOCFMargin.push(ocfMargin)
		}
		// Hacer Proyeccion
		// Calcular Promedio margen Pasado
		avrageOCFMargin = calculateAverage(arrayOCFMargin)
		//Poner OCF Margen promedio 
		//Poner como info
		avrage5YearsMarginTitle = document.getElementById('avrage5YearsMarginTitle')
		avrage5YearsMarginTitle.innerText = 'Previous ' + añosAtras + ' years margin'
		avrage5YearsMarginDoc = document.getElementById('avrage5YearsMargin')
		avrage5YearsMarginDoc.innerText = porcentaje(avrageOCFMargin)
		// Poner en input
		estimatedNext5YearsMarginTitle = document.getElementById('estimatedNext5YearsMarginTitle')
		estimatedNext5YearsMarginTitle.innerText = 'Next ' + añosAproyectar + ' years margin'
		nextOCFMarginInput = document.getElementById('nextOCFMarginInput')
		// Ver si ya se cambio el estimado, si el estimado es diferente que el MArgen propuesto entonces poner el que se cambio
		if(tomarValorLocalStorage(ticker + ': estimatedOCFMargin') == 'undefined') {
			nextOCFMarginInput.value = porcentaje(avrageOCFMargin)
		} else {
			nextOCFMarginInput.value = porcentaje(tomarValorLocalStorage(ticker + ': estimatedOCFMargin'))
		}
		// Hacer proximos 5 anostotal Revenue Y agregar a array
		nextOCFMarginInput = verPorcentaje(nextOCFMarginInput.value)
		for(i=0;i<añosAproyectar;i++) {
			arrayOCF.push(arrayTotalRevenue[añosAtras + i] * nextOCFMarginInput)
		}
		// Crear Grafica
		graficaOCF = hacerGraficaBarrasProyeccion('graficaOCF','Oparating Cash Flow',5,arrayFechasBien,arrayOCF,'rgb(52,168,83)')
		// Rellenar Tabla
		for(i=0;i<arrayFechasBien.length;i++) {
			crearYAgregarElemento(trFechasOCF,'th',arrayFechasBien[i])
			crearYAgregarElemento(trOCF,'td',millonesBillonesTrillones(arrayOCF[i]))
		}

		// Hacer Proyeccion CAPEX------------------------------------------------------------------------------------------------------
		//Tomar Ultimos 5 anos CAPEX
		cashFlowStatment = data['Financials']['Cash_Flow']['yearly']
		arrayCAPEX = []
		arrayCAPEXMargin = []
		for(i=1;i<=añosAtras;i++) {
			// Tomar Elmentos
			CAPEX = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['capitalExpenditures']
			CAPEXMargin = CAPEX / cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['totalCashFromOperatingActivities']
			// Agregar Elementos
			arrayCAPEX.push(CAPEX)
			arrayCAPEXMargin.push(CAPEXMargin)
		}
		// Hacer Proyeccion
		// Calcular Promedio margen Pasado
		avrageCPEXMargin = calculateAverage(arrayCAPEXMargin)
		//Poner OCF Margen promedio 
		//Poner como info
		avrage5YearsCAPEXMarginTitle = document.getElementById('avrage5YearsCAPEXMarginTitle')
		avrage5YearsCAPEXMarginTitle.innerText = 'Average ' + añosAtras + ' years CAPEX Cost'
		avrage5YearsCAPEXMarginDOC = document.getElementById('avrage5YearsCAPEXMargin')
		avrage5YearsCAPEXMarginDOC.innerText = porcentaje(avrageCPEXMargin)
		// Poner en input
		estimatedNext5YearsCAPEXMarginTitle = document.getElementById('estimatedNext5YearsCAPEXMarginTitle')
		estimatedNext5YearsCAPEXMarginTitle.innerText = 'Next ' + añosAproyectar + ' years CAPEX Cost'
		nextCAPEXMarginInput = document.getElementById('nextCAPEXMarginInput')
		// Ver si ya se cambio el estimado, si el estimado es diferente que el MArgen propuesto entonces poner el que se cambio
		if(tomarValorLocalStorage(ticker + ': estimatedCAPEXCost') == 'undefined') {
			nextCAPEXMarginInput.value = porcentaje(avrageCPEXMargin)
		} else {
			nextCAPEXMarginInput.value = porcentaje(tomarValorLocalStorage(ticker + ': estimatedCAPEXCost'))
		}
		// Hacer proximos 5 anos CAPEX Y agregar a array
		nextCAPEXMarginInput = verPorcentaje(nextCAPEXMarginInput.value)
		for(i=0;i<añosAproyectar;i++) {
			arrayCAPEX.push(arrayOCF[añosAtras + i] * nextCAPEXMarginInput)
		}
		// Crear Grafica
		graficaCAPEX = hacerGraficaBarrasProyeccion('graficaCAPEX','Capital Expenditures',5,arrayFechasBien,arrayCAPEX,'rgb(180,95,6)')
		// Rellenar Tabla
		for(i=0;i<arrayFechasBien.length;i++) {
			crearYAgregarElemento(trFechasCAPEX,'th',arrayFechasBien[i])
			crearYAgregarElemento(trCAPEX,'td',millonesBillonesTrillones(arrayCAPEX[i]))
		}

		// Calcular Free Cash Flow-----------------------------------------------------------------------------------------------------
		//Tomar Ultimos 5 anos FCF
		cashFlowStatment = data['Financials']['Cash_Flow']['yearly']
		arrayFCF = []
		arrayFCFDiscounted = []
		arrayDiscountRate = []
		for(i=1;i<=añosAtras;i++) { 
			// Tomar Elmento
			fCF = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['freeCashFlow']
			// Poner en array
			arrayFCF.push(fCF)
			arrayFCFDiscounted.push(NaN)
			arrayDiscountRate.push('')
		}
		// Hacer proximos 5 anos FCF Y agregar a tabla
		for(i=0;i<añosAproyectar;i++) {
			projectedFcf = arrayOCF[añosAtras + i] - arrayCAPEX[añosAtras + i]
			discountRate = (1+requieredReturn)**(i+1)
			discountedFCF = projectedFcf/discountRate
			arrayFCF.push(projectedFcf)
			arrayDiscountRate.push(discountRate)
			arrayFCFDiscounted.push(discountedFCF)
		}
		// Agregar A tabla
		for(i=0;i<arrayFechasBien.length;i++) {
			// Agregar elementos
			crearYAgregarElemento(trFechas,'th',arrayFechasBien[i])
			crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(arrayFCF[i]))
			crearYAgregarElemento(trDiscountRate,'td',arondir(arrayDiscountRate[i]))
			if(isNaN(arrayFCFDiscounted[i])) {
				crearYAgregarElemento(trNetPresentValue,'td','')
			} else {
				crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(arrayFCFDiscounted[i]))
			}
		}
		// Crear terminal value----
		terminalValue = (arrayFCF[arrayFCF.length-1]*(1+perpetualGrwoth))/(requieredReturn - perpetualGrwoth)
		terminalDiscountRate = (1+requieredReturn)**(i+1)
		npvTerminalValue = terminalValue/terminalDiscountRate
		// Valor de la empresa
		sharesOutstanding = data['SharesStats']['SharesOutstanding']
		npv = (sumArray(arrayFCFDiscounted) + npvTerminalValue) /  sharesOutstanding

		// Agregar elementos
		crearYAgregarElemento(trFechas,'th','Terminal Value')
		crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(terminalValue))
		crearYAgregarElemento(trDiscountRate,'td',arondir(terminalDiscountRate))
		crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(npvTerminalValue))

		// Crear Grafica
		graficaPrincipal = hacerGraficaBarras('graficaPrincipal',añosAtras,arrayFechasBien,arrayFCF,arrayFCFDiscounted,['rgb(96, 196, 173)','#df6948'])

		// Poner resultados con precio actual 
		precioInfoRefresh(
			'https://eodhistoricaldata.com/api/real-time/'+ ticker +'?api_token='+ apiToken+'&fmt=json',npv
		);
		
		// Guardar valor intrinsico en localStorage
		guardarValorLocalStorage(ticker + ': DCF intrinsic value: ', npv)
	})



	// Ejecutar cada vez que se cambia un input----------------------------------------
	inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('change', () => {
			// Push ultimo año de data reporatada
			// Tomar Elementos
			constenedorMensajeError = document.getElementById('marcarError')
			mensajeError = document.getElementById('errorMessage')
			riskFreeRate = document.getElementById('riskFreeRate').value
			expectedReturn = document.getElementById('expectedReturn').value
			añosAproyectar =  document.getElementById('añosProyectar').value
			perpetualGrwoth = document.getElementById('perpetualGrwothRate').value
			requieredReturnElement  = document.getElementById('requieredReturnElement')
			inputRiquiredRateOfReturn = document.getElementById('inputRiquiredRateOfReturn')
			quitarMensajeError([perpetualGrwoth,riskFreeRate,expectedReturn])
			// Ver si la info esta en porcentaje y adaptarla en valor numerico
			perpetualGrwoth = verPorcentaje(perpetualGrwoth)
			riskFreeRate = verPorcentaje(riskFreeRate)
			expectedReturn = verPorcentaje(expectedReturn)
			requieredReturn = verPorcentaje(inputRiquiredRateOfReturn.value)
			// Calcular WACC
			wacc = WACC(marketCap,shortLongTermDebtTotalMRQ,riskFreeRate,beta,expectedReturn,intrestExpensesTTM,taxProvisionTTM,pretaxIncomeTTM)
			requieredReturnElement.textContent = porcentaje(wacc)
			// Guardar valores en local storage
			guardarValorLocalStorage(ticker + ': añosAproyectar',añosAproyectar)
			guardarValorLocalStorage(ticker + ': perpetualGrwoth',perpetualGrwoth)
			guardarValorLocalStorage(ticker + ': riskFreeRate',riskFreeRate)
			guardarValorLocalStorage(ticker + ': expectedReturn',expectedReturn)
			guardarValorLocalStorage(ticker + ': requieredReturn',porcentaje(requieredReturn))

			// Total Revenue Proyeccion-----------------------------
			// Tomar Nuevo Valor Grwoth
			totalRevenueGrwothInput = document.getElementById('totalRevenueGrwothInput')
			totalRevenueGrwothInput = verPorcentaje(totalRevenueGrwothInput.value)
			// Guardar el valor si se cambia en local storage
			guardarValorLocalStorage(ticker+': totalRevenueGrwoth',totalRevenueGrwothInput)
			// Poner en input titulo
			estimatedNext5YearsCAGRTitle = document.getElementById('estimatedNext5YearsCAGRTitle')
			estimatedNext5YearsCAGRTitle.innerText = 'Next ' + añosAproyectar + ' years CAGR'
			// Quitar Elementos de la tabla
			removeAllChildNodes(trFechasTotalRevenue)
			removeAllChildNodes(trTotalRevenue)
			// Volver a crear arrays
			// Array Valores que ya existen
			arrayTotalRevenue = []
			arrayFechasBien = []
			for(i=1;i<=añosAtras;i++) {
				date = takeYear(incomeStatement[Object.keys(incomeStatement)[añosAtras-i]]['date'])
				totalRevenue = incomeStatement[Object.keys(incomeStatement)[añosAtras-i]]['totalRevenue']
				arrayFechasBien.push(date)
				arrayTotalRevenue.push(totalRevenue)
			}
			// Array Valores a proyectar
			lastDate = arrayFechasBien[añosAtras-1]
			for(i=1;i<=añosAproyectar;i++) {
				totalRevenue = totalRevenue * (1+totalRevenueGrwothInput)
				lastDate = lastDate + 1
				arrayTotalRevenue.push(totalRevenue)
				arrayFechasBien.push(lastDate)
			}
			// Cambiar Valores Grafica
			graficaTotalRevenue.config.data.labels = arrayFechasBien
			graficaTotalRevenue.config.data.datasets[0].data = arrayTotalRevenue
			graficaTotalRevenue.update()
			// Rellenar Tabla
			for(i=0;i<arrayFechasBien.length;i++) {
				crearYAgregarElemento(trFechasTotalRevenue,'th',arrayFechasBien[i])
				crearYAgregarElemento(trTotalRevenue,'td',millonesBillonesTrillones(arrayTotalRevenue[i]))
			}
			// OCF Poyeccion------------------------------------
			// Poner en input titulo
			estimatedNext5YearsMarginTitle = document.getElementById('estimatedNext5YearsMarginTitle')
			estimatedNext5YearsMarginTitle.innerText = 'Next ' + añosAproyectar + ' years CAGR'
			// Tomar Nuevo Valor Margen
			nextOCFMarginInput = document.getElementById('nextOCFMarginInput')
			nextOCFMarginInput = verPorcentaje(nextOCFMarginInput.value)
			// Guardar el valor del margen si se cambia
			guardarValorLocalStorage(ticker + ': estimatedOCFMargin',nextOCFMarginInput)
			// Quitar Elementos de la tabla
			removeAllChildNodes(trFechasOCF)
			removeAllChildNodes(trOCF)
			// Volver a hacer array
			// Array Valores que ya existen
			arrayOCF = []
			for(i=1;i<=añosAtras;i++) {
				ocf = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['totalCashFromOperatingActivities']
				// Agregar Elementos
				arrayOCF.push(ocf)
			}
			// Array Valores a proyectar
			for(i=0;i<añosAproyectar;i++) {
				arrayOCF.push(arrayTotalRevenue[añosAtras + i] * nextOCFMarginInput)
			}
			// Cambiar Valores Grafica
			graficaOCF.config.data.labels = arrayFechasBien
			graficaOCF.config.data.datasets[0].data = arrayOCF
			graficaOCF.update()
			// Rellenar Tabla
			for(i=0;i<arrayFechasBien.length;i++) {
				crearYAgregarElemento(trFechasOCF,'th',arrayFechasBien[i])
				crearYAgregarElemento(trOCF,'td',millonesBillonesTrillones(arrayOCF[i]))
			}

			// CAPEX Poyeccion------------------------------------
			// Poner en input titulo
			estimatedNext5YearsCAPEXMarginTitle = document.getElementById('estimatedNext5YearsMarginTitle')
			estimatedNext5YearsCAPEXMarginTitle.innerText = 'Next ' + añosAproyectar + ' years CAGR'
			// Tomar Nuevo Valor Margen
			nextCAPEXMarginInput = document.getElementById('nextCAPEXMarginInput')
			nextCAPEXMarginInput = verPorcentaje(nextCAPEXMarginInput.value)
			// Guardar valor de costo si se guarda
			guardarValorLocalStorage(ticker + ': estimatedCAPEXCost',nextCAPEXMarginInput)
			// Quitar Elementos de la tabla
			removeAllChildNodes(trFechasCAPEX)
			removeAllChildNodes(trCAPEX)
			// Volver a hacer array
			// Array Valores que ya existen
			arrayCAPEX = []
			for(i=1;i<=añosAtras;i++) {
				// Tomar Elmentos
				CAPEX = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['capitalExpenditures']
				// Agregar Elementos
				arrayCAPEX.push(CAPEX)
			}
			// Array Valores a proyectar
			for(i=0;i<añosAproyectar;i++) {
				arrayCAPEX.push(arrayOCF[añosAtras + i] * nextCAPEXMarginInput)
			}
			// Cambiar Valores Grafica
			graficaCAPEX.config.data.labels = arrayFechasBien
			graficaCAPEX.config.data.datasets[0].data = arrayCAPEX
			graficaCAPEX.update()
			// Rellenar Tabla
			for(i=0;i<arrayFechasBien.length;i++) {
				crearYAgregarElemento(trFechasCAPEX,'th',arrayFechasBien[i])
				crearYAgregarElemento(trCAPEX,'td',millonesBillonesTrillones(arrayCAPEX[i]))
			}

			// Free cCash Flow Projection
			// Quitar Elementos array
			removeAllChildNodes(trFechas)
			removeAllChildNodes(trFreeCashFlow)
			removeAllChildNodes(trDiscountRate)
			removeAllChildNodes(trNetPresentValue)
			estimatedNext5YearsCAPEXMarginTitle = document.getElementById('estimatedNext5YearsCAPEXMarginTitle')
			estimatedNext5YearsCAPEXMarginTitle.innerText = 'Next ' + añosAproyectar + ' years CAPEX Cost'
			//Tomar Ultimos 5 anos FCF
			cashFlowStatment = data['Financials']['Cash_Flow']['yearly']
			arrayFCF = []
			arrayFCFDiscounted = []
			arrayDiscountRate = []
			for(i=1;i<=añosAtras;i++) { 
				// Tomar Elmento
				fCF = cashFlowStatment[Object.keys(incomeStatement)[añosAtras-i]]['freeCashFlow']
				// Poner en array
				arrayFCF.push(fCF)
				arrayFCFDiscounted.push(NaN)
				arrayDiscountRate.push('')
			}
			// Hacer proximos 5 anos FCF Y agregar a tabla
			for(i=0;i<añosAproyectar;i++) {
				projectedFcf = arrayOCF[añosAtras + i] - arrayCAPEX[añosAtras + i]
				discountRate = (1+requieredReturn)**(i+1)
				discountedFCF = projectedFcf/discountRate
				arrayFCF.push(projectedFcf)
				arrayDiscountRate.push(discountRate)
				arrayFCFDiscounted.push(discountedFCF)
			}
			// Agregar A tabla
			for(i=0;i<arrayFechasBien.length;i++) {
				// Agregar elementos
				crearYAgregarElemento(trFechas,'th',arrayFechasBien[i])
				crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(arrayFCF[i]))
				crearYAgregarElemento(trDiscountRate,'td',arondir(arrayDiscountRate[i]))
				if(isNaN(arrayFCFDiscounted[i])) {
					crearYAgregarElemento(trNetPresentValue,'td','')
				} else {
					crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(arrayFCFDiscounted[i]))
				}
			}
			// Crear terminal value----
			terminalValue = (arrayFCF[arrayFCF.length-1]*(1+perpetualGrwoth))/(requieredReturn - perpetualGrwoth)
			terminalDiscountRate = (1+requieredReturn)**(i+1)
			npvTerminalValue = terminalValue/terminalDiscountRate
			// Valor de la empresa
			sharesOutstanding = data['SharesStats']['SharesOutstanding']
			npv = (sumArray(arrayFCFDiscounted) + npvTerminalValue) /  sharesOutstanding

			// Agregar elementos
			crearYAgregarElemento(trFechas,'th','Terminal Value')
			crearYAgregarElemento(trFreeCashFlow,'td',millonesBillonesTrillones(terminalValue))
			crearYAgregarElemento(trDiscountRate,'td',arondir(terminalDiscountRate))
			crearYAgregarElemento(trNetPresentValue,'td',millonesBillonesTrillones(npvTerminalValue))

			// Cambiar Valores Grafica
			graficaPrincipal.config.data.labels = arrayFechasBien
			graficaPrincipal.config.data.datasets[0].data = arrayFCF
			graficaPrincipal.config.data.datasets[1].data = arrayFCFDiscounted
			graficaPrincipal.update()

			precioInfoRefresh(
				'https://eodhistoricaldata.com/api/real-time/'+ ticker +'?api_token='+ apiToken+'&fmt=json',npv
			);

			// Guardar valor intrinsico en localStorage
			guardarValorLocalStorage(ticker + ': DCF intrinsic value: ', npv)

			// Mover tablas moviles a la info mas a la izquierda posible-----------------------------------------------------------
			var elementos = document.querySelectorAll('.contenedorTablaMovil');

			// Iterar sobre los elementos seleccionados
			elementos.forEach(function(contenedorTablaMovil) {
				contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
			});
		});
	});
}

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token=' + apiToken)


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
			window.location.href = "../analysis/analysis.html"
		})
		a.setAttribute('href','../analysis/analysis.html')
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
		window.location.href = "../analysis/analysis.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});

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
	if(data['data'] == undefined) {
		tresuryYieldValue = '4.32%'
		console.log('Contrata el premium')
	} else {
		tresuryYieldValue = data['data'][0]['value'] + '%'
	}
	return tresuryYieldValue
}

// Function para tomar el ano de una fecha
function takeYear(date) {
	year = date.split('-')[0]
	return parseInt(year)
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

// Borrar contenido de la tabla
function removeAllChildNodes(parent) {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
}

// Hacer que cada tabla empize del lado derecho
function ejecutarDespuesDeCargar() {
	var elementos = document.querySelectorAll('.contenedorTablaMovil');

	// Iterar sobre los elementos seleccionados
	elementos.forEach(function(contenedorTablaMovil) {
		contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
	});
}

// Esperar 1 segundos después de cargar la página
	document.addEventListener('DOMContentLoaded', function () {
	setTimeout(ejecutarDespuesDeCargar, 1000); // 1000 milisegundos = 1 segundos
});
  

// Function hacer grafica barras 
function hacerGraficaBarras(idContexto,cuantosAnosAtras,labels,data1,data2,color) {
	//Hacer Array De colores para los valores reales en color fuerte, y las proyecciones claras
	arrayColoresBarras = []
	// Primeros Valores reales
	for(i=1;i<=cuantosAnosAtras;i++) {
		arrayColoresBarras.push(color[0])
	}
	// Valores Proyectados
	r = color[0].split('rgb(')[1].split(')')[0].split(',')[0]
	g = color[0].split('rgb(')[1].split(')')[0].split(',')[1]
	b = color[0].split('rgb(')[1].split(')')[0].split(',')[2]
	a = 0.8
	nuevoColor = 'rgba(' + r +','+ + g  +','+ b +','+ a + ')'
	for(i=1;i<=30;i++) {
		arrayColoresBarras.push(nuevoColor)
	}

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
					borderColor: arrayColoresBarras,
					backgroundColor: arrayColoresBarras,
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

// Finction para convertir en numero y en caso de null devolver 0
function numero(valor) {
	if (isNaN(parseFloat(valor))) {
		resultado = 0;
	} else {
		resultado = parseFloat(valor);
	}
	return resultado;
}

// Function hacer Grafica Barra Proyecciones
function hacerGraficaBarrasProyeccion(idContexto,nombreData,cuantosAnosAtras,labels,data,color) {
	//Hacer Array De colores para los valores reales en color fuerte, y las proyecciones claras
	arrayColores = []
	// Primeros Valores reales
	for(i=1;i<=cuantosAnosAtras;i++) {
		arrayColores.push(color)
	}
	// Valores Proyectados
	r = color.split('rgb(')[1].split(')')[0].split(',')[0]
	g = color.split('rgb(')[1].split(')')[0].split(',')[1]
	b = color.split('rgb(')[1].split(')')[0].split(',')[2]
	a = 0.8
	nuevoColor = 'rgba(' + r +','+ + g  +','+ b +','+ a + ')'
	for(i=1;i<=30;i++) {
		arrayColores.push(nuevoColor)
	}

	ctx = document.getElementById(idContexto).getContext('2d');

	// Craecion de grafica
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					label: nombreData,
					borderColor: arrayColores,
					backgroundColor: arrayColores,
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
					text: nombreData,
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
	return arr.reduce(function (acc, currentValue) {
	  // Check if the current value is a number (not NaN)
	  if (!isNaN(currentValue)) {
		// Add the current value to the accumulator
		return acc + currentValue;
	  } else {
		// If the current value is NaN, just return the accumulator unchanged
		return acc;
	  }
	}, 0);
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


// Function hacer promediol de array
function calculateAverage(array) {
    if (array.length === 0) {
        return 0; // Handle the case when the array is empty to avoid division by zero
    }

    var sum = array.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
    }, 0);

    var average = sum / array.length;
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


// Hacer que el menu de financials, news, etc... empieze desde la izquierda
function moverMenu() {
	var contenedorTablaMovil = document.querySelector('.paginas');
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Esperar 1 segundos después de cargar la página
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(moverMenu, 1000); // 1000 milisegundos = 1 segundos
});

