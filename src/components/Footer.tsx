import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-700 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                EventTix
              </span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Beli tiket konser, festival, sport event, dan event seru lainnya
              dengan mudah di EventTix.
              <br />
              <strong className="text-slate-900 font-semibold">
                #PASTIBISA beli tiket event &amp; wahana idaman!
              </strong>
            </p>

            
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Tentang EventTix
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#about"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Produk
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#loket-x"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Tix X
                  </a>
                </li>
                <li>
                  <a
                    href="#loket-screen"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Tix Screen
                  </a>
                </li>
                <li>
                  <a
                    href="#loket-plus"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Tix Plus
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Event Creator
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#pricing"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Biaya
                  </a>
                </li>
                <li>
                  <a
                    href="#partnership"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Kerjasama dengan Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#guide"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Buku Panduan Creator
                  </a>
                </li>
                <li>
                  <a
                    href="#craftor"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    EventTix Craftor
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Dukungan
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#help"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Syarat dan Ketentuan
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#compliance"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Kepatuhan Keamanan & Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    Kebijakan Cookies
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
          <p>© 2026 EventTix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}