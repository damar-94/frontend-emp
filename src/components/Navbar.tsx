import {
  LayoutGrid,
  Menu,
  Search,
  UserCircle2,
  LogOut,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/stores/useAuth";

interface CategoryItem {
  id: number;
  name: string;
}

interface NavbarProps {
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({ onSearch, onSelectCategory }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Categories from Database
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Auth State
  const { user, logout } = useAuth() as {
    user: any;
    logout?: () => void;
  };

  const isLoggedIn = Boolean(user && (user.accessToken || user.id));

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "CUSTOMER"
        ? "/customer-dashboard"
        : user?.role === "EVENTORGANIZER"
          ? "/event-organizer-dashboard"
          : "/login";

  // Search Suggestions State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch Categories from Database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
        setCategories(list);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when debounced search changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }

    if (debouncedSearch.trim()) {
      const fetchSuggestions = async () => {
        setIsSearching(true);
        try {
          const res = await axiosInstance.get("/events", {
            params: { search: debouncedSearch },
          });
          setSuggestions(res.data.data.slice(0, 5));
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleAuthAction = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      if (logout) {
        logout();
      }
    }
  };

  // Reusable Suggestions Dropdown Component
  const SuggestionDropdown = () => {
    if (!showSuggestions || !searchTerm) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
        {isSearching ? (
          <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading suggestions...
          </div>
        ) : suggestions.length > 0 ? (
          <ul>
            {suggestions.map((event) => (
              <li key={event.id}>
                <a
                  href={`/events/${event.id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition"
                >
                  {event.thumbnail ? (
                    <img
                      src={event.thumbnail}
                      alt={event.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {event.location}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : debouncedSearch ? (
          <div className="px-4 py-3 text-sm text-slate-500">
            No events found for "{debouncedSearch}"
          </div>
        ) : null}
      </div>
    );
  };

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
              <span>Categories</span>
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400">
                    Explore Categories
                  </div>

                  <a
                    href="/events"
                    onClick={() => {
                      onSelectCategory?.("All Categories");
                      setIsCategoryOpen(false);
                    }}
                    className="block w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#f4917b] transition"
                  >
                    All Categories
                  </a>

                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/events?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => {
                        onSelectCategory?.(cat.name);
                        setIsCategoryOpen(false);
                      }}
                      className="block w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#f4917b] transition"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div
          ref={searchContainerRef}
          className="flex-1 max-w-2xl hidden sm:block relative"
        >
          <div className="relative flex items-center bg-slate-100/90 rounded-xl px-4 py-2.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 border border-[#f4917b]">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search concerts, workshops, webinars..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none pr-8"
            />
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="text-slate-400 hover:text-slate-600 p-0.5 mr-2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <Search className="w-5 h-5 text-slate-500 shrink-0 cursor-pointer hover:text-[#f4917b] transition" />
          </div>
          <SuggestionDropdown />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Dashboard Button */}
          {isLoggedIn && (
            <a
              href={dashboardPath}
              className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-blue-900 font-semibold text-xs sm:text-sm transition"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
          )}

          {/* Login / Logout Button */}
          <a
            href={isLoggedIn ? "#" : "/login"}
            onClick={handleAuthAction}
            className="flex items-center gap-2 bg-[#f4917b] hover:bg-[#ffc7b9] text-[#222432] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition active:scale-95 cursor-pointer"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <UserCircle2 className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <div ref={mobileSearchContainerRef} className="relative">
          <div className="relative flex items-center bg-slate-100 rounded-xl px-3.5 py-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search concerts, festivals..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none pr-6"
            />
            {searchTerm ? (
              <button onClick={clearSearch} className="mr-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <SuggestionDropdown />
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <a
            href={isLoggedIn ? "#" : "/login"}
            onClick={(e) => {
              handleAuthAction(e);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700 hover:text-[#f4917b]"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <UserCircle2 className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </a>

          {/* Dashboard Button Mobile */}
          {isLoggedIn && (
            <a
              href={dashboardPath}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700 hover:text-[#f4917b]"
            >
              <LayoutGrid className="w-4 h-4" />
              Dashboard
            </a>
          )}

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Select Category
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/events"
                onClick={() => {
                  onSelectCategory?.("All Categories");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs text-slate-600 hover:text-[#f4917b] py-1"
              >
                All Categories
              </a>
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`/events?category=${encodeURIComponent(c.name)}`}
                  onClick={() => {
                    onSelectCategory?.(c.name);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left text-xs text-slate-600 hover:text-[#f4917b] py-1"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}