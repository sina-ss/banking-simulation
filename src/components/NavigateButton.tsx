"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { TEXT } from "@/constants/textConstants";

const NavigateButton = () => {
  const pathname = usePathname();

  return (
    <Link href={pathname === "/" ? "/loans" : "/"}>
      <Button className="rounded-3xl">
        {pathname === "/" ?  TEXT.COMMON.LOANS_TITLE : TEXT.COMMON.HOME_TITLE}
      </Button>
    </Link>
  );
};

export default NavigateButton;
