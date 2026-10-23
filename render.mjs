import { partners, formatDate, projectStatus } from './content.mjs';

export const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>'
};

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

export function projectRow(project, today) {
  const status = projectStatus(project, today);
  return `<article class="project-row">
    <div class="project-name"><h3>${escapeHTML(project.title)}</h3><span class="project-status${status === 'Em andamento' ? ' is-current' : ''}">${status}</span></div>
    <p class="project-partner"><span class="mobile-label">Parceria</span>${partners[project.partner].label}</p>
    <p class="project-date"><span class="mobile-label">Início</span><time datetime="${project.start}">${formatDate(project.start)}</time></p>
    <p class="project-date"><span class="mobile-label">Término</span><time datetime="${project.end}">${formatDate(project.end)}</time></p>
    <a href="?projeto=${project.id}#projetos" class="text-link project-open" data-project="${project.id}">Ver projeto <span class="sr-only">${escapeHTML(project.title)}</span>${icons.arrow}</a>
  </article>`;
}

export function photoCard(photo) {
  return `<button type="button" class="photo-card" data-photo="${photo.id}" aria-label="Ampliar ${escapeHTML(photo.title)}">
    <img src="assets/fotos/${photo.id}-720.webp" srcset="assets/fotos/${photo.id}-720.webp 720w, assets/fotos/${photo.id}.webp ${photo.width}w" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 46vw, 30vw" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escapeHTML(photo.alt)}">
    <span class="photo-caption"><span><small>${photo.category}</small><strong>${escapeHTML(photo.title)}</strong></span>${icons.expand}</span>
  </button>`;
}
