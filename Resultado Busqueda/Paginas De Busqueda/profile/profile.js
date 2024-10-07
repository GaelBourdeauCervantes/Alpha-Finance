// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');
// Token para API
apiToken = 'demo'
//'60c184d42ae3a5.75307084'

async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}

function trabajarData(data) {
    // Tomar data--------
    general = data['General']
    // logo
    logoURL = `https://eodhistoricaldata.com/${general['LogoURL']}`
    // Seccion al lado
    stockName = general['Name']
    code = general['Code']
    type = general['Type']
    exchange = general['Exchange']
    currencyCode = general['CurrencyCode']
    phone = general['Phone']
    webUrl = general['WebURL']
    // Seccion Abajo
    countryName = general['CountryName']
    sectro = general['Sector']
    industry = general['Industry']
    ipoDate = general['IPODate']
    fullTimeEmployees = general['FullTimeEmployees']
    // Descripcion
    description = general['Description']
    // Officers lugares de coticacion
    officers = general['Officers']
    listings = general['Listings']
    // Lugar
    adress = general['Address']
    addressData = general['AddressData']
    // Info up date
    updatedAt = general['UpdatedAt']

    // Tomar elementos------
    // Logo
    logoElemento = document.getElementById('logoEmpresa')
    // Seccion al lado
    stockNameElemento = document.getElementById('stockNameAlLado')
    codeElemento = document.getElementById('codeAlLado')
    typeElemento = document.getElementById('typeAllado')
    exchangeElemento = document.getElementById('exchangeAllado')
    currencyCodeElemento = document.getElementById('currencyCodeAllado')
    phoneElemento = document.getElementById('phoneAllado')
    webUrlElemento = document.getElementById('webUrlAllado')
    // Seccion Abajo
    countryNameElemento = document.getElementById('countryName')
    sectroElemento = document.getElementById('sector')
    industryElemento = document.getElementById('industry') 
    ipoDateElemento = document.getElementById('ipoDate') 
    fullTimeEmployeesElemento = document.getElementById('fullTimeEmployees')
    // Descripcion
    descriptionElemento = document.getElementById('textoDescripcion')
    // Officers lugares de coticacion
    officersElemento = document.getElementById('tabalOfficers')
    listingsElemento = document.getElementById('tablaCoticacion')

    // Rellenar elementos--------
    // Logo
    logoElemento.src = logoURL
    // Seccion al lado
    stockNameElemento.innerHTML = stockName
    codeElemento.innerHTML = code
    typeElemento.innerHTML = type
    exchangeElemento.innerHTML = exchange
    currencyCodeElemento.innerHTML = currencyCode
    phoneElemento.innerHTML = phone
    webUrlElemento.innerHTML = webUrl
    webUrlElemento.href = webUrl
    // Seccion Abajo
    countryNameElemento.innerHTML = countryName
    sectroElemento.innerHTML = sectro
    industryElemento.innerHTML = industry
    ipoDateElemento.innerHTML = ipoDate
    fullTimeEmployeesElemento.innerHTML = fullTimeEmployees
    // Descripcion
    descriptionElemento.innerHTML = description
    // Officers
    for(i=0;i<Object.keys(officers).length;i++) {
        // Crear Elementos
        row = document.createElement("tr")
        nameTd  = document.createElement("td")
        titleTd  = document.createElement("td")
        yearBornTd  = document.createElement("td")
        // Crear nodos
        nameNode = document.createTextNode(officers[i]['Name'])
        titleNode = document.createTextNode(officers[i]['Title'])
        yearBornNode = document.createTextNode(officers[i]['YearBorn'])
        // Agregar elemtos a padres
        nameTd.appendChild(nameNode)
        titleTd.appendChild(titleNode)
        yearBornTd.appendChild(yearBornNode)
        row.appendChild(nameTd)
        row.appendChild(titleTd)
        row.appendChild(yearBornTd)
        officersElemento.appendChild(row)
    }
    // Listings
    for(i=0;i<Object.keys(listings).length;i++) {
        // Crear Elementos
        row = document.createElement("tr")
        codeTd  = document.createElement("td")
        exchangeTd  = document.createElement("td")
        nameTd  = document.createElement("td")
        // Crear nodos
        codeNode = document.createTextNode(listings[i]['Code'])
        exchangeNode = document.createTextNode(listings[i]['Exchange'])
        nameNode = document.createTextNode(listings[i]['Name'])
        // Agregar elemtos a padres
        codeTd.appendChild(codeNode)
        exchangeTd.appendChild(exchangeNode)
        nameTd.appendChild(nameNode)
        row.appendChild(codeTd)
        row.appendChild(exchangeTd)
        row.appendChild(nameTd)
        listingsElemento.appendChild(row)
    }
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
			window.location.href = "../profile/profile.html"
		})
		a.setAttribute('href','../profile/profile.html')
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
		window.location.href = "../profile/profile.html"
        // Store the input value in local storage
        localStorage.setItem('ticker', valorMasCercano.match(/\((.*?)\)/)[1]);
    }
});

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'?api_token='+apiToken)
