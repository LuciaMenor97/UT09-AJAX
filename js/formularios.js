//Instanciamos el objeto VideoSystem
var video = VideoSystem.getInstance();

//Añadimos un nombre a nuestro sistema 
video.name = "VIDEOSYSTEM";

var titulo = document.getElementById("titulo");

var main = document.getElementsByTagName("main")[0];



function insertar_categoria() {

    var nombre = document.getElementById("nombre_cat");

    var descrp = document.getElementById("descrp_cat");

    var img = document.getElementById("img_cat");

    var error = document.getElementById("errorcat");

    if (nombre.value != "") {
        var categoria = new Category(nombre.value, descrp.value, img.value);
        try {
            video.addCategory(categoria);
            error.innerHTML = "Categoría añadida correctamente.";
            setInterval(borrarErrorCat, 6000);
        } catch (err) {
            error.innerHTML = err.message;
            setInterval(borrarErrorCat, 6000);
        }
    } else {
        //nombre.style.borderColor = "red";
        error.innerHTML = "El campo nombre es obligatorio";
        setInterval(borrarErrorCat, 6000);
    }


    mostrar_categoria();
}

function borrarErrorCat() {
    var error = document.getElementById("errorcat");

    error.innerHTML = "";
}


function getFunctionCargarCategoria(categoria) {
    return (
        function () {
            cargarCategoria(categoria);
        }
    )
}


function cargarCategoria(c) {
    //Cargamos los datos de la categoria en el modal.
    document.getElementById("nombrecat").value = c.name;
    document.getElementById("descrpcat").value = c.description;
    document.getElementById("btnModCat").value = c.name;
}


function modificar_categoria() {

    var categorias = video.categories;
    var categoria = categorias.next();

    while (categoria.done !== true) {
        if (categoria.value.name == document.getElementById("btnModCat").value) {

            categoria.value.name = document.getElementById("nombrecat").value;
            categoria.value.description = document.getElementById("descrpcat").value;
            modificarCategoriaIndexDB(categoria.value);
        }

        categoria = categorias.next();
    }

    mostrar_categoria();

}


function eliminar_categoria() {

    var iterable_category = video.categories;
    var categoria = iterable_category.next();


    while (categoria.done !== true) {

        if (categoria.value.name === this.value) {
            var eliminado = categoria.value;

            video.removeCategory(eliminado);

            mostrar_categoria();

        }

        categoria = iterable_category.next();

    }
}


function eliminar_categoria2() {

    var iterable_category = video.categories;
    var categoria = iterable_category.next();

    while (categoria.done !== true) {

        if (categoria.value.name === this.value) {

            var eliminado = categoria.value;

            video.removeCategory(eliminado);

            showHomePage();
        }


        categoria = iterable_category.next();

    }

}


function cargarInsertActor() {

    var producciones = video.productions;
    var produccion = producciones.next();


    var div = document.getElementById("producciones");

    /*
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (produccion.done !== true) {

        var checkgroup = document.createElement("div");
        checkgroup.setAttribute("class", "form-check");
        var label = document.createElement("label");
        label.setAttribute("for", "check" + produccion.value.title);
        label.setAttribute("class", "form-check-label mr-2");
        label.appendChild(document.createTextNode(produccion.value.title));
        var input = document.createElement("input");
        input.setAttribute("name", "producciones");
        input.setAttribute("class", "mr-3");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", produccion.value.title);
        input.setAttribute("id", "check" + produccion.value.title);

        var span = document.createElement("label");
        span.appendChild(document.createTextNode("¿Es principal?"));
        span.setAttribute("for", "radio" + produccion.value.title);
        span.setAttribute("class", "form-check-label mr-2");
        var radio = document.createElement("input");
        radio.setAttribute("type", "checkbox");
        radio.setAttribute("name", "papel" + produccion.value.title);
        radio.setAttribute("class", "mr-3");
        radio.setAttribute("value", "principal");
        radio.setAttribute("id", "radio" + produccion.value.title);



        var label2 = document.createElement("label");
        label2.setAttribute("for", "personaje" + produccion.value.name);
        label2.appendChild(document.createTextNode("Personaje:"));
        label2.setAttribute("class", "mr-2")
        var input3 = document.createElement("input");
        input3.setAttribute("type", "text");
        input3.setAttribute("id", "personaje" + produccion.value.title);


        div.appendChild(checkgroup);
        checkgroup.appendChild(label);
        checkgroup.appendChild(input);

        checkgroup.appendChild(span);
        checkgroup.appendChild(radio);

        checkgroup.appendChild(label2);
        checkgroup.appendChild(input3);

        produccion = producciones.next();
    }*/
}


