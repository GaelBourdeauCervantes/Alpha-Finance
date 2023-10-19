// Codigo para louder de incio
var loader = document.querySelector(".loader")

window.addEventListener("load", vanish);

function vanish() {
  loader.classList.add("disapear");
}





// Obtener la lupa de busqueda
const lupa = document.getElementById('lupaBuscar');


// Function para agregar classe positivo negativo a cambio segun dos valores
function agregarPositivoNegativoDos(idElemento) {
	let elemento = document.getElementById(idElemento)
	let contenido = elemento.innerText
	let cambio = contenido.split(' ')
	if (parseFloat(cambio[0]) >= 0) {
		elemento.classList.add('positivo')
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo')
		}
	} else {
		elemento.classList.add('negativo')
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo')
		}
	}
}

// Function para agregar clase positivo negativo segun un valor
function agregarPositivoNegativoUno(idElemento) {
	let elemento = document.getElementById(idElemento)
	let contenido = elemento.innerText.replace("(", "").replace(")", "").replace("%", "")
	if (parseFloat(contenido) > 0) {
		elemento.classList.add('positivo')
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo')
		}
	} else if(parseFloat(contenido) < 0) {
		elemento.classList.add('negativo')
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo')
		}
	} else {
		elemento.classList.add('neutro')
		if (elemento.classList.contains('negativo')) {
			elemento.classList.remove('negativo')
		}
		if (elemento.classList.contains('positivo')) {
			elemento.classList.remove('positivo')
		}
	}
}

// Finction para agregar texto a elemento
function agregarTexto(idElemento,texto) {
	document.getElementById(idElemento).innerText = texto
}

// Function para around a dos numero despues
function around2(num) {
	let resultado = Math.round((num + Number.EPSILON) * 100) / 100
	return resultado
}


// Function para agregar  cambio nominal/porcentual
function cambioNomialPorcentual(principio,ultimo) {
	cambioNominal = around2(ultimo-principio);
	cambioPorcentual = around2((ultimo/principio-1)*100);
	let resultado = `${cambioNominal} (${cambioPorcentual}%)`
	return resultado
}



// Obtener el modo actual
if (localStorage.getItem('dark-mode') === 'true') {
	// Resto de colores para widget circular
	restoColor = 'rgb(40,40,40)'
	bordeColor = 'rgb(49,49,49)'
	// Imagen de lupa busqueda
	lupa.src = 'imagenes/buscarcirculonegro.png';
	// Cambiar background del body a negro
	document.body.style.backgroundColor = '#222020';
} else {
	// Resto de colores para widget circular
	restoColor = 'rgb(240,240,240)'
	bordeColor = 'rgb(255,255,255)'
	// Imagen de lupa busqueda
	lupa.src = 'imagenes/buscarcirculo.png';
	// Cambiar background del body a blanco
	document.body.style.backgroundColor = 'rgb(255,255,255)';
}



// Graficas-----------------------------------------------------------


