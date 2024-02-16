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


// Cofdigo------------------------------------------------------------
function trabajarData(data) {
    // Tomar elementos-----
    // Logo de la empresa
    logoURL = 'https://eodhistoricaldata.com/' + data["General"]['LogoURL'] 
    // Poner logo en el document
    documentoLogoEmpresa = document.getElementById('documentoLogoEmpresa')
    documentoLogoEmpresa.src = logoURL;
    // Fecha para range
    fechasFinancial =  Object.keys(data['Financials']['Income_Statement']['yearly'])
    // Hacer Tabla------------
    // Tomar elementos
    trFechas = document.getElementById('trFechas')
    trTotalRevenue = document.getElementById('trTotalRevenue')
    trCostOfRevenue = document.getElementById('trCostOfRevenue')
    trGrossProfit = document.getElementById('trGrossProfit')
    trSellingGeneralAdministrative = document.getElementById('trSellingGeneralAdministrative')
    trResearchDevelopment = document.getElementById('trResearchDevelopment')
    trTotalOperatingExpenses = document.getElementById('trTotalOperatingExpenses')
    trOperatingIncome = document.getElementById('trOperatingIncome')
    trNonOperatingIncomeNetOther = document.getElementById('trNonOperatingIncomeNetOther')
    trInterestIncome = document.getElementById('trInterestIncome')
    trInterestExpense = document.getElementById('trInterestExpense')
    trNetInterestIncome = document.getElementById('trNetInterestIncome')
    trTotalOtherIncomeExpenseNet = document.getElementById('trTotalOtherIncomeExpenseNet')
    trIncomeBeforeTax = document.getElementById('trIncomeBeforeTax')
    trTaxProvision = document.getElementById('trTaxProvision')
    trNetIncome = document.getElementById('trNetIncome')
    // Obtener arrays de Income Statment yearly 5 años si es posible
    añoInicial = tomar5añosSiEsPosible(fechasFinancial)
    fechaIncomeStatment = []
    financials = data['Financials']['Income_Statement']['yearly']
    // Arrays de valores nominales
    totalRevenueArray = []
    costOfrevenueArray = []
    grossProfitArray = []
    sellingGeneralAdministrativeArray = []
    researchDevelopmentArray = []
    nonOperatingIncomeNetOtherArray = []
    incomeBeforeTaxArray = []
    netIncomeArray = []

    //Arrays Valores como margenes de total revenue
    costOfrevenueMarginArray = []
    grossProfitMarginArray = []
    sellingGeneralAdministrativeMarginArray = []
    researchDevelopmentMarginArray = []
    totalOperatingExpensesMarginArray = []
    operatingIncomeMarginArray = []
    nonOperatingIncomeNetOtherMarginArray = []
    interestIncomeMarginArray = []
    interestExpenseMarginArray = []
    netInterestIncomeMarginArray = []
    totalOtherIncomeExpenseNetMarginArray = []
    incomeBeforeTaxMarginArray = []
    taxProvisionMarginArray = []
    netIncomeMarginArray = []

    // Agregar data a tabla
    // Tomar displays de tabla
    unitDisplay = document.getElementsByClassName('botonActivo')[0].textContent
    decimalDisplay = document.getElementById('puntosDecimales').textContent
    
    // Loop para tabla
    for(i=0;i<añoInicial;i++) {
        // Tomar elementos------------------------
        incomeStatmentArray = data['Financials']['Income_Statement']['yearly'][fechasFinancial[añoInicial-1-i]]
        fechas = fechasFinancial[añoInicial-1-i].split('-')[0]
        totalRevenue = incomeStatmentArray['totalRevenue']
        costOfRevenue = incomeStatmentArray['costOfRevenue']
        grossProfit = incomeStatmentArray['grossProfit']
        sellingGeneralAdministrative = incomeStatmentArray['sellingGeneralAdministrative']
        researchDevelopment = incomeStatmentArray['researchDevelopment']
        totalOperatingExpenses = incomeStatmentArray['totalOperatingExpenses']
        operatingIncome = incomeStatmentArray['operatingIncome']
        nonOperatingIncomeNetOther = incomeStatmentArray['nonOperatingIncomeNetOther']
        interestIncome = incomeStatmentArray['interestIncome']
        interestExpense = incomeStatmentArray['interestExpense']
        netInterestIncome = incomeStatmentArray['netInterestIncome']
        totalOtherIncomeExpenseNet = incomeStatmentArray['totalOtherIncomeExpenseNet']
        incomeBeforeTax = incomeStatmentArray['incomeBeforeTax']
        taxProvision = incomeStatmentArray['taxProvision']
        netIncome = incomeStatmentArray['netIncome']
        // Push elementos en array-------------
        // Elementos nominales
        fechaIncomeStatment.push(fechas)
        totalRevenueArray.push(totalRevenue)
        costOfrevenueArray.push(costOfRevenue)
        grossProfitArray.push(grossProfit)
        sellingGeneralAdministrativeArray.push(sellingGeneralAdministrative)
        researchDevelopmentArray.push(researchDevelopment)
        nonOperatingIncomeNetOtherArray.push(nonOperatingIncomeNetOther)
        incomeBeforeTaxArray.push(incomeBeforeTax)
        netIncomeArray.push(netIncome)
        // Elementos margenes
        costOfrevenueMarginArray.push(costOfRevenue/totalRevenue)
        grossProfitMarginArray.push(grossProfit/totalRevenue)
        sellingGeneralAdministrativeMarginArray.push(sellingGeneralAdministrative/totalRevenue)
        researchDevelopmentMarginArray.push(researchDevelopment/totalRevenue)
        totalOperatingExpensesMarginArray.push(totalOperatingExpenses/totalRevenue)
        operatingIncomeMarginArray.push(operatingIncome/totalRevenue)
        nonOperatingIncomeNetOtherMarginArray.push(nonOperatingIncomeNetOther/totalRevenue)
        interestIncomeMarginArray.push(interestIncome/totalRevenue)
        interestExpenseMarginArray.push(interestExpense/totalRevenue)
        netInterestIncomeMarginArray.push(netInterestIncome/totalRevenue)
        totalOtherIncomeExpenseNetMarginArray.push(totalOtherIncomeExpenseNet/totalRevenue)
        incomeBeforeTaxMarginArray.push(incomeBeforeTax/totalRevenue)
        taxProvisionMarginArray.push(taxProvision/totalRevenue)
        netIncomeMarginArray.push(netIncome/totalRevenue)
        // Agregar elementos a tabla------------------------
        crearYAgregarElemento(trFechas,'th',fechas)
        crearYAgregarElemento(trTotalRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalRevenue))
        crearYAgregarElemento(trCostOfRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,costOfRevenue))
        crearYAgregarElemento(trGrossProfit,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,grossProfit))
        crearYAgregarElemento(trSellingGeneralAdministrative,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,sellingGeneralAdministrative))
        crearYAgregarElemento(trResearchDevelopment,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,researchDevelopment))
        crearYAgregarElemento(trTotalOperatingExpenses,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpenses))
        crearYAgregarElemento(trOperatingIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,operatingIncome))
        crearYAgregarElemento(trNonOperatingIncomeNetOther,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,nonOperatingIncomeNetOther))
        crearYAgregarElemento(trInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestIncome))
        crearYAgregarElemento(trInterestExpense,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,interestExpense))
        crearYAgregarElemento(trNetInterestIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,netInterestIncome))
        crearYAgregarElemento(trTotalOtherIncomeExpenseNet,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpenses))
        crearYAgregarElemento(trIncomeBeforeTax,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,incomeBeforeTax))
        crearYAgregarElemento(trTaxProvision,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,taxProvision))
        crearYAgregarElemento(trNetIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncome))
    }


    // Crear TTM
    totalRevenueTTM = calcularTTM(data,'Income_Statement','totalRevenue')
    costOfRevenueTTM = calcularTTM(data,'Income_Statement','costOfRevenue')
    grossProfitTTM = calcularTTM(data,'Income_Statement','grossProfit')
    sellingGeneralAdministrativeTTM = calcularTTM(data,'Income_Statement','sellingGeneralAdministrative')
    researchDevelopmentTTM = calcularTTM(data,'Income_Statement','researchDevelopment')
    totalOperatingExpensesTTM = calcularTTM(data,'Income_Statement','totalOperatingExpenses')
    operatingIncomeTTM = calcularTTM(data,'Income_Statement','operatingIncome')
    nonOperatingIncomeNetOtherTTM = calcularTTM(data,'Income_Statement','nonOperatingIncomeNetOther')
    interestIncomeTTM = calcularTTM(data,'Income_Statement','interestIncome')
    interestExpenseTTM = calcularTTM(data,'Income_Statement','interestExpense')
    netInterestIncomeTTM = calcularTTM(data,'Income_Statement','netInterestIncome')
    totalOtherIncomeExpenseNetTTM = calcularTTM(data,'Income_Statement','totalOtherIncomeExpenseNet')
    incomeBeforeTaxTTM = calcularTTM(data,'Income_Statement','incomeBeforeTax')
    taxProvisionTTM = calcularTTM(data,'Income_Statement','taxProvision')
    netIncomeTTM = calcularTTM(data,'Income_Statement','netIncome')
    // Agregar TTM a tabla
    crearYAgregarElemento(trFechas,'th','TTM')
    crearYAgregarElemento(trTotalRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalRevenueTTM,'TTM'))
    crearYAgregarElemento(trCostOfRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,costOfRevenueTTM,'TTM'))
    crearYAgregarElemento(trGrossProfit,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,grossProfitTTM,'TTM'))
    crearYAgregarElemento(trSellingGeneralAdministrative,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,sellingGeneralAdministrativeTTM,'TTM'))
    crearYAgregarElemento(trResearchDevelopment,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,researchDevelopmentTTM,'TTM'))
    crearYAgregarElemento(trTotalOperatingExpenses,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpensesTTM,'TTM'))
    crearYAgregarElemento(trOperatingIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,operatingIncomeTTM,'TTM'))
    crearYAgregarElemento(trNonOperatingIncomeNetOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonOperatingIncomeNetOtherTTM,'TTM'))
    crearYAgregarElemento(trInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestIncomeTTM,'TTM'))
    crearYAgregarElemento(trInterestExpense,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestExpenseTTM,'TTM'))
    crearYAgregarElemento(trNetInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInterestIncomeTTM,'TTM'))
    crearYAgregarElemento(trTotalOtherIncomeExpenseNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOtherIncomeExpenseNet,'TTM'))
    crearYAgregarElemento(trIncomeBeforeTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,incomeBeforeTaxTTM,'TTM'))
    crearYAgregarElemento(trTaxProvision,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,taxProvisionTTM,'TTM'))
    crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncomeTTM,'TTM'))
    // Agregar TTM a Array Nominal
    fechaIncomeStatment.push('TTM')
    totalRevenueArray.push(totalRevenueTTM)
    costOfrevenueArray.push(costOfRevenueTTM)
    grossProfitArray.push(grossProfitTTM)
    sellingGeneralAdministrativeArray.push(sellingGeneralAdministrativeTTM)
    researchDevelopmentArray.push(researchDevelopmentTTM)
    nonOperatingIncomeNetOtherArray.push(nonOperatingIncomeNetOtherTTM)
    incomeBeforeTaxArray.push(incomeBeforeTaxTTM)
    netIncomeArray.push(netIncomeTTM)
    // Agregar TTM a Array Margen 
    // Elementos margenes
    costOfrevenueMarginArray.push(costOfRevenueTTM/totalRevenue)
    grossProfitMarginArray.push(grossProfitTTM/totalRevenue)
    sellingGeneralAdministrativeMarginArray.push(sellingGeneralAdministrativeTTM/totalRevenue)
    researchDevelopmentMarginArray.push(researchDevelopmentTTM/totalRevenue)
    totalOperatingExpensesMarginArray.push(totalOperatingExpensesTTM/totalRevenue)
    operatingIncomeMarginArray.push(operatingIncomeTTM/totalRevenue)
    nonOperatingIncomeNetOtherMarginArray.push(nonOperatingIncomeNetOtherTTM/totalRevenue)
    interestIncomeMarginArray.push(interestIncomeTTM/totalRevenue)
    interestExpenseMarginArray.push(interestExpenseTTM/totalRevenue)
    netInterestIncomeMarginArray.push(netInterestIncomeTTM/totalRevenue)
    totalOtherIncomeExpenseNetMarginArray.push(totalOtherIncomeExpenseNetTTM/totalRevenue)
    incomeBeforeTaxMarginArray.push(incomeBeforeTaxTTM/totalRevenue)
    taxProvisionMarginArray.push(taxProvisionTTM/totalRevenue)
    netIncomeMarginArray.push(netIncomeTTM/totalRevenue)

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
    graficaPrincipal = hacerGraficaFinancials('graficaPrincipal',fechaIncomeStatment,
                            'Total Revenue','#46bdc6',totalRevenueArray,
                            'Cost Of Revenue','#ea4335',costOfrevenueArray,
                            'Gorss Profit','#fbbc04',grossProfitArray,
                            'Selling General & Administrative','#34a853',sellingGeneralAdministrativeArray,
                            'Research & Development','#000000',researchDevelopmentArray,
                            'Non Oparating Income','#5b95f9',nonOperatingIncomeNetOtherArray,
                            'Income BeforeTax','#ff9900',incomeBeforeTaxArray,
                            'Net Income','#9900ff',netIncomeArray)

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
        removeAllChildNodes(trFechas)
        removeAllChildNodes(trTotalRevenue)
        removeAllChildNodes(trCostOfRevenue)
        removeAllChildNodes(trGrossProfit) 
        removeAllChildNodes(trSellingGeneralAdministrative)
        removeAllChildNodes(trResearchDevelopment)
        removeAllChildNodes(trTotalOperatingExpenses)
        removeAllChildNodes(trOperatingIncome)
        removeAllChildNodes(trNonOperatingIncomeNetOther)
        removeAllChildNodes(trInterestIncome)
        removeAllChildNodes(trInterestExpense)
        removeAllChildNodes(trNetInterestIncome)
        removeAllChildNodes(trTotalOtherIncomeExpenseNet) 
        removeAllChildNodes(trIncomeBeforeTax)
        removeAllChildNodes(trTaxProvision)
        removeAllChildNodes(trNetIncome)
        // Volver a hacer la tabla ------
        // Vaciar elementos nominales
        fechaIncomeStatment = []
        totalRevenueArray = []
        costOfrevenueArray = []
        grossProfitArray = []
        sellingGeneralAdministrativeArray = []
        researchDevelopmentArray = []
        nonOperatingIncomeNetOtherArray = []
        incomeBeforeTaxArray = []
        netIncomeArray = []
        // Vaciar elementos marginales
        costOfrevenueMarginArray = []
        grossProfitMarginArray = []
        sellingGeneralAdministrativeMarginArray = []
        researchDevelopmentMarginArray = []
        totalOperatingExpensesMarginArray = []
        operatingIncomeMarginArray = []
        nonOperatingIncomeNetOtherMarginArray = []
        interestIncomeMarginArray = []
        interestExpenseMarginArray = []
        netInterestIncomeMarginArray = []
        totalOtherIncomeExpenseNetMarginArray = []
        incomeBeforeTaxMarginArray = []
        taxProvisionMarginArray = []
        netIncomeMarginArray = []
        for(i=0;i<=espacioFechas;i++) {
            incomeStatmentArraySegunRange = financials[Object.keys(financials)[posicionFechaInicial-i]]
            // Tomar elementos------------------------
            fechas = incomeStatmentArraySegunRange['date'].split('-')[0]
            totalRevenue = incomeStatmentArraySegunRange['totalRevenue']
            costOfRevenue = incomeStatmentArraySegunRange['costOfRevenue']
            grossProfit = incomeStatmentArraySegunRange['grossProfit']
            sellingGeneralAdministrative = incomeStatmentArraySegunRange['sellingGeneralAdministrative']
            researchDevelopment = incomeStatmentArraySegunRange['researchDevelopment']
            totalOperatingExpenses = incomeStatmentArraySegunRange['totalOperatingExpenses']
            operatingIncome = incomeStatmentArraySegunRange['operatingIncome']
            nonOperatingIncomeNetOther = incomeStatmentArraySegunRange['nonOperatingIncomeNetOther']
            interestIncome = incomeStatmentArraySegunRange['interestIncome']
            interestExpense = incomeStatmentArraySegunRange['interestExpense']
            netInterestIncome = incomeStatmentArraySegunRange['netInterestIncome']
            totalOtherIncomeExpenseNet = incomeStatmentArraySegunRange['totalOtherIncomeExpenseNet']
            incomeBeforeTax = incomeStatmentArraySegunRange['incomeBeforeTax']
            taxProvision = incomeStatmentArraySegunRange['taxProvision']
            netIncome = incomeStatmentArraySegunRange['netIncome']
            // Push elementos en array nominal-------------
            fechaIncomeStatment.push(fechas)
            totalRevenueArray.push(totalRevenue)
            costOfrevenueArray.push(costOfRevenue)
            grossProfitArray.push(grossProfit)
            sellingGeneralAdministrativeArray.push(sellingGeneralAdministrative)
            researchDevelopmentArray.push(researchDevelopment)
            nonOperatingIncomeNetOtherArray.push(nonOperatingIncomeNetOther)
            incomeBeforeTaxArray.push(incomeBeforeTax)
            netIncomeArray.push(netIncome)
            // Pus elementos array marginal---------------
            // Elementos margenes
            costOfrevenueMarginArray.push(costOfRevenue/totalRevenue)
            grossProfitMarginArray.push(grossProfit/totalRevenue)
            sellingGeneralAdministrativeMarginArray.push(sellingGeneralAdministrative/totalRevenue)
            researchDevelopmentMarginArray.push(researchDevelopment/totalRevenue)
            totalOperatingExpensesMarginArray.push(totalOperatingExpenses/totalRevenue)
            operatingIncomeMarginArray.push(operatingIncome/totalRevenue)
            nonOperatingIncomeNetOtherMarginArray.push(nonOperatingIncomeNetOther/totalRevenue)
            interestIncomeMarginArray.push(interestIncome/totalRevenue)
            interestExpenseMarginArray.push(interestExpense/totalRevenue)
            netInterestIncomeMarginArray.push(netInterestIncome/totalRevenue)
            totalOtherIncomeExpenseNetMarginArray.push(totalOtherIncomeExpenseNet/totalRevenue)
            incomeBeforeTaxMarginArray.push(incomeBeforeTax/totalRevenue)
            taxProvisionMarginArray.push(taxProvision/totalRevenue)
            netIncomeMarginArray.push(netIncome/totalRevenue)
            // Agregar elementos a tabla------------------------
            crearYAgregarElemento(trFechas,'th',fechas)
            crearYAgregarElemento(trTotalRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalRevenue))
            crearYAgregarElemento(trCostOfRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,costOfRevenue))
            crearYAgregarElemento(trGrossProfit,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,grossProfit))
            crearYAgregarElemento(trSellingGeneralAdministrative,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,sellingGeneralAdministrative))
            crearYAgregarElemento(trResearchDevelopment,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,researchDevelopment))
            crearYAgregarElemento(trTotalOperatingExpenses,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpenses))
            crearYAgregarElemento(trOperatingIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,operatingIncome))
            crearYAgregarElemento(trNonOperatingIncomeNetOther,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,nonOperatingIncomeNetOther))
            crearYAgregarElemento(trInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestIncome))
            crearYAgregarElemento(trInterestExpense,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,interestExpense))
            crearYAgregarElemento(trNetInterestIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,netInterestIncome))
            crearYAgregarElemento(trTotalOtherIncomeExpenseNet,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpenses))
            crearYAgregarElemento(trIncomeBeforeTax,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,incomeBeforeTax))
            crearYAgregarElemento(trTaxProvision,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,taxProvision))
            crearYAgregarElemento(trNetIncome,'td', ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncome))
        }
        // Agregar TTM si es necesario
        if(fechaFinal == 'TTM') {
            // Agregar TTM a grafica
            fechaIncomeStatment.push('TTM')
            totalRevenueArray.push(totalRevenueTTM)
            costOfrevenueArray.push(costOfRevenueTTM)
            grossProfitArray.push(grossProfitTTM)
            sellingGeneralAdministrativeArray.push(sellingGeneralAdministrativeTTM)
            researchDevelopmentArray.push(researchDevelopmentTTM)
            nonOperatingIncomeNetOtherArray.push(nonOperatingIncomeNetOtherTTM)
            incomeBeforeTaxArray.push(incomeBeforeTaxTTM)
            netIncomeArray.push(netIncomeTTM)
            // Agregar TTM a Array Margen 
            costOfrevenueMarginArray.push(costOfRevenueTTM/totalRevenue)
            grossProfitMarginArray.push(grossProfitTTM/totalRevenue)
            sellingGeneralAdministrativeMarginArray.push(sellingGeneralAdministrativeTTM/totalRevenue)
            researchDevelopmentMarginArray.push(researchDevelopmentTTM/totalRevenue)
            totalOperatingExpensesMarginArray.push(totalOperatingExpensesTTM/totalRevenue)
            operatingIncomeMarginArray.push(operatingIncomeTTM/totalRevenue)
            nonOperatingIncomeNetOtherMarginArray.push(nonOperatingIncomeNetOtherTTM/totalRevenue)
            interestIncomeMarginArray.push(interestIncomeTTM/totalRevenue)
            interestExpenseMarginArray.push(interestExpenseTTM/totalRevenue)
            netInterestIncomeMarginArray.push(netInterestIncomeTTM/totalRevenue)
            totalOtherIncomeExpenseNetMarginArray.push(totalOtherIncomeExpenseNetTTM/totalRevenue)
            incomeBeforeTaxMarginArray.push(incomeBeforeTaxTTM/totalRevenue)
            taxProvisionMarginArray.push(taxProvisionTTM/totalRevenue)
            netIncomeMarginArray.push(netIncomeTTM/totalRevenue)
            // Agregar TTM a tabla
            crearYAgregarElemento(trFechas,'th','TTM')
            crearYAgregarElemento(trTotalRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalRevenueTTM,'TTM'))
            crearYAgregarElemento(trCostOfRevenue,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,costOfRevenueTTM,'TTM'))
            crearYAgregarElemento(trGrossProfit,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,grossProfitTTM,'TTM'))
            crearYAgregarElemento(trSellingGeneralAdministrative,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,sellingGeneralAdministrativeTTM,'TTM'))
            crearYAgregarElemento(trResearchDevelopment,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,researchDevelopmentTTM,'TTM'))
            crearYAgregarElemento(trTotalOperatingExpenses,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOperatingExpensesTTM,'TTM'))
            crearYAgregarElemento(trOperatingIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,operatingIncomeTTM,'TTM'))
            crearYAgregarElemento(trNonOperatingIncomeNetOther,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,nonOperatingIncomeNetOtherTTM,'TTM'))
            crearYAgregarElemento(trInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestIncomeTTM,'TTM'))
            crearYAgregarElemento(trInterestExpense,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,interestExpenseTTM,'TTM'))
            crearYAgregarElemento(trNetInterestIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netInterestIncomeTTM,'TTM'))
            crearYAgregarElemento(trTotalOtherIncomeExpenseNet,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,totalOtherIncomeExpenseNet,'TTM'))
            crearYAgregarElemento(trIncomeBeforeTax,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,incomeBeforeTaxTTM,'TTM'))
            crearYAgregarElemento(trTaxProvision,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,taxProvisionTTM,'TTM'))
            crearYAgregarElemento(trNetIncome,'td',ajustarDataTablaValor(unitDisplay,decimalDisplay,netIncomeTTM,'TTM'))
        }
        // Agregar elementos Promedio Margenes si el boton indica margenes
        if(unitDisplay == '%') {
            crearYAgregarElemento(trFechas,'th','Avrage')
            crearYAgregarElemento(trTotalRevenue,'td',porcentaje(1))
            crearYAgregarElemento(trCostOfRevenue,'td',porcentaje(calculateAverage(costOfrevenueMarginArray)))
            crearYAgregarElemento(trGrossProfit,'td',porcentaje(calculateAverage(grossProfitMarginArray)))
            crearYAgregarElemento(trSellingGeneralAdministrative,'td',porcentaje(calculateAverage(sellingGeneralAdministrativeMarginArray)))
            crearYAgregarElemento(trResearchDevelopment,'td',porcentaje(calculateAverage(researchDevelopmentMarginArray)))
            crearYAgregarElemento(trTotalOperatingExpenses,'td',porcentaje(calculateAverage(totalOperatingExpensesMarginArray)))
            crearYAgregarElemento(trOperatingIncome,'td',porcentaje(calculateAverage(operatingIncomeMarginArray)))
            crearYAgregarElemento(trNonOperatingIncomeNetOther,'td',porcentaje(calculateAverage(nonOperatingIncomeNetOtherMarginArray)))
            crearYAgregarElemento(trInterestIncome,'td',porcentaje(calculateAverage(interestIncomeMarginArray)))
            crearYAgregarElemento(trInterestExpense,'td',porcentaje(calculateAverage(interestExpenseMarginArray)))
            crearYAgregarElemento(trNetInterestIncome,'td',porcentaje(calculateAverage(netInterestIncomeMarginArray)))
            crearYAgregarElemento(trTotalOtherIncomeExpenseNet,'td',porcentaje(calculateAverage(totalOperatingExpensesMarginArray)))
            crearYAgregarElemento(trIncomeBeforeTax,'td',porcentaje(calculateAverage(incomeBeforeTaxMarginArray)))
            crearYAgregarElemento(trTaxProvision,'td',porcentaje(calculateAverage(taxProvisionMarginArray)))
            crearYAgregarElemento(trNetIncome,'td',porcentaje(calculateAverage(netIncomeMarginArray)))
        }
    }
    // Function refresh Grafica
    function refreshGrafica(nominalMarginal) {
        botonPorcentaje = document.getElementById('botonPorcentaje')
        if(botonPorcentaje.classList.contains('porcentaje')) {
            // Volver a hacer grafica-----
            graficaPrincipal.config.data.labels = fechaIncomeStatment
            graficaPrincipal.config.data.datasets[7].data = []
            graficaPrincipal.config.data.datasets[6].data = costOfrevenueMarginArray
            graficaPrincipal.config.data.datasets[5].data = grossProfitMarginArray
            graficaPrincipal.config.data.datasets[4].data = sellingGeneralAdministrativeMarginArray
            graficaPrincipal.config.data.datasets[3].data = researchDevelopmentMarginArray
            graficaPrincipal.config.data.datasets[2].data = nonOperatingIncomeNetOtherMarginArray
            graficaPrincipal.config.data.datasets[1].data = incomeBeforeTaxMarginArray
            graficaPrincipal.config.data.datasets[0].data = netIncomeMarginArray
            // Poner label en %
            graficaPrincipal.config.options.plugins.tooltip.callbacks.label = function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += porcentaje(context.parsed.y)
                }
                return label;
            }
            // Poner y axis en %
            graficaPrincipal.config.options.scales.y.ticks.callback = function (value, index, values) {
                return porcentaje(value);
            };
        } else  {
            // Volver a hacer grafica-----
            graficaPrincipal.config.data.labels = fechaIncomeStatment
            graficaPrincipal.config.data.datasets[7].data = totalRevenueArray
            graficaPrincipal.config.data.datasets[6].data = costOfrevenueArray
            graficaPrincipal.config.data.datasets[5].data = grossProfitArray
            graficaPrincipal.config.data.datasets[4].data = sellingGeneralAdministrativeArray
            graficaPrincipal.config.data.datasets[3].data = researchDevelopmentArray
            graficaPrincipal.config.data.datasets[2].data = nonOperatingIncomeNetOtherArray
            graficaPrincipal.config.data.datasets[1].data = incomeBeforeTaxArray
            graficaPrincipal.config.data.datasets[0].data = netIncomeArray
            // Poner label en %
            graficaPrincipal.config.options.plugins.tooltip.callbacks.label = function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += millonesBillonesTrillones(context.parsed.y)
                }
                return label;
            }
            // Poner y axis en %
            graficaPrincipal.config.options.scales.y.ticks.callback = function (value, index, values) {
                return millonesBillonesTrillones(value);
            };
        }
        
        graficaPrincipal.update()
    }
    // Obtener contenedor
    slider = document.getElementById('contenedroSlider')
    // Cuando se toca el contenedor
    slider.onclick = function (){
        refreshTabla()
        // Volver a hacer grafica-----
        refreshGrafica()
    };
    // Botones de display
    // Tomar botones
    botonK = document.getElementById('botonK')
    botonMM = document.getElementById('botonMM')
    botonB = document.getElementById('botonB')
    botonMenos = document.getElementById('botonMenos')
    botonMas = document.getElementById('botonMas')
    puntosDecimales = document.getElementById('puntosDecimales')
    botonPorcentaje = document.getElementById('botonPorcentaje')

    // Agregar o quitar color a botones
    // K MM B
    botonK.onclick = function () {
        //Quitar classlist de porcentaje
        botonPorcentaje.classList.remove('porcentaje');
        // Hiligth boton selecionado
        if(botonK.classList.contains('botonActivo')) {
            botonK.classList.remove('botonActivo')
        } else {
            botonK.classList.add('botonActivo')
            botonMM.classList.remove('botonActivo')
            botonB.classList.remove('botonActivo')
            botonPorcentaje.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
        // Cambiar valores grafica
        refreshGrafica()
    }
    botonMM.onclick = function() {
        //Quitar classlist de porcentaje
        botonPorcentaje.classList.remove('porcentaje');
        // Hiligth boton selecionado
        if(botonMM.classList.contains('botonActivo')) {
            botonMM.classList.remove('botonActivo')
            // Ningun display es selecionado
            botonMM.classList.add('noDisplay')
        } else {
            botonMM.classList.add('botonActivo')
            botonK.classList.remove('botonActivo')
            botonB.classList.remove('botonActivo')
            botonPorcentaje.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
        // Cambiar valores grafica
        refreshGrafica()
    }
    botonB.onclick = function() {
        //Quitar classlist de porcentaje
        botonPorcentaje.classList.remove('porcentaje');
        // Hiligth boton selecionado
        if(botonB.classList.contains('botonActivo')) {
            botonB.classList.remove('botonActivo')
        } else {
            botonB.classList.add('botonActivo')
            botonMM.classList.remove('botonActivo')
            botonK.classList.remove('botonActivo')
            botonPorcentaje.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
        // Cambiar valores grafica
        refreshGrafica()
    }
    botonPorcentaje.onclick = function() {
        //Agregar classlist de porcentaje
        botonPorcentaje.classList.add('porcentaje');
         // Hiligth boton selecionado
         if(botonPorcentaje.classList.contains('botonActivo')) {
            botonPorcentaje.classList.remove('botonActivo')
        } else {
            botonPorcentaje.classList.add('botonActivo')
            botonB.classList.remove('botonActivo')
            botonMM.classList.remove('botonActivo')
            botonK.classList.remove('botonActivo')
        }
        // Cambiar valores de la tabla
        refreshTabla()
        // Cambiar valores grafica
        refreshGrafica()
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

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token=' + apiToken)

// Functiones----------------------------------------------------------
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
// Function hacer porcentaje
function porcentaje(valor) {
    resultado = arondir(valor * 100) + '%'
    return resultado
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
// Function para calcular promedio de Array
function calculateAverage(arr) {
    if (arr.length === 0) {
      return 0; // Handle the case where the array is empty to avoid division by zero.
    }
  
    const sum = arr.reduce((total, value) => total + value, 0);
    return sum / arr.length;
}
  
// Function crear y agregar elemento
function crearYAgregarElemento(elementoPadre,tipoDeElementoCreacion,textoDeElementoCreacion) {
    nuevoElemento = document.createElement(tipoDeElementoCreacion)
    textoNodo = document.createTextNode(textoDeElementoCreacion)
    nuevoElemento.appendChild(textoNodo)
    elementoPadre.appendChild(nuevoElemento)
}
// Function ajutes data para tabla
function ajustarDataTablaValor(displayUnits,displayDecimal,valor,ttm) {
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
        } else if(displayUnits == '%') {
            if(ttm == 'TTM') {
                valor = valor/numero(totalRevenueTTM)
            } else {
                valor = valor/numero(totalRevenue)
            }
        }
    }
    
    if (displayUnits !== '%') {
        valor = aroundXdecimalPlaces(valor,displayDecimal)
        valor = valor.toString()
        parteEntera = valor.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if(valor.split('.')[1] == undefined) {
            parteDecimal = ''
        } else {
            parteDecimal = '.' + valor.split('.')[1]
        }

        valorFinal = parteEntera + parteDecimal
    } else {
        valorFinal = arondir(valor*100) + '%'
    }
    
    return valorFinal
} 


// Functiones graficas
// Function Grafica Principal
function hacerGraficaFinancials(idContexto,fechas,data1Nombre,data1Color,data1Array,data2Nombre,data2Color,data2Array,data3Nombre,data3Color,data3Array,
    data4Nombre,data4Color,data4Array,data5Nombre,data5Color,data5Array,data6Nombre,data6Color,data6Array,data7Nombre,data7Color,data7Array,data8Nombre,data8Color,data8Array) {
    ctx = document.getElementById(idContexto).getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechas,
            datasets: [
                {
                    type: 'line',
                    label: data8Nombre,
                    data: data8Array,
                    borderColor: data8Color,
                    backgroundColor: data8Color,
                    pointBackgroundColor: data8Color,
                    pointBorderColor: data8Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'line',
                    label: data7Nombre,
                    data: data7Array,
                    borderColor: data7Color,
                    backgroundColor: data7Color,
                    pointBackgroundColor: data7Color,
                    pointBorderColor: data7Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
                {
                    type: 'line',
                    label: data6Nombre,
                    data: data6Array,
                    borderColor: data6Color,
                    backgroundColor: data6Color,
                    pointBackgroundColor: data6Color,
                    pointBorderColor: data6Color,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.5,
                },
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
function moverTabla() {
	var contenedorTablaMovil = document.querySelector('.contenedorTablaMovil');
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Hacer que el menu de financials, news, etc... empieze desde la izquierda
function moverMenu() {
	var contenedorTablaMovil = document.querySelector('.paginas');
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}


// Esperar 1 segundos después de cargar la página
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(moverTabla, 1000); // 1000 milisegundos = 1 segundos
    setTimeout(moverMenu, 1000); // 1000 milisegundos = 1 segundos
});


// Cambiar contenido de titulos en tablas si el with es menos ancho
function checkScreenWidth() {
    // Get the width of the viewport
    screenWidth = window.innerWidth;

    // Define the threshold value (replace 'x' with your desired width)
    thresholdWidth = 800;

    // Get the th element by its ID
    rdTitle = document.getElementById('r&d');
    oparatingExpensesTtitle = document.getElementById('oparatingExpenses')
    nonOparatingIncomeTitle = document.getElementById('nonOparatingIncome')
    otherIncomeExpenseTitle = document.getElementById('otherIncomeExpense')


    // Check if the screen width is less than the threshold
    if (screenWidth < thresholdWidth) {
      // Change the text of the div
      rdTitle.textContent = 'R&D Expenses';
      oparatingExpensesTtitle.textContent = 'Op Expenses'
      nonOparatingIncomeTitle.textContent = 'Non Op Income'
      otherIncomeExpenseTitle.textContent = 'Other Income Exp'
    } 
  }

// Call the function initially and listen for window resize events
window.addEventListener('load', checkScreenWidth);
window.addEventListener('resize', checkScreenWidth);

