function insertar_actor() {
    var nombre = document.getElementById("nombre");

    var apellido = document.getElementById("apellido");

    var fecha = document.getElementById("fecha");


    var checkpro = $('input[name=producciones]:checked', '#insertar_actores');

    var error = document.getElementById("erroract");


    if (nombre.value != "" && apellido.value != "" && fecha.value != "") {

        var actor = new Actor(nombre.value, apellido.value, "", new Date(fecha.value));

        try {
            video.addActor(actor);
            error.innerHTML = "Actor añadido correctamente.";
            setInterval(borrarErrorAct, 6000);

            var producciones = video.productions;
            var produccion = producciones.next();

            while (produccion.done !== true) {

                for (var i = 0; i < checkpro.length; i++) {
                    if (produccion.value.title == checkpro[i].value) {

                        var isCheck = false;

                        var radiobutton = $("input[name='papel" + produccion.value.title + "']:checked", '#insertar_actores');

                        if (radiobutton.length) {
                            isCheck = true;
                        }

                        var interpretacion = new Interpretation(produccion.value, document.getElementById("personaje" + produccion.value.title).value, isCheck);

                        video.assignActor(actor, interpretacion);
                    }
                }

                produccion = producciones.next();
            }
        } catch (err) {
            error.innerHTML = err.message;
            setInterval(borrarErrorAct, 6000);
        }
    } else {
        error.innerHTML = "Completa los campos obligatorios.";
        setInterval(borrarErrorAct, 6000);
    }

    showActors();
}


function borrarErrorAct() {
    var error = document.getElementById("erroract");

    error.innerHTML = "";
}


function getFunctionCargarActor(actor) {
    return (
        function () {
            cargarActor(actor);
        }
    )
}


function cargarActor(a) {
    //Cargamos los datos del actor en el modal.
    document.getElementById("nombreact").value = a.name;
    document.getElementById("apellidoact").value = a.lastname1;
    document.getElementById("fechaact").valueAsDate = a.born;

    var producciones = video.productions;
    var produccion = producciones.next();


    var div = document.getElementById("produccionesmod");

    /*
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (produccion.done !== true) {

        var checkgroup = document.createElement("div");
        checkgroup.setAttribute("class", "form-check form-check-inline");
        var label = document.createElement("label");
        label.setAttribute("for", "check2" + produccion.value.title);
        label.appendChild(document.createTextNode(produccion.value.title));
        label.setAttribute("class", "form-check-label");
        var input = document.createElement("input");
        input.setAttribute("name", "produccionesmod");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("id", "check2" + produccion.value.title);
        input.setAttribute("value", produccion.value.title);

        var span = document.createElement("label");
        span.appendChild(document.createTextNode("¿Es principal?"));
        span.setAttribute("for", "radio2" + produccion.value.title);
        span.setAttribute("class", "form-check-label");
        var radio = document.createElement("input");
        radio.setAttribute("type", "checkbox");
        radio.setAttribute("class", "form-check-input");
        radio.setAttribute("name", "papelmod" + produccion.value.title);
        radio.setAttribute("id", "radio2" + produccion.value.title);
        radio.setAttribute("value", "principal");

        var label2 = document.createElement("label");
        label2.setAttribute("for", "personaje");
        label2.appendChild(document.createTextNode("Personaje"));
        var input3 = document.createElement("input");
        input3.setAttribute("type", "text");
        input3.setAttribute("id", "personajemod" + produccion.value.title);



        div.appendChild(checkgroup);
        checkgroup.appendChild(label);
        checkgroup.appendChild(input);

        checkgroup.appendChild(span);
        checkgroup.appendChild(radio);

        checkgroup.appendChild(label2);
        checkgroup.appendChild(input3);



        produccion = producciones.next();
    }*/

    document.getElementById("btnModAct").value = a.name;
}


