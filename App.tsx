
import React, { useState, useEffect } from 'react';
import { Project, Skill } from './types';

// Mapa centralizado de colores por proyecto para mantener coherencia visual
const PROJECT_THEMES: Record<string, string> = {
  'breaking-news': '#FF0000', // Rojo Impacto
  'youtube-ctr': '#FFCC00',    // Amarillo YouTube
  'rar-automotores': '#0061FF' // Azul Eléctrico
};

// Configuración de contacto
const CONTACT_CONFIG = {
  whatsapp: "5493512046295", 
  defaultMessage: "Hola Sebastian, vi tu portafolio y me gustaría hablar sobre un proyecto de diseño."
};

/**
 * Componente InteractiveLetter: Maneja la iluminación individual de cada letra.
 */
const InteractiveLetter: React.FC<{ char: string; color?: string }> = ({ char, color = "#0061FF" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (char === " ") return <span className="inline-block">&nbsp;</span>;
  if (char === "\n") return <br />;

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block transition-all duration-150 cursor-default select-none"
      style={{ 
        color: isHovered ? color : 'inherit',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        textShadow: isHovered ? `0 0 20px ${color}` : 'none'
      }}
    >
      {char}
    </span>
  );
};

/**
 * Componente InteractiveTitle: Divide un texto en letras interactivas.
 */
const InteractiveTitle: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <div className={className}>
      {text.split("").map((char, index) => (
        <InteractiveLetter key={index} char={char} />
      ))}
    </div>
  );
};

// Función de utilidad para convertir enlaces de Google Drive a enlaces directos de imagen
const getDriveDirectLink = (url: string) => {
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/file\/d\/(.+?)\//)?.[1] || url.match(/id=(.+?)(&|$)/)?.[1];
    return fileId ? `https://lh3.googleusercontent.com/u/0/d/${fileId}` : url;
  }
  return url;
};

// Componente de Cabecera de Sección
const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12 border-b-4 border-white pb-4">
    <h2 className="text-4xl md:text-6xl font-display font-black text-impact">{title}</h2>
    {subtitle && <p className="mt-2 text-lg text-zinc-400 font-semibold uppercase">{subtitle}</p>}
  </div>
);

