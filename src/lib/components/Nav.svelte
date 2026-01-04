<script>
  import { animate } from 'motion';
  import { theme } from '../stores.js';
  import { onMount } from 'svelte';
  
  let { currentPage = $bindable('overview') } = $props();
  let scrolled = $state(false);
  let mounted = $state(false);
  
  const pages = [
    { id: 'overview', label: 'home' },
    { id: 'about', label: 'about' },
    { id: 'colors', label: 'colors' },
    { id: 'typography', label: 'typography' },
    { id: 'logo', label: 'logo' }
  ];
  
  function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }
  
  onMount(() => {
    mounted = true;
    
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animate nav items on mount
    animate('.nav-item', 
      { opacity: [0, 1], y: [-10, 0] },
      { delay: (i) => 0.1 + (i * 0.05), duration: 0.5 }
    );
    
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class="nav" class:scrolled>
  <div class="nav-container">
    <div class="nav-left">
      <button class="logo-container" onclick={() => currentPage = 'overview'}>
        <img 
          src={$theme === 'dark' ? `${import.meta.env.BASE_URL}images/UnicornMafia_logo_inverse.svg` : `${import.meta.env.BASE_URL}images/UnicornMafia_logo.svg`} 
          alt="Unicorn Mafia"
          class="logo"
        />
        <span class="brand">UNICORN MAFIA</span>
      </button>
    </div>
    
    <div class="nav-center">
      {#each pages as page, i}
        <button 
          class="nav-item mono" 
          class:active={currentPage === page.id}
          onclick={() => currentPage = page.id}
          style="--delay: {i * 0.05}s"
        >
          {page.label}
        </button>
      {/each}
    </div>
    
    <div class="nav-right">
      <button class="theme-toggle" onclick={toggleTheme} title="Toggle theme">
        {#if $theme === 'light'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.66 15.66L17.07 17.07M2.93 2.93L4.34 4.34M15.66 4.34L17.07 2.93M2.93 17.07L4.34 15.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--bg-elevated);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }
  
  .nav.scrolled {
    border-bottom-color: var(--border-color);
    box-shadow: var(--shadow-md);
  }
  
  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  
  .nav-left {
    flex-shrink: 0;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .logo {
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;
  }
  
  .logo-container:hover .logo {
    transform: scale(1.1) rotate(5deg);
  }
  
  .brand {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
  
  .nav-center {
    display: flex;
    gap: 2rem;
    flex: 1;
    justify-content: center;
  }
  
  .nav-item {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    position: relative;
    padding: 0.5rem 0;
    transition: color 0.3s ease;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
    animation-delay: var(--delay, 0s);
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  
  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--um-turquoise);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .nav-item:hover,
  .nav-item.active {
    color: var(--um-turquoise);
  }
  
  .nav-item.active::after {
    transform: scaleX(1);
  }
  
  .nav-right {
    flex-shrink: 0;
  }
  
  .theme-toggle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
    background: var(--um-turquoise);
    color: #1A1A1A;
    border-color: var(--um-turquoise);
    transform: rotate(15deg);
  }
  
  @media (max-width: 768px) {
    .nav-container {
      flex-wrap: wrap;
      padding: 1rem;
    }
    
    .nav-center {
      order: 3;
      width: 100%;
      justify-content: space-around;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    
    .nav-item {
      font-size: 0.85rem;
    }
    
    .brand {
      font-size: 1rem;
    }
    
    .logo {
      width: 32px;
      height: 32px;
    }
  }
</style>

