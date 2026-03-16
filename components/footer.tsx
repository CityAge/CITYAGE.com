export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] py-12 md:py-16 px-8 md:px-16 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <h4 className="text-white text-lg md:text-xl font-serif font-bold mb-3">
              thehumantouch.ai
            </h4>
            <p className="text-[#888888] text-sm leading-relaxed">
              Institutional intelligence operating system for the urban planet.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h5 className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase mb-4 font-semibold">
              Platform
            </h5>
            <ul className="space-y-2">
              {["Intelligence Hub", "Dispatches", "API Access", "Documentation"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#888888] text-sm hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase mb-4 font-semibold">
              Company
            </h5>
            <ul className="space-y-2">
              {["About", "Team", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#888888] text-sm hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase mb-4 font-semibold">
              Legal
            </h5>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Security", "Compliance"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#888888] text-sm hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#888888] tracking-wider">
            © 2026 THE HUMAN TOUCH AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-[#D4AF37]/60 tracking-wider uppercase">
              Geneva • Singapore • New York • London
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
