import { projects, partners, filterProjects, filterPhotos, formatDate, projectStatus, todayISO } from './content.mjs';
import { projectRow, photoCard, escapeHTML } from './render.mjs';

const $ = selector => document.querySelector(selector);
const queryState = { partner: 'todos', status: 'todos', query: '' };
const galleryState = { category: 'Todas', limit: 6, index: 0 };
const dialog = $('#detail-dialog');
let dialogKind = null;
let returnFocus = null;
let originalURL = null;

function updateProjects() {
  const matching = filterProjects(queryState);
  $('#project-results').innerHTML = matching.length
    ? matching.map(project => projectRow(project)).join('')
    : '<div class="empty-state"><h3>Nenhum projeto encontrado.</h3><p>Experimente outro nome ou altere os filtros.</p><button type="button" class="text-link" id="clear-project-filters">Limpar filtros</button></div>';
  $('#project-count').textContent = `${matching.length} ${matching.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}`;
}

function resetProjectFilters() {
  Object.assign(queryState, { partner: 'todos', status: 'todos', query: '' });
  $('#project-search').value = '';
  $('#project-status').value = 'todos';
  document.querySelectorAll('[data-partner]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.partner === 'todos')));
  updateProjects();
  $('#project-search').focus();
}

document.querySelectorAll('[data-partner]').forEach(button => button.addEventListener('click', () => {
  queryState.partner = button.dataset.partner;
  document.querySelectorAll('[data-partner]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  updateProjects();
}));
$('#project-search').addEventListener('input', event => { queryState.query = event.target.value; updateProjects(); });
$('#project-status').addEventListener('change', event => { queryState.status = event.target.value; updateProjects(); });
$('#project-results').addEventListener('click', event => { if (event.target.closest('#clear-project-filters')) resetProjectFilters(); });

function prepareDialog(kind, title) {
  if (!dialog.open) returnFocus = document.activeElement;
  dialogKind = kind;
  dialog.classList.toggle('is-photo-dialog', kind === 'photo');
  $('#dialog-title').textContent = title;
  $('#photo-navigation').hidden = kind !== 'photo';
  $('#dialog-counter').textContent = '';
}

function openProject(id, updateURL = true) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  prepareDialog('project', project.title);
  const partner = partners[project.partner];
  const status = projectStatus(project);
  $('#dialog-content').innerHTML = `<p class="dialog-category">${partner.label} <span aria-hidden="true">·</span> ${status}</p>
    <p class="dialog-intro">${escapeHTML(partner.audience)}</p>
    <dl class="project-facts"><div><dt>Início</dt><dd><time datetime="${project.start}">${formatDate(project.start)}</time></dd></div><div><dt>Término</dt><dd><time datetime="${project.end}">${formatDate(project.end)}</time></dd></div>${project.agreement ? `<div class="fact-wide"><dt>Instrumento</dt><dd>${escapeHTML(project.agreement)}</dd></div>` : ''}</dl>
    <h3>Parceria e recursos</h3><p>${escapeHTML(partner.description)}</p>
    <p class="dialog-note">Realização: Clube Atlético Brotense, em Brotas, São Paulo.</p>`;
  if (updateURL && !originalURL) {
    originalURL = location.href;
    const url = new URL(location.href);
    url.searchParams.set('projeto', id);
    url.hash = 'projetos';
    history.replaceState(null, '', url);
  }
  if (!dialog.open) dialog.showModal();
}

document.addEventListener('click', event => {
  const link = event.target.closest('[data-project]');
  if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
    event.preventDefault();
    openProject(link.dataset.project);
  }
});

function updateGallery() {
  const matching = filterPhotos(galleryState.category);
  $('#gallery-grid').innerHTML = matching.slice(0, galleryState.limit).map(photoCard).join('');
  $('#gallery-count').textContent = `${matching.length} ${matching.length === 1 ? 'fotografia' : 'fotografias'}`;
  $('#load-photos').hidden = matching.length <= galleryState.limit;
}

document.querySelectorAll('[data-gallery-filter]').forEach(button => button.addEventListener('click', () => {
  galleryState.category = button.dataset.galleryFilter;
  galleryState.limit = 6;
  document.querySelectorAll('[data-gallery-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  updateGallery();
}));
$('#load-photos').addEventListener('click', () => {
  const firstNewIndex = galleryState.limit;
  galleryState.limit += 6;
  updateGallery();
  $('#gallery-grid').children[firstNewIndex]?.focus({ preventScroll: true });
});

function openPhoto(index) {
  const matching = filterPhotos(galleryState.category);
  galleryState.index = (index + matching.length) % matching.length;
  const photo = matching[galleryState.index];
  prepareDialog('photo', photo.title);
  const image = document.createElement('img');
  image.src = `assets/fotos/${photo.id}.webp`;
  image.alt = photo.alt;
  image.width = photo.width;
  image.height = photo.height;
  $('#dialog-content').replaceChildren(image);
  $('#dialog-counter').textContent = `${galleryState.index + 1} de ${matching.length} · ${photo.category}`;
  if (!dialog.open) dialog.showModal();
}
$('#gallery-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-photo]');
  if (button) openPhoto(filterPhotos(galleryState.category).findIndex(item => item.id === button.dataset.photo));
});
$('#previous-photo').addEventListener('click', () => openPhoto(galleryState.index - 1));
$('#next-photo').addEventListener('click', () => openPhoto(galleryState.index + 1));
dialog.addEventListener('keydown', event => {
  if (dialogKind === 'photo' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    openPhoto(galleryState.index + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  if (originalURL) { history.replaceState(null, '', originalURL); originalURL = null; }
  dialogKind = null;
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
});

const menu = $('#menu-toggle');
const nav = $('#main-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 1121px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    nav.querySelectorAll('a').forEach(link => {
      if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}

const featured = projects[0];
$('#featured-status').textContent = projectStatus(featured);
$('#copyright-year').textContent = todayISO().slice(0, 4);
updateProjects();
updateGallery();
const linkedProject = new URL(location.href).searchParams.get('projeto');
if (linkedProject) openProject(linkedProject, false);
