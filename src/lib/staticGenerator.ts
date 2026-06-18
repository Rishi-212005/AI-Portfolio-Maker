/**
 * staticGenerator.ts
 * Generates a self-contained, standalone static HTML portfolio webpage
 * that can be hosted on Netlify, GitHub Pages, Vercel, or run locally.
 */

export const generateStaticPortfolio = (
  htmlContent: string,
  themeColor: string,
  isDark: boolean,
  portfolioName: string
): string => {
  const bgColorClass = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  
  // Custom styles extracted from index.css to ensure perfect visual match
  const customStyles = `
    :root {
      --portfolio-primary: ${themeColor};
      --portfolio-primary-glow: ${themeColor}30;
      --portfolio-primary-bg: ${themeColor}10;
      
      --gradient-primary: linear-gradient(135deg, ${themeColor}, HSL(270 80% 65%));
      --gradient-hero: linear-gradient(135deg, ${isDark ? '#020617' : '#f8fafc'} 0%, ${isDark ? '#0b1329' : '#f1f5f9'} 50%, ${isDark ? '#070b19' : '#e2e8f0'} 100%);
      --gradient-card: linear-gradient(135deg, ${isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)'}, ${isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.4)'});
      --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      --shadow-glow: 0 0 30px ${themeColor}26;
      --shadow-glow-lg: 0 0 60px ${themeColor}33;
      --shadow-card: 0 4px 24px rgba(0,0,0,0.3);
    }
    
    html {
      scroll-behavior: smooth;
      scroll-padding-top: 80px;
    }
    
    .theme-highlight-text { color: var(--portfolio-primary) !important; }
    .theme-highlight-border { border-color: var(--portfolio-primary) !important; }
    .theme-highlight-bg { background-color: var(--portfolio-primary) !important; }
    .theme-highlight-bg-opacity { background-color: var(--portfolio-primary-bg) !important; }
    .theme-highlight-border-opacity { border-color: var(--portfolio-primary-glow) !important; }

    .glass-card {
      backdrop-blur-xl;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 0.75rem;
      background: var(--gradient-glass);
    }
    
    .gradient-text {
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      background-image: var(--gradient-primary);
      filter: drop-shadow(0 0 20px ${themeColor}66);
    }
    
    .gradient-border {
      position: relative;
      border-radius: 0.75rem;
    }
    
    .gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 0.75rem;
      padding: 1px;
      background: var(--gradient-primary);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
    
    .hover-glow {
      transition: all 0.35s ease;
    }
    
    .hover-glow:hover {
      box-shadow: var(--shadow-glow);
      transform: translateY(-2px);
    }
    
    .grid-pattern {
      background-size: 60px 60px;
      background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px ${themeColor}1a; }
      50% { box-shadow: 0 0 40px ${themeColor}4d; }
    }
    
    .animate-pulse-glow {
      animation: pulse-glow 2.5s ease-in-out infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .animate-cursor {
      animation: blink 1s step-end infinite;
    }
    
    .neon-text {
      text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
    }
  `;

  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? "dark" : ""}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolioName} | Portfolio</title>
  <meta name="description" content="Personal portfolio website generated using PortGen AI.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  
  <!-- Tailwind Configuration -->
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
            serif: ['Playfair Display', 'serif'],
            outfit: ['Outfit', 'sans-serif'],
            share: ['Share Tech Mono', 'monospace'],
          },
          colors: {
            primary: '${themeColor}',
          }
        }
      }
    }
  </script>
  
  <!-- Custom Styling Rules -->
  <style>
    ${customStyles}
  </style>
</head>
<body class="${bgColorClass} font-sans antialiased overflow-x-hidden">

  ${htmlContent}

  <!-- Standalone Vanilla JS Interactions -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Initialize Lucide Icons
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      // 2. Dynamic Mobile Navigation Menu Toggle
      const nav = document.querySelector('nav');
      if (nav) {
        const toggleButton = nav.querySelector('button');
        const desktopLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
        
        if (toggleButton && desktopLinks.length > 0) {
          // Create a responsive mobile menu dropdown overlay dynamically
          const mobileMenu = document.createElement('div');
          mobileMenu.className = 'mobile-menu hidden absolute top-[57px] left-0 right-0 z-30 border-b px-6 py-4 flex flex-col gap-3 backdrop-blur-lg bg-slate-950/95 border-slate-800/80 shadow-2xl';
          
          // Apply light/dark color matching to mobile menu
          const isDarkTheme = document.documentElement.classList.contains('dark');
          if (!isDarkTheme) {
            mobileMenu.className = 'mobile-menu hidden absolute top-[57px] left-0 right-0 z-30 border-b px-6 py-4 flex flex-col gap-3 backdrop-blur-lg bg-white/95 border-slate-200/80 shadow-2xl';
          }
          
          desktopLinks.forEach(link => {
            const mLink = link.cloneNode(true);
            mLink.className = 'uppercase text-xs font-bold tracking-widest text-inherit hover:opacity-80 py-1.5 block border-b border-slate-500/10';
            mLink.addEventListener('click', () => {
              mobileMenu.classList.add('hidden');
            });
            mobileMenu.appendChild(mLink);
          });
          
          nav.appendChild(mobileMenu);
          
          // Toggle visibility on hamburger click
          toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
          });
          
          // Close mobile menu when clicking outside
          document.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
          });
          
          mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        }
      }
      
      // 3. Handle Static Contact Form Submission
      const contactForms = document.querySelectorAll('form');
      contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // Create success banner
          const successBanner = document.createElement('div');
          successBanner.className = 'p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-sm text-center mb-4 transition-all duration-300';
          successBanner.innerHTML = '✅ Message sent successfully! Thank you for getting in touch.';
          
          form.insertBefore(successBanner, form.firstChild);
          form.reset();
          
          // Clear success banner after 4 seconds
          setTimeout(() => {
            successBanner.style.opacity = '0';
            setTimeout(() => successBanner.remove(), 300);
          }, 4000);
        });
      });
      
      // 4. Smooth Anchor Link Navigation Scrolling
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const hrefAttr = this.getAttribute('href');
          if (hrefAttr === '#') return;
          e.preventDefault();
          
          const target = document.querySelector(hrefAttr);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      });
    });
  </script>
</body>
</html>`;
};
