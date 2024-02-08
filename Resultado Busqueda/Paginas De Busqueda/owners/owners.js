// Tomar ticker symbol buscado
ticker = localStorage.getItem('ticker');

// Functiones
// Function para arondisar numero dos puntos decimales
function arondir(valor) {
	parseFloat(valor);
	return Math.round(valor * 100) / 100;
}
// Function para tranformar numeor en millones billones o trillones
function millonesBillonesTrillones(numero) {
	if(numero > 1000000000000) {
		numero = `${arondir(numero/1000000000000)}T`
	} else if(numero > 1000000000) {
		numero = `${arondir(numero/1000000000)}B`
	} else if(numero > 1000000) {
		numero = `${arondir(numero/1000000)}M`
	} else if(numero > 1000) {
		numero = `${arondir(numero/1000)}K`
	}
	return numero
}

// Function porcentaje
function porcentaje(valor) {
    return arondir(valor*100) + '%'
}
// Combinar cambio porcentual con nombre de empresa
function juntarArrayEndiccionario(array1,array2) {
	combinacion = {}
	for(i=0;i < array1.length; i++) {
		combinacion[array1[i]] = array2[i]
	}
	return combinacion
}
// Function unir arrays x y y para scatter graph
function combinarArrayParaScatterGraph(arrayX,arrayY,arrayR) {
	combination = []
	maxRadius = Math.max(...arrayR)
	for(i = 0; i<arrayX.length;i++) {
		er = {x:arrayX[i],y:arrayY[i],r:(arrayR[i]*10)/maxRadius}
		combination.push(er)
	}
	return combination
}

// Function hacer grafica redonda 
function hacerGraficaDona(idContexto,labels,data,colores,tootltipPorcentual) {
	ctx = document.getElementById(idContexto).getContext('2d');
	myChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					borderColor: colores,
					backgroundColor: colores,
					borderWidth: 1,
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
						top: 10,
						bottom: 10,
						left: 20,
						right: 20,
					},
					bodyColor: '#666666',
					bodyFont: {
						size: 17,
						family: 'Poppins',
						weight: 'bold',
					},
					borderWidth: 1,
					borderColor: '#cfcfcf',
					cornerRadius: 10,
					callbacks: {
						label: function(context) { 
							if(tootltipPorcentual) {
								porcentajeOwned = porcentaje(context['parsed']/100)
							} else {
								porcentajeOwned = context['formattedValue']
							}
							return context['label'] + ': ' + porcentajeOwned;
						}
					}
				}
			},
		},
	});
	return myChart
}
// Function hacer grafica en barras
function hacerGraficaBarras(idContexto,labels,data,colores) {
	ctx = document.getElementById(idContexto).getContext('2d');
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					borderColor: colores,
					backgroundColor: colores,
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
				},
			stacked: false,
			plugins: {
				legend: {
					display: false,
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
					titleAlign: 'center',
					bodyColor: '#666666',
					bodyFont: {
						size: 15,
						family: 'Poppins',
						weight: 'normal',
					},
					borderWidth: 1,
					borderColor: '#cfcfcf',
					cornerRadius: 10,
					callbacks: {
						title: function(context) {
							nombreExecutive =  context[0]['label']
							return nombreExecutive;
						},
						label: function(context) { 
							dataIndex = context['dataIndex']
							priceTransaction = priceTransactionArray[dataIndex]
							return '';
						},
						afterBody:  function(context) { 
							numeroDeAcciones = context[0]['parsed']['y']
							return 'Number of Shares: ' + millonesBillonesTrillones(numeroDeAcciones);
						}
					}
				},
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
					title: {
						display: true,
						text: 'Name of Insider',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 800,
						},
					}
				},
				y: {
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
					title: {
						display: true,
						text: 'Transaction amount in shares',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 800,
						},
					}
				},
			},
		},
	});
	return myChart
}

