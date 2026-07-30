// Same fragment-shader background as before, with one fix: the canvas
// now scales by devicePixelRatio (capped at 2, matching the Three.js
// scene) so it no longer renders soft/blurry on retina displays.

export function initShader(prefersReducedMotion) {
  const canvas = document.getElementById("shader-canvas");
  const wrap = document.getElementById("shader-wrap");
  if (!canvas || !wrap) return;
  if (prefersReducedMotion) {
    wrap.style.display = "none";
    return;
  }

  let isVisible = true;
  let rafId = null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function syncSize() {
    const w = Math.round((canvas.clientWidth || window.innerWidth) * dpr);
    const h = Math.round((canvas.clientHeight || window.innerHeight) * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  if (typeof ResizeObserver !== "undefined")
    new ResizeObserver(syncSize).observe(canvas);
  syncSize();
  window.addEventListener("resize", syncSize);

  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  const vs = `attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }`;

  const fs = `precision highp float;
  varying vec2 v_texCoord;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    float t = u_time * 0.2;
    vec2 p = uv * 3.0;

    for(int i=1; i<4; i++) {
      float fi = float(i);
      p.x += 0.3 / fi * sin(fi * 3.0 * p.y + t + mouse.x * 2.0);
      p.y += 0.3 / fi * cos(fi * 3.0 * p.x + t + mouse.y * 2.0);
    }

    vec3 color1 = vec3(0.976, 0.973, 0.965);
    vec3 color2 = vec3(0.886, 0.886, 0.886);
    vec3 color3 = vec3(0.941, 0.945, 0.953);

    float mask = 0.5 + 0.5 * sin(p.x + p.y);
    vec3 finalColor = mix(color1, color2, mask);
    finalColor = mix(finalColor, color3, 0.2 * sin(u_time * 0.5));

    float n = (noise(uv * u_time) - 0.5) * 0.02;
    finalColor += n;

    gl_FragColor = vec4(finalColor, 1.0);
  }`;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const label = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
      console.error(
        `[shader-bg] ${label} shader failed to compile:`,
        gl.getShaderInfoLog(s),
      );
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
  if (!vertexShader || !fragmentShader) return; // Compile error already logged above.

  const prog = gl.createProgram();
  gl.attachShader(prog, vertexShader);
  gl.attachShader(prog, fragmentShader);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(
      "[shader-bg] program failed to link:",
      gl.getProgramInfoLog(prog),
    );
    return;
  }

  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const pos = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, "u_time");
  const uRes = gl.getUniformLocation(prog, "u_resolution");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
  window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas.width;
      mouse.y = ny * canvas.height;
    }
  });

  // Two independent gates, both must be true for the loop to run:
  // tab visibility (visibilitychange) and viewport visibility
  // (IntersectionObserver). The canvas is a fixed full-viewport layer,
  // so on any page with sections taller than one screen, the user is
  // very often scrolled "past" it while it keeps rendering underneath
  // everything — this stops that, the same way three-scene.js already
  // stops the Three.js hero loop once its container leaves the viewport.
  let tabVisible = !document.hidden;
  let inViewport = true;

  function syncVisibility() {
    const shouldRun = tabVisible && inViewport;
    if (shouldRun === isVisible) return;
    isVisible = shouldRun;
    if (isVisible && rafId === null) render(performance.now());
  }

  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
    syncVisibility();
  });

  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(
      (entries) => {
        inViewport = entries[0].isIntersecting;
        syncVisibility();
      },
      { threshold: 0 },
    ).observe(wrap);
  }

  function render(t) {
    if (!isVisible) {
      rafId = null;
      return;
    }
    syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafId = requestAnimationFrame(render);
  }
  render(0);
}
