export const VERTEX = /* glsl */ `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aHome;   // x, y, z around the center, in heights
layout(location = 2) in vec3 aColor;  // the picture's own color here
layout(location = 3) in vec2 aInk;    // brightness, glyph index
layout(location = 4) in vec4 aSeed;

uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uSize;
uniform float uCell;
uniform float uTime;
uniform float uIntro;
uniform vec2 uTurn;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uCharge;
uniform float uShock;       // seconds since the last shock, or negative
uniform float uShockPower;
uniform vec2 uShockFrom;
uniform float uScroll;
uniform float uStill;       // 1 with reduced motion
uniform float uGlyphs;

out vec2 vUv;
out vec3 vColor;
out float vInk;
out float vReveal;
out float vAlpha;
flat out float vGlyph;

float easeOut(float t) { return 1.0 - pow(1.0 - clamp(t, 0.0, 1.0), 4.0); }
float hash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
  vec3 home = aHome;
  float moving = 1.0 - uStill;

  // Turn toward the pointer, with a little perspective.
  float cy = cos(uTurn.x), sy = sin(uTurn.x);
  float cx = cos(uTurn.y), sx = sin(uTurn.y);
  vec3 p = vec3(home.x * cy + home.z * sy, home.y, home.z * cy - home.x * sy);
  p = vec3(p.x, p.y * cx - p.z * sx, p.z * cx + p.y * sx);
  float depth = 1.0 / (1.0 - p.z * 0.42);
  vec2 px = uCenter + p.xy * depth * uSize;
  px.y += sin(uTime * 0.9 + home.x * 2.0) * 0.006 * uSize * moving;

  float reveal = 0.0;

  // Assemble: every glyph flies in from somewhere on the page.
  float arrive = easeOut((uIntro * 1.9 - aSeed.x * 0.55 - (home.y + 0.5) * 0.35));
  vec2 scatter = uCenter + (aSeed.zw - 0.5) * vec2(uRes.x * 1.15, uRes.y * 1.5);
  float swirl = (1.0 - arrive) * 2.2;
  vec2 arc = mat2(cos(swirl), sin(swirl), -sin(swirl), cos(swirl)) * (scatter - uCenter) + uCenter;
  px = mix(arc, px, arrive);

  // Lens: the real colors come through around the pointer.
  vec2 away = px - uMouse;
  float lens = exp(-dot(away, away) / pow(uSize * 0.25, 2.0)) * uMouseOn * arrive;
  px += away * lens * 0.22 * moving;
  reveal = max(reveal, lens);

  // Scan: a band of color passes over now and then.
  float scan = mix(-0.75, 0.75, fract(uTime / 6.5) * 2.4);
  reveal = max(reveal, exp(-pow((home.y - scan) / 0.07, 2.0)) * 0.85 * moving * arrive);

  // Charge: shake, and pull together, until it lets go.
  float tick = floor(uTime * 45.0);
  vec2 shake = vec2(hash(aSeed.x * 91.0 + tick), hash(aSeed.y * 57.0 + tick)) - 0.5;
  px += shake * uCharge * uCharge * uSize * 0.05 * moving;
  px = mix(px, uCenter, uCharge * 0.07 * moving);

  // Shock: thrown out from where it was hit, then drawn back in.
  if (uShock >= 0.0) {
    vec2 from = px - uShockFrom;
    float dist = length(from) / uSize;
    float hit = max(0.0, uShock - dist * 0.12);
    float out_ = easeOut(hit / 0.45);
    float back = clamp((hit - 0.4 - aSeed.y * 0.35) / 1.15, 0.0, 1.0);
    back = back * back * (3.0 - 2.0 * back);
    float blast = out_ * (1.0 - back) * uShockPower;
    float angle = atan(from.y, from.x) + (aSeed.z - 0.5) * 1.5 + blast * (aSeed.w - 0.5);
    float reach = (0.12 + aSeed.x * aSeed.x * 1.15) * uSize;
    px += vec2(cos(angle), sin(angle)) * reach * blast * moving;
    float ring = exp(-pow((dist - uShock * 1.6) / 0.16, 2.0));
    reveal = max(reveal, max(ring, blast * 0.75) * step(uShock, 2.5));
    reveal = max(reveal, uStill * smoothstep(0.0, 0.2, uShock) * (1.0 - smoothstep(1.4, 2.0, uShock)));
  }

  // Scroll: it comes apart and rains down as the page leaves it.
  float fall = max(0.0, uScroll - aSeed.x * 0.35) * moving;
  px.y += fall * fall * uSize * (0.6 + aSeed.y * 2.2);
  px.x += (aSeed.z - 0.5) * fall * uSize * 0.35;

  // Some glyphs never settle on a character.
  float beat = floor(uTime * (1.0 + aSeed.y * 3.0) + aSeed.z * 20.0);
  float restless = step(0.965 - uCharge * 0.6, hash(aSeed.w * 31.0 + beat)) * moving;
  vGlyph = mix(aInk.y, floor(hash(aSeed.x * 13.0 + beat) * uGlyphs), restless);

  float size = uCell * depth * mix(1.6, 1.1, reveal) * (1.0 + restless * 0.25 + lens * 0.22 * moving);
  px += aCorner * size;

  vec2 clip = px / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  vUv = aCorner + 0.5;
  vColor = aColor;
  vInk = aInk.x + restless * 0.35 + uCharge * 0.35;
  vReveal = clamp(reveal, 0.0, 1.0);
  vAlpha = smoothstep(0.0, 0.25, arrive) * (1.0 - smoothstep(0.55, 1.0, uScroll)) * mix(0.85, 1.0, clamp(depth - 0.6, 0.0, 1.0));
}`;

export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
in vec3 vColor;
in float vInk;
in float vReveal;
in float vAlpha;
flat in float vGlyph;

uniform sampler2D uAtlas;
uniform float uGlyphs;
uniform vec3 uPhosphor;

out vec4 color;

void main() {
  float glyph = texture(uAtlas, vec2((vGlyph + vUv.x) / uGlyphs, vUv.y)).a;
  vec2 edge = abs(vUv - 0.5);
  float block = 1.0 - smoothstep(0.44, 0.5, max(edge.x, edge.y));
  float cover = mix(glyph, block, smoothstep(0.25, 0.85, vReveal));

  vec3 glow = uPhosphor * min(vInk, 1.25) * 1.12 + vec3(pow(max(vInk - 0.78, 0.0), 1.4) * 0.9);
  vec3 ink = mix(glow, vColor, smoothstep(0.1, 0.75, vReveal));
  float a = cover * vAlpha;
  color = vec4(ink * a, a);
}`;
