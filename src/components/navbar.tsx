import { Link } from "@heroui/link";
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent } from "@heroui/navbar";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="bg-gray-800  top-0 z-50 mb-1 ">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" color="foreground" href="/">
            <p className="font-bold text-white">Hunter Bot</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end"></NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end"></NavbarContent>
    </HeroUINavbar>
  );
};
