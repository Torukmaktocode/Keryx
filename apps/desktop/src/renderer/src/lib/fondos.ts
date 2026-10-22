/**
 * Registro de fondos de presentación (sub-agente de código, 0 tokens).
 * Descubre los assets reales (bases PNG + variantes JPEG del script Python)
 * con import.meta.glob y calcula la luminancia de cada fondo para elegir
 * texto claro/oscuro + scrim. Determinista: mismo fondo → mismo estilo.
 */

export type TemaId = 'azules' | 'rojos' | 'luz'

export interface Fondo {
  id: string
  baseId: string
  tema: TemaId
  label: string
  url: string
  variante?: number
}

export interface FondoStyle {
  dark: boolean
  text: string
  scrim: string
  scrimTransparency: number
}

export const TEMAS: TemaId[] = ['azules', 'rojos', 'luz']

export const VARIANTE_LABELS: Record<number, string> = {
  1: 'Tono I',
  2: 'Tono II',
  3: 'Viñeta',
  4: 'Foco suave'
}

const BASE_META: Record<string, { tema: TemaId; label: string }> = {
  'azul-degradado-blanco': { tema: 'azules', label: 'Degradado azul y blanco' },
  'azul-espiral': { tema: 'azules', label: 'Espiral de luz azul' },
  'azul-estela-nocturna': { tema: 'azules', label: 'Estela azul nocturna' },
  'azul-futurista-cian': { tema: 'azules', label: 'Paisaje futurista cian' },
  'azul-nebulosa-violeta': { tema: 'azules', label: 'Nebulosa violeta y azul' },
  'azul-ondas-eterias': { tema: 'azules', label: 'Ondas azules etéreas' },
  'rojo-gradiente-crema': { tema: 'rojos', label: 'Gradiente rojo y crema' },
  'rojo-coral-crema': { tema: 'rojos', label: 'Coral y crema con grano' },
  'luz-aurora-ambar': { tema: 'luz', label: 'Aurora ámbar en la oscuridad' },
  'luz-estelas-cobre-oro': { tema: 'luz', label: 'Estelas de cobre y oro' },
  'luz-estelas-doradas': { tema: 'luz', label: 'Estelas doradas en movimiento' },
  'luz-fuga-cinematografica': { tema: 'luz', label: 'Fuga de luz cinematográfica' },
  'luz-rayos-dorados': { tema: 'luz', label: 'Rayos dorados entre humo' },
  'luz-resplandor-ambar-cian': { tema: 'luz', label: 'Resplandor ámbar y cian' },
  'luz-nebulosa-dorada': { tema: 'luz', label: 'Nebulosa dorada de energía' },
  'luz-ambar-chocolate': { tema: 'luz', label: 'Ámbar y chocolate' },
  'luz-nebulosa-polvo': { tema: 'luz', label: 'Nebulosa de polvo y color' }
}

const files = import.meta.glob('../assets/fondos/**/*.{png,jpg,jpeg}', {
  import: 'default',
  eager: true
}) as Record<string, string>

function buildRegistry(): Fondo[] {
  const fondos: Fondo[] = []
  for (const [path, url] of Object.entries(files)) {
    const match = /\/variantes\/(.+)\.v(\d+)\.(jpg|jpeg|png)$/i.exec(path)
    if (match) {
      const baseId = match[1]
      const variante = Number(match[2])
      const meta = BASE_META[baseId]
      if (!meta) continue
      fondos.push({
        id: `${baseId}.v${variante}`,
        baseId,
        tema: meta.tema,
        label: `${meta.label} · ${VARIANTE_LABELS[variante] ?? `variante ${variante}`}`,
        url,
        variante
      })
      continue
    }
    const baseMatch = /\/bases\/(.+)\.(png|jpg|jpeg)$/i.exec(path)
    if (!baseMatch) continue
    const baseId = baseMatch[1]
    const meta = BASE_META[baseId]
    if (!meta) continue
    fondos.push({ id: baseId, baseId, tema: meta.tema, label: meta.label, url })
  }
  return fondos.sort((a, b) => {
    const temaA = TEMAS.indexOf(a.tema)
    const temaB = TEMAS.indexOf(b.tema)
    if (temaA !== temaB) return temaA - temaB
    const labelA = a.variante == null ? a.label : BASE_META[a.baseId]?.label ?? a.label
    const labelB = b.variante == null ? b.label : BASE_META[b.baseId]?.label ?? b.label
    if (labelA !== labelB) return labelA.localeCompare(labelB)
    return (a.variante ?? 0) - (b.variante ?? 0)
  })
}

export const FONDOS: Fondo[] = buildRegistry()

export function fondosDeTema(tema: TemaId): Fondo[] {
  return FONDOS.filter((fondo) => fondo.tema === tema)
}

export function fondoPorId(id: string): Fondo | undefined {
  return FONDOS.find((fondo) => fondo.id === id)
}

/** Fondo por defecto: el primero del tema Azules. */
export function fondoInicial(): Fondo {
  return fondosDeTema('azules')[0] ?? FONDOS[0]
}

const styleCache = new Map<string, FondoStyle>()

function readLuminance(url: string): Promise<number> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 18
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(0.5)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let total = 0
      const pixels = data.length / 4
      for (let i = 0; i < data.length; i += 4) {
        total += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
      }
      resolve(total / Math.max(1, pixels))
    }
    image.onerror = () => resolve(0.5)
    image.src = url
  })
}

/** Texto claro sobre fondos oscuros, oscuro sobre claros + scrim acorde. */
export async function resolveFondoStyle(fondo: Fondo): Promise<FondoStyle> {
  const cached = styleCache.get(fondo.id)
  if (cached) return cached
  const luminance = await readLuminance(fondo.url)
  const style: FondoStyle =
    luminance < 0.45
      ? { dark: true, text: 'FFFFFF', scrim: '000000', scrimTransparency: 42 }
      : { dark: false, text: '241A10', scrim: 'FFFFFF', scrimTransparency: 18 }
  styleCache.set(fondo.id, style)
  return style
}

/** Carga el fondo como data URI (base64) para incrustarlo en el PPTX. */
export function fondoToDataUri(fondo: Fondo): Promise<string> {
  return fetch(fondo.url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('No se pudo leer el fondo'))
          reader.readAsDataURL(blob)
        })
    )
}
