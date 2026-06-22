# KIOSCO — Descripción del proyecto / Описание проекта

Documento de presentación bilingüe: idea, tipografía, paleta y estilística.
Autora: **Sofiia Dziuba** · Composición Digital · G0D53 · TP2 · Docente Florencia Cristina Coda Sánchez.

---

## 🇷🇺 Идея проекта

**KIOSCO** — это онлайн-каталог готовых модных образов (looks), где каждый образ можно купить **целиком одним заказом**, даже если входящие в него вещи находятся в разных интернет-магазинах.

**Концептуальный якорь:** «Журнал моды, который можно купить» — *La revista de moda que sí puedes comprar*. Первые три секунды пользователь должен почувствовать: «это редакционный журнал, а не очередной маркетплейс».

**Кому это нужно.** Молодой аудитории, которая увидела понравившийся образ в Instagram, Pinterest или у инфлюенсера и хочет повторить его целиком, не тратя часы на поиск каждой вещи отдельно по разным сайтам.

**Что отличает KIOSCO от обычного магазина.**
- Механика **«арматура лука»** — каждый look разбит на конкретные предметы одежды (chaqueta, shorts, botas, bolso, gafas, accesorios) с указанием магазина и цены.
- Пользователь видит «анатомию» образа и может либо купить весь лук одной кнопкой, либо снять галочки с того, что у него уже есть — корзина пересчитает сумму.
- Один заказ = одна оплата = одна доставка, даже если внутри 5 разных магазинов.

**Дополнительный смысловой слой.** Каждый образ помечен по системе **типажа Kibbe** (Dramático, Natural, Clásico, Romántico, Gamin, Mixto), **цветотипа** (Invierno, Primavera, Verano, Otoño), **типа фигуры** (Reloj de arena, Triángulo, Triángulo invertido, Rectángulo, Óvalo) и **случая** (Día, Trabajo, Casual, Noche, Velada). Это помогает пользователю выбрать то, что ему действительно «сядет».

---

## 🇪🇸 Idea del proyecto

**KIOSCO** es una galería curada de looks de moda **comprables como un todo**: cada conjunto se pide entero en un único pedido, aunque las prendas vengan de tiendas distintas.

**Anclaje conceptual:** *"La revista de moda que sí puedes comprar."* En los primeros tres segundos el usuario debe sentir que entra a una **revista editorial**, no a una tienda más.

**Público objetivo.** Jóvenes amantes de la moda que ven un look y quieren reproducirlo entero sin perder horas buscando cada prenda en distintos sitios.

**Diferencial.**
- Mecánica de **"armar tu look"**: cada outfit se desglosa en piezas (chaqueta, shorts, botas, bolso, gafas, accesorios) con su tienda y precio.
- El usuario ve la **anatomía completa** y decide si compra el look entero o quita lo que ya tiene — la cesta recalcula el total al instante.
- Un solo pedido, un solo pago, una sola entrega, aunque dentro vivan 5 tiendas distintas.

**Capa de personalización.** Cada look está etiquetado por **tipaje (Kibbe)**, **cromotipo**, **tipo de figura** y **ocasión** — la app sugiere lo que realmente le favorece a cada cliente, en lugar de empujar todo a todos.

---

## 🔤 Tipografías / Шрифты

Tres familias de **Google Fonts** cargadas en local desde `/tipografias/*.woff2` (subset *latin*, total ~370 KB).

| Función | Familia | Pesos | Uso visual |
|---------|---------|-------|------------|
| **Display / Titulares** | **Archivo** | 400 · 500 · 700 · 800 · 900 (eje `wdth` extendido) | Hero, H2, nombres de look, precios grandes. MAYÚSCULAS, letras anchas |
| **Body / Cuerpo** | **Hanken Grotesk** | 400 · 500 · 700 · 800 | Descripciones, párrafos, links de navegación |
| **Mono / Etiquetas** | **Space Mono** | 400 · 700 | Precios pequeños, tags, números de look, meta-texto editorial |

