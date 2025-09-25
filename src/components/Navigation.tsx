import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, LogOut, CaseSensitive, Menu, ChevronDown } from "lucide-react";
import { useFontSize } from "./FontSizeProvider";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Trip Genie", path: "/trip-genie" },
  { name: "Journey Hub", path: "/bookings" },
  {
    name: "Explore",
    isDropdown: true,
    dropdownItems: [
      { name: "Heritage Trails", path: "/heritage" },
      { name: "Virtual 360", path: "/vr-experience" },
      { name: "FunScapes", path: "/funscapes" },
      { name: "Gen-Z Corner", path: "/genzcorner" },
      { name: "RouteX", path: "/transport" },
    ],
  },
  { name: "Community", path: "/community" },
];

const NavLinkItem = ({ to, children, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "relative group font-medium transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-foreground/70",
        className
      )
    }
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
  </NavLink>
);

export function Navigation() {
  const isMobile = useIsMobile();
  const { user, signOut, role } = useAuth();
  const { toggleLargeFont, isLargeFont } = useFontSize();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileNavItems = navItems.flatMap(item =>
    item.isDropdown ? item.dropdownItems : item
  ).filter(item => !item.adminOnly || (item.adminOnly && role === 'admin'));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-white/10 shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <div className="bg-gradient-to-br from-nature to-primary p-2.5 rounded-xl shadow-soft">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="font-semibold text-lg">Jharkhand Tour</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto text-foreground/80">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background/90 backdrop-blur-xl">
              {/* Mobile Menu Content - styling can be enhanced here */}
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <div className="flex-1 flex justify-center">
              <nav className="flex items-center space-x-8 text-sm">
                <NavLinkItem to="/">Home</NavLinkItem>
                {navItems.map((item) => {
                  if (item.adminOnly && role !== 'admin') return null;
                  return item.isDropdown ? (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative group font-medium text-foreground/70 transition-colors hover:text-foreground">
                          {item.name}
                          <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/50 backdrop-blur-lg border-none shadow-xl rounded-xl">
                        {item.dropdownItems.map((dropdownItem) => (
                          <DropdownMenuItem key={dropdownItem.name} asChild className="p-0">
                            <Link to={dropdownItem.path} className="font-medium px-3 py-2 transition-colors hover:bg-black/5">
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <NavLinkItem key={item.name} to={item.path}>{item.name}</NavLinkItem>
                  );
                })}
                {role === 'admin' && <NavLinkItem to="/dashboard">Dashboard</NavLinkItem>}
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="font-medium text-foreground/70">
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/50 backdrop-blur-lg border-none shadow-xl rounded-xl">
                    <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-nature text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-px"
                >
                  Get Started
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Navigation;