// Componente de Galería / Página de Proyecto
const ProjectGallery: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const accentColor = PROJECT_THEMES[project.id] || '#0061FF';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto animate-in fade-in duration-500">
      <nav className="sticky top-0 z-[60] bg-black/95 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <span className="font-display font-black text-xs md:text-sm tracking-tighter uppercase truncate mr-4 text-zinc-500">
          Proyecto / <span style={{ color: accentColor }}>{project.title}</span>
        </span>
        <button 
          onClick={onClose}
          className="bg-white text-black px-4 py-2 font-display font-black text-[10px] uppercase hover:bg-zinc-200 transition-colors flex-shrink-0"
        >
          Cerrar [ESC]
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-20">
          <div className="lg:w-3/5 flex flex-col justify-start">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black uppercase leading-[1] mb-10 tracking-tighter break-words">
              {project.title.split(':').map((part, i) => (
                <span key={i} className="block" style={{ color: i === 1 ? accentColor : 'white', marginTop: i === 1 ? '0.5rem' : '0' }}>
                  {part.trim()}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light italic border-l-4 pl-6 max-w-xl" style={{ borderColor: accentColor }}>
              {project.concept}
            </p>
          </div>

          <div className="lg:w-2/5">
            <div className="bg-zinc-900/80 p-6 md:p-10 border-t-4 lg:sticky lg:top-28" style={{ borderColor: 'white' }}>
              <h3 className="font-display font-bold uppercase mb-8 text-xs tracking-[0.2em] text-zinc-500">
                Data Sheet del Proyecto
              </h3>
              <ul className="space-y-8">
                {project.details.map((detail, idx) => (
                  <li key={idx} className="text-sm md:text-base text-zinc-400 leading-snug border-b border-zinc-800/50 pb-6 last:border-0 last:pb-0">
                    <span className="font-black block mb-2 uppercase text-[10px] tracking-widest" style={{ color: accentColor }}>
                      Especificación 0{idx + 1}
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-16 md:space-y-24">
          {project.gallery?.map((img, idx) => (
            <div key={idx} className="group relative overflow-hidden bg-zinc-900 border border-zinc-800">
              <img 
                src={getDriveDirectLink(img)} 
                alt={`${project.title} view ${idx}`} 
                className="w-full h-auto object-cover transition-all duration-1000"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] uppercase font-mono tracking-widest border border-zinc-700">
                Asset_Capture_0{idx + 1}.png
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center pb-32 border-t border-zinc-900 pt-20">
          <button 
            onClick={onClose}
            className="text-2xl md:text-4xl font-display font-black uppercase transition-all border-b-4 pb-4 inline-block tracking-tighter"
            style={{ 
              borderColor: 'white',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = accentColor;
              e.currentTarget.style.borderColor = accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'white';
            }}
          >
            ← Volver al Índice
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Proyecto
const ProjectCard: React.FC<{ project: Project; onOpen: (p: Project) => void }> = ({ project, onOpen }) => {
  const accentColor = PROJECT_THEMES[project.id] || '#0061FF';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={() => onOpen(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-white transition-all duration-300 flex flex-col md:flex-row gap-8 p-6 md:p-8 cursor-pointer"
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest">
            {project.category}
          </span>
          <span 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 12px ${accentColor}` 
            }}
          ></span>
        </div>
        <h3 className="text-3xl md:text-4xl font-display font-bold leading-none uppercase tracking-tighter">{project.title}</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-400 text-lg leading-relaxed line-clamp-3">{project.concept}</p>
        </div>
        <div className="pt-4">
          <span 
            className="text-[10px] font-display font-black uppercase tracking-[0.2em] transition-colors duration-300"
            style={{ color: isHovered ? accentColor : 'inherit' }}
          >
            Explorar Caso de Estudio →
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div className="relative aspect-video overflow-hidden transition-all duration-700 bg-zinc-800">
          <img 
            src={getDriveDirectLink(project.image)} 
            alt={project.title}
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'breaking-news',
      category: 'Branding',
      title: 'PL: Sueño de Barrio',
      concept: 'Diseño de la marca de un equipo de futbol amateur, llevando a otro nivel su identidad y cultura.',
      image: 'https://drive.google.com/file/d/1BD-EtPpDpkr6OViCtA4UJxpHXHSNx9gY/view?usp=sharing',
      gallery: [
        'https://drive.google.com/file/d/1BD-EtPpDpkr6OViCtA4UJxpHXHSNx9gY/view?usp=sharing',
        'https://drive.google.com/file/d/1MP1jWFLv-4egJPkJ9nS5n0ng05FmqiXF/view?usp=sharing',
        'https://drive.google.com/file/d/1UyQuVrdZrpq-Z612BjJYCAM0N317lu-l/view?usp=sharing',
      ],
      details: [
        'Tipografía: Uso de Archivo Black por su peso visual.',
        'Paleta: Alto contraste focalizado en la cultura de barrio.',
        'Retícula: Diseño modular para aplicaciones físicas y digitales.'
      ]
    },
    {
      id: 'youtube-ctr',
      category: 'Miniaturas de YouTube',
      title: 'Arquitectura del Click',
      concept: 'Creación de thumbnails diseñadas para maximizar el Click-Through Rate (CTR) en un mercado saturado.',
      image: 'https://images.unsplash.com/photo-1593784991095-a205039470b6?q=80&w=800&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format',
        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1200&auto=format'
      ],
      details: [
        'Jerarquía: Equilibrio de rostros con texto contundente.',
        'Psicología Visual: Iluminación dramática y contornos.',
        'Legibilidad: Textos optimizados para pantallas móviles.'
      ]
    },
    {
      id: 'rar-automotores',
      category: 'Branding / Estrategia',
      title: 'RAR Automotores: Ingeniería Visual',
      concept: 'Desarrollo de la identidad integral para una concesaionaria líder. Se posicionó a la marca como un referente moderno a través de un lenguaje visual basado en la aerodinámica.',
      image: 'https://drive.google.com/file/d/12N-LLBBmuOettsBSgYuPRXNUZ2-9xobx/view?usp=sharing',
      gallery: [
        'https://drive.google.com/file/d/12N-LLBBmuOettsBSgYuPRXNUZ2-9xobx/view?usp=sharing',
        'https://drive.google.com/file/d/1CRuXRJdLsSHx_eyhNJkPqhBjP6m2jR7y/view?usp=sharing',
        'https://drive.google.com/file/d/15Jxb7hqRi1DBbMRPFq91dM3_CZbPKkTe/view?usp=sharing',
        'https://drive.google.com/file/d/1g3v05XrgMDojzYy9Nq9Rc5KkfoYxCJD-/view?usp=sharing'
      ],
      details: [
        'Concepto: "Velocidad y Precisión" basado en aerodinámica.',
        'Cromática: Negro Base, Azul Eléctrico (#0061FF) y Blanco.',
        'Tipografía: Sans-serif expandida para estabilidad institucional.',
        'Expansión: Adaptación omnicanal de digital a señalética física.'
      ]
    }
  ];

  const skills: Skill[] = [
    {
      category: 'Técnicas / Software',
      items: ['Adobe Photoshop (Experto)', 'Adobe Illustrator (Branding)', 'Adobe Premiere Pro', 'Figma (UI/UX)', 'After Effects (Motion)']
    },
    {
      category: 'Criterio / Soft Skills',
      items: ['Entrega bajo presión', 'Edición en tiempo real', 'Criterio editorial agudo', 'Adaptabilidad 24/7', 'Dirección de arte']
    }
  ];

  const whatsappUrl = `https://wa.me/5493512046295?text=${encodeURIComponent(CONTACT_CONFIG.defaultMessage)}`;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:px-12 lg:px-24 selection:bg-[#0061FF] selection:text-white">
      {selectedProject && (
        <ProjectGallery 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <header className="max-w-6xl mx-auto mb-32 mt-12 md:mt-24">
        <div className="flex flex-col gap-10">
          <div className="text-7xl md:text-9xl font-display font-black leading-[0.85] text-impact tracking-tighter">
            <InteractiveTitle text="SEBASTIAN" />
            <InteractiveTitle text="AVARO." />
          </div>
          <div className="max-w-2xl">
            <p className="text-xl md:text-3xl font-semibold text-zinc-400 border-l-8 border-white pl-8 py-2 leading-tight italic">
              "Diseñador gráfico enfocado en comunicación de alto impacto. Transformo la urgencia en piezas visuales audaces y directas."
            </p>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto mb-32">
        <SectionHeader title="Casos de Estudio" subtitle="Proyectos estratégicos" />
        <div className="space-y-16">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onOpen={setSelectedProject}
            />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-32 grid md:grid-cols-2 gap-20">
        <div>
           <SectionHeader title="Habilidades" subtitle="Arsenal Técnico" />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {skills.map((group, i) => (
                <div key={i}>
                  <h4 className="text-[#0061FF] font-display font-bold text-[10px] mb-6 uppercase tracking-[0.3em]">{group.category}</h4>
                  <ul className="space-y-4">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-zinc-400 group cursor-default">
                        <span className="w-4 h-px bg-zinc-700 group-hover:bg-white group-hover:w-8 transition-all duration-300"></span>
                        <span className="text-sm font-bold group-hover:text-white transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="bg-zinc-900 p-8 md:p-14 border-l-8 border-[#0061FF]">
            <h3 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase leading-none tracking-tighter">¿Impulsamos tu visión visual?</h3>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Especializado en diseño editorial y branding para el entorno digital moderno. Escribime para agendar una breve llamada.
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-10 py-5 text-lg font-display font-black hover:bg-[#0061FF] hover:text-white transition-all uppercase tracking-tighter w-full text-center"
            >
              Iniciar vía WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto pt-16 pb-24 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          © 2024 VISUAL IMPACT — BRANDING & EDITORIAL STRATEGY
        </p>
        <div className="flex gap-10">
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest">LinkedIn</a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest">Behance</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
