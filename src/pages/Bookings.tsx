import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import Navigation from "@/components/Navigation";
// --- TYPE DEFINITIONS ---
interface Package {
  id: number;
  title: string;
  provider: "Goibibo" | "MakeMyTrip" | "Yatra" | "Cleartrip";
  price: number;
  description: string;
  image: string;
  bookingLink: string;
}

// --- MOCK DATA ---
const travelPackages: Package[] = [
  {
    id: 1,
    title: "Ranchi Heritage Tour – 3 Days",
    provider: "Goibibo",
    price: 15000,
    description: "Explore the rich history of Ranchi with guided tours to its most iconic heritage sites.",
    image: "/images/spots/jagannath.jpg",
    bookingLink: "https://www.goibibo.com/hotels/hotels-in-ranchi-ct/",
  },
  {
    id: 2,
    title: "Netarhat Sunrise Escape – 2 Days",
    provider: "MakeMyTrip",
    price: 12000,
    description: "Witness the breathtaking sunrise at Netarhat, the 'Queen of Chotanagpur'.",
    image: "/images/spots/netarhat.jpg",
    bookingLink: "https://www.makemytrip.com/hotels/netarhat-hotels.html",
  },
  {
    id: 3,
    title: "Betla National Park Safari – 4 Days",
    provider: "Yatra",
    price: 25000,
    description: "An adventurous safari through the dense forests of Betla, home to diverse wildlife.",
    image: "/images/spots/betla.jpg",
    bookingLink: "https://www.yatra.com/hotels/hotels-in-betla-national-park",
  },
  {
    id: 4,
    title: "Deoghar Spiritual Journey – 3 Days",
    provider: "Cleartrip",
    price: 18000,
    description: "A spiritual retreat to the sacred city of Deoghar, visiting Baidyanath Dham.",
    image: "/images/spots/baidyanath.jpg",
    bookingLink: "https://www.cleartrip.com/hotels/india/deoghar/",
  },
  {
    id: 5,
    title: "Hazaribagh Wildlife Sanctuary – 2 Days",
    provider: "Goibibo",
    price: 13000,
    description: "Discover the serene beauty and wildlife of Hazaribagh Sanctuary.",
    image: "/images/spots/hazaribagh.jpg",
    bookingLink: "https://www.goibibo.com/hotels/hotels-in-hazaribagh-ct/",
  },
  {
    id: 6,
    title: "Dassam & Jonha Falls Tour – 1 Day",
    provider: "MakeMyTrip",
    price: 5000,
    description: "A day trip to the stunning Dassam and Jonha waterfalls.",
    image: "/images/spots/dassam.jpg",
    bookingLink: "https://www.makemytrip.com/activities/india/ranchi/day-trip-to-jonha-and-dassam-falls-from-ranchi.html",
  },
  {
    id: 7,
    title: "Parasnath Hills Trek – 3 Days",
    provider: "Yatra",
    price: 20000,
    description: "A challenging and rewarding trek to the sacred Parasnath Hills.",
    image: "/images/spots/parasnath.jpg",
    bookingLink: "https://www.yatra.com/india-tour-packages/parasnath-hills",
  },
  {
    id: 8,
    title: "Shikharji Jain Pilgrimage – 4 Days",
    provider: "Cleartrip",
    price: 22000,
    description: "A pilgrimage to the holy site of Shikharji for the Jain community.",
    image: "/images/spots/shikharji.jpg",
    bookingLink: "https://www.cleartrip.com/hotels/india/shikharji/",
  },
  {
    id: 9,
    title: "Hundru Falls Adventure – 1 Day",
    provider: "Goibibo",
    price: 6000,
    description: "Experience the majestic Hundru Falls and its surrounding natural beauty.",
    image: "/images/spots/hundru.jpg",
    bookingLink: "https://www.goibibo.com/destinations/ranchi/places-to-visit-in-ranchi/hundru-falls-13052347341/",
  },
  {
    id: 10,
    title: "Jagannath Temple Darshan – 2 Days",
    provider: "MakeMyTrip",
    price: 9000,
    description: "A peaceful visit to the historic Jagannath Temple in Ranchi.",
    image: "/images/spots/jagannath.jpg",
    bookingLink: "https://www.makemytrip.com/hotels/ranchi-hotels.html",
  },
];

