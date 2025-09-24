import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const bookingData = [
  { month: 'January', bookings: 65, revenue: 12000 },
  { month: 'February', bookings: 59, revenue: 11000 },
  { month: 'March', bookings: 80, revenue: 15000 },
  { month: 'April', bookings: 81, revenue: 16000 },
  { month: 'May', bookings: 56, revenue: 10000 },
  { month: 'June', bookings: 55, revenue: 10500 },
  { month: 'July', bookings: 40, revenue: 8000 },
];

const bookingSourceData = [
  { name: 'Direct', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social Media', value: 200 },
  { name: 'Advertisement', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentBookings = [
  { id: 1, customer: 'John Doe', date: '2025-09-12', amount: 250, status: 'Confirmed' },
  { id: 2, customer: 'Jane Smith', date: '2025-09-11', amount: 350, status: 'Pending' },
  { id: 3, customer: 'Sam Wilson', date: '2025-09-10', amount: 150, status: 'Confirmed' },
  { id: 4, customer: 'Alice Johnson', date: '2025-09-09', amount: 450, status: 'Cancelled' },
  { id: 5, customer: 'Bob Brown', date: '2025-09-08', amount: 550, status: 'Confirmed' },
];

const communityPosts = [
  { id: 1, content: "I had an amazing time exploring the waterfalls. Highly recommended!" },
  { id: 2, content: "The hotels were a bit overpriced, and the service was not great." },
  { id: 3, content: "The local food was delicious, and the people were very friendly." },
  { id: 4, content: "The roads to some of the tourist spots are in terrible condition." },
  { id: 5, content: "A decent experience, but there is room for improvement in terms of cleanliness." },
];

const CONVERSION_RATE = 83;

const Dashboard = () => {
  const [showPromotionAlert, setShowPromotionAlert] = useState(false);

  const totalBookings = bookingData.reduce((acc, item) => acc + item.bookings, 0);
  const totalRevenue = bookingData.reduce((acc, item) => acc + item.revenue, 0) * CONVERSION_RATE;
  const averageBookings = Math.round(totalBookings / bookingData.length);
  const averageBookingValue = Math.round(totalRevenue / totalBookings);

  const getFeedback = () => {
    const latestMonth = bookingData[bookingData.length - 1];
    if (latestMonth.bookings > averageBookings) {
      return "Booking numbers are strong! Keep up the great work.";
    } else if (latestMonth.bookings < averageBookings) {
      return "Bookings are a bit low. Consider running a promotion to attract more visitors.";
    }
    return "Bookings are stable. Look for opportunities to grow.";
  };

  const getPromotionAdvice = () => {
    const latestMonth = bookingData[bookingData.length - 1];
    if (latestMonth.bookings < averageBookings) {
      return {
        recommendation: "Yes",
        suggestions: [
          "Offer a 10% discount on all bookings for the next month.",
          "Create a social media campaign to promote the new offer.",
          "Partner with local influencers to reach a wider audience.",
        ],
      };
    } else {
      return {
        recommendation: "No",
        suggestions: [
          "Focus on improving the customer experience.",
          "Gather feedback from recent customers to identify areas for improvement.",
          "Invest in new content for your website to attract more organic traffic.",
        ],
      };
    }
  };

  const promotionAdvice = getPromotionAdvice();

  const getSentiment = (text) => {
    const positiveKeywords = ["amazing", "highly recommended", "delicious", "friendly", "great"];
    const negativeKeywords = ["overpriced", "not great", "terrible", "bad"];

    let sentiment = "Neutral";
    if (positiveKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
      sentiment = "Positive";
    } else if (negativeKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
      sentiment = "Negative";
    }
    return sentiment;
  };

  const communitySentiment = communityPosts.reduce((acc, post) => {
    const sentiment = getSentiment(post.content);
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const sentimentData = Object.keys(communitySentiment).map(key => ({ name: key, value: communitySentiment[key] }));

  const getCommunitySuggestions = () => {
    const negativeFeedback = communitySentiment["Negative"] || 0;
    if (negativeFeedback > 1) {
      return [
        "Address the common issues raised by the community.",
        "Engage with users who have left negative feedback to understand their concerns.",
        "Offer a token of apology to users who have had a bad experience.",
      ];
    } else {
      return [
        "Highlight the positive feedback on your social media channels.",
        "Engage with users who have left positive feedback to thank them.",
        "Identify the most active and positive community members and reward them.",
      ];
    }
  };

  return (
    <>
    <Navigation />
    <div className="container mx-auto p-4">
      
      <h1 className="text-3xl font-bold mb-4">Bookings Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹{averageBookingValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getFeedback()}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Booking Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promotion Advisor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Should you run a promotion? Get an instant recommendation.</p>
            <AlertDialog open={showPromotionAlert} onOpenChange={setShowPromotionAlert}>
              <AlertDialogTrigger asChild>
                <Button>Get Advice</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Promotion Recommendation: {promotionAdvice.recommendation}</AlertDialogTitle>
                  <AlertDialogDescription>
                    <ul className="list-disc list-inside mt-4">
                      {promotionAdvice.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Booking Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingData.map(d => ({...d, revenue: d.revenue * CONVERSION_RATE}))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>₹{(booking.amount * CONVERSION_RATE).toLocaleString()}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Community Feedback Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2">Sentiment Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-bold mb-2">Recent Comments</h3>
                <ul className="space-y-2">
                  {communityPosts.map(post => (
                    <li key={post.id} className="flex items-start">
                      <Badge variant={getSentiment(post.content) === 'Positive' ? 'default' : getSentiment(post.content) === 'Negative' ? 'destructive' : 'secondary'}>{getSentiment(post.content)}</Badge>
                      <p className="ml-2 text-sm">{post.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Community Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {getCommunitySuggestions().map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