// Function para agregar info al indice
function agregarDataGrafica(grafica,data,ultimoPunto,tamañoPunto,idContexto,alturaContexto,ultimoValor,bucle) {
	// Ver si es una grafica de dos colores o uno 
	if(grafica.data.datasets.length == 3) {
		// Agregar Nuevo Valor a Data
		data.push(ultimoValor);

		// Separar Data
		valorNegativo = [];
		valorPositivo = [];
		for (i = 0; i < data.length; i++) {
			if (data[i] < data[0]) {
				valorNegativo.push(data[i]);
				valorPositivo.push(NaN);
			} else {
				valorNegativo.push(NaN);
				valorPositivo.push(data[i]);
			}
		}

		// Juntar Arrays separados
		// Funcion para Juntar Arrays Principio con Final para Graficas de Indices
		function juntarArray(Array1, Array2) {
			for (i = 1; i <= Array1.length; i++) {
				if (isNaN(Array1[i]) && isNaN(Array1[i - 1]) == false) {
					var ultimoValorIndice = Array1[i - 1];
				} else if (isNaN(Array2[i]) && isNaN(Array2[i - 1]) == false) {
					var ultimoValorIndice = Array2[i - 1];
				}

				if (isNaN(Array1[i - 1]) && isNaN(Array1[i]) == false) {
					Array1[i - 1] = ultimoValorIndice;
				} else if (isNaN(Array2[i - 1]) && isNaN(Array2[i]) == false) {
					Array2[i - 1] = ultimoValorIndice;
				}
			}
		}
		juntarArray(valorPositivo, valorNegativo);

		// Quitar valores anteriores de ultimo Punto
		for (i = 0; i < data.length; i++) {
			ultimoPunto[i - 1] = 0;
		}

		// Agregar ultimo Valor
		ultimoPunto.push(tamañoPunto);

		// Agregar data a la grafica
		grafica.config.data.datasets[0].data = valorPositivo;
		grafica.config.data.datasets[1].data = valorNegativo;
		grafica.config.data.datasets[0].pointRadius = ultimoPunto;
		grafica.config.data.datasets[1].pointRadius = ultimoPunto;


		// Crear gradiantes para positivo/negativo segun el fondo

		// Obtener color de fondo
		fondo = document.body.style.backgroundColor
		if (fondo == '') {
			fondo = 'rgb(255,255,255)'
		} 
		// Hacer Difuminado positivo
		contexto = document.getElementById(idContexto).getContext('2d');
		gradientPositivo = contexto.createLinearGradient(0, 0, 0, alturaContexto);
		gradientPositivo.addColorStop(0, 'rgb(52 168 83)');
		gradientPositivo.addColorStop(1, fondo);
		// Hacer Difuminado Negativo
		gradientNegativo = contexto.createLinearGradient(0, 0, 0, alturaContexto);
		gradientNegativo.addColorStop(0, 'rgb(234 67 53)');
		gradientNegativo.addColorStop(1, fondo);

		// Agregar gradiantes a la grafica
		grafica.config.data.datasets[0].backgroundColor = gradientPositivo;
		grafica.config.data.datasets[1].backgroundColor = gradientNegativo;
		grafica.update();

		// Parar de agregar si llega a mas de 390 puntos
		if (data.length >= 390) {
			clearInterval(bucle);
		}
	} 
	// Si no es de dos colores
	else {
		// Agregar Valor a data
		data.push(ultimoValor);

		// Quitar valores anteriores de ultimo Punto
		for (i = 0; i < data.length; i++) {
			ultimoPunto[i - 1] = 0;
		}

		// Agregar ultimo Valor
		ultimoPunto.push(tamañoPunto);

		// Agregar data a la grafica
		grafica.config.data.datasets[1].data = data;
		grafica.config.data.datasets[1].pointRadius = ultimoPunto;

		// Que colores usar segun positivo y negativo y segun el fondo
		contexto = document.getElementById(idContexto).getContext('2d');

		// Obtener color de fondo
		fondo = document.body.style.backgroundColor
		if (fondo == '') {
			fondo = 'rgb(255,255,255)'
		} 

		if (data[0] < data[data.length - 1]) {
			colorIndice = 'rgb(52 168 83)';
			gradiente = contexto.createLinearGradient(0, 0, 0, alturaContexto);
			gradiente.addColorStop(0, 'rgb(52 168 83)');
			gradiente.addColorStop(1, fondo);
		} else {
			colorIndice = 'rgb(234 67 53)';
			gradiente = contexto.createLinearGradient(0, 0, 0, alturaContexto);
			gradiente.addColorStop(0, 'rgb(234 67 53)');
			gradiente.addColorStop(1, fondo);
		}

		// Poner los colores
		grafica.config.data.datasets[1].pointBorderColor = colorIndice;
		grafica.config.data.datasets[1].pointBackgroundColor = colorIndice;
		grafica.config.data.datasets[1].borderColor = colorIndice;
		grafica.config.data.datasets[1].backgroundColor = gradiente;
		grafica.update();
		if (data.length >= 390) {
			clearInterval(bucle);
		}
	}
}




