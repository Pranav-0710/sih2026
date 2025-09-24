import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Clock, IndianRupee, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_days: number;
  price: number;
  max_participants: number;
  includes: any;
  difficulty_level: string;
  is_active: boolean;
  rating: number;
  review_count: number;
  profiles: {
    full_name: string | null;
  } | null;
}

interface UserBooking {
  id: string;
  booking_date: string;
  participants: number;
  total_amount: number;
  status: string;
  travel_packages: {
    title: string;
    duration_days: number;
  };
}

const Bookings = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    participants: 1,
    phone: '',
    requests: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load travel packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          travel_packages (
            title,
            duration_days
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookPackage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book packages",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPackage || !bookingData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalAmount = selectedPackage.price * bookingData.participants;

      const { error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          package_id: selectedPackage.id,
          booking_date: bookingData.date,
          participants: bookingData.participants,
          total_amount: totalAmount,
          contact_phone: bookingData.phone,
          special_requests: bookingData.requests || null,
        }]);

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: "Your booking has been successfully created",
      });

      setSelectedPackage(null);
      setBookingData({ date: '', participants: 1, phone: '', requests: '' });
      fetchUserBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      heritage: 'bg-amber-100 text-amber-800 border-amber-300',
      nature: 'bg-green-100 text-green-800 border-green-300',
      culture: 'bg-purple-100 text-purple-800 border-purple-300',
      adventure: 'bg-red-100 text-red-800 border-red-300',
      pilgrimage: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Travel Packages */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Travel Packages</h1>
              <p className="text-muted-foreground">
                Discover curated experiences crafted by local experts
              </p>
            </div>

            <div className="grid gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{pkg.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(pkg.category)}>
                            {pkg.category}
                          </Badge>
                          <Badge variant="outline">{pkg.difficulty_level}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₹{pkg.price}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{pkg.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{pkg.duration_days} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Max {pkg.max_participants} people</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{pkg.rating}/5 ({pkg.review_count} reviews)</span>
                      </div>
                      {pkg.profiles && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>by {pkg.profiles.full_name}</span>
                        </div>
                      )}
                    </div>
                    
                    {Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Includes:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pkg.includes.slice(0, 3).map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="heritage" 
                          className="w-full"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {pkg.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date">Travel Date</Label>
                              <Input
                                id="date"
                                type="date"
                                value={bookingData.date}
                                onChange={(e) => setBookingData(prev => ({...prev, date: e.target.value}))}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div>
                              <Label htmlFor="participants">Participants</Label>
                              <Input
                                id="participants"
                                type="number"
                                min="1"
                                max={pkg.max_participants}
                                value={bookingData.participants}
                                onChange={(e) => setBookingData(prev => ({...prev, participants: parseInt(e.target.value) || 1}))}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Your phone number"
                              value={bookingData.phone}
                              onChange={(e) => setBookingData(prev => ({...prev, phone: e.target.value}))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="requests">Special Requests (Optional)</Label>
                            <Input
                              id="requests"
                              placeholder="Any special requirements..."
                              value={bookingData.requests}
                              onChange={(e) => setBookingData(prev => ({...prev, requests: e.target.value}))}
                            />
                          </div>
                          
                          <div className="bg-accent p-4 rounded-lg">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total Amount:</span>
                              <span>₹{pkg.price * bookingData.participants}</span>
                            </div>
                          </div>
                          
                          <Button onClick={handleBookPackage} className="w-full" variant="heritage">
                            Confirm Booking
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* User Bookings Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>Manage your travel plans</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">{booking.travel_packages.title}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              {booking.participants} participants
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-3 w-3" />
                              ₹{booking.total_amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No bookings yet. Book your first adventure!
                    </p>
                  )
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Sign in to view your bookings
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;