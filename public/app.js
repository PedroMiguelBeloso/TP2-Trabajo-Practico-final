/* --- URL del backend --- */
const API_BASE = `${window.location.origin}/api`;
document.getElementById("backend-url").textContent = API_BASE;

/* --- Sistema de tabs --- */
const tabAnimales = document.getElementById("tab-animales");
const tabUsuarios = document.getElementById("tab-usuarios");
const viewAnimales = document.getElementById("view-animales");
const viewUsuarios = document.getElementById("view-usuarios");

function setTab(tab) {
	const isAnimales = tab === "animales";
	tabAnimales.classList.toggle("active", isAnimales);
	tabUsuarios.classList.toggle("active", !isAnimales);
	viewAnimales.classList.toggle("active", isAnimales);
	viewUsuarios.classList.toggle("active", !isAnimales);
}

tabAnimales.addEventListener("click", () => setTab("animales"));
tabUsuarios.addEventListener("click", () => setTab("usuarios"));

/* --- Estado visual inferior --- */
const statusEl = document.getElementById("status");
function setStatus(text, isError = false) {
	statusEl.textContent = text;
	statusEl.style.color = isError ? "#ef4444" : "#10b981";
}

/* --- Helper Request --- */
async function http(method, path, body, isFormData = false) {
	const opts = { method };

	if (!isFormData) {
		opts.headers = { "Content-Type": "application/json" };
		if (body) opts.body = JSON.stringify(body);
	} else {
		opts.body = body; // FormData
	}

	const res = await fetch(`${API_BASE}${path}`, opts);

	if (!res.ok) {
		let msg = `${res.status} ${res.statusText}`;
		try {
			const j = await res.json();
			msg = j.error || JSON.stringify(j);
		} catch {}
		throw new Error(msg);
	}

	try {
		return await res.json();
	} catch {
		return null;
	}
}

/* --- Animales --- */
const listaAnimales = document.getElementById("lista-animales");
const refreshAnimalesBtn = document.getElementById("refresh-animales");
const formAnimal = document.getElementById("form-animal");
const formEditarAnimal = document.getElementById("form-editar-animal");
const cancelarEditarAnimalBtn = document.getElementById("cancelar-editar-animal");
let editingAnimalId = null;

function animalItemTemplate(a) {
	const li = document.createElement("li");
	li.className = "item";
li.innerHTML = `
	<div class="card-image-container">
		<img src="${a.foto}" alt="Foto de ${a.nombre}">
	</div>
	<div class="card-content">
		<div><strong>${a.nombre}</strong> — ${a.especie} (${a.raza})</div>
		<div class="meta">Edad: ${a.edad} · Vacunado: ${a.vacunado ? "Sí" : "No"} · Adoptado: ${a.adoptado ? "Sí" : "No"}</div>
		<div class="meta">ID: ${a._id || a.id || "N/A"}</div>
	</div>
	<div class="actions">
		<button class="btn primary">Editar</button>
		<button class="btn danger">Eliminar</button>
	</div>
`;

	const id = a._id || a.id;
	const [btnEditar, btnEliminar] = li.querySelectorAll("button");

	btnEliminar.addEventListener("click", async () => {
		if (!id) return alert("ID inválido");
		if (!confirm("¿Eliminar este animal?")) return;
		try {
			await http("DELETE", `/animales/${id}`);
			setStatus("Animal eliminado");
			await cargarAnimales();
		} catch (e) {
			setStatus(`Error: ${e.message}`, true);
		}
	});

	btnEditar.addEventListener("click", () => {
		editingAnimalId = id;
		formEditarAnimal.style.display = "grid";
		formAnimal.style.display = "none";

		formEditarAnimal.nombre.value = a.nombre || "";
		formEditarAnimal.especie.value = a.especie || "";
		formEditarAnimal.edad.value = a.edad ?? "";
		formEditarAnimal.raza.value = a.raza || "";
		formEditarAnimal.vacunado.value = a.vacunado ? "true" : "false";
		formEditarAnimal.adoptado.value = a.adoptado ? "true" : "false";
	});

	return li;
}

