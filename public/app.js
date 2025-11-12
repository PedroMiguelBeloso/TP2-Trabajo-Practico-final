const API_BASE = `${window.location.origin}/api`;
document.getElementById("backend-url").textContent = API_BASE;

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

const statusEl = document.getElementById("status");
function setStatus(text, isError = false) {
	statusEl.textContent = text;
	statusEl.style.color = isError ? "#ef4444" : "#10b981";
}

async function http(method, path, body) {
	const opts = { method, headers: { "Content-Type": "application/json" } };
	if (body) opts.body = JSON.stringify(body);
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

const listaAnimales = document.getElementById("lista-animales");
const refreshAnimalesBtn = document.getElementById("refresh-animales");
const formAnimal = document.getElementById("form-animal");
const formEditarAnimal = document.getElementById("form-editar-animal");
const cancelarEditarAnimalBtn = document.getElementById(
	"cancelar-editar-animal"
);
let editingAnimalId = null;

function animalItemTemplate(a) {
	const li = document.createElement("li");
	li.className = "item";
	li.innerHTML = `
    <div>
      <div><strong>${a.nombre}</strong> — ${a.especie} (${a.raza})</div>
      <div class="meta">Edad: ${a.edad} · Vacunado: ${
		a.vacunado ? "Sí" : "No"
	} · Adoptado: ${a.adoptado ? "Sí" : "No"}</div>
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

async function crearAnimal(formData) {
	const body = {
		nombre: formData.get("nombre"),
		especie: formData.get("especie"),
		edad: Number(formData.get("edad")),
		raza: formData.get("raza"),
		vacunado: formData.get("vacunado") === "true",
	};
	await http("POST", "/animales", body);
}

async function actualizarAnimal(id, body) {
	await http("PUT", `/animales/${id}`, body);
	setStatus("Animal actualizado");
	await cargarAnimales();
}

formAnimal.addEventListener("submit", async (e) => {
	e.preventDefault();
	const fd = new FormData(formAnimal);
	try {
		await crearAnimal(fd);
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
	const fd = new FormData(formEditarAnimal);
	const body = {
		nombre: fd.get("nombre"),
		especie: fd.get("especie"),
		edad: Number(fd.get("edad")),
		raza: fd.get("raza"),
		vacunado: fd.get("vacunado") === "true",
		adoptado: fd.get("adoptado") === "true",
	};
	try {
		await actualizarAnimal(editingAnimalId, body);
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

const listaUsuarios = document.getElementById("lista-usuarios");
const refreshUsuariosBtn = document.getElementById("refresh-usuarios");
const formUsuario = document.getElementById("form-usuario");
const formEditarUsuario = document.getElementById("form-editar-usuario");
const cancelarEditarUsuarioBtn = document.getElementById(
	"cancelar-editar-usuario"
);
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

async function crearUsuario(formData) {
	const body = {
		nombre: formData.get("nombre"),
		apellido: formData.get("apellido"),
		correo: formData.get("correo"),
		password: formData.get("password"),
		fechaNacimiento: formData.get("fechaNacimiento"),
	};
	await http("POST", "/usuarios", body);
}

async function actualizarUsuario(id, body) {
	await http("PUT", `/usuarios/${id}`, body);
	setStatus("Usuario actualizado");
	await cargarUsuarios();
}

formUsuario.addEventListener("submit", async (e) => {
	e.preventDefault();
	const fd = new FormData(formUsuario);
	try {
		await crearUsuario(fd);
		formUsuario.reset();
		setStatus("Usuario creado");
		await cargarUsuarios();
	} catch (e) {
		setStatus(`Error: ${e.message}`, true);
	}
});

refreshUsuariosBtn.addEventListener("click", cargarUsuarios);

formEditarUsuario.addEventListener("submit", async (e) => {
	e.preventDefault();
	if (!editingUsuarioId) return;
	const fd = new FormData(formEditarUsuario);
	const body = {
		nombre: fd.get("nombre"),
		apellido: fd.get("apellido"),
		correo: fd.get("correo"),
		fechaNacimiento: fd.get("fechaNacimiento"),
	};
	try {
		await actualizarUsuario(editingUsuarioId, body);
		formEditarUsuario.reset();
		formEditarUsuario.style.display = "none";
		formUsuario.style.display = "grid";
		editingUsuarioId = null;
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

setTab("animales");
cargarAnimales();
cargarUsuarios();
