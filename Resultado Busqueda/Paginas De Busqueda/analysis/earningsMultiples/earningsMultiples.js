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

// Function poner un elemento en rojo si el dato es inferior a cierta cantidad y verde si es el contrario
function colorSuperiorInferior(idElemento,valorElemento,valorComparar) {
	elemento = document.getElementById(idElemento)
	if(valorElemento < valorComparar) {
		elemento.style.color = '#d93025'
	} else {
		elemento.style.color = '#188038'
	}
}

// Function Calcular Avrage
function calculateAverage(numbers) {
	if (numbers.length === 0) {
	  return 0; // Handle the case of an empty array
	}
  
	const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	const average = sum / numbers.length;
  
	return average;
}

function trabajarData(data) {
	// Tomar nombre de empresa
    nombreEmpresaAnalizada = data['General']['Name']
	// Tomar multiplos de appl
	valuation = data['Valuation'];
	pe = valuation['TrailingPE'];
	ps = valuation['PriceSalesTTM'];
	pb = valuation['PriceBookMRQ'];
	// Obtener nombres de objetos
	nombresObjetos = Object.keys(data['Financials']['Cash_Flow']['yearly']);
	evFCF = valuation['EnterpriseValue'] / data['Financials']['Cash_Flow']['yearly'][nombresObjetos[0]]['freeCashFlow']
	evEbitda = valuation['EnterpriseValueEbitda'];
	evSales = valuation['EnterpriseValueRevenue'];
	// Poner multiplos en citio
	// Seleccionr elemento
	nombreEmpresaAnalizadaDoc = document.getElementById('nombreEmpresaAnalizada')
	peDoc  = document.getElementById('PER')
	psDoc  = document.getElementById('PS')
	pbDoc  = document.getElementById('PB')
	evFCFDoc  = document.getElementById('EV/FCF')
	// Insertar info
	nombreEmpresaAnalizadaDoc.textContent = nombreEmpresaAnalizada
	peDoc.textContent = multiplicador(pe)
	psDoc.textContent = multiplicador(ps)
	pbDoc.textContent = multiplicador(pb)
	evFCFDoc.textContent = multiplicador(evFCF)

	//Crear array con los multiplos
	ratiosArray = [pe,ps,pb,evFCF]
	return ratiosArray
}

precioAccion = precioInicial(
	'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json'
);

// Trabjar data general

async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	ratiosArray = trabajarData(data)
	return ratiosArray
}



ratiosArray = trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')


// Conseguir ticker de las otras acciones----------------------------------------------------------------------
async function trabajarDataOtrasAccionesTickers(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	arrayTicketsParecidos = trabajarDataOtrasTicker(data)
	return arrayTicketsParecidos
}

function trabajarDataOtrasTicker(data) {
	documentoPrimerTicker = document.getElementById('firstTicker')
	documentoSegundoTicker = document.getElementById('secondTicker')
	primerTicketParecido = data[1]
	segundoTicketParecido = data[2]
	documentoPrimerTicker.value  = primerTicketParecido
    documentoSegundoTicker.value = segundoTicketParecido
	return [primerTicketParecido, segundoTicketParecido]
}



arrayTicketsParecidos = trabajarDataOtrasAccionesTickers(`https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=c32njgiad3ieculvq2ng`)




// Trabajar data de la primera accion------------------------------------------------------------------------
async function trabajarDataOtrasAcciones1(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarDataOtrasAccion1(data)
}

