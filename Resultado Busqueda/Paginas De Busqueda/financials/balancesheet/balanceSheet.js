// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = 'demo'
//'60c184d42ae3a5.75307084'


function trabajarData(data) {
    // Tomar elementos-----
    // Logo de la empresa
    logoURL = 'https://eodhistoricaldata.com/' + data["General"]['LogoURL'] 
    // Poner logo en el document
    documentoLogoEmpresa = document.getElementById('documentoLogoEmpresa')
    documentoLogoEmpresa.src = logoURL;
    // Fecha para range
    fechasFinancial =  Object.keys(data['Financials']['Balance_Sheet']['yearly'])
    // Hacer Tabla------------
    // Tomar elementos
    trFechas = document.getElementById('trFechas')
    trCash = document.getElementById('trCash')
    trShortTermInvestments = document.getElementById('trShortTermInvestments')
    trCashAndShortTermInvestments = document.getElementById('trCashAndShortTermInvestments')
    trNetReceivables = document.getElementById('trNetReceivables')
    trInventory = document.getElementById('trInventory')
    trOtherCurrentAssets = document.getElementById('trOtherCurrentAssets')
    trTotalCurrentAssets = document.getElementById('trTotalCurrentAssets')
    trPropertyPlantAndEquipmentNet = document.getElementById('trPropertyPlantAndEquipmentNet')
    trLongTermInvestments = document.getElementById('trLongTermInvestments')
    trNonCurrrentAssetsOther = document.getElementById('trNonCurrrentAssetsOther')
    trNonCurrentAssetsTotal = document.getElementById('trNonCurrentAssetsTotal')
    trTotalAssets = document.getElementById('trTotalAssets')
    trAccountsPayable = document.getElementById('trAccountsPayable')
    trShortTermDebt = document.getElementById('trShortTermDebt')
    trCurrentDeferredRevenue = document.getElementById('trCurrentDeferredRevenue')
    trOtherCurrentLiab = document.getElementById('trOtherCurrentLiab')
    trTotalCurrentLiabilities = document.getElementById('trTotalCurrentLiabilities')
    trLongTermDebt = document.getElementById('trLongTermDebt')
    trNonCurrentLiabilitiesOther = document.getElementById('trNonCurrentLiabilitiesOther')
    trNonCurrentLiabilitiesTotal = document.getElementById('trNonCurrentLiabilitiesTotal')
    trTotalLiab = document.getElementById('trTotalLiab')
    trCapitalStock = document.getElementById('trCapitalStock')
    trRetainedEarnings = document.getElementById('trRetainedEarnings')
    trOtherStockholderEquity = document.getElementById('trOtherStockholderEquity')
    trTotalStockholderEquity = document.getElementById('trTotalStockholderEquity')
    trNetTangibleAssets = document.getElementById('trNetTangibleAssets')
    trNetWorkingCapital = document.getElementById('trNetWorkingCapital')
    trNetInvestedCapital = document.getElementById('trNetInvestedCapital')
    trShortLongTermDebtTotal = document.getElementById('trShortLongTermDebtTotal')
    trNetDebt = document.getElementById('trNetDebt')
    // Obtener arrays de Income Statment yearly 5 años si es posible
    añoInicial = tomar5añosSiEsPosible(fechasFinancial)
    fechaBalanceSheet = []
    financials = data['Financials']['Balance_Sheet']['yearly']
    totalAsstesArray = []
    totalLiabilitiesArray = []
    totalCurrentAssetsArray = []
    totalCurrentLiabilitiesArray = []
    netDebtArray = []
    // Agregar data a tabla
    // Tomar displays de tabla
    unitDisplay = document.getElementsByClassName('botonActivo')[0].textContent
    decimalDisplay = document.getElementById('puntosDecimales').textContent
    // Loop para tabla
    for(i=0;i<añoInicial;i++) {
        // Tomar elementos------------------------
        balanceSheetArray = data['Financials']['Balance_Sheet']['yearly'][fechasFinancial[añoInicial-1-i]]
        fechas = fechasFinancial[añoInicial-1-i].split('-')[0]
        cash = balanceSheetArray['cash']
        shortTermInvestments = balanceSheetArray['shortTermInvestments']
        cashAndShortTermInvestments = balanceSheetArray['cashAndShortTermInvestments']
        netReceivables = balanceSheetArray['netReceivables']
        inventory = balanceSheetArray['inventory']
        otherCurrentAssets = balanceSheetArray['otherCurrentAssets']
        totalCurrentAssets = balanceSheetArray['totalCurrentAssets']
        propertyPlantAndEquipmentNet = balanceSheetArray['propertyPlantAndEquipmentNet']
        longTermInvestments = balanceSheetArray['longTermInvestments']
        nonCurrentAssetsOther = balanceSheetArray['nonCurrrentAssetsOther']
        nonCurrentAssetsTotal = balanceSheetArray['nonCurrentAssetsTotal']
        totalAssets = balanceSheetArray['totalAssets']
        accountsPayable = balanceSheetArray['accountsPayable']
        shortTermDebt = balanceSheetArray['shortTermDebt']
        currentDeferredRevenue = balanceSheetArray['currentDeferredRevenue']
        otherCurrentLiab = balanceSheetArray['otherCurrentLiab']
        totalCurrentLiabilities = balanceSheetArray['totalCurrentLiabilities']
        longTermDebt = balanceSheetArray['longTermDebt']
        nonCurrentLiabilitiesOther = balanceSheetArray['nonCurrentLiabilitiesOther']
        nonCurrentLiabilitiesTotal = balanceSheetArray['nonCurrentLiabilitiesTotal']
        totalLiab = balanceSheetArray['totalLiab']
        capitalStock = balanceSheetArray['capitalStock']
        retainedEarnings = balanceSheetArray['retainedEarnings']
        otherStockholderEquity = balanceSheetArray['otherStockholderEquity']
        totalStockholderEquity = balanceSheetArray['totalStockholderEquity']
        netTangibleAssets = balanceSheetArray['netTangibleAssets']
        netWorkingCapital = balanceSheetArray['netWorkingCapital']
        netInvestedCapital = balanceSheetArray['netInvestedCapital']
        shortLongTermDebtTotal = balanceSheetArray['shortLongTermDebtTotal']
        netDebt = balanceSheetArray['netDebt']
        // Push elementos en array-------------
        fechaBalanceSheet.push(fechas)
        totalAsstesArray.push(totalAssets)
        totalLiabilitiesArray.push(totalLiab)
        totalCurrentAssetsArray.push(totalCurrentAssets)
        totalCurrentLiabilitiesArray.push(totalCurrentLiabilities)
        netDebtArray.push(netDebt)

        // Agregar elementos a tabla------------------------
        crearYAgregarElemento(trFechas,'th',fechas)
        crearYAgregarElemento(trCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cash))
        crearYAgregarElemento(trShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermInvestments))
        crearYAgregarElemento(trCashAndShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashAndShortTermInvestments))
        crearYAgregarElemento(trNetReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netReceivables))
        crearYAgregarElemento(trInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,inventory))
        crearYAgregarElemento(trOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentAssets))
        crearYAgregarElemento(trTotalCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentAssets))
        crearYAgregarElemento(trPropertyPlantAndEquipmentNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,propertyPlantAndEquipmentNet))
        crearYAgregarElemento(trLongTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermInvestments))
        crearYAgregarElemento(trNonCurrrentAssetsOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsOther))
        crearYAgregarElemento(trNonCurrentAssetsTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsTotal))
        crearYAgregarElemento(trTotalAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalAssets))
        crearYAgregarElemento(trAccountsPayable,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,accountsPayable))
        crearYAgregarElemento(trShortTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermDebt))
        crearYAgregarElemento(trCurrentDeferredRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,currentDeferredRevenue))
        crearYAgregarElemento(trOtherCurrentLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentLiab))
        crearYAgregarElemento(trTotalCurrentLiabilities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentLiabilities))
        crearYAgregarElemento(trLongTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermDebt))
        crearYAgregarElemento(trNonCurrentLiabilitiesOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesOther))
        crearYAgregarElemento(trNonCurrentLiabilitiesTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesTotal))
        crearYAgregarElemento(trTotalLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalLiab))
        crearYAgregarElemento(trCapitalStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalStock))
        crearYAgregarElemento(trRetainedEarnings,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,retainedEarnings))
        crearYAgregarElemento(trOtherStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherStockholderEquity))
        crearYAgregarElemento(trTotalStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalStockholderEquity))
        crearYAgregarElemento(trNetTangibleAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netTangibleAssets))
        crearYAgregarElemento(trNetWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netWorkingCapital))
        crearYAgregarElemento(trNetInvestedCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInvestedCapital))
        crearYAgregarElemento(trShortLongTermDebtTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortLongTermDebtTotal))
        crearYAgregarElemento(trNetDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netDebt))
    }
    // Crear MRQ
    balanceSheetsQuarterly = data['Financials']['Balance_Sheet']['quarterly'];
    nombreDeObjetos = Object.keys(balanceSheetsQuarterly);
    cashMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['cash']
    shortTermInvestmentsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['shortTermInvestments']
    cashAndShortTermInvestmentsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['cashAndShortTermInvestments']
    netReceivablesMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['netReceivables']
    inventoryMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['inventory']
    otherCurrentAssetsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['otherCurrentAssets']
    totalCurrentAssetsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['totalCurrentAssets']
    propertyPlantAndEquipmentNetMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['propertyPlantAndEquipmentNet']
    longTermInvestmentsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['longTermInvestments']
    nonCurrentAssetsOtherMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['nonCurrentAssetsOther']
    nonCurrentAssetsTotalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['nonCurrentAssetsTotal']
    totalAssetsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['totalAssets']
    accountsPayableMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['accountsPayable']
    shortTermDebtMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['shortTermDebt']
    currentDeferredRevenueMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['currentDeferredRevenue']
    otherCurrentLiabMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['otherCurrentLiab']
    totalCurrentLiabilitiesMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['totalCurrentLiabilities']
    longTermDebtMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['longTermDebt']
    nonCurrentLiabilitiesOtherMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['nonCurrentLiabilitiesOther']
    nonCurrentLiabilitiesTotalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['nonCurrentLiabilitiesTotal']
    totalLiabMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['totalLiab']
    capitalStockMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['capitalStock']
    retainedEarningsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['retainedEarnings']
    otherStockholderEquityMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['otherStockholderEquity']
    totalStockholderEquityMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['totalStockholderEquity']
    netTangibleAssetsMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['netTangibleAssets']
    netWorkingCapitalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['netWorkingCapital']
    netInvestedCapitalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['netInvestedCapital']
    shortLongTermDebtTotalMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['shortLongTermDebtTotal']
    netDebtMRQ = balanceSheetsQuarterly[nombreDeObjetos[0]]['netDebt']
    // Agregar MRQ a tabla
    crearYAgregarElemento(trFechas,'th','MRQ')
    crearYAgregarElemento(trCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashMRQ))
    crearYAgregarElemento(trShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermInvestmentsMRQ))
    crearYAgregarElemento(trCashAndShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashAndShortTermInvestmentsMRQ))
    crearYAgregarElemento(trNetReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netReceivablesMRQ))
    crearYAgregarElemento(trInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,inventoryMRQ))
    crearYAgregarElemento(trOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentAssetsMRQ))
    crearYAgregarElemento(trTotalCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentAssetsMRQ))
    crearYAgregarElemento(trPropertyPlantAndEquipmentNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,propertyPlantAndEquipmentNetMRQ))
    crearYAgregarElemento(trLongTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermInvestmentsMRQ))
    crearYAgregarElemento(trNonCurrrentAssetsOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsOtherMRQ))
    crearYAgregarElemento(trNonCurrentAssetsTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsTotalMRQ))
    crearYAgregarElemento(trTotalAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalAssetsMRQ))
    crearYAgregarElemento(trAccountsPayable,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,accountsPayableMRQ))
    crearYAgregarElemento(trShortTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermDebtMRQ))
    crearYAgregarElemento(trCurrentDeferredRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,currentDeferredRevenueMRQ))
    crearYAgregarElemento(trOtherCurrentLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentLiabMRQ))
    crearYAgregarElemento(trTotalCurrentLiabilities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentLiabilitiesMRQ))
    crearYAgregarElemento(trLongTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermDebtMRQ))
    crearYAgregarElemento(trNonCurrentLiabilitiesOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesOtherMRQ))
    crearYAgregarElemento(trNonCurrentLiabilitiesTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesTotalMRQ))
    crearYAgregarElemento(trTotalLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalLiabMRQ))
    crearYAgregarElemento(trCapitalStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalStockMRQ))
    crearYAgregarElemento(trRetainedEarnings,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,retainedEarningsMRQ))
    crearYAgregarElemento(trOtherStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherStockholderEquityMRQ))
    crearYAgregarElemento(trTotalStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalStockholderEquityMRQ))
    crearYAgregarElemento(trNetTangibleAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netTangibleAssetsMRQ))
    crearYAgregarElemento(trNetWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netWorkingCapitalMRQ))
    crearYAgregarElemento(trNetInvestedCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInvestedCapitalMRQ))
    crearYAgregarElemento(trShortLongTermDebtTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortLongTermDebtTotalMRQ))
    crearYAgregarElemento(trNetDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netDebtMRQ))



    // Solo tomar año para fecha para range
    fechasRangeAños = []
    fechasFinancial.forEach(fecha => {
        fechasRangeAños.push(fecha.split('-')[0])
    });
    fechasRangeAños.reverse()
    // Agregar TTM a fechas
    fechasRangeAños.push('MRQ')
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
    // Agregar MRQ aarray
    fechaBalanceSheet.push('MRQ')
    totalAsstesArray.push(totalAssetsMRQ)
    totalLiabilitiesArray.push(totalLiabMRQ)
    totalCurrentAssetsArray.push(totalCurrentAssetsMRQ)
    totalCurrentLiabilitiesArray.push(totalCurrentLiabilitiesMRQ)
    netDebtArray.push(netDebtMRQ)
    graficaPrincipal = hacerGraficaFinancials('graficaPrincipal',fechaBalanceSheet,
                            'Total Asstes','#34a853',totalAsstesArray,
                            'Total Liabilities','#f44336',totalLiabilitiesArray,
                            'Current Assets','#5b95f9',totalCurrentAssetsArray,
                            'Current Liabilities','#0b5394',totalCurrentLiabilitiesArray,
                            'Net Debt','#fbbc04',netDebtArray,
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
        if(fechaFinal == 'MRQ') {
            nombreFinancialsFinal = 'MRQ'
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
        removeAllChildNodes(trCash)
        removeAllChildNodes(trShortTermInvestments)
        removeAllChildNodes(trCashAndShortTermInvestments)
        removeAllChildNodes(trNetReceivables)
        removeAllChildNodes(trInventory)
        removeAllChildNodes(trOtherCurrentAssets)
        removeAllChildNodes(trTotalCurrentAssets)
        removeAllChildNodes(trPropertyPlantAndEquipmentNet)
        removeAllChildNodes(trLongTermInvestments)
        removeAllChildNodes(trNonCurrrentAssetsOther)
        removeAllChildNodes(trNonCurrentAssetsTotal)
        removeAllChildNodes(trTotalAssets)
        removeAllChildNodes(trAccountsPayable)
        removeAllChildNodes(trShortTermDebt)
        removeAllChildNodes(trCurrentDeferredRevenue)
        removeAllChildNodes(trOtherCurrentLiab)
        removeAllChildNodes(trTotalCurrentLiabilities)
        removeAllChildNodes(trLongTermDebt)
        removeAllChildNodes(trNonCurrentLiabilitiesOther)
        removeAllChildNodes(trNonCurrentLiabilitiesTotal)
        removeAllChildNodes(trTotalLiab)
        removeAllChildNodes(trCapitalStock)
        removeAllChildNodes(trRetainedEarnings)
        removeAllChildNodes(trOtherStockholderEquity)
        removeAllChildNodes(trTotalStockholderEquity)
        removeAllChildNodes(trNetTangibleAssets)
        removeAllChildNodes(trNetWorkingCapital)
        removeAllChildNodes(trNetInvestedCapital)
        removeAllChildNodes(trShortLongTermDebtTotal)
        removeAllChildNodes(trNetDebt)
        // Volver a hacer la tabla ------
        fechaBalanceSheet = []
        totalAsstesArray = []
        totalLiabilitiesArray = []
        totalCurrentAssetsArray = []
        totalCurrentLiabilitiesArray = []
        netDebtArray = []

        for(i=0;i<=espacioFechas;i++) {
            balanceSheetArray = data['Financials']['Balance_Sheet']['yearly'][Object.keys(financials)[posicionFechaInicial-i]]
            // Tomar elementos------------------------
            fechas = balanceSheetArray['date'].split('-')[0]
            cash = balanceSheetArray['cash']
            shortTermInvestments = balanceSheetArray['shortTermInvestments']
            cashAndShortTermInvestments = balanceSheetArray['cashAndShortTermInvestments']
            netReceivables = balanceSheetArray['netReceivables']
            inventory = balanceSheetArray['inventory']
            otherCurrentAssets = balanceSheetArray['otherCurrentAssets']
            totalCurrentAssets = balanceSheetArray['totalCurrentAssets']
            propertyPlantAndEquipmentNet = balanceSheetArray['propertyPlantAndEquipmentNet']
            longTermInvestments = balanceSheetArray['longTermInvestments']
            nonCurrentAssetsOther = balanceSheetArray['nonCurrrentAssetsOther']
            nonCurrentAssetsTotal = balanceSheetArray['nonCurrentAssetsTotal']
            totalAssets = balanceSheetArray['totalAssets']
            accountsPayable = balanceSheetArray['accountsPayable']
            shortTermDebt = balanceSheetArray['shortTermDebt']
            currentDeferredRevenue = balanceSheetArray['currentDeferredRevenue']
            otherCurrentLiab = balanceSheetArray['otherCurrentLiab']
            totalCurrentLiabilities = balanceSheetArray['totalCurrentLiabilities']
            longTermDebt = balanceSheetArray['longTermDebt']
            nonCurrentLiabilitiesOther = balanceSheetArray['nonCurrentLiabilitiesOther']
            nonCurrentLiabilitiesTotal = balanceSheetArray['nonCurrentLiabilitiesTotal']
            totalLiab = balanceSheetArray['totalLiab']
            capitalStock = balanceSheetArray['capitalStock']
            retainedEarnings = balanceSheetArray['retainedEarnings']
            otherStockholderEquity = balanceSheetArray['otherStockholderEquity']
            totalStockholderEquity = balanceSheetArray['totalStockholderEquity']
            netTangibleAssets = balanceSheetArray['netTangibleAssets']
            netWorkingCapital = balanceSheetArray['netWorkingCapital']
            netInvestedCapital = balanceSheetArray['netInvestedCapital']
            shortLongTermDebtTotal = balanceSheetArray['shortLongTermDebtTotal']
            netDebt = balanceSheetArray['netDebt']
            // Push elementos en array-------------
            fechaBalanceSheet.push(fechas)
            totalAsstesArray.push(totalAssets)
            totalLiabilitiesArray.push(totalLiab)
            totalCurrentAssetsArray.push(totalCurrentAssets)
            totalCurrentLiabilitiesArray.push(totalCurrentLiabilities)
            netDebtArray.push(netDebt)

            // Agregar elementos a tabla------------------------
            crearYAgregarElemento(trFechas,'th',fechas)
            crearYAgregarElemento(trCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cash))
            crearYAgregarElemento(trShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermInvestments))
            crearYAgregarElemento(trCashAndShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashAndShortTermInvestments))
            crearYAgregarElemento(trNetReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netReceivables))
            crearYAgregarElemento(trInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,inventory))
            crearYAgregarElemento(trOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentAssets))
            crearYAgregarElemento(trTotalCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentAssets))
            crearYAgregarElemento(trPropertyPlantAndEquipmentNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,propertyPlantAndEquipmentNet))
            crearYAgregarElemento(trLongTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermInvestments))
            crearYAgregarElemento(trNonCurrrentAssetsOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsOther))
            crearYAgregarElemento(trNonCurrentAssetsTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsTotal))
            crearYAgregarElemento(trTotalAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalAssets))
            crearYAgregarElemento(trAccountsPayable,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,accountsPayable))
            crearYAgregarElemento(trShortTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermDebt))
            crearYAgregarElemento(trCurrentDeferredRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,currentDeferredRevenue))
            crearYAgregarElemento(trOtherCurrentLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentLiab))
            crearYAgregarElemento(trTotalCurrentLiabilities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentLiabilities))
            crearYAgregarElemento(trLongTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermDebt))
            crearYAgregarElemento(trNonCurrentLiabilitiesOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesOther))
            crearYAgregarElemento(trNonCurrentLiabilitiesTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesTotal))
            crearYAgregarElemento(trTotalLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalLiab))
            crearYAgregarElemento(trCapitalStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalStock))
            crearYAgregarElemento(trRetainedEarnings,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,retainedEarnings))
            crearYAgregarElemento(trOtherStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherStockholderEquity))
            crearYAgregarElemento(trTotalStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalStockholderEquity))
            crearYAgregarElemento(trNetTangibleAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netTangibleAssets))
            crearYAgregarElemento(trNetWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netWorkingCapital))
            crearYAgregarElemento(trNetInvestedCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInvestedCapital))
            crearYAgregarElemento(trShortLongTermDebtTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortLongTermDebtTotal))
            crearYAgregarElemento(trNetDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netDebt))
        }
        // Agregar MRQ si es necesario
        if(fechaFinal == 'MRQ') {
            // Agregar MRQ a grafica
            fechaBalanceSheet.push('MRQ')
            totalAsstesArray.push(totalAssetsMRQ)
            totalLiabilitiesArray.push(totalLiabMRQ)
            totalCurrentAssetsArray.push(totalCurrentAssetsMRQ)
            totalCurrentLiabilitiesArray.push(totalCurrentLiabilitiesMRQ)
            netDebtArray.push(netDebtMRQ)
            // Agregar MRQ a tabla
            crearYAgregarElemento(trFechas,'th','MRQ')
            crearYAgregarElemento(trCash,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashMRQ))
            crearYAgregarElemento(trShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermInvestmentsMRQ))
            crearYAgregarElemento(trCashAndShortTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,cashAndShortTermInvestmentsMRQ))
            crearYAgregarElemento(trNetReceivables,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netReceivablesMRQ))
            crearYAgregarElemento(trInventory,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,inventoryMRQ))
            crearYAgregarElemento(trOtherCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentAssetsMRQ))
            crearYAgregarElemento(trTotalCurrentAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentAssetsMRQ))
            crearYAgregarElemento(trPropertyPlantAndEquipmentNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,propertyPlantAndEquipmentNetMRQ))
            crearYAgregarElemento(trLongTermInvestments,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermInvestmentsMRQ))
            crearYAgregarElemento(trNonCurrrentAssetsOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsOtherMRQ))
            crearYAgregarElemento(trNonCurrentAssetsTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentAssetsTotalMRQ))
            crearYAgregarElemento(trTotalAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalAssetsMRQ))
            crearYAgregarElemento(trAccountsPayable,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,accountsPayableMRQ))
            crearYAgregarElemento(trShortTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortTermDebtMRQ))
            crearYAgregarElemento(trCurrentDeferredRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,currentDeferredRevenueMRQ))
            crearYAgregarElemento(trOtherCurrentLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherCurrentLiabMRQ))
            crearYAgregarElemento(trTotalCurrentLiabilities,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalCurrentLiabilitiesMRQ))
            crearYAgregarElemento(trLongTermDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,longTermDebtMRQ))
            crearYAgregarElemento(trNonCurrentLiabilitiesOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesOtherMRQ))
            crearYAgregarElemento(trNonCurrentLiabilitiesTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonCurrentLiabilitiesTotalMRQ))
            crearYAgregarElemento(trTotalLiab,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalLiabMRQ))
            crearYAgregarElemento(trCapitalStock,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,capitalStockMRQ))
            crearYAgregarElemento(trRetainedEarnings,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,retainedEarningsMRQ))
            crearYAgregarElemento(trOtherStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,otherStockholderEquityMRQ))
            crearYAgregarElemento(trTotalStockholderEquity,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalStockholderEquityMRQ))
            crearYAgregarElemento(trNetTangibleAssets,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netTangibleAssetsMRQ))
            crearYAgregarElemento(trNetWorkingCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netWorkingCapitalMRQ))
            crearYAgregarElemento(trNetInvestedCapital,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInvestedCapitalMRQ))
            crearYAgregarElemento(trShortLongTermDebtTotal,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,shortLongTermDebtTotalMRQ))
            crearYAgregarElemento(trNetDebt,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netDebtMRQ))
        }
    }
    // Obtener contenedor
    slider = document.getElementById('contenedroSlider')
    // Cuando se toca el contenedor
    slider.onclick = function (){
        refreshTabla()
        // Volver a hacer grafica-----
        graficaPrincipal.config.data.labels = fechaBalanceSheet
        graficaPrincipal.config.data.datasets[4].data = totalAsstesArray
        graficaPrincipal.config.data.datasets[3].data = totalLiabilitiesArray
        graficaPrincipal.config.data.datasets[2].data = totalCurrentAssetsArray
        graficaPrincipal.config.data.datasets[1].data = totalCurrentLiabilitiesArray
        graficaPrincipal.config.data.datasets[0].data = netDebtArray
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

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token='+ apiToken)



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
mostrarRowOno('titulosTabla','tablaMovil','trTotalAssets','trNonCurrrentAssetsOther','no')
mostrarRowOno('titulosTabla','tablaMovil','trTotalLiab','trNonCurrentLiabilitiesOther','no')
mostrarRowOno('titulosTabla','tablaMovil','trTotalStockholderEquity','trOtherStockholderEquity','no')

// Tomar flechitas de mostrar o no
flechaTotalAssets = document.getElementById('flechaTotalAssets')
flechaTotalCurrentAssets = document.getElementById('flechaTotalCurrentAssets')
flechaTotalCash = document.getElementById('flechaTotalCash')
flechaTotalNonCurrentAssets = document.getElementById('flechaTotalNonCurrentAssets')
flechaTotalLiabilities = document.getElementById('flechaTotalLiabilities')
flechaTotalCurrentLiab = document.getElementById('flechaTotalCurrentLiab')
flechaTotalNoneCurrentLiab = document.getElementById('flechaTotalNoneCurrentLiab')
flechaStockHoldersEquity = document.getElementById('flechaStockHoldersEquity')

// Adjuntar function a elementos

// Total Assets
flechaTotalAssets.onclick = function () { 
    mostrarRowOnoFlecha(flechaTotalAssets,'titulosTabla','tablaMovil','trTotalAssets','trNonCurrrentAssetsOther')
    // Esconder currentAssets y no cn current assets
    mostrarRowOno('titulosTabla','tablaMovil','trTotalCurrentAssets','trOtherCurrentAssets','no')
    mostrarRowOno('titulosTabla','tablaMovil','trNonCurrentAssetsTotal','trNonCurrrentAssetsOther','no')
}

flechaTotalCurrentAssets.onclick = function () {
    mostrarRowOnoFlecha(flechaTotalCurrentAssets,'titulosTabla','tablaMovil','trTotalCurrentAssets','trOtherCurrentAssets')
    // Esconder cash
    mostrarRowOno('titulosTabla','tablaMovil','trCashAndShortTermInvestments','trShortTermInvestments','no')
}

flechaTotalCash.onclick = function () {
    mostrarRowOnoFlecha(flechaTotalCash,'titulosTabla','tablaMovil','trCashAndShortTermInvestments','trShortTermInvestments')
}

flechaTotalNonCurrentAssets.onclick = function () {
    mostrarRowOnoFlecha(flechaTotalNonCurrentAssets,'titulosTabla','tablaMovil','trNonCurrentAssetsTotal','trNonCurrrentAssetsOther')
}

// Total Liabilities
flechaTotalLiabilities.onclick = function () { 
    mostrarRowOnoFlecha(flechaTotalLiabilities,'titulosTabla','tablaMovil','trTotalLiab','trNonCurrentLiabilitiesOther')
    // Esconder currentAssets y no cn current assets
    mostrarRowOno('titulosTabla','tablaMovil','trTotalCurrentLiabilities','trOtherCurrentLiab','no')
    mostrarRowOno('titulosTabla','tablaMovil','trNonCurrentLiabilitiesTotal','trNonCurrentLiabilitiesOther','no')
}

flechaTotalCurrentLiab.onclick = function () {
    mostrarRowOnoFlecha(flechaTotalCurrentLiab,'titulosTabla','tablaMovil','trTotalCurrentLiabilities','trOtherCurrentLiab')
}

flechaTotalNoneCurrentLiab.onclick = function () {
    mostrarRowOnoFlecha(flechaTotalNoneCurrentLiab,'titulosTabla','tablaMovil','trNonCurrentLiabilitiesTotal','trNonCurrentLiabilitiesOther')
}

flechaStockHoldersEquity.onclick = function () {
    mostrarRowOnoFlecha(flechaStockHoldersEquity,'titulosTabla','tablaMovil','trTotalStockholderEquity','trOtherStockholderEquity')
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
			window.location.href = "../../financials/balancesheet/balanceSheets.html"
		})
		a.setAttribute('href','../../financials/balancesheet/balanceSheets.html')
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
		window.location.href = "../../financials/balancesheet/balanceSheets.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});




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