function modificar_actor() {

    var actores = video.actors;
    var actor = actores.next();

    while (actor.done !== true) {
        if (actor.value.name == document.getElementById("btnModAct").value) {

            actor.value.name = document.getElementById("nombreact").value;
            actor.value.lastname1 = document.getElementById("apellidoact").value;
            actor.value.born = new Date(document.getElementById("fechaact").value);

            /*
            var checkpro = $('input[name=produccionesmod]:checked', '#modificaractores');

            var producciones = video.productions;
            var produccion = producciones.next();

            while (produccion.done !== true) {

                for (var i = 0; i < checkpro.length; i++) {
                    if (produccion.value.title == checkpro[i].value) {

                        var isCheck = false;

                        var radiobutton = $("input[name='papelmod" + produccion.value.title + "']:checked", '#modificaractores');

                        if (radiobutton.length) {
                            isCheck = true;
                        }

                        var interpretacion = new Interpretation(produccion.value, document.getElementById("personajemod" + produccion.value.title).value, isCheck);
                        video.assignActor(actor.value, interpretacion);
                    }
                }

                produccion = producciones.next();
            }*/

            modificarActorIndexDB(actor.value);
        }

        actor = actores.next();
    }

    showActors();
}


function eliminar_actor() {

    var actores = video.actors;
    var actor = actores.next();


    while (actor.done !== true) {
        if (actor.value.name + " " + actor.value.lastname1 === this.value) {

            var eliminado = actor.value;

            video.removeActor(eliminado);

            showActors();
        }

        actor = actores.next();
    }

}


function cargarInsertDirector() {

    var producciones = video.productions;
    var produccion = producciones.next();


    var div = document.getElementById("produccionesdir");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (produccion.done !== true) {

        var checkgroup = document.createElement("div");
        checkgroup.setAttribute("class", "form-check form-check-inline");
        var label = document.createElement("label");
        label.setAttribute("for", "check" + produccion.value.title);
        label.setAttribute("class", "form-check-label");
        label.appendChild(document.createTextNode(produccion.value.title));
        var input = document.createElement("input");
        input.setAttribute("name", "produccionesdir");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("value", produccion.value.title);
        input.setAttribute("id", "check" + produccion.value.title);


        div.appendChild(checkgroup);
        checkgroup.appendChild(label);
        checkgroup.appendChild(input);

        produccion = producciones.next();
    }
}


function insertar_director() {
    var nombre = document.getElementById("nombred").value;

    var apellido = document.getElementById("apellidod").value;

    var fecha = document.getElementById("fechad").value;

    var img = document.getElementById("img_d");

    var checkpro = $('input[name=produccionesdir]:checked', '#insertar_directores');

    var error = document.getElementById("errordir");

    if (nombre != "" && apellido != "" && fecha != "") {

        var director = new Director(nombre, apellido, "", new Date(fecha), img.value);

        try {

            video.addDirector(director);
            error.innerHTML = "Director añadido correctamente.";
            setInterval(borrarErrorDir, 6000);

            var producciones = video.productions;
            var produccion = producciones.next();

            while (produccion.done !== true) {

                for (var i = 0; i < checkpro.length; i++) {
                    if (produccion.value.title == checkpro[i].value) {
                        video.assignDirector(director, produccion.value);
                    }
                }

                produccion = producciones.next();
            }
        } catch (err) {
            error.innerHTML = err.message;
            setInterval(borrarErrorDir, 6000);
        }
    } else {
        error.innerHTML = "Completa los campos obligatorios";
        setInterval(borrarErrorDir, 6000);
    }



    showDirectors();
}


function borrarErrorDir() {
    var error = document.getElementById("errordir");

    error.innerHTML = "";
}



function getFunctionCargarDirector(director) {
    return (
        function () {
            cargarDirector(director);
        }
    )
}


