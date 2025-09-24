-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_type AS ENUM ('tourist', 'local_guide', 'agency', 'admin');
CREATE TYPE public.package_category AS ENUM ('culture', 'adventure', 'nature', 'pilgrimage', 'heritage');
CREATE TYPE public.badge_level AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    user_type user_type DEFAULT 'tourist',
    preferences JSONB DEFAULT '{}',
    location TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create heritage sites table
CREATE TABLE public.heritage_sites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category package_category,
    images JSONB DEFAULT '[]',
    audio_story_url TEXT,
    virtual_tour_url TEXT,
    historical_significance TEXT,
    best_time_to_visit TEXT,
    entry_fee DECIMAL(10, 2) DEFAULT 0,
    opening_hours JSONB DEFAULT '{}',
    languages JSONB DEFAULT '["english", "hindi"]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travel packages table
CREATE TABLE public.travel_packages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category package_category,
    duration_days INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_participants INTEGER DEFAULT 10,
    includes JSONB DEFAULT '[]',
    excludes JSONB DEFAULT '[]',
    itinerary JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    agency_id UUID REFERENCES public.profiles(user_id),
    heritage_sites JSONB DEFAULT '[]',
    difficulty_level TEXT DEFAULT 'easy',
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.travel_packages(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    participants INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'pending',
    payment_id TEXT,
    special_requests TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create heritage badges table
CREATE TABLE public.heritage_badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES public.heritage_sites(id) ON DELETE CASCADE,
    badge_level badge_level NOT NULL,
    quiz_score INTEGER NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, site_id, badge_level)
);

-- Create community posts table
CREATE TABLE public.community_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    tags JSONB DEFAULT '[]',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.travel_packages(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.heritage_sites(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    images JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for heritage sites (public read)
CREATE POLICY "Anyone can view heritage sites" ON public.heritage_sites FOR SELECT USING (true);
CREATE POLICY "Only admins can modify heritage sites" ON public.heritage_sites FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'admin')
);

-- Create RLS policies for travel packages
CREATE POLICY "Anyone can view active packages" ON public.travel_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Agencies can manage their packages" ON public.travel_packages FOR ALL USING (agency_id = auth.uid());

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for heritage badges
CREATE POLICY "Users can view all badges" ON public.heritage_badges FOR SELECT USING (true);
CREATE POLICY "Users can earn their own badges" ON public.heritage_badges FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for community posts
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_heritage_sites_updated_at BEFORE UPDATE ON public.heritage_sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_travel_packages_updated_at BEFORE UPDATE ON public.travel_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample heritage sites data
INSERT INTO public.heritage_sites (name, description, location, category, latitude, longitude, historical_significance, best_time_to_visit, entry_fee) VALUES
('Jagannath Temple Ranchi', 'A replica of the famous Jagannath Temple of Puri, this temple is a major pilgrimage site in Jharkhand.', 'Ranchi', 'heritage', 23.3441, 85.3096, 'Built in 1991, this temple is an architectural marvel and spiritual center for devotees.', 'October to March', 0),
('Hundru Falls', 'One of the highest waterfalls in Jharkhand, cascading from a height of 98 meters.', 'Ranchi', 'nature', 23.4238, 85.4358, 'A natural wonder formed by the Subarnarekha River, popular among nature lovers and photographers.', 'July to February', 20),
('Betla National Park', 'Home to tigers, elephants, and diverse wildlife in the Chota Nagpur Plateau.', 'Latehar', 'nature', 23.9000, 84.1833, 'Established in 1986, this park is crucial for wildlife conservation in Eastern India.', 'November to April', 150),
('Rajrappa Temple', 'Ancient temple dedicated to Goddess Chinnamasta, situated at the confluence of rivers.', 'Ramgarh', 'heritage', 23.6288, 85.5192, 'Dating back to ancient times, this temple holds great religious significance in tantric traditions.', 'October to March', 0),
('Dassam Falls', 'Spectacular waterfall formed by the Kanchi River, popular for picnics and photography.', 'Ranchi', 'nature', 23.5325, 85.4419, 'A breathtaking cascade that attracts thousands of visitors annually, especially during monsoons.', 'July to February', 10);