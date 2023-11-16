// Trabjar data general
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	ratiosArray = trabajarData(data)
	return ratiosArray
}
// Funcition trabajar data
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

ratiosArray = trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')
precioAccion = precioInicial(
	'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json'
);


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
//Conseguir y poner nombre de la primera empresa
async function ponerNombreOtrasAcciones(urlNomre1,urlNombre2) {
	// Storing response
	responseNombre1 = await fetch(urlNomre1);
	responseNombre2 = await fetch(urlNombre2);

	// Storing data in form of JSON
	dataNombre1 = await responseNombre1.json();
	dataNombre2 = await responseNombre2.json();
	ponerNombreOtrasAccion(dataNombre1,dataNombre2)
}
function ponerNombreOtrasAccion(data1,data2) {
	// Tomar los elementos
	nombreEmpresaComparada1Doc = document.getElementById('nombreEmpresaComparada1')
	nombreEmpresaComparada2Doc = document.getElementById('nombreEmpresaComparada2')
	// Agregar valor
	nombreEmpresaComparada1Doc.textContent = data1['name']
	nombreEmpresaComparada2Doc.textContent = data2['name']
}
// Trabajar Data
async function trabajarDataOtrasAcciones(urlMultiplos1,urlMultiplos2) {
	// Storing response
	responseMultiplos1 = await fetch(urlMultiplos1);
	responseMultiplos2 = await fetch(urlMultiplos2);

	// Storing data in form of JSON
	dataMultiplos1 = await responseMultiplos1.json();
	dataMultiplos2 = await responseMultiplos2.json();
	
	trabajarDataOtrasAccion(dataMultiplos1,dataMultiplos2)
}
function trabajarDataOtrasAccion(data1,data2) {
	// Tomar elementos de data
	// Data1
	pe1 = data1['metric']['peTTM']
	ps1 = data1['metric']['psTTM']
	pb1 = data1['metric']['pbQuarterly']
	evFCF1 = data1['metric']['currentEv/freeCashFlowTTM'] 
	// Data2
	pe2 = data2['metric']['peTTM']
	ps2 = data2['metric']['psTTM']
	pb2 = data2['metric']['pbQuarterly']
	evFCF2 = data2['metric']['currentEv/freeCashFlowTTM'] 
	// Tomar elementos de docs
	// Data1
	pe1Doc = document.getElementById('PER1')
	ps1Doc = document.getElementById('PS1')
	pb1Doc = document.getElementById('PB1')
	evFCF1Doc = document.getElementById('EV/FCF1')
	// Data2
	pe2Doc = document.getElementById('PER2')
	ps2Doc = document.getElementById('PS2')
	pb2Doc = document.getElementById('PB2')
	evFCF2Doc = document.getElementById('EV/FCF2')
	// Rellenar Elementos
	// Data1
	pe1Doc.textContent = multiplicador(pe1)
	ps1Doc.textContent = multiplicador(ps1)
	pb1Doc.textContent = multiplicador(pb1)
	evFCF1Doc.textContent = multiplicador(evFCF1)
	// Data2
	pe2Doc.textContent = multiplicador(pe2)
	ps2Doc.textContent = multiplicador(ps2)
	pb2Doc.textContent = multiplicador(pb2)
	evFCF2Doc.textContent = multiplicador(evFCF2)
	// Tomar Ratio de accion principal
	ratiosArray = ratiosArray
	pePrincipal = ratiosArray[0]
	psPrincipal = ratiosArray[1]
	pbPrincipal = ratiosArray[2]
	evFcfPrincipal = ratiosArray[3]
	// Tomar precio de accion
	precioAccion.then((precioAccion) => {
		// Calular precios estimados
		// Data 1
		precioEstimadoPe1 = (precioAccion * pe1)/pePrincipal
		precioEstimadoPs1 = (precioAccion * ps1)/psPrincipal
		precioEstimadoPb1 = (precioAccion * pb1)/pbPrincipal
		precioEstimadoEvFcfc1 = (precioAccion * evFCF1)/evFcfPrincipal
		avragePrecioEstimado1 = calculateAverage([precioEstimadoPe1,precioEstimadoPs1,precioEstimadoPb1,precioEstimadoEvFcfc1])
		// Data 2
		precioEstimadoPe2 = (precioAccion * pe2)/pePrincipal
		precioEstimadoPs2 = (precioAccion * ps2)/psPrincipal
		precioEstimadoPb2 = (precioAccion * pb2)/pbPrincipal
		precioEstimadoEvFcfc2 = (precioAccion * evFCF2)/evFcfPrincipal
		avragePrecioEstimado2 = calculateAverage([precioEstimadoPe2,precioEstimadoPs2,precioEstimadoPb2,precioEstimadoEvFcfc2])
		// Promedio estmated price
		intrinsicValue = (avragePrecioEstimado1 + avragePrecioEstimado2)/2
		// Tomar elementos en doc 
		// Data 1
		precioEstimadoPe1Doc = document.getElementById('PERSuposedPrice1')
		precioEstimadoPs1Doc = document.getElementById('PSSuposedPrice1')
		precioEstimadoPb1Doc = document.getElementById('PBSuposedPrice1')
		precioEstimadoEvFcfc1Doc = document.getElementById('EV/FCFSuposedPrice1')
		// Data 2
		precioEstimadoPe2Doc = document.getElementById('PERSuposedPrice2')
		precioEstimadoPs2Doc = document.getElementById('PSSuposedPrice2')
		precioEstimadoPb2Doc = document.getElementById('PBSuposedPrice2')
		precioEstimadoEvFcfc2Doc = document.getElementById('EV/FCFSuposedPrice2')
		// Rellenar elementos
		// Data 1
		precioEstimadoPe1Doc.textContent = arondir(precioEstimadoPe1)
		precioEstimadoPs1Doc.textContent = arondir(precioEstimadoPs1)
		precioEstimadoPb1Doc.textContent = arondir(precioEstimadoPb1)
		precioEstimadoEvFcfc1Doc.textContent = arondir(precioEstimadoEvFcfc1)
		// Data 2
		precioEstimadoPe2Doc.textContent = arondir(precioEstimadoPe2)
		precioEstimadoPs2Doc.textContent = arondir(precioEstimadoPs2)
		precioEstimadoPb2Doc.textContent = arondir(precioEstimadoPb2)
		precioEstimadoEvFcfc2Doc.textContent = arondir(precioEstimadoEvFcfc2)
		// Poner color a elementos rojo si estimacion inferior a precio o verde s superior
		// Data 1
		colorSuperiorInferior('PERSuposedPrice1',precioEstimadoPe1,precioAccion)
		colorSuperiorInferior('PSSuposedPrice1',precioEstimadoPs1,precioAccion)
		colorSuperiorInferior('PBSuposedPrice1',precioEstimadoPb1,precioAccion)
		colorSuperiorInferior('EV/FCFSuposedPrice1',precioEstimadoEvFcfc1,precioAccion)
		// Data 2
		colorSuperiorInferior('PERSuposedPrice2',precioEstimadoPe2,precioAccion)
		colorSuperiorInferior('PSSuposedPrice2',precioEstimadoPs2,precioAccion)
		colorSuperiorInferior('PBSuposedPrice2',precioEstimadoPb2,precioAccion)
		colorSuperiorInferior('EV/FCFSuposedPrice2',precioEstimadoEvFcfc2,precioAccion)
		//Poner Valor promedio de promedios arriba en intrinsic value
		precioInfoRefresh(
			'https://eodhistoricaldata.com/api/real-time/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&fmt=json',intrinsicValue
		);
	})
}
// Ejecutar function de primer ticker en un promise para obtener el ticker
arrayTicketsParecidos.then((result) => {
	// Tomar tickers comparables
	primerTicker = result[0]
	segundoTicker = result[1]
	// Crear URL de tickers
	// Url de nombre de empresa
	urlNombreEmpres1 = 'https://finnhub.io/api/v1/stock/profile2?symbol='+primerTicker+'&token=c32njgiad3ieculvq2ng'
	urlNombreEmpres2 = 'https://finnhub.io/api/v1/stock/profile2?symbol='+segundoTicker+'&token=c32njgiad3ieculvq2ng'
	// Url de data de empresa
	function analizarMultiplos() {
		urlDataEmpresa1 = 'https://finnhub.io/api/v1/stock/metric?symbol='+primerTicker+'&metric=all&token=c32njgiad3ieculvq2ng'
		urlDataEmpresa2 = 'https://finnhub.io/api/v1/stock/metric?symbol='+segundoTicker+'&metric=all&token=c32njgiad3ieculvq2ng'
		ponerNombreOtrasAcciones(urlNombreEmpres1,urlNombreEmpres2)
		trabajarDataOtrasAcciones(urlDataEmpresa1,urlDataEmpresa2)
	}
	// Ejecitar la funcion a la apertura del citio
	analizarMultiplos()
	// Volver a ejecutar cada minuto para que se actualise el precio
	setInterval(analizarMultiplos, 60000);
})



// Ajustar a inputs
// Obtener todos los elementos de input en el documento
var inputs = document.querySelectorAll('input');

// Agregar un evento de cambio a cada input
inputs.forEach(function(input) {
  input.addEventListener('change', function() {
	// Tu código aquí
	console.log("El valor del input ha cambiado: " + input.value);
  });
});






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




// Functiones----------------------------------------------------------------------------------------------------
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