async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}


// Hacer que cada tabla empize del lado derecho
function ejecutarDespuesDeCargar() {
	var contenedorTablaMovil = document.querySelector('.contenedorTablaMovil');
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Hacer que el menu de financials, news, etc... empieze desde la izquierda
function moverMenu() {
	var contenedorTablaMovil = document.querySelector('.paginas');
    console.log(contenedorTablaMovil)
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Esperar 1 segundos después de cargar la página
	document.addEventListener('DOMContentLoaded', function () {
	setTimeout(ejecutarDespuesDeCargar, 1000); // 1000 milisegundos = 1 segundos
    setTimeout(moverMenu, 1000); // 1000 milisegundos = 1 segundos
});



// Cambiar contenido de titulos en tablas si el with es menos ancho
function checkScreenWidth() {
    // Get the width of the viewport
    screenWidth = window.innerWidth;

    // Define the threshold value (replace 'x' with your desired width)
    thresholdWidth = 800;

    // Get the th element by its ID
    shortTermInvestmentsTitle = document.getElementById('shortTermInvestments');
    netPPETitle = document.getElementById('netPPE')
    longTermInvestmentsTitle = document.getElementById('longTermInvestments')
    otherNonCurrentAssetsTitle = document.getElementById('otherNonCurrentAssets')
    currentDeferredLiabilitiesTitle = document.getElementById('currentDeferredLiabilities')
    otherNonCurrentLiabilitiesTitle = document.getElementById('otherNonCurrentLiabilities')


    // Check if the screen width is less than the threshold
    if (screenWidth < thresholdWidth) {
      // Change the text of the div
      shortTermInvestmentsTitle.textContent = 'ST Investments'
      netPPETitle.textContent = 'Net PP&E'
      longTermInvestmentsTitle.textContent = 'LT Investments'
      otherNonCurrentAssetsTitle.textContent = 'Other Non Curr Assets'
      currentDeferredLiabilitiesTitle.textContent = 'Current Def Liab'
      otherNonCurrentLiabilitiesTitle.textContent = 'Other Non Curr Liab'
    } 
  }

// Call the function initially and listen for window resize events
window.addEventListener('load', checkScreenWidth);
window.addEventListener('resize', checkScreenWidth);