// Function para hacer grafica de indices
function hacerGraficaIndice(tipoDeGrafica, idContexto, apertura, numeroDePuntos, anchoLinea) {
	contexto = document.getElementById(idContexto).getContext('2d');
	if (tipoDeGrafica == 'graficaDual') {
		let lineaApertura = [];
		let labels = [];
		// Hacer Linea de apertura y labels
		for (i = 0; i <= numeroDePuntos; i++) {
			lineaApertura.push(apertura);
			labels.push(i);
		}

		ctx = new Chart(contexto, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						data: apertura,
						pointRadius: 5,
						pointBackgroundColor: 'rgb(52,168,83)',
						pointBorderColor: 'rgb(52,168,83)',
						borderColor: 'rgb(52 168 83)',
						tension: 0.5,
						fill: '+2',
						backgroundColor: 'rgb(100,100,100)',
						borderWidth: anchoLinea
					},
					{
						data: apertura,
						pointRadius: 5,
						pointBackgroundColor: 'rgb(234 67 53)',
						pointBorderColor: 'rgb(234 67 53)',
						borderColor: 'rgb(234 67 53)',
						tension: 0.5,
						fill: '+1',
						backgroundColor: 'rgb(100,100,100)',
						borderWidth: anchoLinea
					},
					{
						data: lineaApertura,
						pointRadius: 0,
						borderColor: 'rgb(100,100,100)',
						borderDash: [5, 10],
						borderWidth: anchoLinea
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: false,
					},
					tooltip: {
						enabled: false,
					},
				},
				scales: {
					x: {
						display: false,
					},
					yAxes: {
						display: false,
						grace: '20%',
					},
				},
				animation: {
					duration: 0,
				},
			},
		});
		return ctx;
	} else if (tipoDeGrafica == 'graficaUnica') {
		let lineaApertura = [];
		let labels = [];
		// Hacer Linea de apertura y labels
		for (i = 0; i <= numeroDePuntos; i++) {
			lineaApertura.push(apertura);
			labels.push(i);
		}

		ctx = new Chart(contexto, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						data: lineaApertura,
						pointRadius: 0,
						borderColor: 'rgb(100,100,100)',
						borderDash: [5, 10],
						borderWidth: anchoLinea
					},
					{
						data: apertura,
						pointRadius: 5,
						pointBorderColor: 'rgb(100,100,100)',
						pointBackgroundColor: 'rgb(100,100,100)',
						borderColor: 'rgb(100,100,100)',
						tension: 0.5,
						fill: true,
						backgroundColor: 'rgb(100,100,100)',
						borderWidth: anchoLinea
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: false,
					},
					tooltip: {
						enabled: false,
					},
				},
				scales: {
					x: {
						display: false,
					},
					yAxes: {
						display: false,
						grace: '20%',
					},
				},
				animation: {
					duration: 0,
				},
			},
		});
		return ctx;
	}
}

// Creando data random para indices

dataIndice1 = []
dataIndice2 = []
dataIndice3 = []
dataIndice4 = []
dataIndice5 = []
dataIndice6 = []
dataIndice7 = []

ultimoPunto1 = []
ultimoPunto2 = []
ultimoPunto3 = []
ultimoPunto4 = []
ultimoPunto5 = []
ultimoPunto6 = []
ultimoPunto7 = []

apertura1 = 150
apertura2 = 120
apertura3 = 130
apertura4 = 105
apertura5 = 110
apertura6 = 109
apertura7 = 130

ultimoValorIndice1 = apertura1
ultimoValorIndice2 = apertura2
ultimoValorIndice3 = apertura3
ultimoValorIndice4 = apertura4
ultimoValorIndice5 = apertura5
ultimoValorIndice6 = apertura6
ultimoValorIndice7 = apertura7

// Creando graficas de indeces 
graficaIndcie1 = hacerGraficaIndice('graficaDual','graficaIndice1',apertura1,390,1.5)
graficaIndcie2 = hacerGraficaIndice('graficaDual','graficaIndice2',apertura2,390,1.5)
graficaIndcie3 = hacerGraficaIndice('graficaDual','graficaIndice3',apertura3,390,1.5)
graficaIndcie4 = hacerGraficaIndice('graficaDual','graficaIndice4',apertura4,390,1.5)
graficaIndcie5 = hacerGraficaIndice('graficaDual','graficaIndice5',apertura5,390,1.5)
graficaIndcie6 = hacerGraficaIndice('graficaDual','graficaIndice6',apertura6,390,1.5)
graficaIndcie7 = hacerGraficaIndice('graficaDual','graficaIndice7',apertura7,390,1.5)
graficaIndcie8 = hacerGraficaIndice('graficaDual','graficaIndice8',apertura1,390,1.5)
graficaIndcie9 = hacerGraficaIndice('graficaDual','graficaIndice9',apertura2,390,1.5)
graficaIndcie10 = hacerGraficaIndice('graficaDual','graficaIndice10',apertura3,390,1.5)
graficaIndcie11 = hacerGraficaIndice('graficaDual','graficaIndice11',apertura4,390,1.5)
graficaIndcie12 = hacerGraficaIndice('graficaDual','graficaIndice12',apertura5,390,1.5)
graficaIndcie13 = hacerGraficaIndice('graficaDual','graficaIndice13',apertura6,390,1.5)
graficaIndcie14 = hacerGraficaIndice('graficaDual','graficaIndice14',apertura7,390,1.5)



