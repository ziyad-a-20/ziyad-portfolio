// Same hero scene as before, with the icosahedron subdivision dropped
// from 6 to 2 — visually identical at this scale (a low-opacity
// wireframe behind hero text) but roughly 1,000x less geometry.

export function initThree(prefersReducedMotion) {
  const container = document.getElementById("threejs-container");
  if (!container) return;
  if (typeof THREE === "undefined") {
    console.warn("Three.js did not load; hero 3D visual skipped.");
    return;
  }
  if (prefersReducedMotion) {
    container.style.display = "none";
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  function themeColors(dark) {
    return {
      sphereColor: dark ? 0x5c8dff : 0x1a1a1a,
      sphereOpacity: dark ? 0.45 : 0.18, // was 0.32 — a bit stronger
      sphereEmissive: dark ? 0x5c8dff : 0x000000, // NEW — self-glow, dark mode only
      sphereEmissiveIntensity: dark ? 0.5 : 0, // NEW
      sphereMetalness: dark ? 0.3 : 0.9, // NEW — was fixed at 0.9 for both
      sphereRoughness: dark ? 0.6 : 0.1, // NEW — was fixed at 0.1 for both
      particleColor: dark ? 0x6ea0ff : 0x0066ff,
      ambientIntensity: dark ? 0.9 : 0.6,
      pointIntensity: dark ? 2.4 : 2,
    };
  }

  const startDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  const c0 = themeColors(startDark);

  const geometry = new THREE.IcosahedronGeometry(1.5, 2);
  const material = new THREE.MeshStandardMaterial({
    color: c0.sphereColor,
    wireframe: true,
    transparent: true,
    opacity: c0.sphereOpacity,
    metalness: c0.sphereMetalness,
    roughness: c0.sphereRoughness,
    emissive: c0.sphereEmissive,
    emissiveIntensity: c0.sphereEmissiveIntensity,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++)
    posArray[i] = (Math.random() - 0.5) * 10;
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3),
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: c0.particleColor,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, c0.ambientIntensity);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x0066ff, c0.pointIntensity);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

  camera.position.z = 5;

  let mouseX = 0,
    mouseY = 0;
  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  window.addEventListener("resize", () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  document.addEventListener("themechange", (e) => {
    const c = themeColors(e.detail.dark);
    material.color.setHex(c.sphereColor);
    material.opacity = c.sphereOpacity;
    material.metalness = c.sphereMetalness;
    material.roughness = c.sphereRoughness;
    material.emissive.setHex(c.sphereEmissive);
    material.emissiveIntensity = c.sphereEmissiveIntensity;
    particlesMaterial.color.setHex(c.particleColor);
    ambientLight.intensity = c.ambientIntensity;
    pointLight.intensity = c.pointIntensity;
  });

  let heroVisible = true;
  let tabVisible = !document.hidden;
  let animId = null;

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible && tabVisible && animId === null) animate();
      });
    },
    { threshold: 0 },
  );
  heroObserver.observe(container);

  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
    if (heroVisible && tabVisible && animId === null) animate();
  });

  function animate() {
    if (!heroVisible || !tabVisible) {
      animId = null;
      return;
    }
    animId = requestAnimationFrame(animate);
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.002;
    sphere.position.x += (mouseX * 0.5 - sphere.position.x) * 0.05;
    sphere.position.y += (-mouseY * 0.5 - sphere.position.y) * 0.05;
    particlesMesh.rotation.y += 0.001;
    particlesMesh.position.x +=
      (mouseX * 0.2 - particlesMesh.position.x) * 0.05;
    renderer.render(scene, camera);
  }
  animate();
}
