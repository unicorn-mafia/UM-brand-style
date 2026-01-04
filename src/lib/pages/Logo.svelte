<script>
  import { animate, inView } from 'motion';
  import { onMount } from 'svelte';
  import { convertSvgToImage, downloadFile } from '../utils.js';
  
  let selectedSize = $state(1024);
  let downloading = $state(false);
  let downloadError = $state(null);
  
  const sizes = [
    { value: 64, label: '64px - favicon' },
    { value: 128, label: '128px - social icons' },
    { value: 256, label: '256px - app icons' },
    { value: 512, label: '512px - web icons' },
    { value: 1024, label: '1024px - standard' },
    { value: 2048, label: '2048px - retina' },
    { value: 4096, label: '4096px - print' }
  ];
  
  async function handleDownloadSVG(isInverse) {
    try {
      downloading = true;
      downloadError = null;
      
      const filename = isInverse ? 'UnicornMafia_logo_inverse.svg' : 'UnicornMafia_logo.svg';
      const response = await fetch(`/images/${filename}`);
      const svgText = await response.text();
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      
      downloadFile(blob, filename);
    } catch (error) {
      console.error('Download error:', error);
      downloadError = 'Failed to download SVG. Please try again.';
    } finally {
      downloading = false;
    }
  }
  
  async function handleDownloadRaster(isInverse, format) {
    try {
      downloading = true;
      downloadError = null;
      
      const filename = isInverse ? 'UnicornMafia_logo_inverse.svg' : 'UnicornMafia_logo.svg';
      const path = `/images/${filename}`;
      
      const blob = await convertSvgToImage(path, format, selectedSize, isInverse);
      const suffix = isInverse ? '_inverse' : '';
      const downloadName = `UnicornMafia_logo${suffix}_${selectedSize}px.${format}`;
      
      downloadFile(blob, downloadName);
    } catch (error) {
      console.error('Conversion error:', error);
      downloadError = `Failed to convert to ${format.toUpperCase()}. Please try again.`;
    } finally {
      downloading = false;
    }
  }
  
  onMount(() => {
    inView('.logo-preview', ({ target }) => {
      animate(target,
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    });
    
    inView('.download-section', ({ target }) => {
      animate(target,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.6 }
      );
    });
  });
</script>

