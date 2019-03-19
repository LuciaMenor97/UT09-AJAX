var db;
const DB_NAME = 'videoSystem';
const DB_VERSION = 1;
const DB_CATEGORIAS = 'categorias';
const DB_ACTORES = 'actores';
const DB_DIRECTORES = 'directores';
const DB_PRODUCCIONES = 'producciones';

var request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    try {
        var tablaCategorias = db.createObjectStore(DB_CATEGORIAS, { keyPath: "nombre" });
        var tablaActores = db.createObjectStore(DB_ACTORES, { keyPath: "nombre" });
        var tablaDirectores = db.createObjectStore(DB_DIRECTORES, { keyPath: "nombre" });
        var tablaProducciones = db.createObjectStore(DB_PRODUCCIONES, { keyPath: "title" });

        tablaActores.transaction.oncomplete = function () {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var json = JSON.parse(this.responseText);
                    
                    var transaction = db.transaction([DB_ACTORES,DB_DIRECTORES,DB_PRODUCCIONES,DB_CATEGORIAS], "readwrite");

                    var tablaCategorias2 = transaction.objectStore(DB_CATEGORIAS);
                    for (var i in json[0]) {
                        tablaCategorias2.add(json[0][i]);
                    }
                    var tablaProducciones2 = transaction.objectStore(DB_PRODUCCIONES);
                    for (var i in json[1]) {
                        tablaProducciones2.add(json[1][i]);
                    }
                    var tablaDirectores2 = transaction.objectStore(DB_DIRECTORES);
                    for (var i in json[2]) {
                        tablaDirectores2.add(json[2][i]);
                    }
                    var tablaActores2 = transaction.objectStore(DB_ACTORES);
                    for (var i in json[3]) {
                        tablaActores2.add(json[3][i]);
                    }
                }
            }
            xmlhttp.open("GET", "init.json", false);
            xmlhttp.send();
        }

    } catch (e) {
        console.log("Exception creating object store: " + e);
    }

}



