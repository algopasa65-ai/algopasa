document.addEventListener('DOMContentLoaded', () => {
  cargarNoticias();
});

async function cargarNoticias() {
  try {
    const respuesta = await fetch('noticias.json');
    const noticias = await respuesta.json();

    if (!noticias || noticias.length === 0) return;

    // 1. Renderizar Noticia Principal (Primer objeto del JSON)
    const principal = noticias[0];
    const elemPrincipal = document.getElementById('noticia-principal');
    
    if (elemPrincipal) {
      elemPrincipal.innerHTML = `
        <div class="tag-categoria">${principal.categoria}</div>
        <h2><a href="${principal.link}" target="_blank" style="color:white; text-decoration:none;">${principal.titulo}</a></h2>
        <p>${principal.descripcion}</p>
        <span class="tiempo">🕒 ${principal.fecha}</span>
      `;
      
      // Aplicar imagen de fondo si está presente
      if (principal.imagen) {
        elemPrincipal.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${principal.imagen}')`;
        elemPrincipal.style.backgroundSize = 'cover';
        elemPrincipal.style.backgroundPosition = 'center';
      }
    }

    // 2. Renderizar Noticias Secundarias (Resto de los objetos)
    const contenedorSecundarias = document.getElementById('noticias-secundarias');
    if (contenedorSecundarias) {
      contenedorSecundarias.innerHTML = ''; // Borra el contenido de maqueta

      noticias.slice(1).forEach(item => {
        contenedorSecundarias.innerHTML += `
          <div class="tarjeta-categoria">
            <div class="bloque-categoria">${item.categoria}</div>
            <div class="info-noticia">
              <h3><a href="${item.link}" target="_blank" style="color:inherit; text-decoration:none;">${item.titulo}</a></h3>
              <span class="tiempo">🕒 ${item.fecha}</span>
            </div>
          </div>
        `;
      });
    }

  } catch (error) {
    console.error('Error al conectar con noticias.json:', error);
  }
}
