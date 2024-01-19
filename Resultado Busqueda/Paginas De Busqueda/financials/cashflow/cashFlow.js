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
    // Tomar elementos-----
    // Fecha para range
    fechasFinancial =  Object.keys(data['Financials']['Cash_Flow']['yearly'])
    // Hacer Tabla------------
    // Tomar elementos
    trFechas = document.getElementById('trFechas')
    trOparatingCahsFlow = document.getElementById('trOparatingCahsFlow')
    trNetIncome = document.getElementById('trNetIncome')
    trDepreciationAmortization = document.getElementById('trDepreciationAmortization')
    trDeferredTax = document.getElementById('trDeferredTax')
    trStockBasedCompensation = document.getElementById('trStockBasedCompensation')
    trOtherNonCashItems = document.getElementById('trOtherNonCashItems')
    trChangeInWorkingCapital = document.getElementById('trChangeInWorkingCapital')
    trChangeReceivables = document.getElementById('trChangeReceivables')
    trChangeInventory = document.getElementById('trChangeInventory')
    trChangePayables = document.getElementById('trChangePayables')
    trChangeOtherCurrentAssets = document.getElementById('trChangeOtherCurrentAssets')
    trChangeOtherWorkingCapital = document.getElementById('trChangeOtherWorkingCapital')
    trInvestingCashFlow = document.getElementById('trInvestingCashFlow')
    trCapitalExpenditures = document.getElementById('trCapitalExpenditures')
    trInvestments = document.getElementById('trInvestments')
    trOtherInvestingActivites = document.getElementById('trOtherInvestingActivites')
    trFinancingCashFlow = document.getElementById('trFinancingCashFlow')
    trIssuencePaymentsOfDebt = document.getElementById('trIssuencePaymentsOfDebt')
    trSalePurchaseOfStock = document.getElementById('trSalePurchaseOfStock')
    trDividendPaid = document.getElementById('trDividendPaid')
    trOtherFinancingActivities = document.getElementById('trOtherFinancingActivities')
    trEndCashPosition = document.getElementById('trEndCashPosition')
    trBiginningCashPosition = document.getElementById('trBiginningCashPosition')
    trChangeInCash = document.getElementById('trChangeInCash')
    trFreeCashFlow = document.getElementById('trFreeCashFlow')
    // Obtener arrays de Income Statment yearly 5 años si es posible
    añoInicial = tomar5añosSiEsPosible(fechasFinancial)
    fechaCashFlow = []
    financials = data['Financials']['Cash_Flow']['yearly']
    oparatingCashFlowArray = []
    investingCashFlowArray = []
    financingCashFlowArray = []
    dividendPaidArray = []
    freeCashFlowArray = []

    // Agregar data a tabla
    // Tomar displays de tabla
    unitDisplay = document.getElementsByClassName('botonActivo')[0].textContent
    decimalDisplay = document.getElementById('puntosDecimales').textContent
    // Loop para tabla
    for(i=0;i<añoInicial;i++) {
        // Tomar elementos------------------------
        cashFlowStatementArray = data['Financials']['Cash_Flow']['yearly'][fechasFinancial[añoInicial-1-i]]
        fechas = fechasFinancial[añoInicial-1-i].split('-')[0]
        totalCashFromOperatingActivities = cashFlowStatementArray['totalCashFromOperatingActivities']
        netIncome = cashFlowStatementArray['netIncome']
        depreciation = cashFlowStatementArray['depreciation']
        deferredTax = cashFlowStatementArray['deferredTax']
        stockBasedCompensation = cashFlowStatementArray['stockBasedCompensation']
        otherNonCashItems = cashFlowStatementArray['otherNonCashItems']
        changeInWorkingCapital = cashFlowStatementArray['changeInWorkingCapital']
        changeReceivables = cashFlowStatementArray['changeReceivables']
        changeToInventory = cashFlowStatementArray['changeToInventory']
        changeToPayables = cashFlowStatementArray['changeToPayables']
        changeToOtherCurrentAssets = cashFlowStatementArray['changeToOtherCurrentAssets']
        changeToOtherWorkingCapital = cashFlowStatementArray['changeToOtherWorkingCapital']
        totalCashflowsFromInvestingActivities = cashFlowStatementArray['totalCashflowsFromInvestingActivities']
        capitalExpenditures = cashFlowStatementArray['capitalExpenditures']
        investments = cashFlowStatementArray['investments']
        otherCashflowsFromInvestingActivities = cashFlowStatementArray['otherCashflowsFromInvestingActivities']
        totalCashFromFinancingActivities = cashFlowStatementArray['totalCashFromFinancingActivities']
        issuancePaymentsOfDebt = cashFlowStatementArray['issuancePaymentsOfDebt']
        salePurchaseOfStock = cashFlowStatementArray['salePurchaseOfStock']
        dividendsPaid = cashFlowStatementArray['dividendsPaid']
        otherCashflowsFromFinancingActivities = cashFlowStatementArray['otherCashflowsFromFinancingActivities']
        endPeriodCashFlow = cashFlowStatementArray['endPeriodCashFlow']
        beginPeriodCashFlow = cashFlowStatementArray['beginPeriodCashFlow']
        changeInCash = cashFlowStatementArray['changeInCash']
        freeCashFlow = cashFlowStatementArray['freeCashFlow']
        // Push elementos en array-------------
        fechaCashFlow.push(fechas)
        oparatingCashFlowArray.push(totalCashFromOperatingActivities)
        investingCashFlowArray.push(totalCashflowsFromInvestingActivities)
        financingCashFlowArray.push(totalCashFromFinancingActivities)
        dividendPaidArray.push(dividendsPaid)
        freeCashFlowArray.push(freeCashFlow)

        // Agregar elementos a tabla------------------------
        crearYAgregarElemento(trFechas,'th',fechas)
        crearYAgregarElemento(trOparatingCahsFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashFromOperatingActivities))
        crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncome))
        crearYAgregarElemento(trDepreciationAmortization,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,depreciation))
        crearYAgregarElemento(trDeferredTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,deferredTax))
        crearYAgregarElemento(trStockBasedCompensation,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,stockBasedCompensation))
        crearYAgregarElemento(trOtherNonCashItems,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherNonCashItems))
        crearYAgregarElemento(trChangeInWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInWorkingCapital))
        crearYAgregarElemento(trChangeReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeReceivables))
        crearYAgregarElemento(trChangeInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToInventory))
        crearYAgregarElemento(trChangePayables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToPayables))
        crearYAgregarElemento(trChangeOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToOtherCurrentAssets))
        crearYAgregarElemento(trChangeOtherWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToOtherWorkingCapital))
        crearYAgregarElemento(trInvestingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashflowsFromInvestingActivities))
        crearYAgregarElemento(trCapitalExpenditures,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalExpenditures))
        crearYAgregarElemento(trInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investments))
        crearYAgregarElemento(trOtherInvestingActivites,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCashflowsFromInvestingActivities))
        crearYAgregarElemento(trFinancingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashFromFinancingActivities))
        crearYAgregarElemento(trIssuencePaymentsOfDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,issuancePaymentsOfDebt))
        crearYAgregarElemento(trSalePurchaseOfStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,salePurchaseOfStock))
        crearYAgregarElemento(trDividendPaid,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,dividendsPaid))
        crearYAgregarElemento(trOtherFinancingActivities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCashflowsFromFinancingActivities))
        crearYAgregarElemento(trEndCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,endPeriodCashFlow))
        crearYAgregarElemento(trBiginningCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,beginPeriodCashFlow))
        crearYAgregarElemento(trChangeInCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInCash))
        crearYAgregarElemento(trFreeCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,freeCashFlow))
    }
    // Crear TTM
    oparatingCahsFlowTTM = calcularTTM(data,'Cash_Flow','totalCashFromOperatingActivities')
    netIncomeTTM = calcularTTM(data,'Cash_Flow','netIncome')
    depreciationAmortizationTTM = calcularTTM(data,'Cash_Flow','depreciation')
    deferredTaxTTM = calcularTTM(data,'Cash_Flow','deferredTax')
    stockBasedCompensationTTM = calcularTTM(data,'Cash_Flow','stockBasedCompensation')
    otherNonCashItemsTTM = calcularTTM(data,'Cash_Flow','otherNonCashItems')
    changeInWorkingCapitalTTM = calcularTTM(data,'Cash_Flow','changeInWorkingCapital')
    changeReceivablesTTM = calcularTTM(data,'Cash_Flow','changeReceivables')
    changeInventoryTTM = calcularTTM(data,'Cash_Flow','changeToInventory')
    changePayablesTTM = calcularTTM(data,'Cash_Flow','changeToPayables')
    changeOtherCurrentAssetsTTM = calcularTTM(data,'Cash_Flow','changeToOtherCurrentAssets')
    changeOtherWorkingCapitalTTM = calcularTTM(data,'Cash_Flow','changeToOtherWorkingCapital')
    investingCashFlowTTM = calcularTTM(data,'Cash_Flow','totalCashflowsFromInvestingActivities')
    capitalExpendituresTTM = calcularTTM(data,'Cash_Flow','capitalExpenditures')
    investmentsTTM = calcularTTM(data,'Cash_Flow','investments')
    otherInvestingActivitesTTM = calcularTTM(data,'Cash_Flow','otherCashflowsFromInvestingActivities')
    financingCashFlowTTM = calcularTTM(data,'Cash_Flow','totalCashFromFinancingActivities')
    issuencePaymentsOfDebtTTM = calcularTTM(data,'Cash_Flow','issuancePaymentsOfDebt')
    salePurchaseOfStockTTM = calcularTTM(data,'Cash_Flow','salePurchaseOfStock')
    dividendPaidTTM = calcularTTM(data,'Cash_Flow','dividendsPaid')
    otherFinancingActivitiesTTM = calcularTTM(data,'Cash_Flow','otherCashflowsFromFinancingActivities')
    endCashPositionTTM = calcularTTM(data,'Cash_Flow','endPeriodCashFlow')
    biginningCashPositionTTM = calcularTTM(data,'Cash_Flow','beginPeriodCashFlow')
    changeInCashTTM = calcularTTM(data,'Cash_Flow','changeInCash')
    freeCashFlowTTM = calcularTTM(data,'Cash_Flow','freeCashFlow')
    // Agregar TTM a tabla
    crearYAgregarElemento(trFechas,'th','TTM')
    crearYAgregarElemento(trOparatingCahsFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,oparatingCahsFlowTTM))
    crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncomeTTM))
    crearYAgregarElemento(trDepreciationAmortization,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,depreciationAmortizationTTM))
    crearYAgregarElemento(trDeferredTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,deferredTaxTTM))
    crearYAgregarElemento(trStockBasedCompensation,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,stockBasedCompensationTTM))
    crearYAgregarElemento(trOtherNonCashItems,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherNonCashItemsTTM))
    crearYAgregarElemento(trChangeInWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInWorkingCapitalTTM))
    crearYAgregarElemento(trChangeReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeReceivablesTTM))
    crearYAgregarElemento(trChangeInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInventoryTTM))
    crearYAgregarElemento(trChangePayables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changePayablesTTM))
    crearYAgregarElemento(trChangeOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeOtherCurrentAssetsTTM))
    crearYAgregarElemento(trChangeOtherWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeOtherWorkingCapitalTTM))
    crearYAgregarElemento(trInvestingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investingCashFlowTTM))
    crearYAgregarElemento(trCapitalExpenditures,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalExpendituresTTM))
    crearYAgregarElemento(trInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investmentsTTM))
    crearYAgregarElemento(trOtherInvestingActivites,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherInvestingActivitesTTM))
    crearYAgregarElemento(trFinancingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,financingCashFlowTTM))
    crearYAgregarElemento(trIssuencePaymentsOfDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,issuencePaymentsOfDebtTTM))
    crearYAgregarElemento(trSalePurchaseOfStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,salePurchaseOfStockTTM))
    crearYAgregarElemento(trDividendPaid,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,dividendPaidTTM))
    crearYAgregarElemento(trOtherFinancingActivities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherFinancingActivitiesTTM))
    crearYAgregarElemento(trEndCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,endCashPositionTTM))
    crearYAgregarElemento(trBiginningCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,biginningCashPositionTTM))
    crearYAgregarElemento(trChangeInCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInCashTTM))
    crearYAgregarElemento(trFreeCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,freeCashFlowTTM))



    // Solo tomar año para fecha para range
    fechasRangeAños = []
    fechasFinancial.forEach(fecha => {
        fechasRangeAños.push(fecha.split('-')[0])
    });
    fechasRangeAños.reverse()
    // Agregar TTM a fechas
    fechasRangeAños.push('TTM')
    // Creacion range line ------------
    var mySlider = new rSlider({
        target: '#slider',
        values: fechasRangeAños, 
        range: true, 
        set:    [fechasRangeAños[fechasRangeAños.length-añoInicial-1],fechasRangeAños[fechasRangeAños.length-1]], 
        width:    750,
        scale:    true, 
        labels:   false, 
        tooltip:  true, 
        step:     null, 
        disabled: false, 
        onChange: false 
    });
    // Hacer grafica inicial
    // Agregar TTM aarray
    fechaCashFlow.push('TTM')
    oparatingCashFlowArray.push(oparatingCahsFlowTTM)
    investingCashFlowArray.push(investingCashFlowTTM)
    financingCashFlowArray.push(financingCashFlowTTM)
    dividendPaidArray.push(dividendPaidTTM)
    freeCashFlowArray.push(freeCashFlowTTM)
    graficaPrincipal = hacerGraficaFinancials('graficaPrincipal',fechaCashFlow,
                            'Oparating Cash Flow','#5b95f9',oparatingCashFlowArray,
                            'Investing Cash Flow','#34a853',investingCashFlowArray,
                            'Financing Cash Flow','#ea4335',financingCashFlowArray,
                            'Dividend Paid', '#fbbc04', dividendPaidArray,
                            'Free Cash Flow','#46bdc6',freeCashFlowArray,
                            )

    // Cambiar info cuando cambia range-----------------------------------------------
    // Function reflesh tabal
    function refreshTabla() {
        // Tomar ajustes de display
        if(document.getElementsByClassName('botonActivo')[0] == undefined) {
            unitDisplay = 'displaySinCambio'
        } else {
            unitDisplay = document.getElementsByClassName('botonActivo')[0].textContent
        }
        decimalDisplay = document.getElementById('puntosDecimales').textContent
        // Obtener Valor del range
        valores = mySlider.getValue();
        // definir principio y final
        fechaInicial = valores.split(',')[0]
        posicionFechaInicial = Object.keys(financials).length-1 - fechasRangeAños.indexOf(fechaInicial)
        fechaFinal = valores.split(',')[1]
        if(fechaFinal == 'TTM') {
            nombreFinancialsFinal = 'TTM'
            posicionFechaFinal = 0
            espacioFechas = (posicionFechaInicial - posicionFechaFinal)
        } else {
            posicionFechaFinal = Object.keys(financials).length-1 - fechasRangeAños.indexOf(fechaFinal)
            espacioFechas = (posicionFechaInicial - posicionFechaFinal) 
        }

        // Vaciar elementos de la tabla
        function removeAllChildNodes(parent) {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        }
        removeAllChildNodes(trFechas)
        removeAllChildNodes(trOparatingCahsFlow)
        removeAllChildNodes(trNetIncome)
        removeAllChildNodes(trDepreciationAmortization)
        removeAllChildNodes(trDeferredTax)
        removeAllChildNodes(trStockBasedCompensation)
        removeAllChildNodes(trOtherNonCashItems)
        removeAllChildNodes(trChangeInWorkingCapital)
        removeAllChildNodes(trChangeReceivables)
        removeAllChildNodes(trChangeInventory)
        removeAllChildNodes(trChangePayables)
        removeAllChildNodes(trChangeOtherCurrentAssets)
        removeAllChildNodes(trChangeOtherWorkingCapital)
        removeAllChildNodes(trInvestingCashFlow)
        removeAllChildNodes(trCapitalExpenditures)
        removeAllChildNodes(trInvestments)
        removeAllChildNodes(trOtherInvestingActivites)
        removeAllChildNodes(trFinancingCashFlow)
        removeAllChildNodes(trIssuencePaymentsOfDebt)
        removeAllChildNodes(trSalePurchaseOfStock)
        removeAllChildNodes(trDividendPaid)
        removeAllChildNodes(trOtherFinancingActivities)
        removeAllChildNodes(trEndCashPosition)
        removeAllChildNodes(trBiginningCashPosition)
        removeAllChildNodes(trChangeInCash)
        removeAllChildNodes(trFreeCashFlow)
        // Volver a hacer la tabla ------
        fechaCashFlow = []
        oparatingCashFlowArray = []
        investingCashFlowArray = []
        financingCashFlowArray = []
        dividendPaidArray = []
        freeCashFlowArray = []

        for(i=0;i<espacioFechas;i++) {
            cashFlowStatementArray = data['Financials']['Cash_Flow']['yearly'][Object.keys(financials)[posicionFechaInicial-i]]
            // Tomar elementos------------------------
            fechas = cashFlowStatementArray['date'].split('-')[0]
            totalCashFromOperatingActivities = cashFlowStatementArray['totalCashFromOperatingActivities']
            netIncome = cashFlowStatementArray['netIncome']
            depreciation = cashFlowStatementArray['depreciation']
            deferredTax = cashFlowStatementArray['deferredTax']
            stockBasedCompensation = cashFlowStatementArray['stockBasedCompensation']
            otherNonCashItems = cashFlowStatementArray['otherNonCashItems']
            changeInWorkingCapital = cashFlowStatementArray['changeInWorkingCapital']
            changeReceivables = cashFlowStatementArray['changeReceivables']
            changeToInventory = cashFlowStatementArray['changeToInventory']
            changeToPayables = cashFlowStatementArray['nonCurrrentAssetsOther']
            changeToOtherCurrentAssets = cashFlowStatementArray['changeToOtherCurrentAssets']
            changeToOtherWorkingCapital = cashFlowStatementArray['changeToOtherWorkingCapital']
            totalCashflowsFromInvestingActivities = cashFlowStatementArray['totalCashflowsFromInvestingActivities']
            capitalExpenditures = cashFlowStatementArray['capitalExpenditures']
            investments = cashFlowStatementArray['investments']
            otherCashflowsFromInvestingActivities = cashFlowStatementArray['otherCashflowsFromInvestingActivities']
            totalCashFromFinancingActivities = cashFlowStatementArray['totalCashFromFinancingActivities']
            issuancePaymentsOfDebt = cashFlowStatementArray['issuancePaymentsOfDebt']
            salePurchaseOfStock = cashFlowStatementArray['salePurchaseOfStock']
            dividendsPaid = cashFlowStatementArray['dividendsPaid']
            otherCashflowsFromFinancingActivities = cashFlowStatementArray['otherCashflowsFromFinancingActivities']
            endPeriodCashFlow = cashFlowStatementArray['endPeriodCashFlow']
            beginPeriodCashFlow = cashFlowStatementArray['beginPeriodCashFlow']
            changeInCash = cashFlowStatementArray['changeInCash']
            freeCashFlow = cashFlowStatementArray['freeCashFlow']
            // Push elementos en array-------------
            fechaCashFlow.push(fechas)
            oparatingCashFlowArray.push(totalCashFromOperatingActivities)
            investingCashFlowArray.push(totalCashflowsFromInvestingActivities)
            financingCashFlowArray.push(totalCashFromFinancingActivities)
            dividendPaidArray.push(dividendsPaid)
            freeCashFlowArray.push(freeCashFlow)

            // Agregar elementos a tabla------------------------
            crearYAgregarElemento(trFechas,'th',fechas)
            crearYAgregarElemento(trOparatingCahsFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashFromOperatingActivities))
            crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncome))
            crearYAgregarElemento(trDepreciationAmortization,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,depreciation))
            crearYAgregarElemento(trDeferredTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,deferredTax))
            crearYAgregarElemento(trStockBasedCompensation,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,stockBasedCompensation))
            crearYAgregarElemento(trOtherNonCashItems,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherNonCashItems))
            crearYAgregarElemento(trChangeInWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInWorkingCapital))
            crearYAgregarElemento(trChangeReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeReceivables))
            crearYAgregarElemento(trChangeInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToInventory))
            crearYAgregarElemento(trChangePayables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToPayables))
            crearYAgregarElemento(trChangeOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToOtherCurrentAssets))
            crearYAgregarElemento(trChangeOtherWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeToOtherWorkingCapital))
            crearYAgregarElemento(trInvestingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashflowsFromInvestingActivities))
            crearYAgregarElemento(trCapitalExpenditures,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalExpenditures))
            crearYAgregarElemento(trInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investments))
            crearYAgregarElemento(trOtherInvestingActivites,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCashflowsFromInvestingActivities))
            crearYAgregarElemento(trFinancingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCashFromFinancingActivities))
            crearYAgregarElemento(trIssuencePaymentsOfDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,issuancePaymentsOfDebt))
            crearYAgregarElemento(trSalePurchaseOfStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,salePurchaseOfStock))
            crearYAgregarElemento(trDividendPaid,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,dividendsPaid))
            crearYAgregarElemento(trOtherFinancingActivities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCashflowsFromFinancingActivities))
            crearYAgregarElemento(trEndCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,endPeriodCashFlow))
            crearYAgregarElemento(trBiginningCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,beginPeriodCashFlow))
            crearYAgregarElemento(trChangeInCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInCash))
            crearYAgregarElemento(trFreeCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,freeCashFlow))
        }
        // Agregar TTM si es necesario
        if(fechaFinal == 'TTM') {
            // Agregar TTM a grafica
            fechaCashFlow.push('TTM')
            oparatingCashFlowArray.push(oparatingCahsFlowTTM)
            investingCashFlowArray.push(investingCashFlowTTM)
            financingCashFlowArray.push(financingCashFlowTTM)
            dividendPaidArray.push(dividendPaidTTM)
            freeCashFlowArray.push(freeCashFlowTTM)
            // Agregar TTM a tabla
            crearYAgregarElemento(trFechas,'th','TTM')
            crearYAgregarElemento(trOparatingCahsFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,oparatingCahsFlowTTM))
            crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncomeTTM))
            crearYAgregarElemento(trDepreciationAmortization,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,depreciationAmortizationTTM))
            crearYAgregarElemento(trDeferredTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,deferredTaxTTM))
            crearYAgregarElemento(trStockBasedCompensation,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,stockBasedCompensationTTM))
            crearYAgregarElemento(trOtherNonCashItems,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherNonCashItemsTTM))
            crearYAgregarElemento(trChangeInWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInWorkingCapitalTTM))
            crearYAgregarElemento(trChangeReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeReceivablesTTM))
            crearYAgregarElemento(trChangeInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInventoryTTM))
            crearYAgregarElemento(trChangePayables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changePayablesTTM))
            crearYAgregarElemento(trChangeOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeOtherCurrentAssetsTTM))
            crearYAgregarElemento(trChangeOtherWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeOtherWorkingCapitalTTM))
            crearYAgregarElemento(trInvestingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investingCashFlowTTM))
            crearYAgregarElemento(trCapitalExpenditures,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalExpendituresTTM))
            crearYAgregarElemento(trInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,investmentsTTM))
            crearYAgregarElemento(trOtherInvestingActivites,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherInvestingActivitesTTM))
            crearYAgregarElemento(trFinancingCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,financingCashFlowTTM))
            crearYAgregarElemento(trIssuencePaymentsOfDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,issuencePaymentsOfDebtTTM))
            crearYAgregarElemento(trSalePurchaseOfStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,salePurchaseOfStockTTM))
            crearYAgregarElemento(trDividendPaid,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,dividendPaidTTM))
            crearYAgregarElemento(trOtherFinancingActivities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherFinancingActivitiesTTM))
            crearYAgregarElemento(trEndCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,endCashPositionTTM))
            crearYAgregarElemento(trBiginningCashPosition,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,biginningCashPositionTTM))
            crearYAgregarElemento(trChangeInCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,changeInCashTTM))
            crearYAgregarElemento(trFreeCashFlow,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,freeCashFlowTTM))
        }
    }
    // Obtener contenedor
    slider = document.getElementById('contenedroSlider')
    // Cuando se toca el contenedor
    slider.onclick = function (){
        refreshTabla()
        console.log(dividendPaidArray)
        // Volver a hacer grafica-----
        graficaPrincipal.config.data.labels = fechaCashFlow
        graficaPrincipal.config.data.datasets[4].data = oparatingCashFlowArray
        graficaPrincipal.config.data.datasets[3].data = investingCashFlowArray
        graficaPrincipal.config.data.datasets[2].data = financingCashFlowArray
        graficaPrincipal.config.data.datasets[1].data = dividendPaidArray
        graficaPrincipal.config.data.datasets[0].data = freeCashFlowArray
        graficaPrincipal.update()
    };
    // Botones de display
    // Tomar botones
    botonK = document.getElementById('botonK')
    botonMM = document.getElementById('botonMM')
    botonB = document.getElementById('botonB')
    botonMenos = document.getElementById('botonMenos')
    botonMas = document.getElementById('botonMas')
    puntosDecimales = document.getElementById('puntosDecimales')

    // Agregar o quitar color a botones
    // K MM B
    botonK.onclick = function () {
        // Hiligth boton selecionado
        if(botonK.classList.contains('botonActivo')) {
            botonK.classList.remove('botonActivo')
        } else {
            botonK.classList.add('botonActivo')
            botonMM.classList.remove('botonActivo')
            botonB.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
    }
    botonMM.onclick = function() {
        // Hiligth boton selecionado
        if(botonMM.classList.contains('botonActivo')) {
            botonMM.classList.remove('botonActivo')
            // Ningun display es selecionado
            botonMM.classList.add('noDisplay')
        } else {
            botonMM.classList.add('botonActivo')
            botonK.classList.remove('botonActivo')
            botonB.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
    }
    botonB.onclick = function() {
        // Hiligth boton selecionado
        if(botonB.classList.contains('botonActivo')) {
            botonB.classList.remove('botonActivo')
        } else {
            botonB.classList.add('botonActivo')
            botonMM.classList.remove('botonActivo')
            botonK.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
    }
    // Agregar o quitar puntos decimales
    botonMenos.onclick = function() {
        // Agregar o quitar al contador
        if(parseInt(puntosDecimales.textContent) > 0) {
            puntosDecimales.textContent = parseInt(puntosDecimales.textContent) - 1 
        }
        // Cambiar valores de la tabla
        refreshTabla()
    }
    botonMas.onclick = function() {
        // Agregar o quitar al contador
        if(parseInt(puntosDecimales.textContent) < 3) {
            puntosDecimales.textContent = parseInt(puntosDecimales.textContent) + 1 
        }
        // Cambiar valores de la tabla
        refreshTabla()
    }
}

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')


// Mostrar o no rows de desgloce
function mostrarRowOno(IdTablaMenu,IdTablaData,IdtrPrincipal,IdUltimoSubTr,mostrarSiONo) {
    tablaData = document.getElementById(IdTablaData)
    tablaMenu = document.getElementById(IdTablaMenu)
    hijoData = tablaData.childNodes[1].children
    hijoMenu = tablaMenu.childNodes[1].children
    // Craer Array con clases de elementos data
    arrayHijos = []
    for(i=0;i<hijoData.length;i++) {
        arrayHijos.push(hijoData[i].id)
    }
    // Buscar posicion de elementos prinicipio y final
    posicionPrimerElemento = arrayHijos.indexOf(IdtrPrincipal)
    posicionUltimoElemento = arrayHijos.indexOf(IdUltimoSubTr)
    // Pasar por todos los elementos y eliminar los necesarios que esten entre primero y ultimo
    for(i=0;i<hijoData.length;i++) {
        posicionElementoActual = arrayHijos.indexOf(hijoData[i].id)
        if(posicionElementoActual > posicionPrimerElemento && posicionElementoActual <= posicionUltimoElemento) {
            if(mostrarSiONo == 'no') {
                hijoData[i].style.display = 'none'
                hijoMenu[i].style.display = 'none'
            } else if(mostrarSiONo == 'si') {
                hijoData[i].style.display = ''
                hijoMenu[i].style.display = ''
            }
        }
    }
}

function mostrarRowOnoFlecha(elementoFlecha,IdTablaMenu,IdTablaData,IdtrPrincipal,IdUltimoSubTr) {
    // Ver si esconder o mostrar
    if(elementoFlecha.classList.contains('hide')) {
        // Cambiar clase
        elementoFlecha.classList.remove('hide')
        elementoFlecha.classList.add('show')
        // Rotar Flecha
        elementoFlecha.style.transform = 'rotate(0deg)'
        // Mostrar elementos
        mostrarRowOno(IdTablaMenu,IdTablaData,IdtrPrincipal,IdUltimoSubTr,'si')
    } else if(elementoFlecha.classList.contains('show')) {
        // Cambiar clase
        elementoFlecha.classList.remove('show')
        elementoFlecha.classList.add('hide')
        // Rotar Flecha
        elementoFlecha.style.transform = 'rotate(-90deg)'
        // Mostrar elementos
        mostrarRowOno(IdTablaMenu,IdTablaData,IdtrPrincipal,IdUltimoSubTr,'no')
    }
}

// Esconder inicialmente
mostrarRowOno('titulosTabla','tablaMovil','trOparatingCahsFlow','trChangeOtherWorkingCapital','no')
mostrarRowOno('titulosTabla','tablaMovil','trInvestingCashFlow','trOtherInvestingActivites','no')
mostrarRowOno('titulosTabla','tablaMovil','trFinancingCashFlow','trOtherFinancingActivities','no')
mostrarRowOno('titulosTabla','tablaMovil','trEndCashPosition','trChangeInCash','no')


// Tomar flechitas de mostrar o no
flechaOparatingCahsFlow = document.getElementById('flechaOparatingCahsFlow')
flechaChangeInWorkingCapital = document.getElementById('flechaChangeInWorkingCapital')
flechaInvestingCahsFlow = document.getElementById('flechaInvestingCahsFlow')
flechaFinancingCahsFlow = document.getElementById('flechaFinancingCahsFlow')
flechaEndCashPosition = document.getElementById('flechaEndCashPosition')

// Adjuntar function a elementos

// Oparating Cash Flow
flechaOparatingCahsFlow.onclick = function () { 
    mostrarRowOnoFlecha(flechaOparatingCahsFlow,'titulosTabla','tablaMovil','trOparatingCahsFlow','trChangeOtherWorkingCapital')
    // Esconder Change In Working Capital
    mostrarRowOno('titulosTabla','tablaMovil','trChangeInWorkingCapital','trChangeOtherWorkingCapital','no')
}

flechaChangeInWorkingCapital.onclick = function () {
    mostrarRowOnoFlecha(flechaChangeInWorkingCapital,'titulosTabla','tablaMovil','trChangeInWorkingCapital','trChangeOtherWorkingCapital')
}

// Investing Cash Flow
flechaInvestingCahsFlow.onclick = function () {
    mostrarRowOnoFlecha(flechaInvestingCahsFlow,'titulosTabla','tablaMovil','trInvestingCashFlow','trOtherInvestingActivites')
}

// Financing Cash Flow
flechaFinancingCahsFlow.onclick = function () {
    mostrarRowOnoFlecha(flechaFinancingCahsFlow,'titulosTabla','tablaMovil','trFinancingCashFlow','trOtherFinancingActivities')
}

// End Cash Position
flechaEndCashPosition.onclick = function () {
    mostrarRowOnoFlecha(flechaEndCashPosition,'titulosTabla','tablaMovil','trEndCashPosition','trChangeInCash')
}





// Functiones practicas
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
// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
}
// Function arrondir x decimal spaces
function aroundXdecimalPlaces(valor,espaciosDespuesComa) {
    valor = Number(Math.round(valor + 'e' + espaciosDespuesComa) + 'e-' + espaciosDespuesComa)
    return valor
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
// Function crear y agregar elemento
function crearYAgregarElemento(elementoPadre,tipoDeElementoCreacion,textoDeElementoCreacion) {
    nuevoElemento = document.createElement(tipoDeElementoCreacion)
    textoNodo = document.createTextNode(textoDeElementoCreacion)
    nuevoElemento.appendChild(textoNodo)
    elementoPadre.appendChild(nuevoElemento)
    return nuevoElemento
}
// Function ajutes data para tabla
function ajustarDataTablaValor(displayUnits,displayDecimal,valor) {
    if(valor == null) {
        valor = 0
    } else {
        if(displayUnits == 'K') {
            valor = valor/1000
        } else if(displayUnits == 'MM') {
            valor = valor/1000000
        } else if(displayUnits == 'B') {
            valor = valor/1000000000
        } else if(displayUnits == 'displaySinCambio') {
            valor = valor
        }
    }
    
    valor = aroundXdecimalPlaces(valor,displayDecimal)
    valor = valor.toString()
    parteEntera = valor.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if(valor.split('.')[1] == undefined) {
        parteDecimal = ''
    } else {
        parteDecimal = '.' + valor.split('.')[1]
    }

    valorFinal = parteEntera + parteDecimal
    return valorFinal
} 


// Functiones graficas
// Function Grafica Principal
function hacerGraficaFinancials(idContexto,fechas,data1Nombre,data1Color,data1Array,data2Nombre,data2Color,data2Array,data3Nombre,data3Color,data3Array,
    data4Nombre,data4Color,data4Array,data5Nombre,data5Color,data5Array) {
    ctx = document.getElementById(idContexto).getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechas,
            datasets: [
                {
                    type: 'line',
                    label: data5Nombre,
                    data: data5Array,
                    borderColor: data5Color,
                    backgroundColor: data5Color,
                    pointBackgroundColor: data5Color,
                    pointBorderColor: data5Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'line',
                    label: data4Nombre,
                    data: data4Array,
                    borderColor: data4Color,
                    backgroundColor: data4Color,
                    pointBackgroundColor: data4Color,
                    pointBorderColor: data4Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'line',
                    label: data3Nombre,
                    data: data3Array,
                    borderColor: data3Color,
                    backgroundColor: data3Color,
                    pointBackgroundColor: data3Color,
                    pointBorderColor: data3Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'line',
                    label: data2Nombre,
                    data: data2Array,
                    borderColor: data2Color,
                    backgroundColor: data2Color,
                    pointBackgroundColor: data2Color,
                    pointBorderColor: data2Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'bar',
                    label: data1Nombre,
                    data: data1Array,
                    borderColor: data1Color,
                    backgroundColor: data1Color,
                    borderRadius: 10,
                    pointStyle: 'rect'
            }],
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        boxWidth: 30,
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 'bold',
                        },
                        padding: 15,
                        usePointStyle: true
                    },
                    onHover: (event,chartElement) => {
                        event.native.target.style.cursor = 'pointer'

                    },
                    onLeave : (event,chartElement) => {
                        event.native.target.style.cursor = 'default'
                    }
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                    displayColors: true,
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
                }
            },
            scales: {
                x: {
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
                y: {
                    ticks: {
                        color: 'rgb(30, 30, 30)',
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 500,
                        },
                        callback: function(value, index, ticks) {
                            return millonesBillonesTrillones(value);
                        }
                    },
                }
            },
        }
    })
    return myChart
}


// Hacer que cada tabla empize del lado derecho
function ejecutarDespuesDeCargar() {
	var contenedorTablaMovil = document.querySelector('.contenedorTablaMovil');
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Esperar 1 segundos después de cargar la página
	document.addEventListener('DOMContentLoaded', function () {
	setTimeout(ejecutarDespuesDeCargar, 1000); // 1000 milisegundos = 1 segundos
});