**Escala tipográfica (responsiva con `clamp`):**
- Hero: `clamp(24px, 4.6vw, 68px)` · line-height `0.9`
- H2 sección: `clamp(22px, 3.6vw, 42px)`
- Card title: `18px` · `wdth: 115` · peso 800
- Body: `clamp(15px, 1.1vw, 16px)` · line-height `1.45`
- Mono caption: `clamp(11px, 0.9vw, 13px)` · MAYÚSCULAS · letter-spacing `0.08em`

**Lista negra (NO usar):** Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins, Space Grotesk.

---

## 🎨 Paleta / Палитра

**Monocromo + UN ÚNICO color de acento** (requisito del TP).

### Modo claro (default)

| Token | HEX | Muestra | Uso |
|-------|-----|---------|-----|
| 📄 **Papel** *(fondo)* | `#EFEBE2` | beige cálido | Fondo principal de toda la página |
| 🃏 **Superficie** *(cards)* | `#FBFAF6` | crema casi blanco | Tarjetas, paneles, modales |
| ⬛ **Tinta** *(texto)* | `#141414` | negro suave | Toda la tipografía principal |
| ▫️ **Apagado** *(muted)* | `#6B6862` | gris cálido | Meta-texto, captions, etiquetas auxiliares |
| 🟥 **ACENTO Rojo** | `#AC2744` | rojo vinoso | **Único color** — CTA, hover, filtros activos, punto del logo, números |
| ⬜ **Blanco puro** | `#FFFFFF` | blanco | Tags, botones secundarios, bordes |
| ⬛ **Negro puro** | `#000000` | negro | Acentos brutalistas (bloque galería de looks) |

### Modo oscuro (opcional, persistente)

| Token | HEX |
|-------|-----|
| Papel | `#141210` |
| Superficie | `#1D1A17` |
| Tinta | `#F1EFE9` |
| Apagado | `#9A958C` |
| Rojo | `#AC2744` |

### Contraste WCAG (verificado AA+)

| Combinación | Ratio |
|-------------|-------|
| Tinta sobre papel | **12 : 1** |
| Blanco sobre rojo | **4.9 : 1** |
| Rojo sobre papel | **4.6 : 1** |

---

## 🎭 Estilística / Стилистика

### Dirección estética
**Brutalismo editorial suizo + collage** (variante B del sistema de diseño).

### Mood / Настроение
Editorial · audaz · hecho a mano (zine recortado) · alto contraste · sin radios · sin sombras suaves.

### Lenguaje visual

- 📐 **Retícula visible** — sistema de 12 columnas de Bootstrap como base, expuesta como decisión de diseño, no escondida.
- ✂️ **Recortes fotográficos** superpuestos y ligeramente rotados (`-5deg`, `+3deg`) — efecto collage de revista.
- 📏 **Bordes 2px** en negro sólido; separadores `5px double`.
- ⬛ **Sombras duras** — `6px 6px 0` sin blur, color tinta. Efecto sello brutalista.
- 🔤 **Texto con contorno** (outline) en el hero — "TU" en gigante.
- 🎞️ **Ticker / marquesina** superior con tagline en movimiento infinito.
- 🔠 **MAYÚSCULAS** con Archivo en eje expandido para todos los titulares.
- 🔴 **Acento rojo único** — punto en el logo, CTA, filtros activos, números de look, hover de enlaces.

### Textura
**Grano de periódico** generado por SVG `feTurbulence`, posicionado fijo sobre todo el lienzo: `opacity ~0.06`, `mix-blend-mode: multiply`, `pointer-events: none`. No crea scroll horizontal.

