/**
 * Navigation komponent til hovedmenuen
 * 
 * Viser logo og navigationsmenu med links til forskellige sider
 * Håndterer navigation mellem sider via props
 * Responsivt design der tilpasser sig mobile enheder
 */

import Image from 'next/image'

// Props interface til navigation
interface NavigationProps {
  currentPage: string; // Nuværende aktive side
  setCurrentPage: (page: string) => void; // Funktion til at skifte side
}

const Navigation = ({ currentPage, setCurrentPage }: NavigationProps) => {
  return (
    // Hovednavigation med sticky position og z-index
    <nav className="bg-[#EFF8FD] sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Flex container til logo og menu */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 space-y-4 md:space-y-0">
          {/* Logo knap der navigerer til forsiden */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="focus:outline-none"
          >
            <Image
              src="/logo.webp"
              alt="Børnetelefonen Logo" 
              width={300}
              height={80}
              className="h-auto"
              priority
            />
          </button>
          {/* Navigation menu med links */}
          <div className="flex gap-4">
            {/* Om os link */}
            <button 
              onClick={() => setCurrentPage('about')}
              className={`text-teal-600 hover:text-teal-700 transition-colors
                ${currentPage === 'about' ? 'font-bold' : ''}`}
            >
              Om os
            </button>
            {/* Få hjælp link */}
            <button 
              onClick={() => setCurrentPage('help')}
              className={`text-teal-600 hover:text-teal-700 transition-colors
                ${currentPage === 'help' ? 'font-bold' : ''}`}
            >
              Få hjælp
            </button>
            {/* Kontakt link */}
            <button 
              onClick={() => setCurrentPage('contact')}
              className={`text-teal-600 hover:text-teal-700 transition-colors
                ${currentPage === 'contact' ? 'font-bold' : ''}`}
            >
              Kontakt
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;