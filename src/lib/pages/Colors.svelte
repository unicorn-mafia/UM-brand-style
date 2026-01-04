<script>
  import { animate, inView } from 'motion';
  import { onMount } from 'svelte';
  import { copyToClipboard } from '../utils.js';
  
  // Color shades: [Lighter, Light, Base, Dark, Darker]
  const primaryShades = [
    { name: 'Off-Black', var: '--um-black', shades: [
      { hex: '#4D4D4D', rgb: 'rgb(77, 77, 77)' },
      { hex: '#333333', rgb: 'rgb(51, 51, 51)' },
      { hex: '#1A1A1A', rgb: 'rgb(26, 26, 26)' },
      { hex: '#0D0D0D', rgb: 'rgb(13, 13, 13)' },
      { hex: '#000000', rgb: 'rgb(0, 0, 0)' }
    ]},
    { name: 'Off-White', var: '--um-white', shades: [
      { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
      { hex: '#FCFCFC', rgb: 'rgb(252, 252, 252)' },
      { hex: '#F8F8F8', rgb: 'rgb(248, 248, 248)' },
      { hex: '#E8E8E8', rgb: 'rgb(232, 232, 232)' },
      { hex: '#D8D8D8', rgb: 'rgb(216, 216, 216)' }
    ]}
  ];
  
  const accentShades = [
    { name: 'Turquoise', var: '--um-turquoise', desc: 'Energy, innovation', shades: [
      { hex: '#E5FDF5', rgb: 'rgb(229, 253, 245)' },
      { hex: '#9FFCDB', rgb: 'rgb(159, 252, 219)' },
      { hex: '#4EF9BD', rgb: 'rgb(78, 249, 189)' },
      { hex: '#2DD4A0', rgb: 'rgb(45, 212, 160)' },
      { hex: '#1A9F78', rgb: 'rgb(26, 159, 120)' }
    ]},
    { name: 'Red', var: '--um-red', desc: 'Urgency, passion', shades: [
      { hex: '#FFEAE7', rgb: 'rgb(255, 234, 231)' },
      { hex: '#FF7566', rgb: 'rgb(255, 117, 102)' },
      { hex: '#EE1701', rgb: 'rgb(238, 23, 1)' },
      { hex: '#B31201', rgb: 'rgb(179, 18, 1)' },
      { hex: '#8A0E01', rgb: 'rgb(138, 14, 1)' }
    ]},
    { name: 'Purple', var: '--um-purple', desc: 'Creativity, premium', shades: [
      { hex: '#F5E7FC', rgb: 'rgb(245, 231, 252)' },
      { hex: '#D979F5', rgb: 'rgb(217, 121, 245)' },
      { hex: '#B307EB', rgb: 'rgb(179, 7, 235)' },
      { hex: '#8905B3', rgb: 'rgb(137, 5, 179)' },
      { hex: '#66048A', rgb: 'rgb(102, 4, 138)' }
    ]},
    { name: 'Blue', var: '--um-blue', desc: 'Trust, technical', shades: [
      { hex: '#E7F4FE', rgb: 'rgb(231, 244, 254)' },
      { hex: '#84C5F9', rgb: 'rgb(132, 197, 249)' },
      { hex: '#3198F1', rgb: 'rgb(49, 152, 241)' },
      { hex: '#2271B8', rgb: 'rgb(34, 113, 184)' },
      { hex: '#18548A', rgb: 'rgb(24, 84, 138)' }
    ]}
  ];
  
  const shadeNames = ['Lighter', 'Light', 'Base', 'Dark', 'Darker'];
  
  let currentShade = $state(2); // Start at Base
  let copiedColor = $state(null);
  
  // Generate Figma URL with current shades
  let figmaUrl = $derived.by(() => {
    const colors = [
      ...accentShades.map(c => c.shades[currentShade].hex),
      ...primaryShades.map(c => c.shades[currentShade].hex)
    ].map(hex => hex.replace('#', '')).join('-');
    return `https://www.figma.com/color-palette-generator/?colors=${colors}`;
  });
  
  async function handleCopy(hex) {
    const success = await copyToClipboard(hex);
    if (success) {
      copiedColor = hex;
      setTimeout(() => copiedColor = null, 1500);
    }
  }
  
  onMount(() => {
    inView('.color-card', ({ target }) => {
      animate(target,
        { opacity: [0, 1], scale: [0.9, 1], rotateY: [10, 0] },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    });
    
    inView('.code-block', ({ target }) => {
      animate(target,
        { opacity: [0, 1], x: [-30, 0] },
        { duration: 0.6 }
      );
    });
  });
</script>

<div class="colors-page">
  <div class="container">
    <h1>Color Palette</h1>
    <p class="subtitle mono">click any swatch to copy hex code</p>
    
    <!-- Shade Selector -->
    <div class="shade-selector">
      <button class="nav-btn" onclick={() => currentShade = Math.max(0, currentShade - 1)} disabled={currentShade === 0}>←</button>
      
      <div class="selector-content">
        <div class="color-preview">
          {#each [...primaryShades, ...accentShades] as colorSet, i}
            <div 
              class="preview-dot" 
              style="background: {colorSet.shades[currentShade].hex}"
            ></div>
          {/each}
        </div>
        <span class="shade-name">{shadeNames[currentShade]}</span>
      </div>
      
      <button class="nav-btn" onclick={() => currentShade = Math.min(4, currentShade + 1)} disabled={currentShade === 4}>→</button>
    </div>
    
    <!-- Primary Colors -->
    <section class="section">
      <h2>Primary Foundation</h2>
      <p class="mono desc">off-black and off-white form the core</p>
      
      <div class="color-grid">
        {#each primaryShades as colorSet}
          {@const color = colorSet.shades[currentShade]}
          <button 
            class="color-card"
            onclick={() => handleCopy(color.hex)}
            style="--color: {color.hex}"
          >
            <div class="color-swatch" style="background: {color.hex}"></div>
            <div class="color-info">
              <div class="color-name">{colorSet.name}</div>
              <div class="color-hex mono">{color.hex}</div>
              <div class="color-rgb mono">{color.rgb}</div>
              {#if copiedColor === color.hex}
                <div class="copied-badge mono">Copied!</div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </section>
    
    <!-- Accent Colors -->
    <section class="section">
      <h2>Vibrant Accents</h2>
      <p class="mono desc">from the pixel-art unicorn • use sparingly</p>
      
      <div class="color-grid accent-grid">
        {#each accentShades as colorSet}
          {@const color = colorSet.shades[currentShade]}
          <button 
            class="color-card accent"
            onclick={() => handleCopy(color.hex)}
            style="--color: {color.hex}"
          >
            <div class="color-swatch" style="background: {color.hex}"></div>
            <div class="color-info">
              <div class="color-name">{colorSet.name}</div>
              <div class="color-desc mono">{colorSet.desc}</div>
              <div class="color-hex mono">{color.hex}</div>
              <div class="color-rgb mono">{color.rgb}</div>
              {#if copiedColor === color.hex}
                <div class="copied-badge mono">Copied!</div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </section>
    
    <!-- Figma Integration -->
    <section class="section figma-section">
      <a 
        href={figmaUrl}
        target="_blank" 
        rel="noopener noreferrer"
        class="figma-link"
      >
        <svg class="figma-logo" width="24" height="24" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
        <span>Open in Figma</span>
        <svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </section>
    
    <!-- Usage Guidelines -->
    <section class="section usage">
      <h2>Usage Philosophy</h2>
      <div class="usage-grid">
        <div class="usage-card">
          <div class="usage-icon">🎨</div>
          <h3>Foundation</h3>
          <p class="mono">Off-black + off-white for 90% of layouts</p>
        </div>
        <div class="usage-card">
          <div class="usage-icon">✨</div>
          <h3>Accents</h3>
          <p class="mono">1-2 vibrant colors per screen for CTAs and key actions</p>
        </div>
        <div class="usage-card">
          <div class="usage-icon">⚡</div>
          <h3>Contrast</h3>
          <p class="mono">Always readable — 4.5:1 minimum</p>
        </div>
      </div>
    </section>
    
    <!-- CSS Variables -->
    <section class="section">
      <h2>Implementation</h2>
      <div class="code-block">
        <pre><code>{`:root {
  --um-black: ${primaryShades[0].shades[currentShade].hex};
  --um-white: ${primaryShades[1].shades[currentShade].hex};
  --um-turquoise: ${accentShades[0].shades[currentShade].hex};
  --um-red: ${accentShades[1].shades[currentShade].hex};
  --um-purple: ${accentShades[2].shades[currentShade].hex};
  --um-blue: ${accentShades[3].shades[currentShade].hex};
}`}</code></pre>
      </div>
      
      <div class="demo-container">
        <!-- Accents on Dark -->
        <div class="demo-group">
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[0].shades[currentShade].hex}; color: {accentShades[0].shades[currentShade].hex}">
              <span class="mono">Turquo on Black</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[0].shades[currentShade].hex}; color: {accentShades[1].shades[currentShade].hex}">
              <span class="mono">Red on Black</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[0].shades[currentShade].hex}; color: {accentShades[2].shades[currentShade].hex}">
              <span class="mono">Purple on Black</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[0].shades[currentShade].hex}; color: {accentShades[3].shades[currentShade].hex}">
              <span class="mono">Blue on Black</span>
            </div>
          </div>
        </div>
        
        <!-- Accents as backgrounds -->
        <div class="demo-group">
          <div class="pair">
            <div class="pair-demo" style="background: {accentShades[0].shades[currentShade].hex}; color: {primaryShades[0].shades[currentShade].hex}">
              <span class="mono">Black on Turquo</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {accentShades[1].shades[currentShade].hex}; color: {primaryShades[1].shades[currentShade].hex}">
              <span class="mono">White on Red</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {accentShades[2].shades[currentShade].hex}; color: {primaryShades[1].shades[currentShade].hex}">
              <span class="mono">White on Purple</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {accentShades[3].shades[currentShade].hex}; color: {primaryShades[1].shades[currentShade].hex}">
              <span class="mono">White on Blue</span>
            </div>
          </div>
        </div>
        
        <!-- Foundation -->
        <div class="demo-group foundation">
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[1].shades[currentShade].hex}; color: {primaryShades[0].shades[currentShade].hex}; border: 1px solid #DADADA">
              <span class="mono">Black on White</span>
            </div>
          </div>
          <div class="pair">
            <div class="pair-demo" style="background: {primaryShades[0].shades[currentShade].hex}; color: {primaryShades[1].shades[currentShade].hex}">
              <span class="mono">White on Black</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .colors-page {
    min-height: calc(100vh - 80px);
    padding: 6rem 0 4rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  h1 {
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .shade-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 1.5rem;
    background: var(--bg-elevated);
    border-radius: 16px;
    border: 2px solid var(--border-color);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .nav-btn {
    background: var(--bg-base);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-primary);
  }
  
  .nav-btn:hover:not(:disabled) {
    border-color: var(--um-turquoise);
    transform: scale(1.05);
  }
  
  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .selector-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .color-preview {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .preview-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
    animation: colorPulse 0.4s ease;
  }
  
  @keyframes colorPulse {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .shade-name {
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
  }
  
  .section {
    margin: 4rem 0;
  }
  
  .section h2 {
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  .desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .color-card {
    background: var(--bg-elevated);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    padding: 0;
    box-shadow: var(--shadow-sm);
  }
  
  .color-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color);
  }
  
  .color-swatch {
    height: 180px;
    position: relative;
    transition: all 0.4s ease;
  }
  
  .color-card:hover .color-swatch {
    height: 200px;
  }
  
  .color-info {
    padding: 1.5rem;
    position: relative;
  }
  
  .color-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .color-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }
  
  .color-hex {
    font-size: 0.95rem;
    color: var(--text-primary);
    margin: 0.25rem 0;
  }
  
  .color-rgb {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .copied-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--um-turquoise);
    color: var(--um-black);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .usage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .usage-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
  }
  
  .usage-card:hover {
    transform: translateY(-4px);
    border-color: var(--um-turquoise);
    background: var(--um-accent-bg);
    box-shadow: var(--shadow-md);
  }
  
  .usage-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .usage-card h3 {
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }
  
  .usage-card p {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
  
  .figma-section {
    display: flex;
    justify-content: center;
    margin: 3rem 0;
  }
  
  .figma-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-elevated);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem 2rem;
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-primary);
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: var(--shadow-sm);
  }
  
  .figma-link:hover {
    transform: translateY(-2px);
    border-color: #A259FF;
    background: var(--um-accent-bg);
    box-shadow: var(--shadow-md);
  }
  
  .figma-link:hover .arrow {
    transform: translateX(4px);
  }
  
  .figma-logo {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  
  .figma-link .arrow {
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  .code-block {
    background: var(--bg-elevated);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    opacity: 0;
    box-shadow: var(--shadow-sm);
  }
  
  .code-block pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre;
    word-wrap: normal;
  }
  
  .code-block code {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--text-primary);
    white-space: pre;
  }
  
  .demo-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .demo-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .demo-group .pair {
    min-width: 0;
  }
  
  .demo-group.foundation {
    grid-template-columns: 1fr;
  }
  
  .pair-demo {
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    transition: transform 0.3s ease;
    cursor: pointer;
    min-width: 0;
    overflow-wrap: break-word;
  }
  
  .pair-demo:hover {
    transform: scale(1.03);
  }
  
  .pair-demo .mono {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    .colors-page {
      padding: 4rem 0 3rem;
    }
    
    .container {
      padding: 0 1.5rem;
    }
    
    .shade-selector {
      gap: 1rem;
      padding: 1rem;
      max-width: 100%;
    }
    
    .nav-btn {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
    
    .preview-dot {
      width: 20px;
      height: 20px;
    }
    
    .shade-name {
      font-size: 1.05rem;
    }
    
    .color-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .color-card {
      padding: 0;
    }
    
    .color-info {
      padding: 1.25rem;
    }
    
    .usage-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .usage-card {
      padding: 1.5rem;
    }
    
    .figma-link {
      padding: 0.875rem 1.5rem;
      font-size: 0.95rem;
      gap: 0.625rem;
    }
    
    .figma-logo {
      width: 20px;
      height: 20px;
    }
    
    .code-block {
      padding: 1.5rem;
    }
    
    .demo-container {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .demo-group {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .pair-demo {
      padding: 1.25rem;
    }
    
    .pair-demo .mono {
      font-size: 0.75rem;
      word-break: break-word;
    }
  }
</style>


