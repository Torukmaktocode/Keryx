/**
 * Exportador PPTX (renderer): pptxgenjs arma el archivo con el fondo real
 * incrustado UNA vez en el master (las 10 diapositivas lo comparten) y los
 * textos del sub-agente de presentación. El binario viaja por IPC y main lo
 * guarda con diálogo nativo. Todo determinista salvo el diálogo del usuario.
 */
import PptxGenJS from 'pptxgenjs'
import type { PSlide } from './presentation'
import { bodyFontSize } from './presentation'
import { fondoToDataUri, resolveFondoStyle, type Fondo } from './fondos'
import { api } from './api'

function dataUriRaw(uri: string): string {
  return uri.replace(/^data:/, '')
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export async function exportPptx(
  name: string,
  fondo: Fondo,
  slides: PSlide[]
): Promise<{ saved: boolean; path: string }> {
  const [dataUri, style] = await Promise.all([fondoToDataUri(fondo), resolveFondoStyle(fondo)])
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'Keryx'
  pptx.title = name
  pptx.defineSlideMaster({
    title: 'KeryxFondo',
    background: { data: dataUriRaw(dataUri) }
  })

  const centered = (slide: PSlide): boolean =>
    slide.kind === 'titulo' || slide.kind === 'cita' || slide.kind === 'meditacion'

  for (const slide of slides) {
    const s = pptx.addSlide({ masterName: 'KeryxFondo' })
    const isTitle = slide.kind === 'titulo'
    const center = centered(slide)

    // Scrim suave sobre la zona de texto (legibilidad sobre la imagen).
    s.addShape(pptx.ShapeType.rect, {
      x: 0.3,
      y: 0.25,
      w: 9.4,
      h: 5.5,
      fill: { color: style.scrim, transparency: style.scrimTransparency }
    })

    let y = 0.55
    if (slide.kicker) {
      s.addText(slide.kicker, {
        x: 0.55,
        y,
        w: 8.9,
        h: 0.4,
        fontSize: 13,
        italic: true,
        color: style.text,
        align: center ? 'center' : 'left'
      })
      y += 0.5
    }

    s.addText(slide.title, {
      x: 0.55,
      y,
      w: 8.9,
      h: isTitle ? 1.4 : 1.1,
      fontSize: isTitle ? 44 : 34,
      bold: true,
      color: style.text,
      align: center ? 'center' : 'left'
    })
    y += isTitle ? 1.6 : 1.35

    if (slide.lines.length) {
      const size = bodyFontSize(slide)
      s.addText(
        slide.lines.map((line) => ({
          text: line,
          options: { bullet: !center, breakLine: true }
        })),
        {
          x: 0.65,
          y: y + 0.2,
          w: 8.7,
          h: slide.quote ? 2.0 : 5.45 - y,
          fontSize: size,
          color: style.text,
          align: center ? 'center' : 'left',
          valign: 'top',
          paraSpaceAfter: 8,
          lineSpacingMultiple: 1.15
        }
      )
    }

    if (slide.quote) {
      const quoteY = slide.lines.length ? y + 2.3 : y + 0.35
      const quoteH = Math.max(0.8, 5.55 - quoteY)
      const chars = slide.quote.length
      const quoteSize = isTitle ? 22 : chars > 220 ? 17 : chars > 140 ? 20 : 24
      s.addText(slide.quote, {
        x: 0.8,
        y: quoteY,
        w: 8.4,
        h: quoteH,
        fontSize: quoteSize,
        italic: !isTitle,
        color: style.text,
        align: center ? 'center' : 'left',
        valign: 'top',
        lineSpacingMultiple: 1.2
      })
    }
  }

  const buffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer
  return api.presentations.save({ name, base64: arrayBufferToBase64(buffer) })
}
