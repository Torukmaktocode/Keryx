import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(RAIZ, 'coalicion');
const JSONL = join(DIR, 'articulos.jsonl');
const LOG = join(DIR, 'minado.log');
const ESTADO = join(DIR, 'estado.json');
const BASE = 'https://www.coalicionporelevangelio.org';
const AGENTE = 'Keryx-Estudio/0.4 (+uso personal; coalicionporelevangelio.org)';
const CONCURRENCIA = 10;
const PAUSA = 120;

const TAXONOMIA = {
  'Biblia y teología': {
    'Conociendo la Biblia': ['antiguo-testamento', 'canon-biblico', 'doctrina-biblica', 'historia-de-la-redencion', 'inerrancia-biblica', 'interpretacion-biblica', 'lenguas-originales', 'ley-de-dios', 'libros-de-la-biblia', 'nuevo-testamento', 'pactos', 'personajes-de-la-biblia', 'profecia-biblica', 'reino-de-dios', 'sola-scriptura', 'textos-dificiles', 'versiones-de-la-biblia'],
    'Nuestro Dios': ['amor-de-dios', 'atributos-de-dios', 'espiritu-santo', 'gloria-de-dios', 'soberania-de-dios', 'trinidad'],
    'Creación y caída': ['angeles', 'creacion', 'guerra-espiritual', 'imagen-de-dios', 'pecado', 'satanas-y-demonios'],
    'Nuestra salvación': ['cielo-e-infierno', 'conversion', 'creer-en-dios', 'evangelio-biblico', 'gracia', 'justicia', 'justificacion', 'legalismo', 'nuevo-nacimiento', 'perseverancia-del-creyente', 'predestinacion-y-eleccion', 'salvacion', 'santidad-y-santificacion', 'ultimos-tiempos'],
    'El Mesías': ['jesucristo', 'navidad', 'regreso-de-cristo', 'semana-santa'],
    'Teología general': ['calvinismo', 'teologia-biblica', 'teologia-reformada', 'teologia-sistematica'],
  },
  'Vida cristiana': {
    'Asuntos de la vida': ['adopcion', 'amistad-cristiana', 'amor-cristiano', 'belleza-verdadera', 'coronavirus-covid-19', 'crianza', 'depresion', 'divorcio', 'enfermedad-y-muerte', 'enojo', 'esperanza', 'estudios', 'etica-laboral', 'familia-cristiana', 'evangelio-y-trabajo', 'feminidad-biblica', 'finanzas-biblicas', 'generosidad', 'gozo', 'gratitud', 'hombre-cristiano', 'hospitalidad', 'humildad', 'identidad-cristiana', 'idolatria', 'llamado-y-vocacion', 'maternidad', 'matrimonio', 'mayordomia', 'miedo-y-ansiedad', 'mujer-cristiana', 'noviazgo', 'obediencia', 'paternidad', 'perdon', 'persecucion', 'pornografia', 'productividad', 'redes-sociales', 'relaciones', 'sabiduria-y-discernimiento', 'sexualidad-biblica', 'solteria', 'sufrimiento', 'tentacion', 'vejez-cristiana', 'viudez', 'voluntad-de-dios'],
    'Creciendo espiritualmente': ['arrepentimiento', 'ayuno', 'caracter-cristiano', 'conciencia', 'congregar', 'contentamiento', 'crecimiento-espiritual', 'disciplinas-espirituales', 'libros-cristianos', 'oracion', 'vida-devocional'],
  },
  'Cosmovisión y cultura': {
    'Defensa de la fe': ['apologetica', 'catolicismo-romano', 'creacionismo', 'evangelio-de-la-prosperidad', 'falsas-ensenanzas', 'falsos-maestros', 'fe-y-ciencia', 'legalismo', 'religiones'],
    'Cultura': ['arte', 'cine-y-television', 'deportes', 'educacion', 'entretenimiento', 'filosofia', 'literatura', 'musica', 'tecnologia', 'eventos-actuales'],
    'Temas éticos': ['aborto', 'bioetica-cristiana', 'desastres-naturales', 'etica-cristiana', 'eutanasia', 'guerra', 'homosexualidad', 'ideologia-de-genero', 'libertad-religiosa', 'medio-oriente', 'migracion', 'pobreza', 'politica', 'psicologia', 'racismo', 'salud-mental', 'terrorismo'],
  },
  'Iglesia y ministerio': {
    'La iglesia en el tiempo': ['biografias-cristianas', 'confesiones-y-catecismos', 'denominaciones-cristianas', 'eclesiologia', 'historia-de-la-iglesia', 'nueva-reforma', 'reforma-protestante'],
    'Prácticas de la iglesia': ['bautismo', 'cena-del-senor', 'diezmo-y-ofrendas', 'discipulado', 'dones-espirituales', 'evangelismo', 'membresia-de-la-iglesia', 'misiones'],
    'Vida de la iglesia': ['alabanza-y-adoracion', 'centralidad-del-evangelio', 'complementarianismo', 'consejeria-biblica', 'crecimiento-de-la-iglesia', 'esposa-del-pastor', 'grupos-pequenos', 'iglesias-sanas', 'organizacion-de-la-iglesia', 'seminario', 'servicio-en-la-iglesia'],
    'Ministerio': ['equipo-pastoral', 'liderazgo-espiritual', 'ministerio-de-mujeres', 'ministerio-de-ninos', 'ministerio-pastoral', 'ministerios-de-jovenes-y-adolescentes', 'plantacion-de-iglesias', 'predicacion', 'revitalizacion-de-iglesias'],
  },
};

