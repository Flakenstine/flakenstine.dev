import { FRAGMENT, VERTEX } from "./shaders";

/** Dark to bright. Every character is one you would find in source code. */
const RAMP = "·:;~+<>=/*{}?#%&@";
const STRIDE = 12;

export type GlyphSource =
  | { image: string; rows?: number }
  | { text: string; rows?: number };

type Options = {
  canvas: HTMLCanvasElement;
  /** Where the picture sits inside the canvas. */
  anchor: HTMLElement;
  source: GlyphSource;
  onReady?: () => void;
};

type Sample = { data: Float32Array; count: number; rows: number };

/** Draw the source small, so each pixel becomes one glyph. */
async function rasterize(source: GlyphSource, font: string) {
  const rows = source.rows ?? 92;
  const canvas = document.createElement("canvas");
  let context: CanvasRenderingContext2D;

  if ("image" in source) {
    const image = new Image();
    image.src = source.image;
    await image.decode();
    canvas.height = rows;
    canvas.width = Math.round((image.naturalWidth / image.naturalHeight) * rows);
    context = canvas.getContext("2d", { willReadFrequently: true })!;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  } else {
    context = canvas.getContext("2d", { willReadFrequently: true })!;
    const face = `700 ${Math.round(rows * 1.3)}px ${font}`;
    context.font = face;
    const box = context.measureText(source.text);
    canvas.width = Math.ceil(box.width);
    canvas.height = Math.ceil(
      box.actualBoundingBoxAscent + box.actualBoundingBoxDescent,
    );
    context.font = face;
    context.fillStyle = "#fff";
    context.fillText(source.text, 0, box.actualBoundingBoxAscent);
  }

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

async function sample(source: GlyphSource, font: string): Promise<Sample> {
  const { data: pixels, width, height } = await rasterize(source, font);
  const flat = "text" in source;
  const out: number[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] < 110) continue;
      const [r, g, b] = [pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255];
      const light = r * 0.3 + g * 0.59 + b * 0.11;
      const u = (x + 0.5) / width - 0.5;
      const v = (y + 0.5) / height - 0.5;

      // Give the flat drawing a face-shaped bulge, so turning it has depth.
      const dome = Math.sqrt(Math.max(0, 1 - (u * u + v * v) * 3.4));
      const z = flat ? (Math.random() - 0.5) * 0.16 : dome * 0.3 - 0.15 + light * 0.04;

      // Contrast is stretched so line work reads against the skin, but hair
      // and outlines keep enough light to be seen on black.
      // Flat areas are dithered, so skin is a mix of characters.
      const tone = flat ? 0.45 + Math.random() * 0.5 : Math.min(1, light * 1.12);
      const ink = 0.24 + 0.86 * Math.pow(tone, 1.5);
      const dither = tone + (Math.random() - 0.5) * 0.26 * tone;
      const glyph = Math.max(
        0,
        Math.min(RAMP.length - 1, Math.floor(dither * RAMP.length)),
      );

      out.push(
        (u * width) / height, v, z,
        r, g, b,
        ink, glyph,
        Math.random(), Math.random(), Math.random(), Math.random(),
      );
    }
  }

  return { data: new Float32Array(out), count: out.length / STRIDE, rows: height };
}

