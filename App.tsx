
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
  defaultMessage: "Hola Sebastián, vi tu portafolio y me gustaría hablar sobre un proyecto de diseño.",
  linkedin: "https://www.linkedin.com/in/avarobula/" 
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
  const [isMobile, setIsMobile] = useState(false);

  // Hook para detectar el ancho de pantalla de forma robusta
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const projects: Project[] = [
    {
      id: 'breaking-news',
      category: 'Branding',
      title: 'PL: Sueño de Barrio',
      concept: 'Esta iniciativa se centró en la profesionalización visual de una institución deportiva amateur, elevando su cultura y sentido de pertenencia a través de un sistema de identidad de élite que fusiona el legado heráldico con la potencia del fútbol contemporáneo. El objetivo principal fue transformar una marca barrial en un símbolo de autoridad competitiva, utilizando una iconografía de alto impacto y una construcción simbólica que proyecta fuerza y tradición desde el primer contacto visual.',
      image: 'https://drive.google.com/file/d/1BD-EtPpDpkr6OViCtA4UJxpHXHSNx9gY/view?usp=sharing',
      gallery: [
        'https://drive.google.com/file/d/1BD-EtPpDpkr6OViCtA4UJxpHXHSNx9gY/view?usp=sharing',
        'https://drive.google.com/file/d/1MP1jWFLv-4egJPkJ9nS5n0ng05FmqiXF/view?usp=sharing',
        'https://drive.google.com/file/d/1UyQuVrdZrpq-Z612BjJYCAM0N317lu-l/view?usp=sharing',
      ],
      details: [
        'Composición Heráldica: Estructura basada en la tradición de clubes clásicos, utilizando soportes simétricos (toros) para reforzar la identidad del nombre y proyectar una imagen de fuerza y competitividad.',
        'Arquitectura de Kit: Integración del sistema visual en indumentaria técnica, equilibrando la carga gráfica del escudo con una estética de uniforme limpia y funcional.',
        'Versatilidad Técnica: Proporciones ajustadas para una reproducción impecable en bordados y aplicaciones del kit oficial.'
      ]
    },
    {
      id: 'youtube-ctr',
      category: 'Miniaturas de YouTube',
      title: 'Thumbnail: Arquitectura del Click',
      concept: 'La creación de thumbnails para temas de economía requiere un equilibrio entre rigor y curiosidad. El objetivo de este proyecto fue diseñar una narrativa visual que logre que datos históricos y financieros complejos resulten atractivos y clickeables en un mercado digital saturado',
      image: 'https://drive.google.com/file/d/1LxsZ4plI3ti-YRHc4101aGKn3ZMx7Kgv/view?usp=sharing',
      gallery: [
        'https://drive.google.com/file/d/1LxsZ4plI3ti-YRHc4101aGKn3ZMx7Kgv/view?usp=sharing',
        'https://drive.google.com/file/d/1NqV_k0RwXL3UkC7qJ2fUvyNnNl73o1kD/view?usp=sharing',
        'https://drive.google.com/file/d/1CvRk1oyHvgTbXbj2YRbqrkgPT3bgslIY/view?usp=sharing',
        'https://drive.google.com/file/d/135s1wJzJgICQxScDMPMVZKIeMHY_LIrJ/view?usp=sharing',
      ],
      details: [
        'Simbología Conceptual: Uso de objetos icónicos para materializar conceptos financieros abstractos de forma visual e inmediata.',
        'Composición de Alto CTR: Jerarquía visual diseñada para capturar la atención en segundos, con tipografías de gran peso optimizadas para dispositivos móviles.',
        'Criterio de Mercado: Diseño estratégico basado en el análisis de tendencias de consumo de contenido educativo.'
      ]
    },
    {
      id: 'rar-automotores',
      category: 'Branding / Estrategia',
      title: 'RAR Automotores: Ingeniería Visual',
      concept: 'El proyecto consistió en la reingeniería de la identidad visual integral para una comercializadora de vehículos líder, posicionándola como un referente moderno mediante un lenguaje visual basado en principios de aerodinámica y precisión técnica. Se desarrolló un ecosistema de marca de alta performance que utiliza tipografías extendidas y un contraste cromático audaz para proyectar solidez, seguridad y vanguardia en cada punto de contacto con el cliente, optimizando la presencia de la marca tanto en entornos físicos como digitales.',
      image: 'https://drive.google.com/file/d/12N-LLBBmuOettsBSgYuPRXNUZ2-9xobx/view?usp=sharing',
      gallery: [
        'https://drive.google.com/file/d/12N-LLBBmuOettsBSgYuPRXNUZ2-9xobx/view?usp=sharing',
        'https://drive.google.com/file/d/1CRuXRJdLsSHx_eyhNJkPqhBjP6m2jR7y/view?usp=sharing',
        'https://drive.google.com/file/d/15Jxb7hqRi1DBbMRPFq91dM3_CZbPKkTe/view?usp=sharing',
        'https://drive.google.com/file/d/1g3v05XrgMDojzYy9Nq9Rc5KkfoYxCJD-/view?usp=sharing'
      ],
      details: [
        'Concepto: "Velocidad y Precisión" basado en aerodinámica.',
        'Cromática: Negro Base, Azul Eléctrico y Blanco.',
        'Tipografía: Ethnocentric expandida para estabilidad institucional.',
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
            {/* Título dinámico basado en estado JS para máxima fidelidad móvil */}
            <InteractiveTitle text={isMobile ? "SEBAS" : "SEBASTIÁN"} />
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
            <h3 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase leading-none tracking-tighter">Hablemos de tu próximo proyecto</h3>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Consultas sin compromiso. Te respondo en el día para presupuestar una solución a tu medida.
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
          © 2026 VISUAL IMPACT — BRANDING & EDITORIAL STRATEGY
        </p>
        <div className="flex gap-10">
          <a 
            href={CONTACT_CONFIG.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
