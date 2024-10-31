const inputConversor = document.getElementById("inputConversor");
const parrafoResultado = document.getElementById("resultado");
const buscarBtn = document.getElementById("buscar-btn");
const ctx = document.getElementById("myLineChart").getContext("2d");

let monedas = [];
let lineChart;

// Función para obtener datos de la API
async function obtenerDatos() {
  try {
    const res = await fetch("https://mindicador.cl/api/");
    if (!res.ok) {
      throw new Error("Error en la red");
    }
    const data = await res.json();

    for (let key in data) {
      if (
        data[key].valor &&
        key !== "version" &&
        key !== "autor" &&
        key !== "fecha" &&
        key !== "tasa_desempleo"
      ) {
        monedas.push({
          nombre: key,
          valor: data[key].valor,
        });
      }
    }

    crearGrafico();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    parrafoResultado.innerHTML = "No se pudo obtener la información de la API.";
  }
}

// Función para crear el gráfico
function crearGrafico() {
  const labels = monedas.map((m) => m.nombre);
  const dataValues = monedas.map((m) => m.valor);

  if (lineChart) {
    lineChart.destroy(); // Destruir el gráfico anterior si existe
  }

  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valores de Monedas",
          data: dataValues,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Valor (CLP)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Monedas",
          },
        },
      },
    },
  });
}

// Función para calcular la moneda
function calcularMoneda() {
  try {
    const pesosChilenos = parseFloat(inputConversor.value);
    const monedaSeleccionada =
      document.getElementById("monedaSeleccionada").value;

    const moneda = monedas.find((m) => m.nombre === monedaSeleccionada);

    if (moneda && !isNaN(pesosChilenos)) {
      const resultado = pesosChilenos / moneda.valor;
      parrafoResultado.innerHTML = `Resultado: ${resultado.toFixed(2)}`;
    } else {
      parrafoResultado.innerHTML = `Moneda no encontrada o cantidad no válida.`;
    }
  } catch (error) {
    console.error("Error al calcular la moneda:", error);
    parrafoResultado.innerHTML = "Se produjo un error al calcular la moneda.";
  }
}

buscarBtn.addEventListener("click", calcularMoneda);

// Iniciar la obtención de datos
obtenerDatos();