function drawAtlas(font: string) {
  const cell = 64;
  const canvas = document.createElement("canvas");
  canvas.width = cell * RAMP.length;
  canvas.height = cell;
  const context = canvas.getContext("2d")!;
  context.font = `700 ${cell * 0.92}px ${font}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#fff";
  [...RAMP].forEach((char, i) => {
    context.fillText(char, cell * (i + 0.5), cell * 0.54);
  });
  return canvas;
}

function compile(gl: WebGL2RenderingContext) {
  const program = gl.createProgram();
  for (const [type, text] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Shader failed to compile");
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Program failed to link");
  }
  return program;
}

function readPhosphor(): [number, number, number] {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--phosphor")
    .trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(value)?.[1] ?? "00ff9d";
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
}

const ease = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

/**
 * Renders a picture as thousands of glyphs. Where each one sits is worked out
 * in the vertex shader, so a frame is a handful of uniforms and one draw call.
 */
export function createGlyphs({ canvas, anchor, source, onReady }: Options) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanup = new AbortController();
  const { signal } = cleanup;

  let visible = true;
  let frame = 0;
  let last = 0;
  let time = 0;
  let intro = 0;
  let charge = 0;
  let chargeTo = 0;
  let shockAt = -1;
  let shockPower = 0;
  let shockFrom: [number, number] = [0, 0];
  let mouseOn = 0;
  let mouseOnTo = 0;
  const mouse = { x: 0, y: 0 };
  const turn = { x: 0, y: 0, toX: 0, toY: 0 };
  let phosphorNow = readPhosphor();
  let phosphorTo = phosphorNow;
  let render: ((dt: number) => void) | undefined;

  function loop(now: number) {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    render?.(dt);
    wake();
  }

  function wake() {
    if (!frame && visible && render && !document.hidden && !signal.aborted) {
      frame = requestAnimationFrame(loop);
    }
  }

  function local(x: number, y: number) {
    const box = canvas.getBoundingClientRect();
    return { x: x - box.left, y: y - box.top };
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      turn.toX = (event.clientX / window.innerWidth - 0.5) * 0.95;
      turn.toY = (event.clientY / window.innerHeight - 0.5) * 0.7;
      const point = local(event.clientX, event.clientY);
      mouse.x = point.x;
      mouse.y = point.y;
      mouseOnTo = 1;
    },
    { passive: true, signal },
  );
  document.documentElement.addEventListener(
    "pointerleave",
    () => {
      mouseOnTo = 0;
      turn.toX = turn.toY = 0;
    },
    { signal },
  );
  // A finger has no hover: once it lifts, there is nothing to look at.
  for (const type of ["pointerup", "pointercancel"] as const) {
    window.addEventListener(
      type,
      (event) => {
        if (event.pointerType !== "mouse") mouseOnTo = turn.toX = turn.toY = 0;
      },
      { passive: true, signal },
    );
  }
  document.addEventListener("visibilitychange", wake, { signal });

  const seen = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  seen.observe(canvas);

  const themed = new MutationObserver(() => {
    phosphorTo = readPhosphor();
  });
  themed.observe(document.documentElement, {
    attributeFilter: ["data-phosphor"],
  });

  async function start(gl: WebGL2RenderingContext) {
    const font = getComputedStyle(canvas).fontFamily;
    await document.fonts.load(`700 64px ${font}`).catch(() => undefined);
    const { data, count, rows } = await sample(source, font);
    if (signal.aborted) return;

    const program = compile(gl);
    gl.useProgram(program);
    const at = (name: string) => gl.getUniformLocation(program, name);

    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let offset = 0;
    for (const [index, size] of [[1, 3], [2, 3], [3, 2], [4, 4]]) {
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
      gl.vertexAttribDivisor(index, 1);
      offset += size;
    }

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawAtlas(font));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(at("uGlyphs"), RAMP.length);

    const u = Object.fromEntries(
      [
        "uRes", "uCenter", "uSize", "uCell", "uTime", "uIntro", "uTurn",
        "uMouse", "uMouseOn", "uCharge", "uShock", "uShockPower",
        "uShockFrom", "uScroll", "uStill", "uPhosphor",
      ].map((name) => [name, at(name)]),
    );

    render = (dt) => {
      const calm = still.matches;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      time += dt;
      intro = calm ? 1 : Math.min(1, intro + dt / 2.1);
      charge = ease(charge, chargeTo, chargeTo > charge ? 2.6 : 14, dt);
      mouseOn = ease(mouseOn, mouseOnTo, 7, dt);
      if (shockAt >= 0) shockAt = shockAt > 4 ? -1 : shockAt + dt;

      const sway = calm ? 0 : Math.sin(time * 0.55) * 0.16;
      turn.x = calm ? 0 : ease(turn.x, turn.toX + sway, 4, dt);
      turn.y = calm ? 0 : ease(turn.y, turn.toY, 4, dt);
      phosphorNow = phosphorNow.map((from, i) =>
        ease(from, phosphorTo[i], 6, dt),
      ) as typeof phosphorNow;

      const box = canvas.getBoundingClientRect();
      const spot = anchor.getBoundingClientRect();
      const cell = spot.height / rows;
      const gone = -box.top / Math.max(1, box.height * 0.8);

      gl.uniform2f(u.uRes, width, height);
      gl.uniform2f(
        u.uCenter,
        spot.left - box.left + spot.width / 2,
        spot.top - box.top + spot.height / 2,
      );
      gl.uniform1f(u.uSize, spot.height);
      gl.uniform1f(u.uCell, cell);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uIntro, intro);
      gl.uniform2f(u.uTurn, turn.x, turn.y);
      gl.uniform2f(u.uMouse, mouse.x, mouse.y);
      gl.uniform1f(u.uMouseOn, mouseOn);
      gl.uniform1f(u.uCharge, charge);
      gl.uniform1f(u.uShock, shockAt);
      gl.uniform1f(u.uShockPower, shockPower);
      gl.uniform2f(u.uShockFrom, ...shockFrom);
      gl.uniform1f(u.uScroll, Math.min(1, Math.max(0, gone)));
      gl.uniform1f(u.uStill, calm ? 1 : 0);
      gl.uniform3f(u.uPhosphor, ...phosphorNow);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    };

    onReady?.();
    wake();
  }

  start(gl).catch((error) => console.warn("Glyphs could not start:", error));

  return {
    charge(on: boolean) {
      chargeTo = on ? 1 : 0;
      wake();
    },
    /** Blow it apart, from a point on the page or from its middle. */
    shock(power: number, at?: { x: number; y: number }) {
      const spot = anchor.getBoundingClientRect();
      const from = at ?? {
        x: spot.left + spot.width / 2,
        y: spot.top + spot.height / 2,
      };
      const point = local(from.x, from.y);
      shockFrom = [point.x, point.y];
      shockPower = power;
      shockAt = 0;
      chargeTo = 0;
      wake();
    },
    destroy() {
      cleanup.abort();
      cancelAnimationFrame(frame);
      seen.disconnect();
      themed.disconnect();
    },
  };
}

export type Glyphs = NonNullable<ReturnType<typeof createGlyphs>>;
