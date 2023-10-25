// Function formatear fecha  yyy/mm/dd at hh:mm
function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    let hour = date.getHours();
    const amPM = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const minute = ('0' + date.getMinutes()).slice(-2);
    return `${year}/${month}/${day} at ${hour}:${minute} ${amPM}`;
}

// Function leer fecha Alpha Vantage
function leerFecha(dateTimeString) {
    const year = parseInt(dateTimeString.substring(0, 4));
    const month = parseInt(dateTimeString.substring(4, 6));
    const day = parseInt(dateTimeString.substring(6, 8));
    const hour = parseInt(dateTimeString.substring(9, 11));
    const minute = parseInt(dateTimeString.substring(11, 13));
    const date = new Date(year, month - 1, day, hour, minute);
    return formatDate(date);
}



// Ordenar array de tickers por sentimiento
function sortTickerSentimentByRelevance(tickerSentiment) {
    return tickerSentiment.sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 4)
      .map(({ticker, ticker_sentiment_label}) => ({ticker, ticker_sentiment_label}));
}

// Function crear y agregar elemento
function crearYAgregarElemento(elementoPadre,tipoDeElementoCreacion,textoDeElementoCreacion) {
    nuevoElemento = document.createElement(tipoDeElementoCreacion)
    textoNodo = document.createTextNode(textoDeElementoCreacion)
    nuevoElemento.appendChild(textoNodo)
    elementoPadre.appendChild(nuevoElemento)
}

function trabajarData(data) {
    feed = data['feed']
    contenedorFeed = document.getElementById('contenedorFeed')
    for (i=0;i<feed.length;i++) {
        feedSelecionado = feed[i]
        linkNoticia = feedSelecionado['url']
        fechaPublicada = leerFecha(feedSelecionado['time_published'])
        tituloNoticia = feedSelecionado['title']  
        summaryNoticia = feedSelecionado['summary']
        authores = feedSelecionado['authors']
        if(authores.length == 0) {
            autoresNoticia = ''
        } else {
            autoresNoticia = 'By: ' + authores
        }
        urlIMagen = feedSelecionado['banner_image']
        sourceNoticia = feedSelecionado['source']
        sourceDomain  = 'https://' + feedSelecionado['source_domain']
        textoSentimientoOverAll = feedSelecionado['overall_sentiment_label']
        
        // create parent container element
        const contenedorNoticia = document.createElement('a');
        contenedorNoticia.classList.add('contenedorNoticia');
        contenedorNoticia.href = linkNoticia
        contenedorNoticia.target = '_blank'
        // Poner color de noticia
        if(textoSentimientoOverAll == 'Neutral') {
            contenedorNoticia.style.backgroundColor = '#c8c8c8'
        } else if(textoSentimientoOverAll == 'Bullish') {
            contenedorNoticia.style.backgroundColor = '#acfaa0'
        } else if(textoSentimientoOverAll == 'Somewhat-Bullish') {
            contenedorNoticia.style.backgroundColor = '#cff9c9'
        } else if(textoSentimientoOverAll == 'Bearish') {
            contenedorNoticia.style.backgroundColor = '#fd6b6b'
        } else if(textoSentimientoOverAll == 'Somewhat-Bearish') {
            contenedorNoticia.style.backgroundColor = '#fdc1c1'
        }

        // create  hora elements
        const contenedorHora = document.createElement('div');
        contenedorHora.classList.add('contenedorHora');
        const hora = document.createElement('h5');
        hora.classList.add('hora');
        hora.textContent = fechaPublicada;
        contenedorHora.appendChild(hora);
        contenedorNoticia.appendChild(contenedorHora);

        // create title element
        const contenedorTitulo = document.createElement('div');
        contenedorTitulo.classList.add('contenedorTitulo');
        const titulo = document.createElement('b');
        titulo.classList.add('titulo');
        titulo.textContent = tituloNoticia;
        contenedorTitulo.appendChild(titulo);
        contenedorNoticia.appendChild(contenedorTitulo);

        // create summary element
        const contenedorSummary = document.createElement('div');
        contenedorSummary.classList.add('contenedorSummary');
        const summary = document.createElement('p');
        summary.classList.add('summary');
        summary.textContent = summaryNoticia;
        const autores = document.createElement('h5');
        autores.classList.add('autores');
        autores.textContent = autoresNoticia;
        contenedorSummary.appendChild(summary);
        contenedorSummary.appendChild(autores);
        contenedorNoticia.appendChild(contenedorSummary);

        // create image element
        const contenedorImagen = document.createElement('div');
        contenedorImagen.classList.add('contenedorImagen');
        const imagen = document.createElement('img');
        imagen.classList.add('imagen');
        imagen.src = urlIMagen;
        imagen.alt = '';
        contenedorImagen.appendChild(imagen);
        contenedorNoticia.appendChild(contenedorImagen);

        // create source element
        const contenedorSource = document.createElement('div');
        contenedorSource.classList.add('contenedorSource');
        const source = document.createElement('a');
        source.classList.add('source');
        source.href = sourceDomain;
        source.textContent = sourceNoticia;
        contenedorSource.appendChild(source);
        contenedorNoticia.appendChild(contenedorSource);

        
        // Agregar elementos a elementos padre-----------------------
        contenedorFeed.appendChild(contenedorNoticia)
    }
}


// Defining async function para data general
async function trabajarDataGeneral(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	let data = await response.json();
	trabajarData(data)
}



trabajarDataGeneral('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=IPEKTH6CFPNE7G3N')
