"use client";

import { useState } from "react";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  NavbarLogo, 
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from "@/components/ui/resizable-navbar";
import HeaderSign from "./header";

export function NavbarWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
  ];

  return (
    <div className="sticky inset-x-0 top-0 h-16 z-50  ">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />        
          <div className="flex items-center space-x-2 md:space-x-4 ml-auto ">      
            <NavbarButton>
              <HeaderSign />
              </NavbarButton>
          </div>
        </NavBody>
        
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, i) => (
              <a 
                key={i}
                href={item.link}
                className="w-full px-4 py-2 text-lg font-medium text-black dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            
            <div className="flex flex-col gap-2 mt-4">
              <NavbarButton variant="primary" className="w-full">
                <HeaderSign />
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}