async function cargarAnimales() {
	try {
		const data = await http("GET", "/animales");
		listaAnimales.innerHTML = "";
		data.forEach((a) => listaAnimales.appendChild(animalItemTemplate(a)));
		setStatus(`Se cargaron ${data.length} animales`);
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
}

/* Crear animal con foto */
async function crearAnimal(form) {
	const fd = new FormData(form); // incluye foto
	await http("POST", "/animales", fd, true);
}

/* Editar animal con posible nueva foto */
async function actualizarAnimal(id, form) {
	const fd = new FormData(form);
	await http("PUT", `/animales/${id}`, fd, true);
	setStatus("Animal actualizado");
	await cargarAnimales();
}

formAnimal.addEventListener("submit", async (e) => {
	e.preventDefault();
	try {
		await crearAnimal(formAnimal);
		formAnimal.reset();
		setStatus("Animal creado");
		await cargarAnimales();
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
});

formEditarAnimal.addEventListener("submit", async (e) => {
	e.preventDefault();
	if (!editingAnimalId) return;
	try {
		await actualizarAnimal(editingAnimalId, formEditarAnimal);
		formEditarAnimal.reset();
		formEditarAnimal.style.display = "none";
		formAnimal.style.display = "grid";
		editingAnimalId = null;
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
});

cancelarEditarAnimalBtn.addEventListener("click", () => {
	formEditarAnimal.reset();
	formEditarAnimal.style.display = "none";
	formAnimal.style.display = "grid";
	editingAnimalId = null;
});

refreshAnimalesBtn.addEventListener("click", cargarAnimales);

/* --- Usuarios --- */
const listaUsuarios = document.getElementById("lista-usuarios");
const refreshUsuariosBtn = document.getElementById("refresh-usuarios");
const formUsuario = document.getElementById("form-usuario");
const formEditarUsuario = document.getElementById("form-editar-usuario");
const cancelarEditarUsuarioBtn = document.getElementById("cancelar-editar-usuario");
let editingUsuarioId = null;

function usuarioItemTemplate(u) {
	const li = document.createElement("li");
	li.className = "item";
	li.innerHTML = `
    <div>
      <div><strong>${u.nombre} ${u.apellido}</strong></div>
      <div class="meta">Correo: ${u.correo}</div>
      <div class="meta">Nacimiento: ${
				u.fechaNacimiento
					? new Date(u.fechaNacimiento).toLocaleDateString()
					: "-"
			}</div>
      <div class="meta">ID: ${u._id || u.id || "N/A"}</div>
    </div>
    <div class="actions">
      <button class="btn primary">Editar</button>
      <button class="btn danger">Eliminar</button>
    </div>
  `;

	const id = u._id || u.id;
	const [btnEditar, btnEliminar] = li.querySelectorAll("button");

	btnEliminar.addEventListener("click", async () => {
		if (!id) return alert("ID inválido");
		if (!confirm("¿Eliminar este usuario?")) return;
		try {
			await http("DELETE", `/usuarios/${id}`);
			setStatus("Usuario eliminado");
			await cargarUsuarios();
		} catch (e) {
			setStatus(`Error: ${e.message}`, true);
		}
	});

	btnEditar.addEventListener("click", () => {
		editingUsuarioId = id;
		formEditarUsuario.style.display = "grid";
		formUsuario.style.display = "none";

		formEditarUsuario.nombre.value = u.nombre || "";
		formEditarUsuario.apellido.value = u.apellido || "";
		formEditarUsuario.correo.value = u.correo || "";
		const d = u.fechaNacimiento ? new Date(u.fechaNacimiento) : null;
		formEditarUsuario.fechaNacimiento.value = d
			? d.toISOString().slice(0, 10)
			: "";
	});

	return li;
}

async function cargarUsuarios() {
	try {
		const data = await http("GET", "/usuarios");
		listaUsuarios.innerHTML = "";
		data.forEach((u) => listaUsuarios.appendChild(usuarioItemTemplate(u)));
		setStatus(`Se cargaron ${data.length} usuarios`);
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
}

formUsuario.addEventListener("submit", async (e) => {
	e.preventDefault();
	const fd = new FormData(formUsuario);
	const body = Object.fromEntries(fd.entries());
	try {
		await http("POST", "/usuarios", body);
		formUsuario.reset();
		setStatus("Usuario creado");
		await cargarUsuarios();
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
});

formEditarUsuario.addEventListener("submit", async (e) => {
	e.preventDefault();
	if (!editingUsuarioId) return;
	const fd = new FormData(formEditarUsuario);
	const body = Object.fromEntries(fd.entries());
	try {
		await http("PUT", `/usuarios/${editingUsuarioId}`, body);
		formEditarUsuario.reset();
		formEditarUsuario.style.display = "none";
		formUsuario.style.display = "grid";
		editingUsuarioId = null;
		setStatus("Usuario actualizado");
		await cargarUsuarios();
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
});

cancelarEditarUsuarioBtn.addEventListener("click", () => {
	formEditarUsuario.reset();
	formEditarUsuario.style.display = "none";
	formUsuario.style.display = "grid";
	editingUsuarioId = null;
});

refreshUsuariosBtn.addEventListener("click", cargarUsuarios);

/* --- Iniciales --- */
setTab("animales");
cargarAnimales();
cargarUsuarios();