// Refresh Info de Indices
var refreshIndices = setInterval(function() { 
		// Crear nuvos valores
		ultimoValorIndice1 = around2(ultimoValorIndice1 += 5 - Math.random() * 10)
		ultimoValorIndice2 = around2(ultimoValorIndice2 += 5 - Math.random() * 10)
		ultimoValorIndice3 = around2(ultimoValorIndice3 += 5 - Math.random() * 10)
		ultimoValorIndice4 = around2(ultimoValorIndice4 += 5 - Math.random() * 10)
		ultimoValorIndice5 = around2(ultimoValorIndice5 += 5 - Math.random() * 10)
		ultimoValorIndice6 = around2(ultimoValorIndice6 += 5 - Math.random() * 10)
		ultimoValorIndice7 = around2(ultimoValorIndice7 += 5 - Math.random() * 10)

		// Agregar Nuevos Valores a grafica
		agregarDataGrafica(graficaIndcie1,dataIndice1,ultimoPunto1,2.5,'graficaIndice1',55,ultimoValorIndice1,refreshIndices);
		agregarDataGrafica(graficaIndcie2,dataIndice2,ultimoPunto2,2.5,'graficaIndice2',55,ultimoValorIndice2,refreshIndices);
		agregarDataGrafica(graficaIndcie3,dataIndice3,ultimoPunto3,2.5,'graficaIndice3',55,ultimoValorIndice3,refreshIndices);
		agregarDataGrafica(graficaIndcie4,dataIndice4,ultimoPunto4,2.5,'graficaIndice4',55,ultimoValorIndice4,refreshIndices);
		agregarDataGrafica(graficaIndcie5,dataIndice5,ultimoPunto5,2.5,'graficaIndice5',55,ultimoValorIndice5,refreshIndices);
		agregarDataGrafica(graficaIndcie6,dataIndice6,ultimoPunto6,2.5,'graficaIndice6',55,ultimoValorIndice6,refreshIndices);
		agregarDataGrafica(graficaIndcie7,dataIndice7,ultimoPunto7,2.5,'graficaIndice7',55,ultimoValorIndice7,refreshIndices);
		agregarDataGrafica(graficaIndcie8,dataIndice1,ultimoPunto1,2.5,'graficaIndice8',55,ultimoValorIndice1,refreshIndices);
		agregarDataGrafica(graficaIndcie9,dataIndice2,ultimoPunto2,2.5,'graficaIndice9',55,ultimoValorIndice2,refreshIndices);
		agregarDataGrafica(graficaIndcie10,dataIndice3,ultimoPunto3,2.5,'graficaIndice10',55,ultimoValorIndice3,refreshIndices);
		agregarDataGrafica(graficaIndcie11,dataIndice4,ultimoPunto4,2.5,'graficaIndice11',55,ultimoValorIndice4,refreshIndices);
		agregarDataGrafica(graficaIndcie12,dataIndice5,ultimoPunto5,2.5,'graficaIndice12',55,ultimoValorIndice5,refreshIndices);
		agregarDataGrafica(graficaIndcie13,dataIndice6,ultimoPunto6,2.5,'graficaIndice13',55,ultimoValorIndice6,refreshIndices);
		agregarDataGrafica(graficaIndcie14,dataIndice7,ultimoPunto7,2.5,'graficaIndice14',55,ultimoValorIndice7,refreshIndices);

		// Agregar valores a info en el sitio

		// Agregar Ultimo valor
		agregarTexto('valorIndice1',ultimoValorIndice1);
		agregarTexto('valorIndice2',ultimoValorIndice2);
		agregarTexto('valorIndice3',ultimoValorIndice3);
		agregarTexto('valorIndice4',ultimoValorIndice4);
		agregarTexto('valorIndice5',ultimoValorIndice5);
		agregarTexto('valorIndice6',ultimoValorIndice6);
		agregarTexto('valorIndice7',ultimoValorIndice7);
		agregarTexto('valorIndice8',ultimoValorIndice1);
		agregarTexto('valorIndice9',ultimoValorIndice2);
		agregarTexto('valorIndice10',ultimoValorIndice3);
		agregarTexto('valorIndice11',ultimoValorIndice4);
		agregarTexto('valorIndice12',ultimoValorIndice5);
		agregarTexto('valorIndice13',ultimoValorIndice6);
		agregarTexto('valorIndice14',ultimoValorIndice7);
	
		// Agregar Ultimo cambio
		agregarTexto('cambioIndice1',cambioNomialPorcentual(apertura1,ultimoValorIndice1));
		agregarTexto('cambioIndice2',cambioNomialPorcentual(apertura2,ultimoValorIndice2));
		agregarTexto('cambioIndice3',cambioNomialPorcentual(apertura3,ultimoValorIndice3));
		agregarTexto('cambioIndice4',cambioNomialPorcentual(apertura4,ultimoValorIndice4));
		agregarTexto('cambioIndice5',cambioNomialPorcentual(apertura5,ultimoValorIndice5));
		agregarTexto('cambioIndice6',cambioNomialPorcentual(apertura6,ultimoValorIndice6));
		agregarTexto('cambioIndice7',cambioNomialPorcentual(apertura7,ultimoValorIndice7));
		agregarTexto('cambioIndice8',cambioNomialPorcentual(apertura1,ultimoValorIndice1));
		agregarTexto('cambioIndice9',cambioNomialPorcentual(apertura2,ultimoValorIndice2));
		agregarTexto('cambioIndice10',cambioNomialPorcentual(apertura3,ultimoValorIndice3));
		agregarTexto('cambioIndice11',cambioNomialPorcentual(apertura4,ultimoValorIndice4));
		agregarTexto('cambioIndice12',cambioNomialPorcentual(apertura5,ultimoValorIndice5));
		agregarTexto('cambioIndice13',cambioNomialPorcentual(apertura6,ultimoValorIndice6));
		agregarTexto('cambioIndice14',cambioNomialPorcentual(apertura7,ultimoValorIndice7));

		// Agregar Clases positivo negativo a objetos
		for(i=1; i<=14; i++) {
			agregarPositivoNegativoDos(`cambioIndice${i}`)
		}

	}, 

1000);


