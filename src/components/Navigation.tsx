import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, LogOut, CaseSensitive, Menu, ChevronDown, Globe } from "lucide-react";
import { useFontSize } from "./FontSizeProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const NavLinkItem = ({ to, children, className = "" }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "relative group font-medium transition-all duration-300 hover:text-foreground px-1 py-1",
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
  const { t } = useTranslation();
  const navItems = [
    { name: t("nav.tripGenie"), path: "/trip-genie" },
    {
      name: t("nav.explore"),
      isDropdown: true,
      dropdownItems: [
        { name: t("nav.allMonasteries"), path: "/explore" },
        { name: t("nav.heritageTrails"), path: "/heritage" },
        { name: t("nav.virtual360"), path: "/vr-experience" },
        { name: t("nav.routeX"), path: "/transport" },
      ],
    },
    { name: t("nav.community"), path: "/community" },
  ];
  const isMobile = useIsMobile();
  const { user, signOut, role, loading } = useAuth();
  const { toggleLargeFont, isLargeFont } = useFontSize();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 50
  );
  const [hovering, setHovering] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Sync once on mount: browsers restore the previous scroll position on
    // refresh without firing a scroll event, which otherwise left the bar
    // stuck in its top-of-page style on top of already-scrolled content.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The homepage hero renders full-bleed media behind the nav — let it show
  // through until the user scrolls past the hero or hovers the bar itself.
  const isHeroPage = location.pathname === "/";
  const transparent = isHeroPage && !scrolled && !hovering;

  const mobileNavItems = navItems.reduce((acc, item) => {
    if (item.isDropdown && item.dropdownItems) {
      return [...acc, ...item.dropdownItems];
    } else if (!item.isDropdown && item.path) {
      return [...acc, { name: item.name, path: item.path }];
    }
    return acc;
  }, [] as { name: string; path: string }[]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguageDropdown(false);
  };

  return (
    <header
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out",
        scrolled ? "w-[95%] max-w-6xl" : "w-[98%] max-w-7xl"
      )}
    >
      <div
        className={cn(
          "flex items-center px-6 py-3 rounded-2xl transition-all duration-500 ease-out floating-navbar",
          transparent
            ? "nav-transparent bg-transparent border border-transparent shadow-none h-[4.5rem]"
            : scrolled
            ? "bg-background/95 backdrop-blur-xl border border-border/50 shadow-strong h-16"
            : // Kept near-opaque: on the homepage this state sits over dark
              // hero footage, and a translucent bar left the dark nav text
              // and gradient wordmark unreadable against it.
              "bg-background/95 backdrop-blur-xl border border-border/30 shadow-soft h-[4.5rem]"
        )}
      >
        <Link to="/" className="flex items-center space-x-3">
          <div
            className={cn(
              "bg-gradient-to-br from-nature to-primary rounded-xl shadow-soft transition-all duration-300",
              scrolled ? "p-2" : "p-2.5"
            )}
          >
            <MapPin
              className={cn(
                "text-white transition-all duration-300",
                scrolled ? "h-5 w-5" : "h-6 w-6"
              )}
            />
          </div>
          <span
            className={cn(
              "font-bold transition-all duration-300",
              scrolled ? "text-lg" : "text-xl",
              transparent
                ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
                : "bg-gradient-to-r from-primary to-nature bg-clip-text text-transparent"
            )}
          >
            Monastery360
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-2 ml-auto">
            <DropdownMenu open={showLanguageDropdown} onOpenChange={setShowLanguageDropdown}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-xl transition-all duration-300"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Translate</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-strong rounded-xl p-1">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('hi')}>Hindi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-xl transition-all duration-300"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="pr-0 bg-background/95 backdrop-blur-xl border-r border-border/50 rounded-r-2xl"
              >
                <div className="flex flex-col space-y-4 py-4">
                  {/* Radix requires a title inside every dialog/sheet for
                      screen readers; the drawer is visually self-evident, so
                      it's exposed to assistive tech only. */}
                  <SheetTitle className="sr-only">Site navigation</SheetTitle>
                  <Link to="/" className="flex items-center space-x-3 px-4">
                    <div className="bg-gradient-to-br from-nature to-primary p-2 rounded-xl shadow-soft">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-nature bg-clip-text text-transparent">
                      Monastery360
                    </span>
                  </Link>
                  <div className="flex flex-col space-y-2 px-4">
                    <Link
                      to="/"
                      className="py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                    >
                      Home
                    </Link>
                    {mobileNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                      >
                        {item.name}
                      </Link>
                    ))}
                    {role === "admin" && (
                      <>
                        <Link
                          to="/dashboard"
                          className="py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/sentiment-analysis"
                          className="py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                        >
                          Feedback Analysis
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="px-4 pt-4 border-t border-border/50">
                    {loading ? (
                      <div className="py-2 px-3 rounded-lg font-medium text-foreground/70">Loading...</div>
                    ) : user ? (
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          className="block py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                        >
                          Profile
                        </Link>
                        <Button
                          onClick={signOut}
                          variant="ghost"
                          className="w-full justify-start py-2 px-3 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-destructive/10"
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate("/auth")}
                        className="w-full font-semibold py-2 px-4 rounded-xl bg-gradient-to-r from-primary to-nature text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Get Started
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <div className="flex-1 flex justify-center">
              <nav
                className={cn(
                  "flex items-center space-x-6 text-sm transition-all duration-300",
                  scrolled ? "space-x-4" : "space-x-6"
                )}
              >
                <NavLinkItem to="/">Home</NavLinkItem>
                {navItems.map((item) => {
                  return item.isDropdown ? (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative group font-medium text-foreground/70 transition-all duration-300 hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2"
                        >
                          {item.name}
                          <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-strong rounded-xl p-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <DropdownMenuItem
                            key={dropdownItem.name}
                            asChild
                            className="p-0"
                          >
                            <Link
                              to={dropdownItem.path}
                              className="font-medium px-3 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 text-foreground/70 hover:text-foreground w-full"
                            >
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <NavLinkItem key={item.name} to={item.path || "#"}>
                      {item.name}
                    </NavLinkItem>
                  );
                })}
                {role === "admin" && (
                  <>
                    <NavLinkItem to="/dashboard">Dashboard</NavLinkItem>
                    <NavLinkItem to="/sentiment-analysis">
                      Feedback Analysis
                    </NavLinkItem>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu open={showLanguageDropdown} onOpenChange={setShowLanguageDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-xl transition-all duration-300"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Translate</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-strong rounded-xl p-1">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('hi')}>Hindi</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div id="google_translate_element" className="mr-3"></div>
              <ModeToggle />
              {loading ? (
                <div className="h-9 w-28 animate-pulse rounded-xl bg-foreground/10" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2 transition-all duration-300"
                    >
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-strong rounded-xl p-1"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="font-medium px-3 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 text-foreground/70 hover:text-foreground w-full"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={signOut}
                      className="font-medium px-3 py-2 rounded-lg transition-all duration-300 hover:bg-destructive/10 text-foreground/70 hover:text-destructive cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className={cn(
                    "font-semibold rounded-xl bg-gradient-to-r from-primary to-nature text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5",
                    scrolled ? "px-4 py-2 text-sm" : "px-6 py-2 text-sm"
                  )}
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