function cargarDirector(d) {
    //Cargamos los datos del director en el modal.
    document.getElementById("nombredir").value = d.name;
    document.getElementById("apellidodir").value = d.lastname1;
    document.getElementById("fechadir").valueAsDate = d.born;

    var producciones = video.productions;
    var produccion = producciones.next();


    var div = document.getElementById("produccionesdirmod");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (produccion.done !== true) {

        var checkgroup = document.createElement("div");
        var label = document.createElement("label");
        label.setAttribute("for", "check3" + produccion.value.title);
        label.setAttribute("class", "form-check-label");
        label.appendChild(document.createTextNode(produccion.value.title));
        var input = document.createElement("input");
        input.setAttribute("name", "produccionesdirmod");
        input.setAttribute("type", "checkbox");
        //input.setAttribute("class", "form-check-input");
        input.setAttribute("id", "check3" + produccion.value.title);
        input.setAttribute("value", produccion.value.title);


        div.appendChild(checkgroup);
        checkgroup.appendChild(label);
        checkgroup.appendChild(input);

        produccion = producciones.next();
    }

    document.getElementById("btnModDir").value = d.name;
}


function modificar_director() {

    var directores = video.directors;
    var director = directores.next();

    while (director.done !== true) {
        if (director.value.name == document.getElementById("btnModDir").value) {


            director.value.production.splice(0,director.value.production.length);

            director.value.name = document.getElementById("nombredir").value;
            director.value.lastname1 = document.getElementById("apellidodir").value;
            director.value.born = new Date(document.getElementById("fechadir").value);


            var checkpro = $('input[name=produccionesdirmod]:checked', '#modificardirectores');

            var producciones = video.productions;
            var produccion = producciones.next();

            while (produccion.done !== true) {

                for (var i = 0; i < checkpro.length; i++) {
                    if (produccion.value.title == checkpro[i].value) {
                        video.assignDirector(director.value, produccion.value);
                        //asignarDirectorProduccion(director.value, produccion.value);
                        console.log(director.value.production);
                    }
                }

                produccion = producciones.next();
            }




            modificarDirectorIndexDB(director.value);

        }

        director = directores.next();
    }




    showDirectors();
}


function eliminar_director() {
    var directores = video.directors;
    var director = directores.next();


    while (director.done !== true) {
        if (director.value.name + " " + director.value.lastname1 === this.value) {

            var eliminado = director.value;

            video.removeDirector(eliminado);

            showDirectors();
        }

        director = directores.next();
    }
}


function cargarInsertPelícula() {

    var categorias = video.categories;
    var categoria = categorias.next();

    var div = document.getElementById("categoriapel");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (categoria.done !== true) {

        var checkgroup = document.createElement("div");
        checkgroup.setAttribute("class", "form-check form-check-inline");
        var label = document.createElement("label");
        label.setAttribute("for", "check" + categoria.value.name);
        label.setAttribute("class", "form-check-label");
        label.appendChild(document.createTextNode(categoria.value.name));
        var input = document.createElement("input");
        input.setAttribute("name", "categoriapro");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "form-check-input ml-2");
        input.setAttribute("id", "check" + categoria.value.name);
        input.setAttribute("value", categoria.value.name);



        checkgroup.appendChild(label);

        checkgroup.appendChild(input);

        div.appendChild(checkgroup);

        categoria = categorias.next();
    }


    /*
    var divact = document.getElementById("actorpel");


    while (divact.firstChild) {
        divact.removeChild(divact.firstChild);
    }

    var actores = video.actors;
    var actor = actores.next();

    while (actor.done !== true) {
        var checkgroup2 = document.createElement("div");
        checkgroup2.setAttribute("class", "form-check form-check-inline");
        var label2 = document.createElement("label");
        label2.setAttribute("for", "check" + actor.value.name);
        label2.setAttribute("class", "form-check-label");
        label2.appendChild(document.createTextNode(actor.value.name + " " + actor.value.lastname1));
        var input2 = document.createElement("input");
        input2.setAttribute("name", "actorpro");
        input2.setAttribute("type", "checkbox");
        input2.setAttribute("class", "form-check-input ml-2");
        input2.setAttribute("id", "check" + actor.value.name);
        input2.setAttribute("value", actor.value.name);



        checkgroup2.appendChild(label2);

        checkgroup2.appendChild(input2);

        divact.appendChild(checkgroup2);

        actor = actores.next();
    }*/

    var divdir = document.getElementById("dirpel");

    while (divdir.firstChild) {
        divdir.removeChild(divdir.firstChild);
    }

    var directores = video.directors;
    var director = directores.next();

    while (director.done !== true) {
        var checkgroup3 = document.createElement("div");
        checkgroup3.setAttribute("class", "form-check form-check-inline");
        var label3 = document.createElement("label");
        label3.setAttribute("for", "check" + director.value.name);
        label3.setAttribute("class", "form-check-label");
        label3.appendChild(document.createTextNode(director.value.name + " " + director.value.lastname1));
        var input3 = document.createElement("input");
        input3.setAttribute("name", "directorpro");
        input3.setAttribute("type", "radio");
        input3.setAttribute("class", "form-check-input ml-2");
        input3.setAttribute("id", "check" + director.value.name);
        input3.setAttribute("value", director.value.name);



        checkgroup3.appendChild(label3);

        checkgroup3.appendChild(input3);

        divdir.appendChild(checkgroup3);

        director = directores.next();
    }
}



