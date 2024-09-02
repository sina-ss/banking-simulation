"use client";

import NavigateButton from "./NavigateButton";
import { ModeToggle } from "./ui/ModeToggle";

const Navbar = () => {
  return (
    <nav className="flex justify-between container mt-4">
      <NavigateButton />
      <ModeToggle />
    </nav>
  );
};

export default Navbar;