// Funcion para hacer la grafica circular de widget
function hcaerIndicador(idGrafica, idPuntuacion, puntuacion) {
	// funciones para colores

	function colorPuntuacion(puntuacion) {
		if (puntuacion <= 10) {
			return 'rgb(230, 30, 30)';
		} else if (puntuacion <= 30) {
			return 'rgb(244, 67, 54)';
		} else if (puntuacion <= 40) {
			return 'rgb(255, 152, 30)';
		} else if (puntuacion <= 50) {
			return 'rgb(255, 232, 26)';
		} else if (puntuacion < 60) {
			return 'rgb(221, 244, 16)';
		} else if (puntuacion < 70) {
			return 'rgb(100, 216, 104)';
		} else {
			return 'rgb(66, 179, 66)';
		}
	}

	// Insercion de puntuacion
	documentoPuntuacion = document.getElementById(idPuntuacion);
	documentoPuntuacion.innerHTML = `${puntuacion}%`;

	// Insercion de grafica
	ctx = document.getElementById(idGrafica).getContext('2d');

	let delayed;
	grafica = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['er', 'err'],
			datasets: [
				{
					data: [puntuacion, 100 - puntuacion],
					backgroundColor: [colorPuntuacion(puntuacion), restoColor],
					borderColor: bordeColor,
					hoverBackgroundColor: [colorPuntuacion(puntuacion), restoColor],
					hoverBorderColor: [colorPuntuacion(puntuacion), bordeColor],
					hoverBorderWidth: [2, 0],
					spacing: 0,
					borderRadius: [30, 0],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
				tooltip: {
					enabled: false,
				},
			},
			animation: {
				animationRotate: true,
				duration: 3000,
			},
			showTooltips: false,
			cutout: '75%',
		},
	});
	return grafica
}


// Creando las graficas circulares de los widgets
circuloDewidget1 = hcaerIndicador(`graficaPuntuacion1`, `puntuacion1`, Math.round(Math.random() * 100));
circuloDewidget2 = hcaerIndicador(`graficaPuntuacion2`, `puntuacion2`, Math.round(Math.random() * 100));
circuloDewidget3 = hcaerIndicador(`graficaPuntuacion3`, `puntuacion3`, Math.round(Math.random() * 100));
circuloDewidget4 = hcaerIndicador(`graficaPuntuacion4`, `puntuacion4`, Math.round(Math.random() * 100));
circuloDewidget5 = hcaerIndicador(`graficaPuntuacion5`, `puntuacion5`, Math.round(Math.random() * 100));
circuloDewidget6 = hcaerIndicador(`graficaPuntuacion6`, `puntuacion6`, Math.round(Math.random() * 100));
circuloDewidget7 = hcaerIndicador(`graficaPuntuacion7`, `puntuacion7`, Math.round(Math.random() * 100));
circuloDewidget8 = hcaerIndicador(`graficaPuntuacion8`, `puntuacion8`, Math.round(Math.random() * 100));