// Function hacer graphyca coordenadas
function hacerGraficaCambioPorcion(idContexto,dataX,dataY,dataRadius,color,arrayCambioNombre,arrayNombreownership) {
	ctx = document.getElementById(idContexto).getContext('2d');
	// Fucionar data
	data = combinarArrayParaScatterGraph(dataX,dataY,dataRadius)
	myChart = new Chart(ctx, {
		type: 'bubble',
		data: {
			datasets: [
				{
					data: data,
					radius: 5,
					hoverRadius: 10,
					backgroundColor: color
				}
			],
		},
		options: {
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
				},
			stacked: false,
			plugins: {
				legend: {
					display: false,
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
					titleAlign: 'center',
					bodyColor: '#666666',
					bodyFont: {
						size: 15,
						family: 'Poppins',
						weight: 'normal',
					},
					borderWidth: 1,
					borderColor: '#cfcfcf',
					cornerRadius: 10,
					callbacks: {
						title: function(context) {
							porcentajeCambio =  parseFloat(context[0]['parsed']['x'])
							nombre = arrayCambioNombre[porcentajeCambio]
							return nombre;
						},
						beforeBody: function(context) { 
							porcentajeOwned = porcentaje(arrayNombreownership[nombre]/100)
							nombre = arrayCambioNombre[porcentajeCambio]
							return 'Ownership: ' + porcentajeOwned;
						},
						label: function(context) { 
							porcentajePortfolio = porcentaje(context['parsed']['y']/100)
							nombre = arrayCambioNombre[porcentajeCambio]
							return 'Portion Portfolio: ' + porcentajePortfolio;
						},
						afterBody:  function(context) { 
							porcentajeCambio =  porcentaje(parseFloat(context[0]['parsed']['x'])/100)
							nombre = arrayCambioNombre[porcentajeCambio]
							return 'Change Portfolio: ' + porcentajeCambio;
						}
					}
				},
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
						display: true,
					},
					title: {
						display: true,
						text: 'Change in shares (%)',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 800,
						},
					}
				},
				y: {
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
					title: {
						display: true,
						text: 'Portion of portfolio (%)',
						font: {
							size: 15,
							family: 'Poppins',
							weight: 800,
						},
					}
				},
			},
		},
	});
	return myChart
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
	currencySymbol = general['CurrencySymbol']
	fullName = general['Name'];
	ticker = general['Code'];
	webUrl = general['WebURL'];
	logoURL = `https://eodhistoricaldata.com/${general['LogoURL']}`;
    // Boxes Summary 
    sharesStats = data['SharesStats']
    sharesOutstanding = sharesStats['SharesOutstanding']
    percentInstitutions = sharesStats['PercentInstitutions']
    percentInsiders = sharesStats['PercentInsiders']
    shortPercent = data['Technicals']['ShortPercent']

	// Insitution Holders
	tituloInstitutionHolders = 'Institutional Ownership on ' + fullName +'.'
	institutionHolders = data['Holders']['Institutions']
	// Sacar Arrays necesarios
	arrayNombresInstitutionHolders = []
	arrayPorecntajeDeTodasAccionesInstitutionHolders = []
	coloresInstitutionHolders = ['#00A568','#85D1B2','#C2C3C5','#5F6368']
	for(i = 0; i < Object.keys(institutionHolders).length; i++) {
		arrayNombresInstitutionHolders.push(institutionHolders[i]['name'])
		arrayPorecntajeDeTodasAccionesInstitutionHolders.push(institutionHolders[i]['totalShares'])
	}
	// Hacer Grafica
	graficaInstitutionHolders = hacerGraficaDona('graficaInstitutionsOwners',arrayNombresInstitutionHolders,arrayPorecntajeDeTodasAccionesInstitutionHolders,coloresInstitutionHolders,true)

	// Funds Holders
	tituloFundsHolders = 'Funds Ownership on ' + fullName +'.'
	fundsHolders = data['Holders']['Funds']
	// Sacar Arrays necesarios
	arrayNombresFundsHolders = []
	arrayPorecntajeDeTodasAccionesFundsHolders = []
	coloresFundsHolders = ['#FFD700','#20B2AA','#C0C0C0','#D2B48C']
	for(i = 0; i < Object.keys(fundsHolders).length; i++) {
		arrayNombresFundsHolders.push(fundsHolders[i]['name'])
		arrayPorecntajeDeTodasAccionesFundsHolders.push(fundsHolders[i]['totalShares'])
	}

	// Hacer Grafica
	graficaFindHolders = hacerGraficaDona('graficaFundsOwners',arrayNombresFundsHolders,arrayPorecntajeDeTodasAccionesFundsHolders,coloresFundsHolders,true)

	// Institution Portion vs change vs shares
	portionInPortfolioInstitution = []
	changeInPortfolioInstitution = []
	colorInstitution = []
	for(i = 0; i < Object.keys(institutionHolders).length; i++) {
		portionInPortfolioInstitution.push(institutionHolders[i]['totalAssets'])
		changeInPortfolioInstitution.push(institutionHolders[i]['change_p'])
		if(institutionHolders[i]['change_p'] < 0) {
			colorInstitution.push('red')
		} else if(institutionHolders[i]['change_p'] > 0) {
			colorInstitution.push('green')
		} else {
			colorInstitution.push('gray')
		}
	}
	// Combinar cmbio y nombre
	cambioConNombreInstitution = juntarArrayEndiccionario(changeInPortfolioInstitution,arrayNombresInstitutionHolders)
	// Combinar porcentaje owned y nombre
	nombreConOwnershipInstitution = juntarArrayEndiccionario(arrayNombresInstitutionHolders,arrayPorecntajeDeTodasAccionesInstitutionHolders)
	// Hacer grafica
	hacerGraficaCambioPorcion('graficaInstitutionsChanges',
							changeInPortfolioInstitution,
							portionInPortfolioInstitution,
							arrayPorecntajeDeTodasAccionesInstitutionHolders,
							colorInstitution,
							cambioConNombreInstitution,
							nombreConOwnershipInstitution)

	// Funds Portion vs change
	portionInPortfolioFunds = []
	changeInPortfolioFunds = []
	colorFunds = []
	for(i = 0; i < Object.keys(fundsHolders).length; i++) {
		portionInPortfolioFunds.push(fundsHolders[i]['totalAssets'])
		changeInPortfolioFunds.push(fundsHolders[i]['change_p'])
		if(fundsHolders[i]['change_p'] < 0) {
			colorFunds.push('red')
		} else if(fundsHolders[i]['change_p'] > 0) {
			colorFunds.push('green')
		} else {
			colorFunds.push('gray')
		}
	}
	// Combinar acmbio y nombre
	cambioConNombreFunds = juntarArrayEndiccionario(changeInPortfolioFunds,arrayNombresFundsHolders)
	// Combinar porcentaje owned y nombre
	nombreConOwnershipFunds = juntarArrayEndiccionario(arrayNombresFundsHolders,arrayPorecntajeDeTodasAccionesFundsHolders)
	// Hacer grafica
	hacerGraficaCambioPorcion('graficaFundsChanges',
	                          changeInPortfolioFunds,
							  portionInPortfolioFunds,
							  arrayPorecntajeDeTodasAccionesFundsHolders,
							  colorFunds,
							  cambioConNombreFunds,
							  nombreConOwnershipFunds)

	// Insider Transaction
	insiderTransaction = data['InsiderTransactions']
	numeroVentas = 0
	numeroCompras = 0
	ownerNameArray = []
	transactionDateArray = []
	transactionAmountArray = []
	priceTransactionArray = []
	priceTransactionBuy = 0
	priceTransactionSell = 0
	insiderTrasctionsTable = document.getElementById('insiderTrasctionsTable')
	for(i = 0; i < Object.keys(insiderTransaction).length; i++) {
		// Tomar elementos
		ownersName = insiderTransaction[i]['ownerName']
		date = insiderTransaction[i]['transactionDate']
		transactionType = insiderTransaction[i]['transactionCode']
		amount = insiderTransaction[i]['transactionAmount']
		postAmount = insiderTransaction[i]['postTransactionAmount']
		price = insiderTransaction[i]['transactionPrice']
		value = millonesBillonesTrillones(amount * price)
		secLink = insiderTransaction[i]['secLink']
		// Poner elemenstos en arrays
		if(transactionType == 'S') {
			numeroVentas = numeroVentas + 1
			priceTransactionSell = priceTransactionSell + price
			type = 'Sell'
		} else {
			numeroCompras = numeroCompras + 1
			priceTransactionBuy = priceTransactionBuy + price
			type = 'Buy'
		}
		if(postAmount == null) {
			postAmount = "N/A"
		} 
		ownerNameArray.push(ownersName)
		priceTransactionArray.push(price)
		transactionDateArray.push(date)
		transactionAmountArray.push(amount)

		// Craecion de tabla
		// Crear Elementos
        row = document.createElement("tr")
        nameTd  = document.createElement("td")
        dateTd  = document.createElement("td")
        typeTd  = document.createElement("td")
		amountTd  = document.createElement("td")
		posAmountTd  = document.createElement("td")
		priceTd  = document.createElement("td")
		valueTd  = document.createElement("td")
		secLinkTd  = document.createElement("td")
		link = document.createElement("a")
        // Crear nodos
        nameNode = document.createTextNode(ownersName)
        dateNode = document.createTextNode(date)
        typeNode = document.createTextNode(type)
		amountNode = document.createTextNode(amount)
		postAmountNode  = document.createTextNode(postAmount)
		priceNode  = document.createTextNode(price)
		valueNode  = document.createTextNode(value)
        // Agregar elemtos a padres
        nameTd.appendChild(nameNode)
		nameTd.style.textAlign = 'left'
		dateTd.appendChild(dateNode)
        typeTd.appendChild(typeNode)
		amountTd.appendChild(amountNode)
		posAmountTd.appendChild(postAmountNode)
		priceTd.appendChild(priceNode)
		valueTd.appendChild(valueNode)
		link.href = secLink
		link.innerHTML = 'SEC From 4'
		secLinkTd.appendChild(link)
		// Poner color a sell buy
		if(type == 'Sell') {
			typeTd.style.color = "#d93025";
		} else {
			typeTd.style.color = "#188038";
		}
		
		// Agregar td a row
		row.appendChild(nameTd)
        row.appendChild(dateTd)
        row.appendChild(typeTd)
		row.appendChild(amountTd)
		row.appendChild(posAmountTd)
		row.appendChild(priceTd)
		row.appendChild(valueTd)
		row.appendChild(secLinkTd)
		// Agregar row a tabla
        insiderTrasctionsTable.appendChild(row)
	}


	// Calcular avrage price sell
	if(priceTransactionSell == 0) {
		avragePriceSell = '-'
	} else {
		avragePriceSell = arondir(priceTransactionSell/numeroVentas) + currencySymbol
	}
	// Calcular avrage price buy
	if(priceTransactionBuy == 0) {
		avragePriceBuy = '-'
	} else {
		avragePriceBuy = arondir(priceTransactionBuy/numeroCompras) + currencySymbol
	}
	
	// Hacer grafica dona ventas vs compras
	hacerGraficaDona('graficaInsiderTransactionVentaVsCompra',['Buys','Sells'],[numeroCompras,numeroVentas],['green','red'],false)
	// Hacer grafica barras cambio en posicion
	// Ordenar arrays para juntar nombres y ordenar por orden creciente
	function combineArrays(names, amounts) {
		const result = [];
		
		// loop through the names array
		for (let i = 0; i < names.length; i++) {
			const name = names[i];
			const amount = amounts[i];
		
			// check if the name exists in the result array
			const index = result.findIndex(item => item.name === name);
		
			if (index === -1) {
			// if the name doesn't exist, add it to the result array
			result.push({ name, amount });
			} else {
			// if the name exists, add the amount to the existing object
			result[index].amount += amount;
			}
		}
		
		// sort the result array by amount in ascending order
		result.sort((a, b) => a.amount - b.amount);
		
		// separate the names and amounts into separate arrays
		const sortedNames = result.map(item => item.name);
		const sortedAmounts = result.map(item => item.amount);
		
		return [sortedNames, sortedAmounts];
	}
	[sortedNames, sortedAmounts] = combineArrays(ownerNameArray, transactionAmountArray);
	hacerGraficaBarras('graficaInsiderTransaction',sortedNames,sortedAmounts,'#D1512D',true)
	// Obtener elementos---------------------------------------------------------------------------------------
	// Identidad
	documentoLinEmpresa = document.getElementById('linkPaginaEmpresa')
	documentoLogoEmpresa = document.getElementById('logoEmpresa');
	documentoNombreEmpresa = document.getElementById('nombreEmpresa');
	documentoTickerEmpresa = document.getElementById('tickerEmpresa');
    // Boxes Summary 
    documentoSharesOutstanding = document.getElementById('sharesOutstandingValue')
    documentoSharesOutstandingExtra = document.getElementById('sharesOutstandingExtra')
    documentoPercentInstitutions = document.getElementById('institutionalOwnershipValue')
    documentoPercentInstitutionsExtra = document.getElementById('institutionalOwnershipExtra')
    documentoPercentInsiders = document.getElementById('insiderOwnershipValue')
    documentoPercentInsidersExtra = document.getElementById('insiderOwnershipExtra')
    documentoShortPercent = document.getElementById('shortPercentValue')
    documentoShortPercentExtra = document.getElementById('shortPercentExtra')
	// Institution Holders
	documentoTituloInstitutionsHolders = document.getElementById('tituloInstitutionsHolders')
	documentoTituloFundsHolders = document.getElementById('tituloFundsHolders')
	// Avrage buy sell
	documentoAvrageSellPrice = document.getElementById('avrageSellPrice')
	documentoAvrageBuyPrice = document.getElementById('avrageBuyPrice')

    // Rellenar elementos---------------------------------------------------------------------------------------
	// Identidad
	documentoLinEmpresa.href = webUrl
	documentoLogoEmpresa.src = logoURL;
	documentoNombreEmpresa.innerHTML = fullName;
	documentoTickerEmpresa.innerHTML = `(${ticker})`;
    // Boxes Summary 
    documentoSharesOutstanding.innerHTML = arondir(sharesOutstanding/1000000)
    documentoSharesOutstandingExtra.innerHTML = '(Mil)'
    documentoPercentInstitutions.innerHTML = porcentaje(percentInstitutions/100)
    documentoPercentInstitutionsExtra.innerHTML = `${arondir((sharesOutstanding * (percentInstitutions/100))/1000000)} (Mil)`
    documentoPercentInsiders.innerHTML = porcentaje(percentInsiders/100)
    documentoPercentInsidersExtra.innerHTML = `${arondir((sharesOutstanding * (percentInsiders/100))/1000000)} (Mil)`
    documentoShortPercent.innerHTML = porcentaje(shortPercent/100)
    documentoShortPercentExtra.innerHTML = `${arondir((sharesOutstanding * (shortPercent/100))/1000000)} (Mil)`
	// Institution Holders
	documentoTituloInstitutionsHolders.innerHTML = tituloInstitutionHolders
	documentoTituloFundsHolders.innerHTML = tituloFundsHolders
	// Avrage buy sell
	documentoAvrageSellPrice.innerHTML = avragePriceSell
	documentoAvrageBuyPrice.innerHTML = avragePriceBuy
}

trabajarDataGeneral('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX')

// Hacer que el menu de financials, news, etc... empieze desde la izquierda
function moverMenu() {
	var contenedorTablaMovil = document.querySelector('.paginas');
    console.log(contenedorTablaMovil)
    contenedorTablaMovil.scrollLeft = contenedorTablaMovil.scrollWidth;
}

// Esperar 1 segundos después de cargar la página
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(moverMenu, 1000); // 1000 milisegundos = 1 segundos
});