request.onsuccess = function (event) {

    var videoSystem = VideoSystem.getInstance();

    db = event.target.result;
    db.onerror = function (event) {
        console.log(event.target.error);
    };

    window.produccionesYaInstanciadas = [];

    var transaction = db.transaction([DB_CATEGORIAS, DB_PRODUCCIONES, DB_ACTORES, DB_DIRECTORES]);

    var tablaCategorias = transaction.objectStore(DB_CATEGORIAS);
    tablaCategorias.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            //console.log(cursor.value);
            var categoria = new Category(cursor.value.nombre, cursor.value.description);
            for (var i in cursor.value.producciones) {
                var produccion;
                if (cursor.value.producciones[i].hasOwnProperty('seasons')) {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.producciones[i].title;
                    });
                    if (!produccion) {
                        produccion = new Serie(cursor.value.producciones[i].title, new Date(cursor.value.producciones[i].publicacion), cursor.value.producciones[i].seasons, cursor.value.producciones[i].nacionalidad, cursor.value.producciones[i].sinopsis);
                        produccionesYaInstanciadas.push(produccion);
                    }
                } else {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.producciones[i].title;
                    });
                    if (!produccion) {
                        produccion = new Movie(cursor.value.producciones[i].title, new Date(cursor.value.producciones[i].publicacion), cursor.value.producciones[i].resource, cursor.value.producciones[i].localizaciones, cursor.value.producciones[i].nacionalidad, cursor.value.producciones[i].sinopsis);
                        produccionesYaInstanciadas.push(produccion);
                    }
                }
                categoria.addProduction(produccion);
            }

            videoSystem.addCategory(categoria, true);

            //console.log(categoria);

            cursor.continue();
        }
    }

    var tablaProducciones = transaction.objectStore(DB_PRODUCCIONES);
    tablaProducciones.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            //console.log(cursor.value);
            var produccion;

            if (cursor.value.hasOwnProperty('seasons')) {
                produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                    return produccionArray.title == cursor.value.title;
                });
                if (!produccion) {
                    produccion = new Serie(cursor.value.title, new Date(cursor.value.publicacion), cursor.value.seasons, cursor.value.nacionalidad, cursor.value.sinopsis);
                    produccionesYaInstanciadas.push(produccion);
                }
            } else {
                produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                    return produccionArray.title == cursor.value.title;
                });
                if (!produccion) {
                    produccion = new Movie(cursor.value.title, new Date(cursor.value.publicacion), cursor.value.resource, cursor.value.localizaciones, cursor.value.nacionalidad, cursor.value.sinopsis);
                    produccionesYaInstanciadas.push(produccion);
                }
            }
            videoSystem.addProduction(produccion, true);
            //console.log(produccion);
            cursor.continue();
        }
    }


    var tablaActores = transaction.objectStore(DB_ACTORES);
    tablaActores.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            //console.log(cursor.value);
            var actor = new Actor(cursor.value.nombre, cursor.value.apellido1, cursor.value.apellido2, new Date(cursor.value.fecha));
            for (var i in cursor.value.interpretaciones) {
                var produccion;
                if (cursor.value.interpretaciones[i].produccion.hasOwnProperty('seasons')) {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.interpretaciones[i].produccion.title;
                    });
                    if (!produccion) {
                        produccion = new Serie(cursor.value.interpretaciones[i].produccion.title, new Date(cursor.value.interpretaciones[i].produccion.publicacion), cursor.value.interpretaciones[i].produccion.seasons, cursor.value.interpretaciones[i].produccion.nacionalidad, cursor.value.interpretaciones[i].produccion.sinopsis);
                        var personaje = cursor.value.interpretaciones[i].personaje;
                        var principal = cursor.value.interpretaciones[i].principal;
                        produccionesYaInstanciadas.push(produccion);
                    }
                } else {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.interpretaciones[i].produccion.title;
                    });
                    if (!produccion) {
                        produccion = new Movie(cursor.value.interpretaciones[i].produccion.title, new Date(cursor.value.interpretaciones[i].produccion.publicacion), cursor.value.interpretaciones[i].produccion.resource, cursor.value.interpretaciones[i].produccion.localizaciones, cursor.value.interpretaciones[i].produccion.nacionalidad, cursor.value.interpretaciones[i].produccion.sinopsis);
                        var personaje = cursor.value.interpretaciones[i].personaje;
                        var principal = cursor.value.interpretaciones[i].principal;
                        produccionesYaInstanciadas.push(produccion);
                    } else {
                        var personaje = cursor.value.interpretaciones[i].personaje;
                        var principal = cursor.value.interpretaciones[i].principal;
                    }
                }

                var interpretacion = new Interpretation(produccion, personaje, principal);
                actor.addInterpretation(interpretacion);
            }

            videoSystem.addActor(actor, true);
            cursor.continue();
        }
    }


    var tablaDirectores = transaction.objectStore(DB_DIRECTORES);
    tablaDirectores.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            //console.log(cursor.value);
            var director = new Director(cursor.value.nombre, cursor.value.apellido1, cursor.value.apellido2, cursor.value.fecha);
            for (var i in cursor.value.producciones) {
                var produccion;
                if (cursor.value.producciones[i].hasOwnProperty('seasons')) {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.producciones[i].title;
                    });
                    if (!produccion) {
                        produccion = new Serie(cursor.value.producciones[i].title, new Date(cursor.value.producciones[i].publicacion), cursor.value.producciones[i].seasons, cursor.value.producciones[i].nacionalidad, cursor.value.producciones[i].sinopsis);
                        produccionesYaInstanciadas.push(produccion);
                    }
                } else {
                    produccion = produccionesYaInstanciadas.find(function (produccionArray) {
                        return produccionArray.title == cursor.value.producciones[i].title;
                    });
                    if (!produccion) {
                        produccion = new Movie(cursor.value.producciones[i].title, new Date(cursor.value.producciones[i].publicacion), cursor.value.producciones[i].resource, cursor.value.producciones[i].localizaciones, cursor.value.producciones[i].nacionalidad, cursor.value.producciones[i].sinopsis);
                        produccionesYaInstanciadas.push(produccion);
                    }
                }
                director.addProduction(produccion);
            }

            videoSystem.addDirector(director, true);

            cursor.continue();
        }
    }
}



//CATEGORÍAS

function insertarCategoriaIndexDB(categoria) {

    var transaction = db.transaction([DB_CATEGORIAS], "readwrite");

    transaction.onerror = function (event) {
        console.log("Error en transaction: " + event.target.error);
    };

    var tablaCategorias = transaction.objectStore(DB_CATEGORIAS);

    var req = tablaCategorias.add(categoria.getObject());

    req.onsuccess = function (even) {
        console.log("Categoria añadida.");
    };

    req.onerror = function (event) {
        console.log("La categoría no se ha podido añadir.");
    };
}

function borrarCategoriaIndexDB(categoria) {
    var request = db.transaction([DB_CATEGORIAS], "readwrite").objectStore(DB_CATEGORIAS).delete(categoria.name);

    request.onsuccess = function (event) {
        console.log("Categoría borrada.");
    };

    request.onerror = function (event) {
        console.log("La categoría no se ha podido borrar.");
    };
}

function modificarCategoriaIndexDB(categoria) {
    var objectStore = db.transaction([DB_CATEGORIAS], "readwrite").objectStore(DB_CATEGORIAS);

    var request = objectStore.get(categoria.name);

    request.onsuccess = function (event) {
        var data = request.result;


        data = categoria.getObject();

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("La categoría no se ha podido modificar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Categoría modificada.");
        };
    };
}


//PRODUCCIONES

function insertarProduccionIndexDB(produccion) {

    var transaction = db.transaction([DB_PRODUCCIONES], "readwrite");

    transaction.onerror = function (event) {
        console.log("Error en transaction: " + event.target.error);
    };

    var tablaProducciones = transaction.objectStore(DB_PRODUCCIONES);

    var req = tablaProducciones.add(produccion.getObject());

    req.onsuccess = function (event) {
        console.log("Producción añadida.");
    };

    req.onerror = function (event) {
        console.log("La producción no se ha podido añadir.");
    };
}

