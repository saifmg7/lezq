/**
 * 3D Visualizations Module
 * Laser & Photonics Engineering Platform
 * Using Three.js for WebGL rendering
 */

// ============================================
// 1. WAVE PROPAGATION VISUALIZATION
// ============================================
function createWavePropagationVisualization() {
    const container = document.getElementById('canvas1');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6b6b, 1);
    pointLight.position.set(30, 30, 30);
    scene.add(pointLight);

    // Create wave geometry
    const waveGeometry = new THREE.IcosahedronGeometry(15, 64);
    
    // Vertex shader for wave
    const vertexShader = `
        uniform float uTime;
        varying vec3 vNormal;
        varying float vWave;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            
            float wave = sin(position.x * 0.1 + uTime) * 
                        cos(position.y * 0.1 + uTime) * 
                        sin(position.z * 0.1 + uTime);
            
            vWave = wave;
            
            vec3 newPosition = position + normal * wave * 2.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;

    // Fragment shader for wave
    const fragmentShader = `
        varying vec3 vNormal;
        varying float vWave;
        
        void main() {
            vec3 color = mix(
                vec3(0.23, 0.34, 0.84),  // Blue
                vec3(0.90, 0.30, 0.24),  // Red
                vWave * 0.5 + 0.5
            );
            
            vec3 light = normalize(vec3(1.0, 1.0, 1.0));
            float diffuse = max(dot(vNormal, light), 0.0);
            
            gl_FragColor = vec4(color * (0.5 + diffuse * 0.5), 0.9);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        wireframe: false,
        side: THREE.DoubleSide
    });

    const wave = new THREE.Mesh(waveGeometry, material);
    scene.add(wave);

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        
        material.uniforms.uTime.value = time;
        wave.rotation.x += 0.001;
        wave.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ============================================
// 2. LASER BEAM VISUALIZATION
// ============================================
function createLaserBeamVisualization() {
    const container = document.getElementById('canvas2');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 50);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff3333, 2);
    pointLight.position.set(0, 0, 30);
    scene.add(pointLight);

    // Create laser beam
    const beamGeometry = new THREE.CylinderGeometry(0.5, 0.5, 60, 32);
    
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff6666,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9
    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.z = Math.PI / 2;
    scene.add(beam);

    // Create glow effect
    const glowGeometry = new THREE.CylinderGeometry(2, 2, 60, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6666,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.z = Math.PI / 2;
    scene.add(glow);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positionArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        positionArray[i] = (Math.random() - 0.5) * 60;
        positionArray[i + 1] = (Math.random() - 0.5) * 4;
        positionArray[i + 2] = (Math.random() - 0.5) * 4;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xffaa00,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate particles
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = (Math.sin(time * 0.5 + i) - 0.5) * 60;
            positions[i + 1] = Math.cos(time * 0.3 + i) * 2;
            positions[i + 2] = Math.sin(time * 0.4 + i) * 2;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Pulsing effect
        const pulse = Math.sin(time * 2) * 0.3 + 0.7;
        beamMaterial.emissiveIntensity = pulse;
        glowMaterial.opacity = pulse * 0.2;

        // Rotate glow
        glow.rotation.x += 0.02;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ============================================
// 3. OPTICAL FIBER VISUALIZATION
// ============================================
function createOpticalFiberVisualization() {
    const container = document.getElementById('canvas3');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 40);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff00, 1.5);
    pointLight.position.set(0, 0, 30);
    scene.add(pointLight);

    // Create fiber core
    const fiberGeometry = new THREE.CylinderGeometry(0.8, 0.8, 50, 32);
    const fiberMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.6,
        roughness: 0.5,
        metalness: 0.5
    });
    const fiber = new THREE.Mesh(fiberGeometry, fiberMaterial);
    fiber.rotation.z = Math.PI / 2;
    scene.add(fiber);

    // Create light path
    const pathPoints = [];
    for (let i = -25; i <= 25; i += 1) {
        pathPoints.push(
            new THREE.Vector3(i, Math.sin(i * 0.1) * 3, Math.cos(i * 0.08) * 2)
        );
    }

    const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 30, 0.3, 8, false);
    const pathMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.6
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);

    // Light particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 100; i++) {
        positions.push(
            Math.random() * 50 - 25,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x00ff88,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate particle positions
        const posArray = particlesGeometry.attributes.position.array;
        for (let i = 0; i < posArray.length; i += 3) {
            posArray[i] -= 0.5;
            if (posArray[i] < -25) posArray[i] = 25;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Pulsing fiber
        const pulse = Math.sin(time * 1.5) * 0.3 + 0.7;
        fiberMaterial.emissiveIntensity = pulse;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ============================================
// 4. INTERFERENCE PATTERN VISUALIZATION
// ============================================
function createInterferencePatternVisualization() {
    const container = document.getElementById('canvas4');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Canvas for 2D rendering
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
        ctx.fillRect(0, 0, width, height);

        const time = Date.now() * 0.001;
        const centerX = width / 2;
        const centerY = height / 2;

        // Draw interference pattern
        for (let x = 0; x < width; x += 3) {
            for (let y = 0; y < height; y += 3) {
                const dx1 = x - centerX + 50;
                const dy1 = y - centerY;
                const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

                const dx2 = x - centerX - 50;
                const dy2 = y - centerY;
                const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                const phase = (d1 - d2 + time * 20) / 10;
                const intensity = Math.cos(phase) * 0.5 + 0.5;

                const hue = intensity * 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(x, y, 3, 3);
            }
        }

        // Draw source points
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX - 50, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX + 50, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    });
}

