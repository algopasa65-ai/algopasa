document.addEventListener('DOMContentLoaded', () => {
  cargarNoticias();
});

async function cargarNoticias() {
  try {
    const respuesta = await fetch('noticias.json');
    const noticias = await respuesta.json();

    if (!noticias || noticias.length === 0) return;

    // 1. Cargar Noticia Principal
    const principal = noticias[0];
    const elemPrincipal = document.getElementById('noticia-principal');
    
    if (elemPrincipal) {
      const h1 = elemPrincipal.querySelector('h1');
      const p = elemPrincipal.querySelector('p');
      const small = elemPrincipal.querySelector('small');
      
      if (h1) h1.innerHTML = `<a href="${principal.link}" target="_blank" style="color:inherit; text-decoration:none;">${principal.titulo}</a>`;
      if (p) p.textContent = principal.descripcion;
      if (small) small.textContent = `🕒 ${principal.fecha}`;

      if (principal.imagen) {
        elemPrincipal.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('${principal.imagen}')`;
        elemPrincipal.style.backgroundSize = 'cover';
      }
    }

    // 2. Cargar Noticias Secundarias
    const contenedorSecundarias = document.getElementById('noticias-secundarias');
    if (contenedorSecundarias) {
      contenedorSecundarias.innerHTML = ''; 

      noticias.slice(1).forEach(item => {
        contenedorSecundarias.innerHTML += `
          <article class="mini-card">
            <div class="placeholder p1">${item.categoria}</div>
            <div class="mini-card-content">
              <h3><a href="${item.link}" target="_blank" style="color:inherit; text-decoration:none;">${item.titulo}</a></h3>
              <small>🕒 ${item.fecha}</small>
            </div>
          </article>
        `;
      });
    }

  } catch (error) {
    console.error('Error al conectar con noticias.json:', error);
  }
}