// Apertura de acciones

aperturaPrecioWidget1 = 150
aperturaPrecioWidget2 = 120
aperturaPrecioWidget3 = 130
aperturaPrecioWidget4 = 105
aperturaPrecioWidget5 = 110
aperturaPrecioWidget6 = 109
aperturaPrecioWidget7 = 130
aperturaPrecioWidget8 = 150

// Precio de acciones
ultimoValorPrecioWidget1 = aperturaPrecioWidget1
ultimoValorPrecioWidget2 = aperturaPrecioWidget2
ultimoValorPrecioWidget3 = aperturaPrecioWidget3
ultimoValorPrecioWidget4 = aperturaPrecioWidget4
ultimoValorPrecioWidget5 = aperturaPrecioWidget5
ultimoValorPrecioWidget6 = aperturaPrecioWidget6
ultimoValorPrecioWidget7 = aperturaPrecioWidget7
ultimoValorPrecioWidget8 = aperturaPrecioWidget8

// Refresh Info de Widgets
var refreshWidget = setInterval(function() { 
		// Crear nuvos valores
		ultimoValorPrecioWidget1 = around2(ultimoValorPrecioWidget1 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget2 = around2(ultimoValorPrecioWidget2 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget3 = around2(ultimoValorPrecioWidget3 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget4 = around2(ultimoValorPrecioWidget4 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget5 = around2(ultimoValorPrecioWidget5 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget6 = around2(ultimoValorPrecioWidget6 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget7 = around2(ultimoValorPrecioWidget7 += 5 - Math.random() * 10)
		ultimoValorPrecioWidget8 = around2(ultimoValorPrecioWidget8 += 5 - Math.random() * 10)

		// Agregar valores a info en el sitio

		// Simbolo de moneda
		simboloDiner = ' $'

		// Agregar Ultimo valor
		agregarTexto('widgetAccionPrecio1',`${ultimoValorPrecioWidget1}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio2',`${ultimoValorPrecioWidget2}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio3',`${ultimoValorPrecioWidget3}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio4',`${ultimoValorPrecioWidget4}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio5',`${ultimoValorPrecioWidget5}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio6',`${ultimoValorPrecioWidget6}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio7',`${ultimoValorPrecioWidget7}${simboloDiner}`);
		agregarTexto('widgetAccionPrecio8',`${ultimoValorPrecioWidget8}${simboloDiner}`);

		// Agregar Ultimo cambio nominal
		agregarTexto('cambioWidgetNominal1',cambioNomialPorcentual(aperturaPrecioWidget1,ultimoValorPrecioWidget1).split(' ')[0]);
		agregarTexto('cambioWidgetNominal2',cambioNomialPorcentual(aperturaPrecioWidget2,ultimoValorPrecioWidget2).split(' ')[0]);
		agregarTexto('cambioWidgetNominal3',cambioNomialPorcentual(aperturaPrecioWidget3,ultimoValorPrecioWidget3).split(' ')[0]);
		agregarTexto('cambioWidgetNominal4',cambioNomialPorcentual(aperturaPrecioWidget4,ultimoValorPrecioWidget4).split(' ')[0]);
		agregarTexto('cambioWidgetNominal5',cambioNomialPorcentual(aperturaPrecioWidget5,ultimoValorPrecioWidget5).split(' ')[0]);
		agregarTexto('cambioWidgetNominal6',cambioNomialPorcentual(aperturaPrecioWidget6,ultimoValorPrecioWidget6).split(' ')[0]);
		agregarTexto('cambioWidgetNominal7',cambioNomialPorcentual(aperturaPrecioWidget7,ultimoValorPrecioWidget7).split(' ')[0]);
		agregarTexto('cambioWidgetNominal8',cambioNomialPorcentual(aperturaPrecioWidget8,ultimoValorPrecioWidget8).split(' ')[0]);

		// Agregar Ultimo cambio porcentual
		agregarTexto('cambioWidgetPorcentual1',cambioNomialPorcentual(aperturaPrecioWidget1,ultimoValorPrecioWidget1).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual2',cambioNomialPorcentual(aperturaPrecioWidget2,ultimoValorPrecioWidget2).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual3',cambioNomialPorcentual(aperturaPrecioWidget3,ultimoValorPrecioWidget3).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual4',cambioNomialPorcentual(aperturaPrecioWidget4,ultimoValorPrecioWidget4).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual5',cambioNomialPorcentual(aperturaPrecioWidget5,ultimoValorPrecioWidget5).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual6',cambioNomialPorcentual(aperturaPrecioWidget6,ultimoValorPrecioWidget6).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual7',cambioNomialPorcentual(aperturaPrecioWidget7,ultimoValorPrecioWidget7).split(' ')[1]);
		agregarTexto('cambioWidgetPorcentual8',cambioNomialPorcentual(aperturaPrecioWidget8,ultimoValorPrecioWidget8).split(' ')[1]);

		// Agregar Clases positivo negativo a objetos
		for(i=1; i<=8; i++) {
			agregarPositivoNegativoUno(`cambioWidgetNominal${i}`)
			agregarPositivoNegativoUno(`cambioWidgetPorcentual${i}`)
		}
		
},
1000);


// Boton de dark-------------------------------------------------------------
const btnSwitch = document.querySelector('#switch');


// Condicion si el boton es apretado
btnSwitch.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	btnSwitch.classList.toggle('active');

	// Guardar el modo en local storage
	if (document.body.classList.contains('dark')) {
		localStorage.setItem('dark-mode', 'true');
		// Cambiar lupa de busqueda
		lupa.src = 'imagenes/buscarcirculonegro.png';
		// Cambiar background del body a negro
		document.body.style.backgroundColor = '#222020';
	} else {
		localStorage.setItem('dark-mode', 'false');
		// Cambiar lupa de busuqeda
		lupa.src = 'imagenes/buscarcirculo.png';
		// Cambiar background del body a negro
		document.body.style.backgroundColor = 'rgb(255,255,255)';
	}
});

// Obtener el modo actual
if (localStorage.getItem('dark-mode') === 'true') {
	document.body.classList.add('dark');
	btnSwitch.classList.add('active');
	// Cambiar background del body a negro
	document.body.style.backgroundColor = '#222020';
} else {
	document.body.classList.remove('dark');
	btnSwitch.classList.remove('active');
	// Cambiar background del body a blanco
	document.body.style.backgroundColor = 'rgb(255,255,255)';
}

btnSwitch.addEventListener('click', 
	// Cambiar Grafiaca
	function cambiarGrafica() {
		if (document.body.classList.contains('dark')) {
			circuloDewidget1.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget1.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget1.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget1.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget1.update();

			circuloDewidget2.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget2.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget2.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget2.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget2.update();

			circuloDewidget3.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget3.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget3.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget3.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget3.update();

			circuloDewidget4.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget4.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget4.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget4.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget4.update();

			circuloDewidget5.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget5.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget5.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget5.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget5.update();

			circuloDewidget6.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget6.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget6.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget6.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget6.update();

			circuloDewidget7.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget7.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget7.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget7.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget7.update();

			circuloDewidget8.config.data.datasets[0].borderColor = 'rgb(49,49,49)';
			circuloDewidget8.config.data.datasets[0].hoverBorderColor[1] = 'rgb(49,49,49)';
			circuloDewidget8.config.data.datasets[0].backgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget8.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(40,40,40)';
			circuloDewidget8.update();

		} else {
			circuloDewidget1.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget1.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget1.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget1.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget1.update();

			circuloDewidget2.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget2.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget2.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget2.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget2.update();

			circuloDewidget3.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget3.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget3.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget3.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget3.update();

			circuloDewidget4.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget4.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget4.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget4.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget4.update();

			circuloDewidget5.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget5.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget5.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget5.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget5.update();

			circuloDewidget6.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget6.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget6.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget6.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget6.update();

			circuloDewidget7.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget7.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget7.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget7.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget7.update();

			circuloDewidget8.config.data.datasets[0].borderColor = 'rgb(255,255,255)';
			circuloDewidget8.config.data.datasets[0].hoverBorderColor[1] = 'rgb(255,255,255)';
			circuloDewidget8.config.data.datasets[0].backgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget8.config.data.datasets[0].hoverBackgroundColor[1] = 'rgb(240,240,240)';
			circuloDewidget8.update();
		}
	}
)







// Codigo para barra de busqueda----------------------------------------------------------------------------------

// Array de opciones
var arrayAcciones = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];



// Function w3School
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
		// Contar cuantos elementos se crearon
		elementosCreadosBusqueda = 0
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			// Contar cuantos elementos se crearon
			elementosCreadosBusqueda = elementosCreadosBusqueda + 1
			// Maximo de elemntos posibles 7 si hay mas ya no se crean
			if (elementosCreadosBusqueda <= 7) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					// A donde dirigirse cuando se seleciona uno-------------------------------------------------------------------
					window.location.href = "Resultado Busqueda/busqueda.html"
					// Guardar valor en local storage-----------------------------------------------------------------------------
					localStorage.setItem('ticker', inp.value)
					// INdicar que esta el input no esta activo
					document.querySelector('.baraBusqueda').classList = 'baraBusqueda'
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
						closeAllLists();
				});
				a.appendChild(b);
			}
            }
        }
    });



    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
            }
        }
    });


    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }


    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }


    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

	// Si se presiona enter buscar lo que se alla puesto en el input
	inp.addEventListener("keyup", function(event) {
		if(inp.value != '') {
			if (event.keyCode === 13) {
				// A donde dirigirse cuando se seleciona uno----------------------------------------
				window.location.href = "Resultado Busqueda/busqueda.html"
				// Guardar valor en local storage---------------------------------------------------
				localStorage.setItem('ticker', inp.value)
			}
		}
	});
}

