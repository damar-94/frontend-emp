import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#E8F0E8] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center bg-[#FFFCF5] p-8 rounded-2xl border border-[#D9E4D9] shadow-sm">
        <p className="text-sm font-semibold text-[#718577] uppercase tracking-widest mb-2">
          404 Error
        </p>
        <h1 className="text-2xl font-bold text-[#35463B] tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#69766D] leading-relaxed mb-6">
          The link you followed may be broken or the page may have been removed.
        </p>
        <Button className="bg-[#8EAD9B] hover:bg-[#52665A] text-white rounded-full transition-colors duration-200">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