const TEMA_NOMBRES = new Map();
for (const seccion of Object.keys(TAXONOMIA)) {
  for (const sub of Object.keys(TAXONOMIA[seccion])) {
    for (const slug of TAXONOMIA[seccion][sub]) {
      TEMA_NOMBRES.set(slug.toLowerCase(), { slug, seccion, sub });
    }
  }
}
const NOM_TEMA = (slug) => {
  const t = TEMA_NOMBRES.get(slug.toLowerCase());
  if (t) return t.slug === slug ? slug : slug;
  return slug;
};

const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#8217;': '\u2019', '&nbsp;': ' ', '&mdash;': '\u2014', '&ndash;': '\u2013', '&hellip;': '\u2026', '&rsquo;': '\u2019', '&ldquo;': '\u201c', '&rdquo;': '\u201d', '&laquo;': '\u00ab', '&raquo;': '\u00bb', '&eacute;': '\u00e9', '&aacute;': '\u00e1', '&iacute;': '\u00ed', '&oacute;': '\u00f3', '&uacute;': '\u00fa', '&ntilde;': '\u00f1', '&ordf;': '\u00aa', '&ordm;': '\u00ba', '&#8211;': '\u2013', '&#8216;': '\u2018', '&#8220;': '\u201c', '&#8221;': '\u201d', '&#8230;': '\u2026', '&#038;': '&' };
const decod = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/(?:&[a-zA-Z#0-9]+;)/g, (e) => ENTIDADES[e] ?? ' ');
const log = (m) => appendFileSync(LOG, `${new Date().toISOString()} ${m}\n`);

function textoDeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|h3|h4|li|blockquote)>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n\u2022 ')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cuerpo(html) {
  const i = html.indexOf('class="entry-content"');
  if (i < 0) return '';
  let fin = html.indexOf('</article>', i);
  if (fin < 0) fin = html.indexOf('class="row card_row_wrap"', i);
  if (fin < 0) fin = html.length;
  return textoDeHtml(html.slice(i, fin).replace('class="entry-content"', ''));
}

