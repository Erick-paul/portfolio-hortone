import React, { useEffect, useRef } from "react";
import images from "../constants/images";

export default function Introduction() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cleanupFn = null;

    const run = async () => {
      const loadScript = (src, globalName) =>
        new Promise((res, rej) => {
          if (window[globalName]) {
            res();
            return;
          }
          if (document.querySelector(`script[src="${src}"]`)) {
            const check = setInterval(() => {
              if (window[globalName]) {
                clearInterval(check);
                res();
              }
            }, 50);
            setTimeout(() => {
              clearInterval(check);
              rej(new Error(`Timeout waiting for ${globalName}`));
            }, 10000);
            return;
          }
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => setTimeout(() => res(), 100);
          s.onerror = () => rej(new Error(`Failed to load ${src}`));
          document.head.appendChild(s);
        });

      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
          "gsap",
        );
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
          "THREE",
        );
      } catch (e) {
        console.error("Failed to load base scripts:", e);
        return;
      }

      cleanupFn = initApplication();
    };

    const initApplication = () => {
      const THREE = window.THREE;
      const gsap = window.gsap;

      const SLIDER_CONFIG = {
        settings: {
          transitionDuration: 2.5,
          autoSlideSpeed: 5000,
          currentEffect: "glass",
          currentEffectPreset: "Default",
          globalIntensity: 1.0,
          speedMultiplier: 1.0,
          distortionStrength: 1.0,
          colorEnhancement: 1.0,
          glassRefractionStrength: 1.0,
          glassChromaticAberration: 1.0,
          glassBubbleClarity: 1.0,
          glassEdgeGlow: 1.0,
          glassLiquidFlow: 1.0,
        },
      };

      let currentSlideIndex = 0;
      let isTransitioning = false;
      let shaderMaterial, renderer, scene, camera;
      let slideTextures = [];
      let texturesLoaded = false;
      let autoSlideTimer = null;
      let progressAnimation = null;
      let sliderEnabled = false;
      let animationFrameId = null;

      const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
      const PROGRESS_UPDATE_INTERVAL = 50;
      const TRANSITION_DURATION = () =>
        SLIDER_CONFIG.settings.transitionDuration;

      const slides = [
        {
          title: "Hackathon Junction China 2023",
          description:
            "A whirlwind of innovation, collaboration, and creativity in the heart of China's tech scene.",
          media: images.junction5,
        },
        {
          title: "Hackathon Junction China 2023",
          description:
            "Teams from around the world converged to push the boundaries of technology, crafting groundbreaking solutions and forging lasting connections in an unforgettable celebration of ingenuity.",
          media: images.junction4,
        },
        {
          title: "Hackathon Junction China 2023",
          description:
            "A dynamic fusion of creativity and technology, where bright minds converge to innovate and inspire.",
          media: images.junction2,
        },
        {
          title: "Neza Hackathon",
          description: "Where reality fades and imagination takes flight.",
          media: images.neza6,
        },
        {
          title: "Neza Hackathon",
          description:
            "A dynamic fusion of creativity and technology, where bright minds converge to innovate and inspire.",
          media: images.neza4,
        },
        {
          title: "Neza Hackathon 2023",
          description: "The ultimate showcase of innovation and collaboration.",
          media: images.neza,
        },
      ];

      const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const fragmentShader = `
        uniform sampler2D uTexture1, uTexture2;
        uniform float uProgress;
        uniform vec2 uResolution, uTexture1Size, uTexture2Size;
        uniform int uEffectType;
        uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
        uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
        varying vec2 vUv;

        vec2 getCoverUV(vec2 uv, vec2 textureSize) {
          vec2 s = uResolution / textureSize;
          float scale = max(s.x, s.y);
          vec2 scaledSize = textureSize * scale;
          vec2 offset = (uResolution - scaledSize) * 0.5;
          return (uv * uResolution - offset) / scaledSize;
        }

        vec4 glassEffect(vec2 uv, float progress) {
          float time = progress * 5.0 * uSpeedMultiplier;
          vec2 uv1 = getCoverUV(uv, uTexture1Size);
          vec2 uv2 = getCoverUV(uv, uTexture2Size);
          float maxR = length(uResolution) * 0.85;
          float br = progress * maxR;
          vec2 p = uv * uResolution;
          vec2 c = uResolution * 0.5;
          float d = length(p - c);
          float nd = d / max(br, 0.001);
          float param = smoothstep(br + 3.0, br - 3.0, d);
          vec4 img;
          if (param > 0.0) {
            float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
            vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
            vec2 distUV = uv2 - dir * ro;
            distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
            float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
            img = vec4(
              texture2D(uTexture2, distUV + dir * ca * 1.2).r,
              texture2D(uTexture2, distUV + dir * ca * 0.2).g,
              texture2D(uTexture2, distUV - dir * ca * 0.8).b,
              1.0
            );
            if (uGlassEdgeGlow > 0.0) {
              float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
              img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
            }
          } else {
            img = texture2D(uTexture2, uv2);
          }
          vec4 oldImg = texture2D(uTexture1, uv1);
          if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
          return mix(oldImg, img, param);
        }

        void main() {
          gl_FragColor = glassEffect(vUv, uProgress);
        }
      `;

      // --- SAFE REF GUARD ---
      const getContainer = () => containerRef.current;

      const updateShaderUniforms = () => {
        if (!shaderMaterial) return;
        const s = SLIDER_CONFIG.settings;
        const u = shaderMaterial.uniforms;
        for (const key in s) {
          const uName = "u" + key.charAt(0).toUpperCase() + key.slice(1);
          if (u[uName]) u[uName].value = s[key];
        }
        u.uEffectType.value = 0;
      };

      const splitText = (text) =>
        text
          .split("")
          .map(
            (char) =>
              `<span style="display: inline-block; opacity: 0;">${char === " " ? "&nbsp;" : char}</span>`,
          )
          .join("");

      const updateContent = (idx) => {
        const container = getContainer();
        if (!container) return;
        const titleEl = container.querySelector("#mainTitle");
        const descEl = container.querySelector("#mainDesc");
        if (!titleEl || !descEl) return;

        gsap.to(titleEl.children, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.in",
        });
        gsap.to(descEl, {
          y: -10,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });

        setTimeout(() => {
          if (!getContainer()) return;
          titleEl.innerHTML = splitText(slides[idx].title);
          descEl.textContent = slides[idx].description;
          gsap.set(titleEl.children, { y: 20, opacity: 0 });
          gsap.set(descEl, { y: 20, opacity: 0 });
          gsap.to(titleEl.children, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out",
          });
          gsap.to(descEl, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
          });
        }, 500);
      };

      const updateNavigationState = (idx) => {
        const container = getContainer();
        if (!container) return;
        container.querySelectorAll(".slide-nav-item").forEach((el, i) => {
          el.classList.toggle("active", i === idx);
          el.querySelector(".slide-nav-title").style.color =
            i === idx ? "#fff" : "rgba(255,255,255,0.6)";
        });
      };

      const updateSlideProgress = (idx, prog) => {
        const container = getContainer();
        if (!container) return;
        const items = container.querySelectorAll(".slide-nav-item");
        if (!items || !items[idx]) return;
        const el = items[idx].querySelector(".slide-progress-fill");
        if (el) {
          el.style.width = `${prog}%`;
          el.style.opacity = "1";
        }
      };

      const fadeSlideProgress = (idx) => {
        const container = getContainer();
        if (!container) return;
        const items = container.querySelectorAll(".slide-nav-item");
        if (!items || !items[idx]) return;
        const el = items[idx].querySelector(".slide-progress-fill");
        if (el) {
          el.style.opacity = "0";
          setTimeout(() => {
            if (!getContainer()) return;
            el.style.width = "0%";
          }, 300);
        }
      };

      const quickResetProgress = (idx) => {
        const container = getContainer();
        if (!container) return;
        const items = container.querySelectorAll(".slide-nav-item");
        if (!items || !items[idx]) return;
        const el = items[idx].querySelector(".slide-progress-fill");
        if (el) {
          el.style.transition = "width 0.2s ease-out";
          el.style.width = "0%";
          setTimeout(() => {
            if (!getContainer()) return;
            el.style.transition = "width 0.1s ease, opacity 0.3s ease";
          }, 200);
        }
      };

      const updateCounter = (idx) => {
        const container = getContainer();
        if (!container) return;
        const sn = container.querySelector("#slideNumber");
        if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
        const st = container.querySelector("#slideTotal");
        if (st) st.textContent = String(slides.length).padStart(2, "0");
      };

      const stopAutoSlideTimer = () => {
        if (progressAnimation) clearInterval(progressAnimation);
        if (autoSlideTimer) clearTimeout(autoSlideTimer);
        progressAnimation = null;
        autoSlideTimer = null;
      };

      const startAutoSlideTimer = () => {
        if (!texturesLoaded || !sliderEnabled) return;
        stopAutoSlideTimer();
        let progress = 0;
        const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
        progressAnimation = setInterval(() => {
          if (!sliderEnabled || !getContainer()) {
            stopAutoSlideTimer();
            return;
          }
          progress += increment;
          updateSlideProgress(currentSlideIndex, progress);
          if (progress >= 100) {
            clearInterval(progressAnimation);
            progressAnimation = null;
            fadeSlideProgress(currentSlideIndex);
            if (!isTransitioning) handleSlideChange();
          }
        }, PROGRESS_UPDATE_INTERVAL);
      };

      const safeStartTimer = (delay = 0) => {
        stopAutoSlideTimer();
        if (sliderEnabled && texturesLoaded && getContainer()) {
          if (delay > 0)
            autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
          else startAutoSlideTimer();
        }
      };

      const navigateToSlide = (targetIndex) => {
        if (isTransitioning || targetIndex === currentSlideIndex) return;
        stopAutoSlideTimer();
        quickResetProgress(currentSlideIndex);

        const currentTexture = slideTextures[currentSlideIndex];
        const targetTexture = slideTextures[targetIndex];
        if (!currentTexture || !targetTexture) return;

        isTransitioning = true;
        shaderMaterial.uniforms.uTexture1.value = currentTexture;
        shaderMaterial.uniforms.uTexture2.value = targetTexture;
        shaderMaterial.uniforms.uTexture1Size.value =
          currentTexture.userData.size;
        shaderMaterial.uniforms.uTexture2Size.value =
          targetTexture.userData.size;

        updateContent(targetIndex);
        currentSlideIndex = targetIndex;
        updateCounter(currentSlideIndex);
        updateNavigationState(currentSlideIndex);

        gsap.fromTo(
          shaderMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: TRANSITION_DURATION(),
            ease: "power2.inOut",
            onComplete: () => {
              if (!getContainer()) return;
              shaderMaterial.uniforms.uProgress.value = 0;
              shaderMaterial.uniforms.uTexture1.value = targetTexture;
              shaderMaterial.uniforms.uTexture1Size.value =
                targetTexture.userData.size;
              isTransitioning = false;
              safeStartTimer(100);
            },
          },
        );
      };

      const handleSlideChange = () => {
        if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
        navigateToSlide((currentSlideIndex + 1) % slides.length);
      };

      const createSlidesNavigation = () => {
        const container = getContainer();
        if (!container) return;
        const nav = container.querySelector("#slidesNav");
        if (!nav) return;
        nav.innerHTML = "";
        slides.forEach((slide, i) => {
          const item = document.createElement("div");
          item.className = `slide-nav-item flex-1 cursor-pointer py-2 ${i === 0 ? "active" : ""}`;
          item.dataset.slideIndex = String(i);
          item.innerHTML = `
            <div class="slide-progress-line h-[2px] bg-white/20 w-full relative">
              <div class="slide-progress-fill h-full bg-white w-0 absolute left-0 top-0 transition-opacity duration-300"></div>
            </div>
            <div class="slide-nav-title font-mono text-[10px] uppercase mt-2 text-white/60 transition-colors duration-300 truncate">${slide.title}</div>
          `;
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isTransitioning && i !== currentSlideIndex) {
              stopAutoSlideTimer();
              quickResetProgress(currentSlideIndex);
              navigateToSlide(i);
            }
          });
          nav.appendChild(item);
        });
      };

      const loadImageTexture = (src) =>
        new Promise((resolve, reject) => {
          const l = new THREE.TextureLoader();
          l.setCrossOrigin("anonymous");
          l.load(
            src,
            (t) => {
              t.minFilter = t.magFilter = THREE.LinearFilter;
              t.userData = t.userData || {};
              t.userData.size = new THREE.Vector2(
                t.image.width,
                t.image.height,
              );
              resolve(t);
            },
            undefined,
            reject,
          );
        });

      const initRenderer = async () => {
        const container = getContainer();
        if (!container) return;
        const canvas = container.querySelector(".webgl-canvas");
        if (!canvas) return;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: false,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture1: { value: null },
            uTexture2: { value: null },
            uProgress: { value: 0 },
            uResolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uTexture1Size: { value: new THREE.Vector2(1, 1) },
            uTexture2Size: { value: new THREE.Vector2(1, 1) },
            uEffectType: { value: 0 },
            uGlobalIntensity: { value: 1.0 },
            uSpeedMultiplier: { value: 1.0 },
            uDistortionStrength: { value: 1.0 },
            uColorEnhancement: { value: 1.0 },
            uGlassRefractionStrength: { value: 1.0 },
            uGlassChromaticAberration: { value: 1.0 },
            uGlassBubbleClarity: { value: 1.0 },
            uGlassEdgeGlow: { value: 1.0 },
            uGlassLiquidFlow: { value: 1.0 },
          },
          vertexShader,
          fragmentShader,
        });
        scene.add(
          new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial),
        );

        for (const s of slides) {
          try {
            const texture = await loadImageTexture(s.media);
            slideTextures.push(texture);
          } catch {
            console.warn("Failed to load texture:", s.media);
          }
        }

        if (!getContainer()) return;

        if (slideTextures.length >= 2) {
          shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
          shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
          shaderMaterial.uniforms.uTexture1Size.value =
            slideTextures[0].userData.size;
          shaderMaterial.uniforms.uTexture2Size.value =
            slideTextures[1].userData.size;
          texturesLoaded = true;
          sliderEnabled = true;
          updateShaderUniforms();
          containerRef.current.classList.add("opacity-100");
          safeStartTimer(500);
        }

        const render = () => {
          if (!renderer) return;
          animationFrameId = requestAnimationFrame(render);
          renderer.render(scene, camera);
        };
        render();
      };

      // --- INIT ---
      createSlidesNavigation();
      updateCounter(0);

      const container = getContainer();
      if (container) {
        const tEl = container.querySelector("#mainTitle");
        const dEl = container.querySelector("#mainDesc");
        if (tEl && dEl) {
          tEl.innerHTML = splitText(slides[0].title);
          dEl.textContent = slides[0].description;
          gsap.fromTo(
            tEl.children,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.03,
              ease: "power3.out",
              delay: 0.5,
            },
          );
          gsap.fromTo(
            dEl,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 },
          );
        }
      }

      initRenderer();

      const handleVisibility = () => {
        if (!getContainer()) return;
        document.hidden
          ? stopAutoSlideTimer()
          : !isTransitioning && safeStartTimer();
      };

      const handleResize = () => {
        if (!renderer || !shaderMaterial) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
        shaderMaterial.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight,
        );
      };

      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("resize", handleResize);

      // --- CLEANUP ---
      return () => {
        sliderEnabled = false;
        stopAutoSlideTimer();
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("resize", handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
          renderer = null;
        }
        if (shaderMaterial) {
          shaderMaterial.dispose();
          shaderMaterial = null;
        }
        slideTextures.forEach((t) => t.dispose());
        slideTextures = [];
      };
    };

    run();

    return () => {
      if (typeof cleanupFn === "function") cleanupFn();
    };
  }, []);

  return (
    <main
      className="slider-wrapper relative w-full h-screen bg-[#0a0a0a] text-white overflow-hidden opacity-0 transition-opacity duration-1000"
      ref={containerRef}
    >
      <canvas className="webgl-canvas absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16 pointer-events-none">
        <header className="flex justify-between items-start font-mono text-[clamp(10px,1.2vw,12px)] uppercase tracking-widest text-white/70">
          <div>Interactive List</div>
          <div className="flex gap-2">
            <span id="slideNumber">01</span>
            <span className="text-white/40">/</span>
            <span id="slideTotal" className="text-white/40">
              06
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-3xl pointer-events-auto">
          <h1
            className="slide-title font-serif text-5xl md:text-7xl lg:text-8xl mb-6 italic font-light"
            id="mainTitle"
          />
          <p
            className="slide-description font-sans text-base md:text-lg text-white/70 max-w-md leading-relaxed"
            id="mainDesc"
          />
        </div>

        <nav
          className="slides-navigation flex gap-4 md:gap-8 pointer-events-auto w-full max-w-2xl"
          id="slidesNav"
        />
      </div>
    </main>
  );
}
