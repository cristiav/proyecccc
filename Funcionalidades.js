// Función de navegación entre secciones
function show(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sec).classList.add('active');
}

// Función para cargar resumen de productos y eventos
function cargarResumen() {
  let inv = JSON.parse(localStorage.getItem("inv")) || [];
  let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  document.getElementById("resumen").innerHTML = `
    <div class="card">📦 Productos: ${inv.length}</div>
    <div class="card">📢 Eventos: ${eventos.length}</div>
  `;
}

// Funciones para la sección de Compras
function generarConsecutivo() {
  let n = localStorage.getItem('oc') || 0;
  n++;
  localStorage.setItem('oc', n);
  document.getElementById('ocNumber').value = "OC-" + String(n).padStart(4, '0');
}

function calcularTotal() {
  let base = parseFloat(document.getElementById('valorBase').value) || 0;
  let iva = parseFloat(document.getElementById('iva').value) || 0;
  let total = base + (base * iva);
  document.getElementById('total').innerText = total.toLocaleString();
}

// Funciones para gestionar inventario
function agregarInv() {
  let p = prod.value;
  let c = parseInt(cant.value);
  let pr = parseFloat(precio.value);

  if (!p || !c || !pr) return;

  let inv = JSON.parse(localStorage.getItem("inv")) || [];
  inv.push({ p, c, pr });
  localStorage.setItem("inv", JSON.stringify(inv));

  mostrarInv();
}

function mostrarInv() {
  let lista = document.getElementById("listaInv");
  lista.innerHTML = "";

  let inv = JSON.parse(localStorage.getItem("inv")) || [];

  if (inv.length === 0) {
    lista.innerHTML = "<p>No hay productos</p>";
    return;
  }

  inv.forEach((i, index) => {
    lista.innerHTML += `
      <div class="card-inv">
        <h4>${i.p}</h4>
        <p>Stock: ${i.c}</p>
        <p>$${i.pr}</p>
        <button onclick="eliminarInv(${index})">Eliminar</button>
      </div>
    `;
  });
}

// Funciones para la sección de Marketing
let mesActual = new Date().getMonth();
let añoActual = new Date().getFullYear();
let fechaSel = "";

function cambiarMes(n) {
  mesActual += n;
  if (mesActual < 0) { mesActual = 11; añoActual--; }
  if (mesActual > 11) { mesActual = 0; añoActual++; }
  generarCalendario();
}

function generarCalendario() {
  let cal = document.getElementById("calendar");
  cal.innerHTML = "";

  let dias = new Date(añoActual, mesActual + 1, 0).getDate();

  mes.innerText = `${mesActual + 1}/${añoActual}`;

  let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  for (let i = 1; i <= dias; i++) {
    let fecha = `${añoActual}-${mesActual + 1}-${i}`;

    let d = document.createElement("div");
    d.classList.add("day");

    d.innerHTML = `<strong>${i}</strong>`;

    eventos.filter(e => e.fecha === fecha)
      .forEach(e => {
        d.innerHTML += `<div class="event">${e.titulo}</div>`;
      });

    d.onclick = () => {
      fechaSel = fecha;
      verEventos();
    };

    cal.appendChild(d);
  }
}

function verEventos() {
  let cont = document.getElementById("eventosDia");
  cont.innerHTML = "";

  let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  eventos
    .filter(e => e.fecha === fechaSel)
    .forEach((e, i) => {
      cont.innerHTML += `
        <div class="card">
          <strong>${e.titulo}</strong><br>
          ${e.detalle}
          <button onclick="eliminarEvento(${i})">Eliminar</button>
        </div>
      `;
    });
}

function guardarEvento() {
  if (!fechaSel) { alert("Selecciona un día"); return; }

  let t = titulo.value;
  let d = detalle.value;

  let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  eventos.push({ fecha: fechaSel, titulo: t, detalle: d });

  localStorage.setItem("eventos", JSON.stringify(eventos));

  generarCalendario();
  verEventos();
  cargarResumen();
}

function eliminarEvento(i) {
  let eventos = JSON.parse(localStorage.getItem("eventos"));

  eventos.splice(i, 1);

}