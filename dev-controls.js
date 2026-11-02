/**
 * Developer Controls for Rose Petal Adjustment
 * 
 * This file adds a Tweakpane GUI for real-time adjustment of flower petals.
 * REMOVE THIS FILE AND ITS SCRIPT TAG FROM index.html WHEN DONE ADJUSTING.
 * 
 * Usage:
 * 1. Adjust sliders to position petals
 * 2. Click "Export CSS" to copy values to clipboard
 * 3. Paste into style.css
 * 4. Remove this script when finished
 */

(async function() {
  // Load Tweakpane UMD build from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js';
  document.head.appendChild(script);
  
  // Wait for script to load
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });

  // Wait a moment for Tweakpane to initialize
  await new Promise(r => setTimeout(r, 100));

  const Tweakpane = window.Tweakpane;
  
  if (!Tweakpane) {
    console.error('Tweakpane failed to load');
    return;
  }
    
  // Create main pane
  const pane = new Tweakpane.Pane({
    title: '🌹 Rose Editor',
    expanded: true,
  });

    // Store all petal configurations
    const petalConfigs = {};
    const centerConfigs = {};

    // Initialize petal configs for all 17 petals
    for (let i = 1; i <= 17; i++) {
      petalConfigs[`petal${i}`] = {
        translateX: -50,
        translateY: getDefaultTranslateY(i),
        rotate: getDefaultRotate(i),
        scale: getDefaultScale(i),
        rotateX: getDefaultRotateX(i),
      };
    }

    // Center circle config
    centerConfigs.center = {
      width: 6,
      height: 6,
    };

    // Helper functions for default values based on current CSS
    function getDefaultTranslateY(i) {
      const defaults = {
        1: -65, 2: -62, 3: -68, 4: -64, 5: -66,
        6: -58, 7: -60, 8: -56, 9: -59, 10: -57,
        11: -48, 12: -45, 13: -52, 14: -50, 15: -48,
        16: -42, 17: -40
      };
      return defaults[i] || -50;
    }

    function getDefaultRotate(i) {
      const defaults = {
        1: -10, 2: 62, 3: 134, 4: 206, 5: 278,
        6: 25, 7: 97, 8: 169, 9: 241, 10: 313,
        11: 45, 12: 165, 13: 90, 14: 220, 15: 300,
        16: 130, 17: 260
      };
      return defaults[i] || 0;
    }

    function getDefaultScale(i) {
      const defaults = {
        1: 1.5, 2: 1.45, 3: 1.5, 4: 1.48, 5: 1.52,
        6: 1.15, 7: 1.18, 8: 1.12, 9: 1.2, 10: 1.16,
        11: 0.8, 12: 0.75, 13: 0.85, 14: 0.82, 15: 0.78,
        16: 0.55, 17: 0.5
      };
      return defaults[i] || 1;
    }

    function getDefaultRotateX(i) {
      const defaults = {
        1: 25, 2: 20, 3: 22, 4: 18, 5: 24,
        6: 35, 7: 32, 8: 38, 9: 30, 10: 36,
        11: 50, 12: 55, 13: 45, 14: 48, 15: 52,
        16: 60, 17: 65
      };
      return defaults[i] || 0;
    }

    // Apply transform to a petal element
    function applyPetalTransform(petalNum, config) {
      const petals = document.querySelectorAll(`.flower__leaf--${petalNum}`);
      petals.forEach(petal => {
        petal.style.transform = `translate(${config.translateX}%, ${config.translateY}%) rotate(${config.rotate}deg) scale(${config.scale}) rotateX(${config.rotateX}deg)`;
      });
    }

    // Apply size to center circle
    function applyCenterSize(config) {
      const centers = document.querySelectorAll('.flower__white-circle');
      centers.forEach(center => {
        center.style.width = `${config.width}vmin`;
        center.style.height = `${config.height}vmin`;
      });
    }

    // Select which flower to edit (1, 2, or 3) or all
    const flowerSelector = { target: 'all' };
    pane.addBinding(flowerSelector, 'target', {
      label: 'Edit Flower',
      options: {
        'All Flowers': 'all',
        'Flower 1 (Left)': '1',
        'Flower 2 (Center)': '2', 
        'Flower 3 (Right)': '3',
      }
    });

    // Create folders for petal layers
    const outerFolder = pane.addFolder({ title: '🌸 Outer Petals (1-5)', expanded: false });
    const middleFolder = pane.addFolder({ title: '🌸 Middle Petals (6-10)', expanded: false });
    const innerFolder = pane.addFolder({ title: '🌸 Inner Petals (11-15)', expanded: false });
    const coreFolder = pane.addFolder({ title: '🌸 Core Petals (16-17)', expanded: false });
    const centerFolder = pane.addFolder({ title: '⭕ Center Circle', expanded: false });

    // Add controls for each petal
    function addPetalControls(folder, petalNum) {
      const petalFolder = folder.addFolder({ title: `Petal ${petalNum}`, expanded: false });
      const config = petalConfigs[`petal${petalNum}`];

      petalFolder.addBinding(config, 'translateX', { min: -100, max: 0, step: 1, label: 'X (%)' })
        .on('change', () => applyPetalTransform(petalNum, config));
      
      petalFolder.addBinding(config, 'translateY', { min: -100, max: 50, step: 1, label: 'Y (%)' })
        .on('change', () => applyPetalTransform(petalNum, config));
      
      petalFolder.addBinding(config, 'rotate', { min: -180, max: 360, step: 1, label: 'Rotate (°)' })
        .on('change', () => applyPetalTransform(petalNum, config));
      
      petalFolder.addBinding(config, 'scale', { min: 0.1, max: 2, step: 0.01, label: 'Scale' })
        .on('change', () => applyPetalTransform(petalNum, config));
      
      petalFolder.addBinding(config, 'rotateX', { min: 0, max: 90, step: 1, label: 'RotateX (°)' })
        .on('change', () => applyPetalTransform(petalNum, config));
    }

    // Outer petals 1-5
    for (let i = 1; i <= 5; i++) addPetalControls(outerFolder, i);
    // Middle petals 6-10
    for (let i = 6; i <= 10; i++) addPetalControls(middleFolder, i);
    // Inner petals 11-15
    for (let i = 11; i <= 15; i++) addPetalControls(innerFolder, i);
    // Core petals 16-17
    for (let i = 16; i <= 17; i++) addPetalControls(coreFolder, i);

    // Center circle controls
    centerFolder.addBinding(centerConfigs.center, 'width', { min: 1, max: 15, step: 0.5, label: 'Width (vmin)' })
      .on('change', () => applyCenterSize(centerConfigs.center));
    centerFolder.addBinding(centerConfigs.center, 'height', { min: 1, max: 15, step: 0.5, label: 'Height (vmin)' })
      .on('change', () => applyCenterSize(centerConfigs.center));

    // Export CSS button
    const actionsFolder = pane.addFolder({ title: '📋 Actions', expanded: true });
    
    actionsFolder.addButton({ title: '📋 Export CSS to Console' }).on('click', () => {
      let css = '/* Generated Petal CSS - Copy these values to style.css */\n\n';
      
      for (let i = 1; i <= 17; i++) {
        const c = petalConfigs[`petal${i}`];
        css += `.flower__leaf--${i} {\n`;
        css += `  transform: translate(${c.translateX}%, ${c.translateY}%) rotate(${c.rotate}deg) scale(${c.scale}) rotateX(${c.rotateX}deg);\n`;
        css += `}\n\n`;
      }

      css += `.flower__white-circle {\n`;
      css += `  width: ${centerConfigs.center.width}vmin;\n`;
      css += `  height: ${centerConfigs.center.height}vmin;\n`;
      css += `}\n`;

      console.log(css);
      alert('CSS exported to browser console (F12 → Console tab)');
    });

    actionsFolder.addButton({ title: '📋 Copy CSS to Clipboard' }).on('click', () => {
      let css = '/* Generated Petal CSS */\n\n';
      
      for (let i = 1; i <= 17; i++) {
        const c = petalConfigs[`petal${i}`];
        css += `.flower__leaf--${i} { \n  transform: translate(${c.translateX}%, ${c.translateY}%) rotate(${c.rotate}deg) scale(${c.scale}) rotateX(${c.rotateX}deg); \n}\n`;
      }

      navigator.clipboard.writeText(css).then(() => {
        alert('CSS copied to clipboard!');
      }).catch(() => {
        console.log(css);
        alert('Could not copy to clipboard. Check console.');
      });
    });

    actionsFolder.addButton({ title: '🔄 Reset All' }).on('click', () => {
      for (let i = 1; i <= 17; i++) {
        petalConfigs[`petal${i}`] = {
          translateX: -50,
          translateY: getDefaultTranslateY(i),
          rotate: getDefaultRotate(i),
          scale: getDefaultScale(i),
          rotateX: getDefaultRotateX(i),
        };
        applyPetalTransform(i, petalConfigs[`petal${i}`]);
      }
      pane.refresh();
    });

    // Add toggle visibility button
    let panelVisible = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'h' && e.ctrlKey) {
        panelVisible = !panelVisible;
        pane.element.style.display = panelVisible ? 'block' : 'none';
      }
    });

    // Add instruction text
    const instructionDiv = document.createElement('div');
    instructionDiv.innerHTML = `
      <div style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: #fff; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; z-index: 9999;">
        <strong>Dev Controls:</strong><br>
        • Ctrl+H to toggle panel<br>
        • Adjust sliders to position petals<br>
        • Export CSS when done<br>
        • Remove dev-controls.js when finished
      </div>
    `;
    document.body.appendChild(instructionDiv);

    console.log('🌹 Rose Editor loaded! Use Ctrl+H to toggle the panel.');
})();