function trabajarDataOtrasAccion1(data) {
	// Tomar Elementos de la data
	pe1 = data['metric']['peTTM']
	ps1 = data['metric']['psTTM']
	pb1 = data['metric']['pbQuarterly']
	evFCF1 = data['metric']['currentEv/freeCashFlowTTM'] 
	// Tomar elementos en docs
	pe1Doc = document.getElementById('PER1')
	ps1Doc = document.getElementById('PS1')
	pb1Doc = document.getElementById('PB1')
	evFCF1Doc = document.getElementById('EV/FCF1')
	// Rellenar Elementos
	pe1Doc.textContent = multiplicador(pe1)
	ps1Doc.textContent = multiplicador(ps1)
	pb1Doc.textContent = multiplicador(pb1)
	evFCF1Doc.textContent = multiplicador(evFCF1)
	// Tomar Ratio de accion principal
	ratiosArray.then((result) => {
		ratiosArray = result
		pePrincipal = ratiosArray[0]
		psPrincipal = ratiosArray[1]
		pbPrincipal = ratiosArray[2]
		evFcfPrincipal = ratiosArray[3]
		// Tomar precio de accion
		precioAccion.then((precioAccion) => {
			// Calcular Supuesto precio de accion
			precioEstimadoPe1 = (precioAccion * pe1)/pePrincipal
			precioEstimadoPs1 = (precioAccion * ps1)/psPrincipal
			precioEstimadoPb1 = (precioAccion * pb1)/pbPrincipal
			precioEstimadoEvFcfc1 = (precioAccion * evFCF1)/evFcfPrincipal
			avragePrecioEstimado1 = calculateAverage([precioEstimadoPe1,precioEstimadoPs1,precioEstimadoPb1,precioEstimadoEvFcfc1])
			// Tomar elementos en doc
			precioEstimadoPe1Doc = document.getElementById('PERSuposedPrice1')
			precioEstimadoPs1Doc = document.getElementById('PSSuposedPrice1')
			precioEstimadoPb1Doc = document.getElementById('PBSuposedPrice1')
			precioEstimadoEvFcfc1Doc = document.getElementById('EV/FCFSuposedPrice1')
			// Rellenar elementos
			precioEstimadoPe1Doc.textContent = arondir(precioEstimadoPe1)
			precioEstimadoPs1Doc.textContent = arondir(precioEstimadoPs1)
			precioEstimadoPb1Doc.textContent = arondir(precioEstimadoPb1)
			precioEstimadoEvFcfc1Doc.textContent = arondir(precioEstimadoEvFcfc1)
			// Poner color a elementos rojo si estimacion inferior a precio o verde s superior
			colorSuperiorInferior('PERSuposedPrice1',precioEstimadoPe1,precioAccion)
			colorSuperiorInferior('PSSuposedPrice1',precioEstimadoPs1,precioAccion)
			colorSuperiorInferior('PBSuposedPrice1',precioEstimadoPb1,precioAccion)
			colorSuperiorInferior('EV/FCFSuposedPrice1',precioEstimadoEvFcfc1,precioAccion)
		})
   })
}

//Conseguir y poner nombre de la primera empresa
async function ponerNombrePrimeraEmpresa(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	ponerNombrePrimeraEmpresa1(data)
}

function ponerNombrePrimeraEmpresa1(data) {
	nombreEmpresaComparada1Doc = document.getElementById('nombreEmpresaComparada1')
	nombreEmpresaComparadaPrecio1Doc = document.getElementById('nombreEmpresaComparadaPrecio1')
	nombreEmpresaComparada1Doc.textContent = data['name']
	nombreEmpresaComparadaPrecio1Doc.textContent = data['name']
}


// Ejecutar function de primer ticker en un promise para obtener el ticker
arrayTicketsParecidos.then((result) => {
	primerTicker = result[0]
	ponerNombrePrimeraEmpresa('https://finnhub.io/api/v1/stock/profile2?symbol='+primerTicker+'&token=c32njgiad3ieculvq2ng')
	trabajarDataOtrasAcciones1('https://finnhub.io/api/v1/stock/metric?symbol='+primerTicker+'&metric=all&token=c32njgiad3ieculvq2ng')
})

// Trabajar data de la segunda  accion------------------------------------------------------------------------
async function trabajarDataOtrasAcciones2(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarDataOtrasAccion2(data)
}

