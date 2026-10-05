import {
  LayoutGrid,
  Menu,
  Search,
  Sparkles,
  UserCircle2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({ onSearch, onSelectCategory }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const categories = [
    "Semua Event",
    "Konser Musik",
    "Pertunjukan & Seni",
    "Seminar & Konferensi",
    "Workshop & Pelatihan",
    "Olahraga",
    "Festival & Hiburan",
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbf7f4] border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 shrink-0">
          <a href="/" className="flex items-center gap-1 group">
            <span className="font-black text-2xl tracking-tighter text-[#222432]">
              EventTix
            </span>
            
          </a>

          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-900 font-semibold text-sm px-2 py-1.5 rounded-lg transition"
            >
              <LayoutGrid className="w-4 h-4 text-blue-900 stroke-[2.5]" />
              <span>Kategori</span>
            </button>

            {isCategoryOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsCategoryOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400">
                    Jelajah Kategori
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory?.(cat);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-2xl hidden sm:block">
          <div className="relative flex items-center bg-slate-100/90 rounded-xl px-4 py-2.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 border border-transparent">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari event konser musik, workshop, webinar..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none pr-8"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600 p-0.5 mr-2"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <Search className="w-5 h-5 text-slate-500 shrink-0 cursor-pointer hover:text-blue-600 transition" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          <a
            href="/partnership"
            className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-blue-900 font-semibold text-xs sm:text-sm transition"
          >
            <span>Kerjasama dengan Kami</span>
          </a>

    

          <button className="flex items-center gap-2 bg-[#f4917b] hover:bg-[#ffc7b9] text-[#222432] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition active:scale-95">
            <UserCircle2 className="w-4 h-4" />
            <span>Akun</span>
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Menu navigasi ponsel"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <div className="relative flex items-center bg-slate-100 rounded-xl px-3.5 py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari event konser, festival..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none pr-6"
          />
          {searchTerm ? (
            <button onClick={() => setSearchTerm("")} className="mr-1 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <Search className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <a
            href="/partnership"
            className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700"
          >
            <Sparkles className="w-4 h-4 text-blue-900" />
            Kerjasama dengan Kami
          </a>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 mb-2">Pilih Kategori</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onSelectCategory?.(c);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-xs text-slate-600 hover:text-blue-600 py-1"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}