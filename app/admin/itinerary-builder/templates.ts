export type ActivityType = "hotel" | "transfer" | "cruise" | "meal" | "activity" | "sightseeing";
export type TierKey = "standard" | "premium" | "luxury";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  cost: number;
  imageUrl: string;
  pills: string[];
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface TierData {
  label: string;
  perPerson: number;
  description: string;
}

export interface Template {
  name: string;
  nights: number;
  days: DayPlan[];
  tiers: Record<TierKey, TierData>;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
}

export const DEFAULT_INCLUSIONS = [
  "Accommodation as per itinerary",
  "Airport pick-up and drop",
  "All transfers in AC vehicle",
  "Daily breakfast",
  "All applicable hotel taxes",
];

export const DEFAULT_EXCLUSIONS = [
  "Airfare / train tickets",
  "Lunch and dinner (unless specified)",
  "Personal expenses & tips",
  "Entry tickets to monuments/parks",
  "Travel insurance",
];

export const DEFAULT_CANCELLATION = "Free cancellation up to 7 days before check-in. 50% refund for 3-7 days. No refund within 3 days.";

export const TEMPLATES: Template[] = [
  {
    name: "Honeymoon Bliss 3N/4D",
    nights: 3,
    days: [
      {
        day: 1, title: "Arrival & Romance",
        activities: [
          { id: "h1-1", type: "transfer", title: "Airport Pickup", description: "AC sedan from Dabolim/Manohar airport", startTime: "14:00", endTime: "15:00", cost: 1200, imageUrl: "", pills: ["AC Sedan", "Meet & Greet"] },
          { id: "h1-2", type: "hotel", title: "Resort Check-in", description: "Premium beachfront resort in North Goa", startTime: "15:00", endTime: "16:00", cost: 5500, imageUrl: "", pills: ["Sea View", "Couple Room"] },
          { id: "h1-3", type: "cruise", title: "Sunset Cruise", description: "2-hour sunset cruise on the Mandovi River", startTime: "17:00", endTime: "19:00", cost: 1800, imageUrl: "", pills: ["Live Music", "Snacks"] },
          { id: "h1-4", type: "meal", title: "Candlelight Dinner", description: "Beachside candlelight dinner for two", startTime: "20:00", endTime: "22:00", cost: 3000, imageUrl: "", pills: ["Beachside", "Multicuisine"] },
        ],
      },
      {
        day: 2, title: "Beach & Spa Day",
        activities: [
          { id: "h2-1", type: "meal", title: "Breakfast at Resort", description: "Buffet breakfast included with stay", startTime: "08:00", endTime: "09:30", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "h2-2", type: "activity", title: "Couple's Spa", description: "90-minute Ayurvedic couples massage", startTime: "10:00", endTime: "11:30", cost: 4000, imageUrl: "", pills: ["Ayurvedic", "90 min"] },
          { id: "h2-3", type: "sightseeing", title: "North Goa Tour", description: "Visit Aguada Fort, Vagator, Anjuna Beach", startTime: "14:00", endTime: "18:00", cost: 1500, imageUrl: "", pills: ["Fort Aguada", "Vagator"] },
          { id: "h2-4", type: "cruise", title: "Dinner Cruise", description: "Dinner cruise with DJ and entertainment", startTime: "19:30", endTime: "22:00", cost: 2200, imageUrl: "", pills: ["DJ Night", "Unlimited Drinks"] },
        ],
      },
      {
        day: 3, title: "South Goa & Culture",
        activities: [
          { id: "h3-1", type: "meal", title: "Breakfast", description: "Buffet breakfast at resort", startTime: "08:00", endTime: "09:30", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "h3-2", type: "sightseeing", title: "Old Goa Heritage", description: "Basilica of Bom Jesus, Se Cathedral, Dona Paula", startTime: "10:00", endTime: "13:00", cost: 1500, imageUrl: "", pills: ["UNESCO", "Churches"] },
          { id: "h3-3", type: "activity", title: "Spice Plantation", description: "Guided tour with lunch at spice plantation", startTime: "14:00", endTime: "16:30", cost: 1200, imageUrl: "", pills: ["Lunch Included", "Nature Walk"] },
          { id: "h3-4", type: "meal", title: "Farewell Dinner", description: "Special Goan seafood dinner", startTime: "20:00", endTime: "22:00", cost: 2500, imageUrl: "", pills: ["Goan Cuisine", "Seafood"] },
        ],
      },
      {
        day: 4, title: "Departure",
        activities: [
          { id: "h4-1", type: "meal", title: "Breakfast & Checkout", description: "Breakfast followed by hotel checkout", startTime: "08:00", endTime: "10:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "h4-2", type: "transfer", title: "Airport Drop", description: "AC sedan transfer to airport", startTime: "10:30", endTime: "11:30", cost: 1200, imageUrl: "", pills: ["AC Sedan"] },
        ],
      },
    ],
    tiers: {
      standard: { label: "Standard", perPerson: 18000, description: "3-star hotel, shared transfers" },
      premium:  { label: "Premium",  perPerson: 28000, description: "4-star resort, private transfers, spa" },
      luxury:   { label: "Luxury",   perPerson: 45000, description: "5-star resort, all-inclusive, butler" },
    },
    inclusions: [
      "Accommodation as per itinerary (3 nights)",
      "Airport pick-up and drop (AC sedan)",
      "All transfers in AC vehicle",
      "Daily breakfast",
      "Sunset cruise with snacks",
      "Dinner cruise with entertainment",
      "Couple's spa session (90 min)",
      "North Goa & South Goa sightseeing",
      "Spice plantation visit with lunch",
      "Candlelight dinner for two",
      "All applicable hotel taxes",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Lunch (unless specified)",
      "Personal expenses & tips",
      "Entry tickets to monuments",
      "Water sports & optional activities",
      "Travel insurance",
      "Anything not mentioned in inclusions",
    ],
    cancellationPolicy: "Free cancellation up to 7 days before check-in. 50% refund for 3-7 days. No refund within 3 days.",
  },
  {
    name: "Family Explorer 5N/6D",
    nights: 5,
    days: [
      {
        day: 1, title: "Welcome to Goa",
        activities: [
          { id: "f1-1", type: "transfer", title: "Airport Pickup", description: "AC Innova from airport to hotel", startTime: "12:00", endTime: "13:00", cost: 1500, imageUrl: "", pills: ["AC Innova", "Child Seat"] },
          { id: "f1-2", type: "hotel", title: "Hotel Check-in", description: "Family room at beachside resort", startTime: "14:00", endTime: "15:00", cost: 4500, imageUrl: "", pills: ["Family Room", "Pool Access"] },
          { id: "f1-3", type: "activity", title: "Beach Evening", description: "Relax at Calangute/Baga beach", startTime: "16:00", endTime: "18:30", cost: 0, imageUrl: "", pills: ["Free", "Sunset"] },
        ],
      },
      {
        day: 2, title: "North Goa Adventure",
        activities: [
          { id: "f2-1", type: "meal", title: "Breakfast", description: "Hotel buffet breakfast", startTime: "08:00", endTime: "09:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "f2-2", type: "sightseeing", title: "Fort Aguada", description: "Historic Portuguese fort with panoramic views", startTime: "09:30", endTime: "11:30", cost: 800, imageUrl: "", pills: ["Heritage", "Views"] },
          { id: "f2-3", type: "activity", title: "Water Sports", description: "Parasailing, banana ride, jet ski for the family", startTime: "12:00", endTime: "14:00", cost: 2500, imageUrl: "", pills: ["Family Pack", "3 Activities"] },
          { id: "f2-4", type: "cruise", title: "Evening Cruise", description: "Family-friendly sunset cruise on Mandovi", startTime: "17:00", endTime: "19:00", cost: 1500, imageUrl: "", pills: ["Kid Friendly", "Snacks"] },
        ],
      },
      {
        day: 3, title: "South Goa Culture",
        activities: [
          { id: "f3-1", type: "meal", title: "Breakfast", description: "Hotel breakfast", startTime: "08:00", endTime: "09:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "f3-2", type: "sightseeing", title: "Old Goa Churches", description: "Basilica, Se Cathedral, Church of St. Francis", startTime: "09:30", endTime: "12:00", cost: 1000, imageUrl: "", pills: ["UNESCO", "Guide"] },
          { id: "f3-3", type: "meal", title: "Goan Lunch", description: "Authentic Goan thali at local restaurant", startTime: "12:30", endTime: "13:30", cost: 800, imageUrl: "", pills: ["Veg & Non-veg"] },
          { id: "f3-4", type: "sightseeing", title: "Miramar & Dona Paula", description: "Beach walk and viewpoint visit", startTime: "15:00", endTime: "17:30", cost: 500, imageUrl: "", pills: ["Beach", "Viewpoint"] },
        ],
      },
      {
        day: 4, title: "Nature & Spices",
        activities: [
          { id: "f4-1", type: "meal", title: "Breakfast", description: "Hotel breakfast", startTime: "08:00", endTime: "09:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "f4-2", type: "activity", title: "Spice Plantation", description: "Tropical spice farm tour with elephant bathing", startTime: "09:30", endTime: "13:00", cost: 1800, imageUrl: "", pills: ["Lunch Included", "Nature"] },
          { id: "f4-3", type: "sightseeing", title: "Dudhsagar View", description: "View point of the majestic waterfall", startTime: "14:00", endTime: "16:00", cost: 1200, imageUrl: "", pills: ["Waterfall", "Scenic"] },
        ],
      },
      {
        day: 5, title: "Beach & Shopping",
        activities: [
          { id: "f5-1", type: "meal", title: "Breakfast", description: "Hotel breakfast", startTime: "08:00", endTime: "09:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "f5-2", type: "activity", title: "Dolphin Spotting", description: "Boat trip to spot dolphins off Sinquerim", startTime: "09:30", endTime: "11:30", cost: 1500, imageUrl: "", pills: ["Boat Trip", "Wildlife"] },
          { id: "f5-3", type: "sightseeing", title: "Anjuna Flea Market", description: "Shopping at the famous Wednesday flea market", startTime: "14:00", endTime: "17:00", cost: 0, imageUrl: "", pills: ["Shopping", "Free Entry"] },
          { id: "f5-4", type: "cruise", title: "Farewell Dinner Cruise", description: "DJ cruise with dinner and drinks", startTime: "19:00", endTime: "22:00", cost: 2200, imageUrl: "", pills: ["DJ", "Dinner"] },
        ],
      },
      {
        day: 6, title: "Departure",
        activities: [
          { id: "f6-1", type: "meal", title: "Breakfast & Checkout", description: "Final breakfast and checkout", startTime: "08:00", endTime: "10:00", cost: 0, imageUrl: "", pills: ["Included"] },
          { id: "f6-2", type: "transfer", title: "Airport Drop", description: "AC Innova to airport", startTime: "10:30", endTime: "11:30", cost: 1500, imageUrl: "", pills: ["AC Innova"] },
        ],
      },
    ],
    tiers: {
      standard: { label: "Standard", perPerson: 25000, description: "3-star hotel, shared transfers" },
      premium:  { label: "Premium",  perPerson: 38000, description: "4-star resort, private vehicle, all activities" },
      luxury:   { label: "Luxury",   perPerson: 55000, description: "5-star villa, luxury vehicle, all meals" },
    },
    inclusions: [
      "Accommodation (5 nights) as per itinerary",
      "Airport pick-up and drop (AC Innova)",
      "All transfers in private AC vehicle",
      "Daily breakfast",
      "1 Goan lunch",
      "Sunset cruise",
      "Farewell dinner cruise",
      "North & South Goa sightseeing with guide",
      "Spice plantation visit with lunch",
      "Water sports (3 activities)",
      "Dolphin spotting boat trip",
      "All applicable hotel taxes",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Meals not mentioned",
      "Personal expenses & tips",
      "Entry fees (unless specified)",
      "Optional activities",
      "Travel insurance",
    ],
    cancellationPolicy: "Free cancellation up to 10 days before check-in. 50% refund for 5-10 days. 25% refund for 3-5 days. No refund within 3 days.",
  },
  {
    name: "Blank Canvas 3N/4D",
    nights: 3,
    days: [
      { day: 1, title: "Day 1", activities: [] },
      { day: 2, title: "Day 2", activities: [] },
      { day: 3, title: "Day 3", activities: [] },
      { day: 4, title: "Day 4", activities: [] },
    ],
    tiers: {
      standard: { label: "Standard", perPerson: 0, description: "Budget-friendly option" },
      premium:  { label: "Premium",  perPerson: 0, description: "Best value for comfort" },
      luxury:   { label: "Luxury",   perPerson: 0, description: "All-inclusive luxury experience" },
    },
    inclusions: [...DEFAULT_INCLUSIONS],
    exclusions: [...DEFAULT_EXCLUSIONS],
    cancellationPolicy: DEFAULT_CANCELLATION,
  },
];