function trabajarDataOtrasAccion2(data) {
	// Tomar Elementos de la data
	pe2 = data['metric']['peTTM']
	ps2 = data['metric']['psTTM']
	pb2 = data['metric']['pbQuarterly']
	evFCF2 = data['metric']['currentEv/freeCashFlowTTM'] 
	// Tomar elementos en docs
	pe2Doc = document.getElementById('PER2')
	ps2Doc = document.getElementById('PS2')
	pb2Doc = document.getElementById('PB2')
	evFCF2Doc = document.getElementById('EV/FCF2')
	// Rellenar Elementos
	pe2Doc.textContent = multiplicador(pe2)
	ps2Doc.textContent = multiplicador(ps2)
	pb2Doc.textContent = multiplicador(pb2)
	evFCF2Doc.textContent = multiplicador(evFCF2)
	// Tomar Ratio de accion principal
	ratiosArray.then((result) => {
		ratiosArray = result
		pePrincipal = ratiosArray[0]
		psPrincipal = ratiosArray[1]
		pbPrincipal = ratiosArray[2]
		evFcfPrincipal = ratiosArray[3]
		// Tomar precio de accion
		precioAccion.then((precioAccion) => {
			// Calcular Supuesto precio de accion
			precioEstimadoPe2 = (precioAccion * pe2)/pePrincipal
			precioEstimadoPs2 = (precioAccion * ps2)/psPrincipal
			precioEstimadoPb2 = (precioAccion * pb2)/pbPrincipal
			precioEstimadoEvFcfc2 = (precioAccion * evFCF2)/evFcfPrincipal
			// Tomar elementos en doc
			precioEstimadoPe2Doc = document.getElementById('PERSuposedPrice2')
			precioEstimadoPs2Doc = document.getElementById('PSSuposedPrice2')
			precioEstimadoPb2Doc = document.getElementById('PBSuposedPrice2')
			precioEstimadoEvFcfc2Doc = document.getElementById('EV/FCFSuposedPrice2')
			// Rellenar elementos
			precioEstimadoPe2Doc.textContent = arondir(precioEstimadoPe2)
			precioEstimadoPs2Doc.textContent = arondir(precioEstimadoPs2)
			precioEstimadoPb2Doc.textContent = arondir(precioEstimadoPb2)
			precioEstimadoEvFcfc2Doc.textContent = arondir(precioEstimadoEvFcfc2)
			// Poner color a elementos rojo si estimacion inferior a precio o verde s superior
			colorSuperiorInferior('PERSuposedPrice2',precioEstimadoPe2,precioAccion)
			colorSuperiorInferior('PSSuposedPrice2',precioEstimadoPs2,precioAccion)
			colorSuperiorInferior('PBSuposedPrice2',precioEstimadoPb2,precioAccion)
			colorSuperiorInferior('EV/FCFSuposedPrice2',precioEstimadoEvFcfc2,precioAccion)
		})
   })
}

//Conseguir y poner nombre de la segunda empresa
async function ponerNombreDegundaEmpresa(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	ponerNombreSegundaEmpresa2(data)
}

function ponerNombreSegundaEmpresa2(data) {
	nombreEmpresaComparada1Doc = document.getElementById('nombreEmpresaComparada2')
	nombreEmpresaComparadaPrecio2Doc = document.getElementById('nombreEmpresaComparadaPrecio2')
	nombreEmpresaComparada1Doc.textContent = data['name']
	nombreEmpresaComparadaPrecio2Doc.textContent = data['name']
}

// Ejecutar function de segundo ticker en un promise para obtener el ticker
arrayTicketsParecidos.then((result) => {
	segundoTicker = result[1]
	ponerNombreDegundaEmpresa('https://finnhub.io/api/v1/stock/profile2?symbol='+segundoTicker+'&token=c32njgiad3ieculvq2ng')
	trabajarDataOtrasAcciones2('https://finnhub.io/api/v1/stock/metric?symbol='+segundoTicker+'&metric=all&token=c32njgiad3ieculvq2ng')
})


intrinsicValue = 190.73



precioInfoRefresh(
	'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',intrinsicValue
);





// Trabajar precio refresh sin valor intrinsico solo omar el precio
// Sakar precio de accion ---------------
// Defining async function
async function precioInicial(url,valorEncontrado) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	closePriceAperturaCitio = trabajarInfoPrecioInicial(data,valorEncontrado);
	return closePriceAperturaCitio;
}

// Trabaja data de precio
function trabajarInfoPrecioInicial(data) {
	closePriceMinuto = data['close'];

	return closePriceMinuto;
}

// Trabajar precio refresh con valor intrinsico
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
