import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "Heritage Trails", path: "/heritage" },
    { name: "Kora", path: "/trip-genie" },
    { name: "Community", path: "/community" },
    { name: "Cultural Calendar", path: "/calendar" },
    { name: "Digital Archive", path: "/archive" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ];

  const socialIcons = [
    { icon: Facebook, path: "#" },
    { icon: Twitter, path: "#" },
    { icon: Instagram, path: "#" },
    { icon: Youtube, path: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-nature to-primary p-2.5 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-lg">Monastery360</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Discover and help preserve Sikkim's centuries-old monasteries with our AI-powered digital heritage platform.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 tracking-wide">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for the latest travel inspiration and deals.</p>
            <div className="flex">
              <Input type="email" placeholder="Your Email" className="bg-gray-800 border-gray-700 rounded-r-none" />
              <Button className="bg-primary rounded-l-none">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 tracking-wide">Follow Us</h4>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <Link key={index} to={social.path} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition-colors">
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Monastery360. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            {legalLinks.map(link => (
              <Link key={link.name} to={link.path} className="text-gray-500 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