// --- HELPER COMPONENTS ---

const PackageCard = ({ packageInfo, onBook }: { packageInfo: Package; onBook: (pkg: Package) => void; }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
  >
    <img className="w-full h-48 object-cover" src={packageInfo.image} alt={packageInfo.title} />
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{packageInfo.title}</h3>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">{packageInfo.provider}</span>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">
          ₹{packageInfo.price.toLocaleString("en-IN")}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{packageInfo.description}</p>
      <button
        onClick={() => onBook(packageInfo)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
      >
        Book Now
      </button>
    </div>
  </motion.div>
);

const PaymentModal = ({
  pkg,
  onClose,
  walletAddress,
  connectWallet,
}: {
  pkg: Package | null;
  onClose: () => void;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
}) => {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");

  if (!pkg) return null;

  const handlePayment = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      setPaymentStatus("processing");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Convert INR to a mock ETH value (e.g., 1 ETH = 2,50,000 INR for test)
      const ethValue = (pkg.price / 250000).toFixed(6);
      
      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dEaD", // Replace with a recipient address
        value: ethers.parseEther(ethValue),
      });

      await tx.wait();
      setTxHash(tx.hash);
      setPaymentStatus("success");

      // Redirect after a short delay
      setTimeout(() => {
        window.open(pkg.bookingLink, "_blank");
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirm Booking</h2>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{pkg.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{pkg.provider}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              ₹{pkg.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-4">
            {paymentStatus === "idle" && (
              <>
                {walletAddress ? (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Connected: {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    </p>
                    <button
                      onClick={handlePayment}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Pay with Crypto
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    Connect Wallet
                  </button>
                )}
              </>
            )}

            {paymentStatus === "processing" && (
              <div className="text-center">
                <p className="text-blue-500">Processing payment...</p>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center text-green-500">
                <p className="font-semibold">Payment Successful!</p>
                <p className="text-xs break-all">Tx: {txHash}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Redirecting to {pkg.provider}...</p>
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="text-center text-red-500">
                <p className="font-semibold">Payment Failed</p>
                <p className="text-sm">Please try again or check your wallet.</p>
                <button
                  onClick={() => setPaymentStatus("idle")}
                  className="mt-2 px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// --- MAIN COMPONENT ---
export default function Bookings() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [filterProvider, setFilterProvider] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please check the console for details.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    }
  }, []);

  const handleBookNow = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  const filteredAndSortedPackages = useMemo(() => {
    let result = [...travelPackages];

    if (filterProvider) {
      result = result.filter((p) => p.provider === filterProvider);
    }

    if (sortOrder) {
      result.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return result;
  }, [sortOrder, filterProvider]);

  const providers = useMemo(() => [...new Set(travelPackages.map(p => p.provider))], []);

  return (
    <>
    <Navigation />
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-gray-50 dark:bg-gray-800  py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Journey Hub: Jharkhand</h1>
          <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Curated travel packages for your next adventure.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filter and Sort Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full sm:w-auto">
            <label htmlFor="sort-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort by Price
            </label>
            <select
              id="sort-price"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <label htmlFor="filter-provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Provider
            </label>
            <select
              id="filter-provider"
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Providers</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredAndSortedPackages.map((pkg) => (
              <PackageCard key={pkg.id} packageInfo={pkg} onBook={handleBookNow} />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <PaymentModal
            pkg={selectedPackage}
            onClose={closeModal}
            walletAddress={walletAddress}
            connectWallet={connectWallet}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