function insertar_pelicula() {
    var nombre = document.getElementById("nombrepro");
    var fecha = document.getElementById("fechapro");
    var descrp = document.getElementById("descrppro");

    var duracion = document.getElementById("duracion");

    var link = document.getElementById("link");

    var error = document.getElementById("errorpel");

    if (nombre.value != "" && fecha.value != "" && descrp.value != "" && duracion.value != "" && link.value != "") {

        var categoriaspro = $('input[name=categoriapro]:checked', '#insertar_peliculas');

        //var actorespro = $('input[name=actorpro]:checked', '#insertar_peliculas');

        var directorespro = $('input[name=directorpro]:checked', '#insertar_peliculas');




        var recurso = new Resource(duracion.value, link.value, ['Español', ' Inglés', ' Italiano'], ['Español', ' Inglés', ' Italiano']);
        var coordenadas2 = new Coordinate(66, 154);

        var pelicula = new Movie(nombre.value, new Date(fecha.value), recurso.getObject(), coordenadas2, "Inglesa", descrp.value);

        try {
            error.innerHTML = "Película añadida correctamente.";
            setInterval(borrarErrorPel, 6000);
            video.addProduction(pelicula);

            //var interpretacion = new Interpretation(pelicula.value, "", "");

            var categorias = video.categories;
            var categoria = categorias.next();

            while (categoria.done !== true) {

                for (var i = 0; i < categoriaspro.length; i++) {
                    if (categoria.value.name == categoriaspro[i].value) {
                        video.assignCategory(categoria.value, pelicula);
                    }
                }

                categoria = categorias.next();
            }


            /*
            var actores = video.actors;
            var actor = actores.next();

            while (actor.done !== true) {

                for (var i = 0; i < actorespro.length; i++) {
                    if (actor.value.name == actorespro[i].value) {

                        var interpretacion = new Interpretation(pelicula, "Personaje prueba", false);

                        video.assignActor(actor.value, interpretacion);
                    }
                }
                actor = actores.next();
            }*/

            var directores = video.directors;
            var director = directores.next();

            while (director.done !== true) {
                for (var i = 0; i < directorespro.length; i++) {
                    if (director.value.name == directorespro[i].value) {

                        video.assignDirector(director.value, pelicula);
                    }
                }
                director = directores.next();
            }
        } catch (err) {
            error.innerHTML = err.message;
            setInterval(borrarErrorPel, 6000);
        }



    } else {
        error.innerHTML = "Completa los campos obligatorios";
        setInterval(borrarErrorPel, 6000);
    }


    ver_producciones();



}


function borrarErrorPel() {
    var error = document.getElementById("errorpel");

    error.innerHTML = "";
}