### Motion / Анимация
- **Fade-in** al hacer scroll vía `IntersectionObserver` en cards y secciones.
- **Hover en botones:** `translate(-3px, -3px)` + sombra dura desplazada.
- **Hover en cards:** zoom suave + sombra dura aparece + segunda foto (otro ángulo) cross-fade.
- **Hover en thumbnails de tendencias:** zoom 1.05× con transición media.
- **Smooth scroll** global en `<html>`.
- **Ticker** superior con marquesina infinita CSS.
- **Carrusel** "Portadas de la edición": fade + auto-rotación cada 6 segundos.
- **Galería detalle:** sticky al hacer scroll (la foto se queda fija mientras lees la lista de prendas).

### Lo que **NO** hacemos
- ❌ Bordes redondeados (`border-radius: 0` brutalista)
- ❌ Sombras suaves o blur
- ❌ Gradientes psicodélicos
- ❌ Más de un color de acento
- ❌ Lorem Ipsum (todo el copy en español real)
- ❌ Iconos de relleno (todos los SVG son outline)
- ❌ Plantillas / temas de Bootstrap pre-fabricados

### Referencia UX (NO visual)
**shopltk.com** — la mecánica de "comprar el look entero" inspira la lógica, pero el lenguaje visual es 100% propio.

---

## 📐 Layout / Сетка

- **Framework:** Bootstrap 5.3.3 (CDN)
- **Sistema:** 12 columnas, breakpoints `sm 576 / md 768 / lg 992 / xl 1200 / xxl 1400`
- **Max content width:** `1280px`
- **Padding lateral:** `24px`
- **Base unit:** `8px` · escala `4 / 8 / 14 / 18 / 24 / 32 / 40 / 64`
- **Gutter de galería:** `18px`
- **Regla dura:** **CERO scroll horizontal** en ninguna medida (320 / 375 / 768 / 1024 / 1440) — verificado con Playwright.

---

## 🧩 Componentes Bootstrap usados

ТЗ требует minimum 3 — реализовано **6**:

1. **Navbar** (responsive — offcanvas en móvil, inline en desktop)
2. **Carousel** (sección "Portadas de la edición" — fade, 3 slides, autoplay 6s)
3. **Accordion** (FAQ de 8 preguntas)
4. **Modal** ("Añadir a la cesta" — elegir look completo o prenda suelta)
5. **Offcanvas** × 4 (menú móvil + filtros + cesta + mi cuenta)
6. **Form controls + utilities** (d-flex, d-grid, mb-*, breakpoints visibility, etc.)

---

## 🗂️ Estructura del sitio

```
/kiosco
├── index.html              ← portada: hero collage + bloques editoriales + carrusel + FAQ
├── /secciones
│   ├── productos.html      ← catálogo de 16 looks con filtros multi-eje
│   └── detalle.html        ← anatomía del look (Cuero Urbano) + 6 prendas + similares
├── /css
│   └── estilos.css         ← TODO el CSS propio (cero inline)
├── /js
│   ├── principal.js        ← reveal, tema, filtros, galería, carrusel
│   └── tienda.js           ← lógica de e-commerce sin servidor (localStorage)
├── /multimedia             ← 244 imágenes (61 originales × 3 tamaños responsive)
├── /tipografias            ← 11 archivos .woff2 (Archivo + Hanken + Space Mono)
└── favicon.svg             ← cuadrado rojo (punto del logo)
```

---

## ✍️ Texto real (sin Lorem Ipsum)

Todo el copy en **español argentino**, con tono editorial de moda.

**Nombres de look** (ejemplos): *Noir Estructurado, Sastre Verde Salvia, Tweed Salvia, Pelo y Denim, Cuero Urbano, Pañuelo Tierra, Teddy Rojo, Peplum y Denim, Cuero Bombón, Gabardina Larga, Track Plisado, Cardigan y Slip, Mohair y Charol, Lunares y Encaje, Rojo y Leopardo, Denim de Pedrería.*

**Tiendas ficticias:** ORÁCULO · LINNÉ · GRADO.

**Moneda:** pesos argentinos (AR$), rango de precios mid-market tipo Zara/Mango (de $695.000 a $1.240.000 por look completo).