function esquema(html) {
  const m = html.match(/<script type="application\/ld\+json" id="tgc-article-schema">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

function metas(html, prop) {
  const r = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`);
  return html.match(r)?.[1] ?? '';
}

async function pedir(url, intentos = 3) {
  for (let n = 1; n <= intentos; n++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 30000);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': AGENTE, 'Accept': 'text/html,application/xhtml+xml' }, signal: ctl.signal, redirect: 'follow' });
      const txt = await r.text();
      clearTimeout(t);
      if (r.ok) return txt;
      if (r.status === 404 || r.status === 301) { log(`UNREACH ${r.status} ${url}`); return null; }
      throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      clearTimeout(t);
      if (n === intentos) { log(`FALLO ${url} :: ${e.message}`); return null; }
      await new Promise((r) => setTimeout(r, 800 * n * n));
    }
  }
}

async function cola(urls, fn) {
  let idx = 0, hechos = 0;
  const total = urls.length;
  const obreras = Array.from({ length: CONCURRENCIA }, async () => {
    while (true) {
      const i = idx++;
      if (i >= total) break;
      await fn(urls[i], i);
      hechos++;
      if (hechos % 25 === 0) {
        writeFileSync(ESTADO, JSON.stringify({ total, hechos, ts: new Date().toISOString() }));
        console.log(`${hechos}/${total}`);
      }
    }
  });
  await Promise.all(obreras);
  writeFileSync(ESTADO, JSON.stringify({ total, hechos, ts: new Date().toISOString(), fin: true }));
}

async function minar(limite = 0) {
  mkdirSync(DIR, { recursive: true });
  const setSet = new Set();
  const nSitemaps = limite > 0 ? 3 : 80;
  await cola(Array.from({ length: nSitemaps }, (_, i) => `${BASE}/article-sitemap${i + 1}.xml`), async (u) => {
    const xml = await pedir(u);
    if (!xml) return;
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) setSet.add(m[1]);
  });
  let urls = [...setSet];
  if (limite > 0) urls = urls.slice(0, limite);
  log(`sitemaps leidos: ${setSet.size} urls`);
  const yaHechos = new Set();
  if (existsSync(JSONL)) {
    for (const line of readFileSync(JSONL, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try { yaHechos.add(JSON.parse(line).url); } catch { }
    }
  }
  const pendi = urls.filter((u) => !yaHechos.has(u) && !/\/articulo\/(page\/\d+\/?)?$/.test(u));
  log(`total urls: ${setSet.size}; ya hechas: ${yaHechos.size}; pendiente: ${pendi.length}`);
  await cola(pendi, async (url) => {
    const html = await pedir(url);
    if (!html) { appendFileSync(JSONL, JSON.stringify({ url, vacio: true }) + '\n'); return; }
    const es = esquema(html);
    if (!es?.headline && !metas(html, 'og:title')) { log(`SIN METADATOS ${url}`); appendFileSync(JSONL, JSON.stringify({ url, vacio: true }) + '\n'); return; }
    const tipo = (url.match(/\.org\/([a-z-]+)\//) || [])[1] ?? 'articulo';
    const claseArt = html.match(/<article\s+class="([^"]*)type-article([^"]*)"/)?.slice(1).join('') ?? '';
    const cats = [...claseArt.matchAll(/category-([a-z0-9_-]+)/g)].map((m) => m[1]);
    const etiquetas = [...claseArt.matchAll(/tag-([a-z0-9_-]+)/g)].map((m) => m[1]);
    const temasDeEnlaces = [...html.matchAll(/href="https:\/\/www\.coalicionporelevangelio\.org\/temas\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]).filter((s) => TEMA_NOMBRES.has(s));
    const temasDeEtiquetas = etiquetas.filter((s) => TEMA_NOMBRES.has(s));
    const temas = [...new Set([...temasDeEnlaces, ...temasDeEtiquetas])];
    const texto = decod(cuerpo(html));
    appendFileSync(JSONL, JSON.stringify({
      url,
      tipo,
      titulo: decod(es?.headline || metas(html, 'og:title') || '').trim(),
      descripcion: decod(es?.description || metas(html, 'description') || '').trim(),
      autor: es?.author?.map((a) => ({ nombre: decod(a.name), slug: (a.sameAs || '').split('/autor/')[1]?.replace(/\/$/, '') })) || [],
      fecha: es?.datePublished || '',
      modificado: es?.dateModified || '',
      categorias: cats,
      temas,
      etiquetas,
      texto,
    }) + '\n');
  });
  console.log('MINA LISTA');
}

function aplanarTrad() {
  const filas = [];
  for (const line of readFileSync(JSONL, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { filas.push(JSON.parse(line)); } catch { }
  }
  return filas.filter((f) => f.texto !== undefined && f.url);
}

function listado() {
  const filas = aplanarTrad();
  const porTema = new Map();
  const sinTema = [];
  for (const f of filas) {
    const dt = f.fecha ? f.fecha.slice(0, 10) : '';
    const item = { titulo: f.titulo, url: f.url, fecha: dt, autor: (f.autor || []).map((a) => a.nombre).join(', '), txt: (f.texto || '').length };
    if (!f.temas || f.temas.length === 0) { sinTema.push(item); continue; }
    for (const t of f.temas) {
      if (!porTema.has(t)) porTema.set(t, []);
      porTema.get(t).push(item);
    }
  }
  const lineas = [];
  lineas.push('# Catálogo Coalición por el Evangelio — temas y textos');
  lineas.push('');
  lineas.push(`- Fuente: https://www.coalicionporelevangelio.org/`);
  lineas.push(`- Artículos con texto completo: ${filas.length}`);
  lineas.push('- Derechos de autor de los artículos: © Coalición por el Evangelio y sus autores; uso citable conforme a su página de permisos.');
  lineas.push('');
  for (const seccion of Object.keys(TAXONOMIA)) {
    lineas.push(`## ${seccion}`);
    lineas.push('');
    for (const sub of Object.keys(TAXONOMIA[seccion])) {
      lineas.push(`### ${sub}`);
      lineas.push('');
      for (const slug of TAXONOMIA[seccion][sub]) {
        const arts = porTema.get(slug) ?? [];
        if (arts.length === 0) continue;
        lineas.push(`#### ${NOM_TEMA(slug)} (${arts.length})`);
        lineas.push('');
        const orden = [...arts].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.titulo.localeCompare(b.titulo));
        for (const a of orden) lineas.push(`- ${a.titulo} — ${a.autor} (${a.fecha}) [${a.txt} chars] ${a.url}`);
        lineas.push('');
      }
    }
  }
  lineas.push(`## Sin tema asignado (${sinTema.length})`);
  lineas.push('');
  sinTema.sort((a, b) => a.fecha.localeCompare(b.fecha));
  for (const a of sinTema) lineas.push(`- ${a.titulo} — ${a.autor} (${a.fecha}) [${a.txt} chars] ${a.url}`);
  writeFileSync(join(DIR, 'catalogo-temas-textos.md'), lineas.join('\n'), 'utf8');

  const indice = {};
  for (const [slug, arts] of porTema) {
    const meta = TEMA_NOMBRES.get(slug.toLowerCase()) ?? { seccion: 'Sin clasificar', sub: 'Sin clasificar' };
    const k = `${meta.seccion} > ${meta.sub}`;
    (indice[k] ||= []).push({ slug, total: arts.length, articulos: arts.sort((a, b) => b.fecha.localeCompare(a.fecha)) });
  }
  writeFileSync(join(DIR, 'indice-temas.json'), JSON.stringify(indice, null, 2), 'utf8');
  console.log(`LISTADO OK: ${filas.length} artículos, ${porTema.size} temas con contenido, ${sinTema.length} sin tema`);
}

const modo = process.argv[2] ?? 'minar';
if (modo === 'minar') minar(Number(process.argv[3] ?? 0) || 0).catch((e) => { log(`FATAL ${e.message}`); console.error(e); process.exit(1); });
else if (modo === 'listado') listado();
