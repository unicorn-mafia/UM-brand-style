<script>
  import { animate, inView } from 'motion';
  import { onMount } from 'svelte';
  
  const positioning = [
    'elite but not elitist',
    'technical but accessible',
    'professional but raw',
    'community-first always'
  ];
  
  onMount(() => {
    inView('.card', ({ target }) => {
      animate(target,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    });
  });
</script>

<div class="about">
  <div class="container">
    <h1>Brand Identity</h1>
    <p class="subtitle mono">highest signal, zero noise</p>
    
    <div class="card">
      <h2>Positioning</h2>
      <div class="positioning mono">
        {#each positioning as pos}
          <div class="pos-item">{pos}</div>
        {/each}
      </div>
    </div>
    
    <div class="card">
      <h2>Voice & Tone</h2>
      <p><strong>Confident.</strong> We know we're the best builders in London.</p>
      <p><strong>Direct.</strong> No fluff, no corporate speak, no BS.</p>
      <p><strong>Technical.</strong> We speak in code, not buzzwords.</p>
      <p><strong>Community-focused.</strong> We're building together.</p>
    </div>
    
    <div class="card">
      <h2>Visual Language</h2>
      <p>Clean, minimal, high-contrast. The pixel-art unicorn represents technical roots and gaming culture. Vibrant accent colors reflect diverse skills.</p>
      <div class="colors">
        <span class="dot" style="background: var(--um-turquoise)"></span>
        <span class="dot" style="background: var(--um-red)"></span>
        <span class="dot" style="background: var(--um-purple)"></span>
        <span class="dot" style="background: var(--um-blue)"></span>
      </div>
    </div>
  </div>
</div>

<style>
  .about {
    min-height: calc(100vh - 80px);
    padding: 6rem 0 4rem;
  }
  
  .container {
    max-width: 800px;
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
  
  .card {
    background: var(--bg-elevated);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    padding: 2.5rem;
    margin-bottom: 2rem;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .card h2 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-weight: 700;
  }
  
  .card p {
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  
  .positioning {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
  
  .pos-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
  }
  
  .pos-item:last-child {
    border-bottom: none;
  }
  
  .colors {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
  }
  
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  .dot:nth-child(4) { animation-delay: 0.6s; }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  
  @media (max-width: 768px) {
    .about {
      padding: 4rem 0 3rem;
    }
    
    .container {
      padding: 0 1.5rem;
    }
    
    .card {
      padding: 1.5rem;
    }
    
    .positioning {
      font-size: 1rem;
    }
  }
</style>
