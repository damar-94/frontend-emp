import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AccNavbar } from "./AccNavbar";

function Navbar() {
  return (
    <div>
      <div className="bg-red-400 flex items-center justify-between">
        <div className="bg-blue-500 items-center px-2 flex">
          <img src="/icons8-ticket-100.png" alt=""
          className="h-[80px]" />
          <p>Loket</p>
        </div>

        <Field orientation="horizontal" className=" max-w-2xl px-1">
          <Input type="search" placeholder="Search..." />
          <Button>Search</Button>
        </Field>
        <Button>Kerjasama dengan Kami</Button>
        <AccNavbar />
      </div>
    </div>
  );
}
export default Navbar;