function borrarProduccionIndexDB(produccion) {
    var request = db.transaction([DB_PRODUCCIONES], "readwrite").objectStore(DB_PRODUCCIONES).delete(produccion.title);

    request.onsuccess = function (event) {
        console.log("Producción borrada.");
    };

    request.onerror = function (event) {
        console.log("La producción no se ha podido borrar.");
    };
}



//DIRECTORES

function insertarDirectorIndexDB(director) {

    var transaction = db.transaction([DB_DIRECTORES], "readwrite");

    transaction.onerror = function (event) {
        console.log("Error en transaction: " + event.target.error);
    };

    var tablaDirectores = transaction.objectStore(DB_DIRECTORES);

    var req = tablaDirectores.add(director.getObject());

    req.onsuccess = function (event) {
        console.log("Director añadido.");
    };

    req.onerror = function (event) {
        console.log("El director no se ha podido añadir.");
    };
}

function borrarDirectorIndexDB(director) {
    var request = db.transaction([DB_DIRECTORES], "readwrite").objectStore(DB_DIRECTORES).delete(director.name);

    request.onsuccess = function (event) {
        console.log("Director borrado.");
    };

    request.onerror = function (event) {
        console.log("El director no se ha podido borrar.");
    };
}

function modificarDirectorIndexDB(director) {
    var objectStore = db.transaction([DB_DIRECTORES], "readwrite").objectStore(DB_DIRECTORES);

    var request = objectStore.get(director.name);

    request.onsuccess = function (event) {
        var data = request.result;


        data = director.getObject();

        var producciones = data.producciones;

        data.producciones = [];

        for (var i = 0; i < producciones.length; i++) {
            data.producciones.push(producciones[i].getObject());
        }

        console.log(data.producciones);

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("El director no se ha podido modificar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Director modificado.");
        };
    };
}



//ACTORES

function insertarActorIndexDB(actor) {

    var transaction = db.transaction([DB_ACTORES], "readwrite");

    transaction.onerror = function (event) {
        console.log("Error en transaction: " + event.target.error);
    };

    var tablaActores = transaction.objectStore(DB_ACTORES);

    var req = tablaActores.add(actor.getObject());

    req.onsuccess = function (event) {
        console.log("Actor añadido.");
    };

    req.onerror = function (event) {
        console.log("El actor no se ha podido añadir.");
    };
}


function borrarActorIndexDB(actor) {
    var request = db.transaction([DB_ACTORES], "readwrite").objectStore(DB_ACTORES).delete(actor.name);

    request.onsuccess = function (event) {
        console.log("Actor borrado.");
    };

    request.onerror = function (event) {
        console.log("El actor no se ha podido borrar.");
    };
}

//ASIGNAR

function asignarCategoriaProduccion(categoria, produccion) {
    var objectStore = db.transaction([DB_CATEGORIAS], "readwrite").objectStore(DB_CATEGORIAS);
    var request = objectStore.get(categoria.name);

    request.onsuccess = function (event) {
        var data = request.result;

        data.producciones.push(produccion.getObject());

        //data.producciones = produccion;

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("La producción no se ha podido asignar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Producción asignada a la categoría.");
        };
    };
}


function asignarDirectorProduccion(director, produccion) {
    var objectStore = db.transaction([DB_DIRECTORES], "readwrite").objectStore(DB_DIRECTORES);
    var request = objectStore.get(director.name);

    request.onsuccess = function (event) {
        var data = request.result;

        data.producciones.push(produccion.getObject());

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("La producción no se ha podido asignar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Producción asignada al director.");
        };
    };
}


//DESASIGNAR

function desasignarCategoriaProduccion(categoria, produccion) {
    var objectStore = db.transaction([DB_CATEGORIAS], "readwrite").objectStore(DB_CATEGORIAS);
    var request = objectStore.get(categoria.name);

    request.onsuccess = function (event) {
        var data = request.result;

        var lista = data.producciones;

        for (var i = 0; i < lista.length; i++) {

            //console.log(lista[i].title == produccion.title);

            if (lista[i].title == produccion.title) {
                lista.splice(i, 1);
            }
        }

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("La producción no se ha podido desasignar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Producción desasignada a la categoría.");
        };
    };
}

function desasignarDirectorProduccion(director, produccion) {
    var objectStore = db.transaction([DB_DIRECTORES], "readwrite").objectStore(DB_DIRECTORES);
    var request = objectStore.get(director.name);

    request.onsuccess = function (event) {
        var data = request.result;

        var lista = data.producciones;

        for (var i = 0; i < lista.length; i++) {

            //console.log(lista[i].title == produccion.title);

            if (lista[i].title == produccion.title) {
                lista.splice(i, 1);
            }
        }

        var requestUpdate = objectStore.put(data);

        requestUpdate.onerror = function (event) {
            console.log("La producción no se ha podido desasignar.");
        };

        requestUpdate.onsuccess = function (event) {
            console.log("Producción desasignada al director.");
        };
    };
}
