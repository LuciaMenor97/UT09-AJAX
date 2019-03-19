//Crea una ventana
function crearVentana(nombre) {
    var ventanaNueva = window.open("recursos.html", nombre, "toolbar=yes,scrollbars=yes,resizable=yes,top=230,left=850,width=640,height=670");
    ventanas.push(ventanaNueva);
}

var ventanas = [];

//Abre una nueva ventana
function abrirVentana() {
    var index = 0;
    var encontrada = false;
    //Si es la primera vez que se ejecuta la función crea directamente la ventana
    if (ventanas[0] == undefined) {
        crearVentana(this.value);
    } else {
        while ((index < ventanas.length) || encontrada) {
            if (ventanas[index] && !ventanas[index].closed && ventanas[index] == this.value) {
                //Si la ventana no está cerrada, está creada y ya tiene ese nombre
                encontrada = true;
            }
            index++;
        }

        if (encontrada) {
            ventanas[index].focus();
        } else {
            crearVentana(this.value);
        }
    }

}

//Cierra las ventanas abiertas
function cerrarVentanas() {
    for (let index = 0; index < ventanas.length; index++) {
        if (!ventanas[index].closed) {
            ventanas[index].close();
        }
    }
}

//Muestra los recursos relacionados con una producción en una nueva ventana
//Esta función se ejecuta al cargar la ventana
function showResource() {
    //Se recoge el título de la producción
    var tituloProduccion = document.getElementById("tituloprod");

    //Se recorre el array de ventanas 
    for (let index = 0; index < ventanas.length; index++) {
        //Si el título es igual a la ventana que haya en el array
        if (ventanas[index].name == tituloProduccion.textContent) {
            //Selecciona la zona de la ventana nueva
            var ventana = ventanas[index];
        }
    }

    var contenidoVentana = ventana.document.getElementById("contenidoZona");

    //Cambia el titulo de la ventana
    ventana.document.title = tituloProduccion.textContent;

    var encontrado = false;
    var producciones = video.productions;
    var produccion = producciones.next();
    while ((produccion.done !== true) && (!encontrado)) {

        if (produccion.value.title == tituloProduccion.textContent) {

            var tarjeta = document.createElement("div");
            tarjeta.setAttribute("class", "col-lg-12 col-md-12 mb-4");
            var borde = document.createElement("div");
            borde.setAttribute("class", "card h-100");
            borde.style.marginTop = "20%";
            var cuerpo = document.createElement("div");
            cuerpo.setAttribute("class", "card-body");
            cuerpo.style.backgroundColor = "#48C9B0";
            var tipo = document.createElement("h5");
            tipo.setAttribute("class", "mx-auto text-center");
            tipo.setAttribute("id", "actorDirector");
            tipo.appendChild(document.createTextNode("Actor"));
            var imagen = document.createElement("img");
            imagen.setAttribute("class", "card-img");
            imagen.setAttribute("width", "50");
            imagen.setAttribute("heigh", "50");

            imagen.setAttribute("src", "img/" + produccion.value.title + ".jpg");
            imagen.setAttribute("alt", produccion.value.title);

            var tituloProdu = ventana.document.getElementById("tituloZona");
            tituloProdu.setAttribute("class", "mx-auto text-center");
            tituloProdu.innerHTML = tituloProduccion.textContent;

            contenidoVentana.appendChild(tarjeta);
            tarjeta.appendChild(borde);
            borde.appendChild(tituloProdu);
            borde.appendChild(cuerpo);
            cuerpo.appendChild(imagen);


            /*
            if (produccion.value instanceof Movie) {
                
                if (produccion.value.resource != null) {
                    var resource = document.createElement("p");
                    resource.setAttribute("class", "card-text");

                    resource.appendChild(document.createTextNode("Recurso: " + produccion.value.resource));
                    cuerpo.appendChild(resource);
                }
           
                if (produccion.value.locations != null) {
                    var locations = document.createElement("p");
                    locations.setAttribute("class", "card-text");

                
                    locations.appendChild(document.createTextNode("Localizacion: " + produccion.value.locations));
                    cuerpo.appendChild(locations);
                }
            }

            if (produccion.value.seasons != null) {
               
                var temporada = document.createElement("p");
                temporada.setAttribute("class", "card-text");

                temporada.appendChild(document.createTextNode( produccion.value.seasons));
                cuerpo.appendChild(temporada);
                
            }*/

            if (produccion.value instanceof Movie) {
                //Si es distinto de null pone el recurso de la produccion
                if (produccion.value.resource != null) {
                    var resource = document.createElement("p");
                    resource.setAttribute("class", "card-text font-weight-bold m-0");
                    resource.appendChild(document.createTextNode("Recurso: "));

                    cuerpo.appendChild(resource);

                    var duracion = document.createElement("p");
                    duracion.setAttribute("class", "card-text m-0 ml-3");
                    duracion.appendChild(document.createTextNode("Duración: " + produccion.value.resource.duration));

                    cuerpo.appendChild(duracion);

                    var link = document.createElement("p");
                    link.setAttribute("class", "card-text m-0 ml-3");
                    link.appendChild(document.createTextNode("Link: " + produccion.value.resource.link));

                    cuerpo.appendChild(link);

                    var audios = document.createElement("p");
                    audios.setAttribute("class", "card-text m-0 ml-3");
                    audios.appendChild(document.createTextNode("Audios: " + produccion.value.resource.audios));

                    cuerpo.appendChild(audios);

                    var subtitulos = document.createElement("p");
                    subtitulos.setAttribute("class", "card-text m-0 ml-3");
                    subtitulos.appendChild(document.createTextNode("Subtitulos: " + produccion.value.resource.subtitles));

                    cuerpo.appendChild(subtitulos);
                }
                //Si es distinto de null pone la localizacion de la produccion
                if (produccion.value.locations != "") {
                    var locations = document.createElement("p");
                    locations.setAttribute("class", "card-text font-weight-bold m-0");
                    locations.appendChild(document.createTextNode("Localizacion: "));

                    cuerpo.appendChild(locations);

                    var locations = document.createElement("p");
                    locations.setAttribute("class", "card-text m-0 ml-3");
                    locations.appendChild(document.createTextNode("Latitud: " + produccion.value.locations.latitude));

                    cuerpo.appendChild(locations);

                    var locations = document.createElement("p");
                    locations.setAttribute("class", "card-text m-0 ml-3");
                    locations.appendChild(document.createTextNode("Longitud: " + produccion.value.locations.longitude));

                    cuerpo.appendChild(locations);
                }
            }//Fin del instanceof

            if (produccion.value.seasons != null) {
                //Si tiene temporadas las muestra

                for (let index = 0; index < produccion.value.seasons.length; index++) {
                    var season = document.createElement("p");
                    season.setAttribute("class", "cajaTitulo font-weight-bold m-0");
                    season.appendChild(document.createTextNode("• " + produccion.value.seasons[index].title + ":"));

                    cuerpo.appendChild(season);

                    console.log(produccion.value.seasons[index].episodes);

                    for (let indexArray = 0; indexArray < produccion.value.seasons[index].episodes.length; indexArray++) {

                        if (produccion.value.seasons[index].episodes[indexArray].title != undefined && produccion.value.seasons[index].episodes[indexArray].title != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-1 font-weight-light");
                            episodio.appendChild(document.createTextNode(produccion.value.seasons[index].episodes[indexArray].title));

                            cuerpo.appendChild(episodio);
                        }


                        if (produccion.value.seasons[index].episodes[indexArray].recurso.duration != undefined && produccion.value.seasons[index].episodes[indexArray].recurso.duration != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-3");
                            episodio.appendChild(document.createTextNode("Recurso: " + produccion.value.seasons[index].episodes[indexArray].recurso.duration));

                            cuerpo.appendChild(episodio);
                        }

                        if (produccion.value.seasons[index].episodes[indexArray].recurso.link != undefined && produccion.value.seasons[index].episodes[indexArray].recurso.link != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-5");
                            episodio.appendChild(document.createTextNode("Link: " + produccion.value.seasons[index].episodes[indexArray].recurso.link));

                            cuerpo.appendChild(episodio);
                        }

                        if (produccion.value.seasons[index].episodes[indexArray].recurso.audios != undefined && produccion.value.seasons[index].episodes[indexArray].recurso.audios != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-5");
                            episodio.appendChild(document.createTextNode("Audios: " + produccion.value.seasons[index].episodes[indexArray].recurso.audios));

                            cuerpo.appendChild(episodio);
                        }

                        if (produccion.value.seasons[index].episodes[indexArray].recurso.subtitles != undefined && produccion.value.seasons[index].episodes[indexArray].recurso.subtitles != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-5");
                            episodio.appendChild(document.createTextNode("Subtitulos: " + produccion.value.seasons[index].episodes[indexArray].recurso.subtitles));

                            cuerpo.appendChild(episodio);
                        }

                        if (produccion.value.seasons[index].episodes[indexArray].localizaciones.latitude != undefined && produccion.value.seasons[index].episodes[indexArray].localizaciones.latitude != "" && produccion.value.seasons[index].episodes[indexArray].localizaciones.longitude != undefined && produccion.value.seasons[index].episodes[indexArray].localizaciones.longitude != "") {
                            var episodio = document.createElement("p");
                            episodio.setAttribute("class", "cajaDescripcion m-0 ml-3");
                            episodio.appendChild(document.createTextNode("Localización: Latitud: " + produccion.value.seasons[index].episodes[indexArray].localizaciones.latitude + " Longitud: " + produccion.value.seasons[index].episodes[indexArray].localizaciones.longitude));

                            cuerpo.appendChild(episodio);
                        }
                    }
                }
            }
        }
        produccion = producciones.next();
    }
}