// Ejecutar Function W3school
autocomplete(document.getElementById("barraBusqueda"), arrayAcciones);







// Funcion para ver si el autocomplete esta desplegado
function autocompleteActivado() {
	let elemento = document.getElementById('barraBusquedaautocomplete-list')
	if(elemento != null && elemento.firstChild != null) {
		document.querySelector('.baraBusqueda').classList = 'baraBusqueda baraBusquedaactivada'
	} else {
		document.querySelector('.baraBusqueda').classList = 'baraBusqueda'
	}
}


// poner err en consola
console.log(
	`
	%c
	░░░░░░▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄▄
	░░░░░█░░░░░░░░░░░░░░░░░░▀▀▄
	░░░░█░░░░░░░░░░░░░░░░░░░░░░█
	░░░█░░░░░░▄██▀▄▄░░░░░▄▄▄░░░░█
	░▄▀░▄▄▄░░█▀▀▀▀▄▄█░░░██▄▄█░░░░█
	█░░█░▄░▀▄▄▄▀░░░░░░░░█░░░░░░░░░█
	█░░█░█▀▄▄░░░░░█▀░░░░▀▄░░▄▀▀▀▄░█
	░█░▀▄░█▄░█▀▄▄░▀░▀▀░▄▄▀░░░░█░░█
	░░█░░░▀▄▀█▄▄░█▀▀▀▄▄▄▄▀▀█▀██░█
	░░░█░░░░██░░▀█▄▄▄█▄▄█▄▄██▄░░█
	░░░░█░░░░▀▀▄░█░░░█░█▀█▀█▀██░█
	░░░░░▀▄░░░░░▀▀▄▄▄█▄█▄█▄█▄▀░░█
	░░░░░░░▀▄▄░░░░░░░░░░░░░░░░░░░█
	░░▐▌░█░░░░▀▀▄▄░░░░░░░░░░░░░░░█
	░░░█▐▌░░░░░░█░▀▄▄▄▄▄░░░░░░░░█
	░░███░░░░░▄▄█░▄▄░██▄▄▄▄▄▄▄▄▀
	░▐████░░▄▀█▀█▄▄▄▄▄█▀▄▀▄
	░░█░░▌░█░░░▀▄░█▀█░▄▀░░░█
	░░█░░▌░█░░█░░█░░░█░░█░░█
	░░█░░▀▀░░██░░█░░░█░░█░░█
	░░░▀▀▄▄▀▀░█░░░▀▄▀▀▀▀█░░█
	░░░░░░░░░░█░░░░▄░░▄██▄▄▀
	░░░░░░░░░░█░░░░▄░░████
	░░░░░░░░░░█▄░░▄▄▄░░▄█
	░░░░░░░░░░░█▀▀░▄░▀▀█
	░░░░░░░░░░░█░░░█░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█░░░▐░░░█
	░░░░░░░░░░░█▄▄▄▐▄▄▄█
	░░░░░░░▄▄▄▄▀▄▄▀█▀▄▄▀▄▄▄▄
	░░░░░▄▀▄░▄░▄░░░█░░░▄░▄░▄▀▄
	░░░░░█▄▄▄▄▄▄▄▄▄▀▄▄▄▄▄▄▄▄▄█
	`, 
	'color:green;'
)



