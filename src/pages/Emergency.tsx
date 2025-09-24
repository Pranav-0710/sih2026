import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Hospital, 
  Car, 
  HeadphonesIcon,
  Navigation as NavigationIcon,
  Copy
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Emergency = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const emergencyContacts = [
    {
      category: 'Police',
      number: '100',
      icon: Shield,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'For crime, theft, or security issues'
    },
    {
      category: 'Medical Emergency',
      number: '108',
      icon: Hospital,
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Ambulance and medical assistance'
    },
    {
      category: 'Fire Emergency',
      number: '101',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Fire department and rescue services'
    },
    {
      category: 'Tourist Helpline',
      number: '1363',
      icon: HeadphonesIcon,
      color: 'bg-green-100 text-green-800 border-green-300',
      description: '24/7 tourist assistance and information'
    },
    {
      category: 'Jharkhand Tourism',
      number: '0651-2446066',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'State tourism department'
    },
    {
      category: 'Roadside Assistance',
      number: '1073',
      icon: Car,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Vehicle breakdown and road assistance'
    }
  ];

  const importantLocations = [
    {
      name: 'RIMS Hospital, Ranchi',
      address: 'Bariatu Road, Ranchi',
      phone: '0651-2577515',
      type: 'Hospital',
      coordinates: '23.3307°N 85.3105°E'
    },
    {
      name: 'Ranchi Railway Station',
      address: 'Station Road, Ranchi',
      phone: '139',
      type: 'Railway',
      coordinates: '23.3583°N 85.3247°E'
    },
    {
      name: 'Birsa Munda Airport',
      address: 'Hinoo, Ranchi',
      phone: '0651-2582525',
      type: 'Airport',
      coordinates: '23.3145°N 85.3217°E'
    },
    {
      name: 'Police Control Room',
      address: 'Main Road, Ranchi',
      phone: '0651-2482100',
      type: 'Police',
      coordinates: '23.3441°N 85.3096°E'
    }
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        setIsGettingLocation(false);
        
        // Copy location to clipboard
        const locationText = `${location.lat}, ${location.lng}`;
        navigator.clipboard.writeText(locationText);
        
        toast({
          title: "Location captured",
          description: "Your coordinates have been copied to clipboard",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enable location services.",
          variant: "destructive",
        });
      }
    );
  };

  const makeCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const shareLocation = () => {
    if (currentLocation) {
      const locationText = `Emergency Location: ${currentLocation.lat}, ${currentLocation.lng}`;
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: locationText,
        });
      } else {
        copyToClipboard(locationText, 'Location');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Emergency Assistance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get immediate help when you need it most. Save these contacts and use location sharing for emergencies.
          </p>
        </div>

        {/* SOS Section */}
        <Card className="mb-8 border-red-200 bg-red-50/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-800 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Emergency SOS
            </CardTitle>
            <CardDescription className="text-red-700">
              In case of immediate emergency, call 112 (National Emergency Number)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => makeCall('112')}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call 112 - Emergency
              </Button>
              
              <Button
                onClick={getCurrentLocation}
                size="lg"
                variant="outline"
                disabled={isGettingLocation}
                className="border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <NavigationIcon className="h-5 w-5" />
                {isGettingLocation ? 'Getting Location...' : 'Share Location'}
              </Button>
            </div>
            
            {currentLocation && (
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-red-800">Your Current Location:</h4>
                    <p className="text-sm text-red-700 font-mono">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                  <Button
                    onClick={shareLocation}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Contacts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Emergency Contacts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <Card key={contact.category} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${contact.color}`}>
                          <contact.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contact.category}</CardTitle>
                          <Badge variant="outline" className="text-lg font-mono font-bold">
                            {contact.number}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => makeCall(contact.number)}
                        size="sm"
                        className="flex-1"
                        variant="heritage"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(contact.number, 'Number')}
                        size="sm"
                        variant="outline"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Locations */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Important Locations</h2>
            <div className="space-y-4">
              {importantLocations.map((location, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{location.name}</CardTitle>
                    <Badge variant="secondary">{location.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-1 text-primary" />
                        <span className="text-muted-foreground">{location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-primary" />
                        <span className="font-mono">{location.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => makeCall(location.phone)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Call
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(location.coordinates, 'Coordinates')}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Copy Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Safety Tips for Travelers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Before Traveling</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Share your itinerary with family/friends</li>
                  <li>• Keep emergency contacts handy</li>
                  <li>• Check weather conditions</li>
                  <li>• Carry sufficient cash</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">During Emergency</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Stay calm and assess the situation</li>
                  <li>• Call appropriate emergency number</li>
                  <li>• Share your exact location</li>
                  <li>• Follow local authority instructions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Medical Emergency</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Call 108 immediately</li>
                  <li>• Provide clear medical details</li>
                  <li>• Keep medical documents ready</li>
                  <li>• Note nearest hospital location</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;