<div class="logo-page">
  <div class="container">
    <h1>Logo Assets</h1>
    <p class="subtitle mono">pixel-art unicorn with vibrant accent colors</p>
    <!-- Logo Previews -->
    <section class="section">
      <h2>The Mark</h2>
      <p>Distinctive pixel-art unicorn representing innovation and technical excellence.</p>
      
      <div class="logo-grid">
        <div class="logo-preview light">
          <div class="preview-box">
            <img src="/images/UnicornMafia_logo.svg" alt="Unicorn Mafia Logo" />
          </div>
          <p class="mono">regular / for light backgrounds</p>
        </div>
        
        <div class="logo-preview dark">
          <div class="preview-box">
            <img src="/images/UnicornMafia_logo_inverse.svg" alt="Unicorn Mafia Logo Inverse" />
          </div>
          <p class="mono">inverse / for dark backgrounds</p>
        </div>
      </div>
    </section>
    
    <!-- Downloads -->
    <section class="section">
      <h2>Downloads</h2>
      <p class="mono desc">choose format and resolution • click to download</p>
      
      {#if downloadError}
        <div class="error-banner">
          {downloadError}
        </div>
      {/if}
      
      <!-- Regular Version -->
      <div class="download-section">
        <h3>Regular Version <span class="mono">(black unicorn)</span></h3>
        
        <div class="download-grid">
          <!-- SVG -->
          <div class="download-card">
            <div class="format-header">
              <h4 class="mono">SVG</h4>
              <span class="badge">Recommended</span>
            </div>
            <p class="mono desc">vector / scalable / best quality</p>
            <button 
              class="download-btn" 
              onclick={() => handleDownloadSVG(false)}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download SVG'}
            </button>
          </div>
          
          <!-- Raster -->
          <div class="download-card">
            <div class="format-header">
              <h4 class="mono">PNG / JPG</h4>
            </div>
            <p class="mono desc">raster / for specific sizes</p>
            
            <select bind:value={selectedSize} class="size-select mono">
              {#each sizes as size}
                <option value={size.value}>{size.label}</option>
              {/each}
            </select>
            
            <div class="button-group">
              <button 
                class="download-btn secondary" 
                onclick={() => handleDownloadRaster(false, 'png')}
                disabled={downloading}
              >
                PNG
              </button>
              <button 
                class="download-btn secondary" 
                onclick={() => handleDownloadRaster(false, 'jpg')}
                disabled={downloading}
              >
                JPG
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Inverse Version -->
      <div class="download-section">
        <h3>Inverse Version <span class="mono">(white unicorn)</span></h3>
        
        <div class="download-grid">
          <!-- SVG -->
          <div class="download-card">
            <div class="format-header">
              <h4 class="mono">SVG</h4>
              <span class="badge">Recommended</span>
            </div>
            <p class="mono desc">vector / scalable / best quality</p>
            <button 
              class="download-btn" 
              onclick={() => handleDownloadSVG(true)}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download SVG'}
            </button>
          </div>
          
          <!-- Raster -->
          <div class="download-card">
            <div class="format-header">
              <h4 class="mono">PNG / JPG</h4>
            </div>
            <p class="mono desc">raster / for specific sizes</p>
            
            <select bind:value={selectedSize} class="size-select mono">
              {#each sizes as size}
                <option value={size.value}>{size.label}</option>
              {/each}
            </select>
            
            <div class="button-group">
              <button 
                class="download-btn secondary" 
                onclick={() => handleDownloadRaster(true, 'png')}
                disabled={downloading}
              >
                PNG
              </button>
              <button 
                class="download-btn secondary" 
                onclick={() => handleDownloadRaster(true, 'jpg')}
                disabled={downloading}
              >
                JPG
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p class="mono note">PNG has transparent background • JPG has white/black background</p>
    </section>
    
    <!-- Guidelines -->
    <section class="section">
      <h2>Usage Guidelines</h2>
      
      <div class="guidelines">
        <div class="guideline-item">
          <h3>📏 Sizing</h3>
          <p class="mono">favicon: 64px / icons: 128-256px / web: 512px / standard: 1024px / print: 2048px+</p>
        </div>
        
        <div class="guideline-item">
          <h3>🎯 Clear Space</h3>
          <p class="mono">minimum 25% of logo width on all sides</p>
        </div>
        
        <div class="guideline-item">
          <h3>✅ Do</h3>
          <p>Maintain aspect ratio, use on high-contrast backgrounds, keep clear space</p>
        </div>
        
        <div class="guideline-item">
          <h3>❌ Don't</h3>
          <p>Stretch, change colors, rotate, add effects, or place on busy backgrounds</p>
        </div>
        
        <div class="guideline-item full">
          <h3>🎨 When to Use</h3>
          <div class="usage-examples">
            <div class="usage-ex">
              <span class="mono">regular (black)</span>
              <p>Light backgrounds, white/light gray surfaces</p>
            </div>
            <div class="usage-ex">
              <span class="mono">inverse (white)</span>
              <p>Dark backgrounds, black surfaces, colored backgrounds</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .logo-page {
    min-height: calc(100vh - 80px);
    padding: 6rem 0 4rem;
  }
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  h1 {
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 3rem;
  }
  
  .section {
    margin: 4rem 0;
  }
  
  .section h2 {
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
  
  .logo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .logo-preview {
    opacity: 0;
  }
  
  .preview-box {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
  }
  
  .logo-preview.light .preview-box {
    background: #F5F5F5;
  }
  
  [data-theme="dark"] .logo-preview.light .preview-box {
    background: #D8D8D8;
  }
  
  .logo-preview.dark .preview-box {
    background: #1A1A1A;
  }
  
  .logo-preview:hover .preview-box {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  
  .preview-box img {
    max-width: 200px;
    width: 100%;
    height: auto;
    animation: float 4s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .logo-preview p {
    text-align: center;
    margin-top: 1rem;
    color: var(--text-secondary);
  }
  
  .download-section {
    margin: 3rem 0;
    opacity: 0;
  }
  
  .download-section h3 {
    margin-bottom: 1.5rem;
  }
  
  .download-section h3 span {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 400;
  }
  
  .download-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .download-card {
    background: var(--bg-elevated);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
  }
  
  .download-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .format-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .format-header h4 {
    margin: 0;
    font-size: 1rem;
  }
  
  .badge {
    background: var(--um-turquoise);
    color: var(--um-black);
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .download-card .desc {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  
  .size-select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .size-select:hover {
    border-color: var(--um-turquoise);
  }
  
  .size-select:focus {
    outline: none;
    border-color: var(--um-turquoise);
  }
  
  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .download-btn {
    width: 100%;
    padding: 0.875rem;
    background: var(--um-black);
    color: var(--um-white);
    border: 2px solid var(--um-black);
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .download-btn:hover:not(:disabled) {
    background: var(--um-turquoise);
    color: var(--um-black);
    border-color: var(--um-turquoise);
    transform: translateY(-2px);
  }
  
  .download-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .download-btn.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);
  }
  
  .download-btn.secondary:hover:not(:disabled) {
    background: var(--um-purple);
    color: var(--um-white);
    border-color: var(--um-purple);
  }
  
  .error-banner {
    background: var(--um-red);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 600;
  }
  
  .note {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-top: 2rem;
  }
  
  .guidelines {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .guideline-item {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  
  .guideline-item.full {
    grid-column: 1 / -1;
  }
  
  .guideline-item h3 {
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }
  
  .guideline-item p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .usage-examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .usage-ex {
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 8px;
  }
  
  .usage-ex span {
    color: var(--um-turquoise);
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .usage-ex p {
    font-size: 0.9rem;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .logo-page {
      padding: 4rem 0 3rem;
    }
    
    .container {
      padding: 0 1.5rem;
    }
    
    .logo-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .preview-box {
      padding: 2rem;
      min-height: 250px;
    }
    
    .preview-box img {
      max-width: 150px;
    }
    
    .download-grid {
      grid-template-columns: 1fr;
    }
    
    .download-card {
      padding: 1.5rem;
    }
    
    .guidelines {
      grid-template-columns: 1fr;
    }
    
    .usage-examples {
      grid-template-columns: 1fr;
    }
  }
</style>

