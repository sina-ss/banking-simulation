"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const NavigateButton = () => {
  const pathname = usePathname();

  return (
    <Link href={pathname === "/" ? "/loans" : "/"}>
      <Button className="rounded-3xl">
        {pathname === "/" ? "لیست تسهیلات" : "دریافت تسهیلات"}
      </Button>
    </Link>
  );
};

export default NavigateButton;