function cargarInsertSerie() {

    var categorias = video.categories;
    var categoria = categorias.next();

    var div = document.getElementById("categoriaser");


    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    while (categoria.done !== true) {

        var checkgroup = document.createElement("div");
        checkgroup.setAttribute("class", "form-check form-check-inline");
        var label = document.createElement("label");
        label.setAttribute("for", "check" + categoria.value.name);
        label.setAttribute("class", "form-check-label");
        label.appendChild(document.createTextNode(categoria.value.name));
        var input = document.createElement("input");
        input.setAttribute("name", "categoriaser");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "form-check-input ml-2");
        input.setAttribute("id", "check" + categoria.value.name);
        input.setAttribute("value", categoria.value.name);


        checkgroup.appendChild(label);

        checkgroup.appendChild(input);

        div.appendChild(checkgroup);

        categoria = categorias.next();
    }

    /*

    var divact = document.getElementById("actorser");


    while (divact.firstChild) {
        divact.removeChild(divact.firstChild);
    }

    var actores = video.actors;
    var actor = actores.next();

    while (actor.done !== true) {
        var checkgroup2 = document.createElement("div");
        checkgroup2.setAttribute("class", "form-check form-check-inline");
        var label2 = document.createElement("label");
        label2.setAttribute("for", "check" + actor.value.name);
        label2.setAttribute("class", "form-check-label");
        label2.appendChild(document.createTextNode(actor.value.name + " " + actor.value.lastname1));
        var input2 = document.createElement("input");
        input2.setAttribute("name", "actorser");
        input2.setAttribute("type", "checkbox");
        input2.setAttribute("class", "form-check-input ml-2");
        input2.setAttribute("id", "check" + actor.value.name);
        input2.setAttribute("value", actor.value.name);



        checkgroup2.appendChild(label2);

        checkgroup2.appendChild(input2);

        divact.appendChild(checkgroup2);

        actor = actores.next();
    }*/

    var divdir = document.getElementById("dirser");

    while (divdir.firstChild) {
        divdir.removeChild(divdir.firstChild);
    }

    var directores = video.directors;
    var director = directores.next();

    while (director.done !== true) {
        var checkgroup3 = document.createElement("div");
        checkgroup3.setAttribute("class", "form-check form-check-inline");
        var label3 = document.createElement("label");
        label3.setAttribute("for", "check" + director.value.name);
        label3.setAttribute("class", "form-check-label");
        label3.appendChild(document.createTextNode(director.value.name + " " + director.value.lastname1));
        var input3 = document.createElement("input");
        input3.setAttribute("name", "directorser");
        input3.setAttribute("type", "radio");
        input3.setAttribute("class", "form-check-input ml-2");
        input3.setAttribute("id", "check" + director.value.name);
        input3.setAttribute("value", director.value.name);



        checkgroup3.appendChild(label3);

        checkgroup3.appendChild(input3);

        divdir.appendChild(checkgroup3);

        director = directores.next();
    }
}



function insertar_serie() {
    var nombre = document.getElementById("nombreser");
    var fecha = document.getElementById("fechaser");
    //var img = document.getElementById("imgser");
    var descrp = document.getElementById("descrpser");

    var error = document.getElementById("errorser");

    var duracion = document.getElementById("duracionser");

    var link = document.getElementById("linkser");

    if (nombre.value != "" && fecha.value != "" && descrp.value != "" && duracion.value != "" && link.value != "") {
        var categoriasser = $('input[name=categoriaser]:checked', '#insertar_series');

        var actoresser = $('input[name=actorser]:checked', '#insertar_series');

        var directoresser = $('input[name=directorser]:checked', '#insertar_series');



        var recurso = new Resource(duracion.value, link.value, ['Español', ' Inglés', ' Italiano'], ['Español', ' Inglés', ' Italiano']);

        var coordenadas1 = new Coordinate(50, 165);
        var coordenadas2 = new Coordinate(66, 154);

        //Episodios

        var episodio1 = new Episodes("Episodio 1", recurso.getObject(), coordenadas1.getObject());
        var episodio2 = new Episodes("Episodio 2", recurso.getObject(), coordenadas2.getObject());
        var episodio3 = new Episodes("Episodio 3", recurso.getObject(), coordenadas1.getObject());
        var episodio4 = new Episodes("Episodio 4", recurso.getObject(), coordenadas2.getObject());


        //Temporadas

        var season1 = new Season("Temporada 1", [episodio1.getObject(), episodio2.getObject()]);
        var season2 = new Season("Temporada 2", [episodio3.getObject(), episodio4.getObject()]);

        var serie = new Serie(nombre.value, new Date(fecha.value), [season1.getObject(), season2.getObject()], "Inglesa", descrp.value);

        try {
            error.innerHTML = "Serie añadida correctamente.";
            setInterval(borrarErrorPel, 6000);
            video.addProduction(serie);


            var categorias = video.categories;
            var categoria = categorias.next();

            while (categoria.done !== true) {

                for (var i = 0; i < categoriasser.length; i++) {
                    if (categoria.value.name == categoriasser[i].value) {
                        video.assignCategory(categoria.value, serie);
                    }
                }

                categoria = categorias.next();
            }

            /*
            var actores = video.actors;
            var actor = actores.next();

            while (actor.done !== true) {

                for (var i = 0; i < actoresser.length; i++) {
                    if (actor.value.name == actoresser[i].value) {

                        var interpretacion = new Interpretation(serie, "Personaje prueba", false);

                        video.assignActor(actor.value, interpretacion);
                    }
                }
                actor = actores.next();
            }*/


            var directores = video.directors;
            var director = directores.next();

            while (director.done !== true) {
                for (var i = 0; i < directoresser.length; i++) {
                    if (director.value.name == directoresser[i].value) {
                        video.assignDirector(director.value, serie);
                    }
                }
                director = directores.next();
            }
        } catch (err) {
            error.innerHTML = err.message;
            setInterval(borrarErrorPel, 6000);
        }


    } else {
        error.innerHTML = "Completa los campos obligatorios";
        setInterval(borrarErrorSer, 6000);
    }


    ver_producciones();
}


