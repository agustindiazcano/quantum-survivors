# Context (brainstorm)

> This is a brainstorm, **not a final version and not a set of decisions**. It will change. It is here so that anyone (human or AI) roughly understands what the author wanted. Original text in Spanish, kept as is.

---

Tienes toda la razón. Me puse en modo profesor de física aburrido y arruiné el propósito de hacer un juego. Olvídate de los corchetes, los ceros, los unos y la matemática.

El jugador NUNCA debe ver un símbolo matemático. Si el jugador ve una ecuación, perdiste. El jugador solo ve armas, monstruos y cartas de poderes.

Aquí tienes cómo hacer el Vampire Survivors Cuántico para que lo entienda un niño de 10 años, pero que por detrás use simulación real para impresionar a los jueces:

## La Regla de Oro del Juego

Tu personaje dispara solo. Empieza siendo muy ineficiente: tira balitas débiles en todas las direcciones (como el ajo inicial de Vampire Survivors). Tu objetivo es sobrevivir agarrando cofres que te dan "Cartas de Modificación".

## Las Cartas de Poder (sin nombres raros)

### 1. La Carta Espejo (Puerta X)
- **Qué hace en el juego:** invierte tu fuego. Si tu arma estaba disparando mucho hacia adelante y te atacan por la espalda, usas esta carta y ahora disparas hacia atrás.
- **El secreto:** por detrás, tu código está aplicando una compuerta matemática NOT, pero el jugador solo ve un cambio de dirección táctico.

### 2. La Carta Escopeta (Puerta H - Hadamard)
- **Qué hace en el juego:** agarra un rayo enfocado y lo esparce. Pasas de disparar un solo láser a disparar perdigones en forma de cono.
- **El secreto:** esto representa la "superposición" cuántica (estar en varios lados a la vez).

### 3. La Carta "Fantasma" y el Combo Secreto (Fase Z + Escopeta)
Aquí está el truco que te hace ganar el hackathon.
- **Qué hace en el juego:** aparece una carta llamada "Modificador de Fase". Si el jugador la agarra... no pasa absolutamente nada. El arma sigue disparando igual. El jugador piensa: "Esta carta es una basura".
- **El combo:** pero si el jugador tiene la Carta Escopeta, luego agarra la Carta Fantasma, y luego otra Carta Escopeta... ¡BOOM! Los perdigones se fusionan y se transforman en un Láser de la Muerte súper potente que aniquila todo en una línea recta.
- **El secreto:** esto se llama Interferencia Cuántica. Las ondas se cancelan y se suman. El jugador acaba de descubrir la magia de la cuántica a través de un "combo de armas" en un videojuego, sin leer una sola fórmula.

### 4. La Carta Vínculo (Compuerta CNOT)
- **Qué hace en el juego:** entrelaza dos direcciones de disparo. Si disparas hacia adelante, automáticamente sale un disparo idéntico hacia atrás con el doble de daño. Ideal para cuando los monstruos te encierran en un pasillo.
- **El secreto:** le estás enseñando "Entrelazamiento Cuántico" (cuando dos cosas están conectadas a distancia).

## ¿Cómo hacer esto en el código?

Dile a tu programador que NO invente porcentajes con if/else.

Solo tiene que escribir las matrices reales de estas 4 cartas en JavaScript (son arreglos de números muy chiquitos de 2x2) y multiplicarlas en cada frame.

Dejas que el código matemático mueva los disparos, pero tú le pones gráficos de balas de fuego, monstruos y cofres de nivel.

## El Pitch para los Jueces

> "Nadie quiere aprender cuántica leyendo símbolos raros en una pizarra. Así que escondimos un simulador cuántico real dentro de un clon de Vampire Survivors. Los jugadores aprenden sobre superposición, entrelazamiento e interferencia simplemente descubriendo 'combos de armas' para sobrevivir a la horda. Y todo corre fluido en el navegador."

Es fácil de programar, súper adictivo de jugar, y a los jueces se les caerá la baba porque tradujiste ciencia dura a diversión pura.

---

## Notas del autor (fuera del brainstorm original)
- El juego se llama **Quantum Survivors**.
- Estética: colores neón con glow. Enemigos como formas geométricas por ahora; al morir explotan con algún efecto.
- Puede ser 2D (Canvas) o 3D (WebGL + three.js); todavía no está decidido.
- Stack simple: JS, HTML, CSS. Un HTML monolito para facilitar el trabajo, Vite para desarrollo.
