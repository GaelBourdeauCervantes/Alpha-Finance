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

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')
