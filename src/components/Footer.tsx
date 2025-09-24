import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-heritage p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-heritage-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Smart Tourism</h3>
                <p className="text-sm text-primary-foreground/80">Jharkhand</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Discover the untamed beauty and rich cultural heritage of Jharkhand 
              with our AI-powered smart tourism platform.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#heritage" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Heritage Sites</a></li>
              <li><a href="#trips" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Trip Genie</a></li>
              <li><a href="#community" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Community</a></li>
              <li><a href="#badges" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Heritage Badges</a></li>
              <li><a href="#guides" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Local Guides</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#packages" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Travel Packages</a></li>
              <li><a href="#emergency" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Emergency Assist</a></li>
              <li><a href="#weather" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Weather Updates</a></li>
              <li><a href="#booking" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Easy Booking</a></li>
              <li><a href="#support" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">24/7 Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-heritage" />
                <span className="text-primary-foreground/80">hello@jharkhlandtourism.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-heritage" />
                <span className="text-primary-foreground/80">+91 9876543210</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-heritage mt-1" />
                <span className="text-primary-foreground/80">
                  Tourism Department<br />
                  Government of Jharkhand<br />
                  Ranchi, Jharkhand
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Smart Tourism Jharkhand. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;