function borrarErrorSer() {
    var error = document.getElementById("errorser");

    error.innerHTML = "";
}


function eliminar_produccion() {

    var producciones = video.productions;
    var produccion = producciones.next();

    while (produccion.done !== true) {

        if (produccion.value.title === this.value) {
            var eliminado = produccion.value;

            var categorias = video.categories;
            var categoria = categorias.next();

            while (categoria.done !== true) {
                var encontrado = false;
                var productions = video.getProductionsCategory(categoria.value);
                var production = productions.next();

                while (production.done !== true && (!encontrado)) {
                    if (production.value.title === this.value) {
                        video.deassignCategory(categoria.value, eliminado);
                        desasignarCategoriaProduccion(categoria.value, eliminado.title);

                        encontrado = true;
                    }
                    production = productions.next();
                }

                categoria = categorias.next();
            }


            /*
            var actores = video.actors;
            var actor = actores.next();

            while (actor.done !== true) {
                var producciones = video.getProductionsActor(actor.value);
                var pro = producciones.next();

                while (pro.done !== true) {
                    var interpretacion = new Interpretation(produccion.value, "", "");

                    video.deassignActor(actor.value, interpretacion);

                    pro = producciones.next();
                }
                actor = actores.next();
            }*/

            var directores = video.directors;
            var director = directores.next();

            while (director.done !== true) {
                var productions = video.getProductionsDirector(director.value);
                var production = productions.next();

                while (production.done !== true) {
                    if (production.value.title === this.value) {
                        video.deassignDirector(director.value, eliminado);
                        desasignarDirectorProduccion(director.value, eliminado);
                    }
                    production = productions.next();
                }

                director = directores.next();
            }

            video.removeProduction(eliminado);

            ver_producciones();
        }

        produccion = producciones.next();
    }
}


function comprobacionLogin() {
    if (getCookie("validacion") !== "") {
        document.getElementById("formValidacion").setAttribute("class", "d-none");
        document.getElementById("inicioses").setAttribute("class", "d-none");
        document.getElementById("nmbreUsu").appendChild(document.createTextNode(getCookie("validacion")));
        document.getElementById("validado").setAttribute("class", "d-block");
        $(".estaValidado").css("display", "block");
    } else {
        document.getElementById("formValidacion").setAttribute("class", "d-block");
        document.getElementById("inicioses").setAttribute("class", "mx-auto d-block w-50");
        document.getElementById("validado").setAttribute("class", "d-none");
        $(".estaValidado").css("display", "none");
    }
}


function validarSesion() {
    var usuario = document.getElementById("nombresesion").value;
    var contrasna = document.getElementById("pwd").value;
    var error = document.getElementById("errores");

    if ((usuario != "prueba") || (contrasna != "prueba")) {

        while (error.firstChild) {
            error.removeChild(error.firstChild);
        }

        error.appendChild(document.createTextNode("Usuario o contraseña incorrecto"));
        $(".alert").alert()
    } else {
        setCookie("validacion", usuario, 1);
        comprobacionLogin();
    }
}

function cerrarSesion() {
    document.cookie = "validacion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    comprobacionLogin();
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

window.onload = comprobacionLogin();