// ============================================
// 5. OPTICAL ELEMENTS VISUALIZATION
// ============================================
function createOpticalElementsVisualization() {
    const container = document.getElementById('canvas5');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffaa00, 1);
    pointLight1.position.set(-30, 20, 30);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00aaff, 0.8);
    pointLight2.position.set(30, 20, 30);
    scene.add(pointLight2);

    // Create lens (convex)
    const lensGeometry = new THREE.SphereGeometry(5, 32, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.3
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.x = -15;
    scene.add(lens);

    // Create prism (pyramid)
    const prismGeometry = new THREE.TetrahedronGeometry(4, 0);
    const prismMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8844,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1
    });
    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    prism.position.x = 0;
    prism.rotation.z = Math.PI / 4;
    scene.add(prism);

    // Create mirror (reflective plane)
    const mirrorGeometry = new THREE.PlaneGeometry(12, 8);
    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 1,
        roughness: 0.1
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.x = 15;
    mirror.rotation.y = Math.PI / 6;
    scene.add(mirror);

    // Create light ray
    const rayGeometry = new THREE.BufferGeometry();
    const rayPoints = [
        new THREE.Vector3(-40, 0, 0),
        new THREE.Vector3(-20, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(20, 0, 0),
        new THREE.Vector3(40, -5, 0)
    ];
    rayGeometry.setFromPoints(rayPoints);
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
    const ray = new THREE.Line(rayGeometry, rayMaterial);
    scene.add(ray);

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;

        // Rotate lens
        lens.rotation.y += 0.01;
        lens.rotation.x = Math.sin(time) * 0.3;

        // Rotate prism
        prism.rotation.x += 0.01;
        prism.rotation.y += 0.01;

        // Rotate mirror
        mirror.rotation.y = Math.PI / 6 + Math.sin(time * 0.5) * 0.2;

        // Update ray
        const rayPositions = rayGeometry.attributes.position.array;
        rayPositions[0] = -40 + Math.sin(time) * 5;
        rayPositions[1] = Math.cos(time) * 2;
        rayGeometry.attributes.position.needsUpdate = true;

        // Light effects
        pointLight1.intensity = 1 + Math.sin(time * 1.5) * 0.5;
        pointLight2.intensity = 0.8 + Math.cos(time * 1.5) * 0.4;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ============================================
// Initialize All Visualizations
// ============================================
function initializeVisualizations() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createWavePropagationVisualization();
            createLaserBeamVisualization();
            createOpticalFiberVisualization();
            createInterferencePatternVisualization();
            createOpticalElementsVisualization();
            console.log('✨ تم تحميل جميع التصورات ثلاثية الأبعاد بنجاح!');
        });
    } else {
        createWavePropagationVisualization();
        createLaserBeamVisualization();
        createOpticalFiberVisualization();
        createInterferencePatternVisualization();
        createOpticalElementsVisualization();
        console.log('✨ تم تحميل جميع التصورات ثلاثية الأبعاد بنجاح!');
    }
}

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (event) => {
    if (event.message.includes('THREE')) {
        console.warn('⚠️ تنبيه: قد تحتاج إلى تحميل مكتبة Three.js');
    }
});

// ============================================
// Start Application
// ============================================
initializeVisualizations();
