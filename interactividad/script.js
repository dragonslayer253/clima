const apiKey = "10df7c78ba6d4f23a2510846233108";
const buscarBtn = document.getElementById("buscar");
const ciudadInput = document.getElementById("ciudad");
const resultadoDiv = document.getElementById("resultado");
const opcionesLista = document.getElementById("opciones");
const barraAutocompletado = document.getElementById("barraAutocompletado");

buscarBtn.addEventListener("click", () => {
  const ciudad = ciudadInput.value;
  obtenerClima(ciudad);
});

ciudadInput.addEventListener("input", function() {
  const filtro = ciudadInput.value.toLowerCase();
  obtenerCiudades(filtro);
});

const obtenerCiudades = async (filtro) => {
  try {
    const respuesta = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${filtro}`
    );
    const data = await respuesta.json();
    const ciudadesFiltradas = data.map(ciudad => {
      const nombreCiudad = ciudad.name;
      const nombrePais = ciudad.country;
      return `${nombreCiudad}, ${nombrePais}`;
    });
    opcionesLista.innerHTML = "";
    ciudadesFiltradas.forEach(function(ciudadFiltrada) {
      const opcion = document.createElement("li");
      opcion.textContent = ciudadFiltrada;
      opcion.addEventListener("click", function() {
        ciudadInput.value = ciudadFiltrada;
        opcionesLista.innerHTML = "";
      });
      opcionesLista.appendChild(opcion);
    });
  } catch (error) {
    console.error("Error al obtener la lista de ciudades:", error);
  }
};

const obtenerClima = async (ciudad) => {
  try {
    const respuesta = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudad}`
    );
    const datos = await respuesta.json();
    mostrarClima(datos);
  } catch (error) {
    console.error("Error al obtener el clima:", error);
  }
};

const mostrarClima = (datos) => {
  const temperatura = datos.current.temp_c;
  const condiciones = datos.current.condition.text;
  const humedad = datos.current.humidity;
  const viento = datos.current.wind_kph;
  const presion = datos.current.pressure_mb;
  const ubicacion = datos.location.name;
  const pais = datos.location.country;
  const hora = new Date(datos.location.localtime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  resultadoDiv.innerHTML = `
    <h2>${ubicacion}, ${pais}</h2>
    <p>Temperatura: ${temperatura}°C</p>
    <p>Condiciones: ${condiciones}</p>
    <p>Humedad: ${humedad}%</p>
    <p>Viento: ${viento} km/h</p>
    <p>Presión: ${presion} mb</p>
    <p>Hora local: ${hora}</p>
  `;

  const mapaIframe = document.getElementById("gmap_canvas");
  const mapaURL = `https://maps.google.com/maps?q=${encodeURIComponent(ubicacion + ',' + pais)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  mapaIframe.src = mapaURL;
};

function mostrarOpciones(opciones) {
  barraAutocompletado.innerHTML = "";
  opciones.forEach(function(ciudadFiltrada) {
    const opcion = document.createElement("div");
    opcion.textContent = ciudadFiltrada;
    opcion.addEventListener("click", function() {
      ciudadInput.value = ciudadFiltrada;
      barraAutocompletado.innerHTML = "";
    });
    barraAutocompletado.appendChild(opcion);
  });
}