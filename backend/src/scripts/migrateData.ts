import { connectDB } from '../database/connection';
import TennisCourt from '../models/TennisCourt';
import Review from '../models/Review';
import { config } from '../../config';

// Import the tennis courts data from the frontend
const tennisCourts = [
  {
    id: 1,
    name: "Central Park Tennis Center",
    location: "New York, NY",
    address: "93rd St Transverse, New York, NY 10024",
    surface: "Hard",
    price: "$25/hour",
    hours: "6:00 AM - 10:00 PM",
    amenities: ["Lighting", "Pro Shop", "Restrooms", "Parking"],
    rating: 4.5,
    reviewCount: 127,
    description: "Beautiful courts in the heart of Central Park with excellent lighting and well-maintained surfaces.",
    reviews: [
      {
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        text: "Amazing location and well-maintained courts. The lighting is perfect for evening games."
      },
      {
        name: "Mike Chen",
        rating: 4,
        date: "2024-01-10",
        text: "Great courts but can get crowded on weekends. Book in advance!"
      }
    ]
  },
  {
    id: 2,
    name: "Riverside Tennis Club",
    location: "Los Angeles, CA",
    address: "1234 Riverside Dr, Los Angeles, CA 90210",
    surface: "Clay",
    price: "$35/hour",
    hours: "5:30 AM - 11:00 PM",
    amenities: ["Lighting", "Pro Shop", "Restrooms", "Parking", "Café"],
    rating: 4.8,
    reviewCount: 89,
    description: "Premium clay courts with professional coaching available. Perfect for serious players.",
    reviews: [
      {
        name: "Emma Rodriguez",
        rating: 5,
        date: "2024-01-12",
        text: "Best clay courts in LA! The coaching staff is incredible."
      }
    ]
  },
  {
    id: 3,
    name: "Golden Gate Tennis Courts",
    location: "San Francisco, CA",
    address: "456 Golden Gate Ave, San Francisco, CA 94102",
    surface: "Hard",
    price: "$30/hour",
    hours: "6:00 AM - 9:00 PM",
    amenities: ["Lighting", "Restrooms", "Parking"],
    rating: 4.2,
    reviewCount: 156,
    description: "Scenic courts with views of the Golden Gate Bridge. Popular with locals and tourists.",
    reviews: [
      {
        name: "David Kim",
        rating: 4,
        date: "2024-01-08",
        text: "Great views and decent courts. Can be windy sometimes."
      }
    ]
  },
  {
    id: 4,
    name: "Miami Beach Tennis Center",
    location: "Miami, FL",
    address: "789 Ocean Dr, Miami Beach, FL 33139",
    surface: "Hard",
    price: "$40/hour",
    hours: "6:00 AM - 10:00 PM",
    amenities: ["Lighting", "Pro Shop", "Restrooms", "Parking", "Beach Access"],
    rating: 4.6,
    reviewCount: 203,
    description: "Oceanfront tennis courts with stunning beach views. Perfect for a tennis vacation.",
    reviews: [
      {
        name: "Lisa Martinez",
        rating: 5,
        date: "2024-01-14",
        text: "Absolutely stunning location! Playing tennis with ocean views is incredible."
      }
    ]
  },
  {
    id: 5,
    name: "Wimbledon Tennis Academy",
    location: "Chicago, IL",
    address: "321 Wimbledon St, Chicago, IL 60601",
    surface: "Grass",
    price: "$50/hour",
    hours: "7:00 AM - 8:00 PM",
    amenities: ["Lighting", "Pro Shop", "Restrooms", "Parking", "Locker Rooms", "Café"],
    rating: 4.9,
    reviewCount: 67,
    description: "Authentic grass courts modeled after Wimbledon. Premium experience for serious players.",
    reviews: [
      {
        name: "James Wilson",
        rating: 5,
        date: "2024-01-11",
        text: "True grass court experience! Worth every penny for the authentic feel."
      }
    ]
  }
];

const migrateData = async (): Promise<void> => {
  try {
    console.log('Starting data migration...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await TennisCourt.deleteMany({});
    await Review.deleteMany({});
    
    // Migrate courts data
    console.log('Migrating courts data...');
    for (const courtData of tennisCourts) {
      const { reviews, ...courtInfo } = courtData;
      
      // Create reviews first
      const createdReviews = [];
      for (const reviewData of reviews) {
        const review = new Review(reviewData);
        await review.save();
        createdReviews.push(review._id);
      }
      
      // Create court with review references
      const court = new TennisCourt({
        ...courtInfo,
        reviews: createdReviews
      });
      
      await court.save();
      console.log(`Migrated court: ${court.name}`);
    }
    
    console.log('Data migration completed successfully!');
    console.log(`Migrated ${tennisCourts.length} courts with their reviews.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
}

export default migrateData;
