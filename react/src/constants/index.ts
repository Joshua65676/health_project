import { 
  ChatIcon, Cindy, Clock, Josh, Lock, Message, NoteLine, PrivateIcon, Sarah, SettingIcon, VectorAI 
} from "../assets";

export const SidebarList = [
    {id: 1, name: "Chat", icon: ChatIcon, link: ""},
    {id: 2, name: "Settings", icon: SettingIcon, link: ""}
]

export const NavLinks = [
    { name: "Home", link: "#hero" },
    { name: "About Us", link: "#aboutus" },
    { name: "How It Works", link: "#howitworks" },
    { name: "Reviews", link: "#reviews" },
];

export const HeroList = [
    {name: "100% Secure", icon: Lock},
    {name: "Available 24/7", icon: Clock},
    {name: "Private & Confidential", icon: PrivateIcon},
]

export const STEPS = [
  {
    id: 1,
    icon: Message,
    title: "Describe Your Symptoms",
    description: "Tell MedAi how you are feeling in your own words.",
  },
  {
    id: 2,
    icon: VectorAI,
    title: "AI Analyze Your Input",
    description: "Our AI processes your symptoms and provides intelligent insights.",
  },
  {
    id: 3,
    icon: NoteLine,
    title: "Receive Guidance",
    description: "Get recommendations, next steps and healthy suggestions instantly.",
  },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Cindy A.",
    image: Cindy,
    text: "MedAI helped me understand my symptoms and gave clear next steps. It's like having a health expert available 24/7.",
  },
  {
    id: 2,
    name: "Sarah J.",
    image: Sarah,
    text: "I love how easy it is to chat and get personalized health advice. It gave me peace of mind when I needed it the most.",
  },
  {
    id: 3,
    name: "Josh O.",
    image: Josh,
    text: "I love how easy it is to chat and get personalized health advice. It gave me peace of mind when I needed it the most.",
  },
  // add more reviews here; the dots update automatically
];

export const FOOTER_COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "About Us", href: "#about" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Use", href: "#terms" },
      { label: "Disclaimer", href: "#disclaimer" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Health Tips", href: "#health-tips" },
      { label: "Blog", href: "#blog" },
      { label: "Help Center", href: "#help" },
    ],
  },
];

export const HEALTH_EMERGENCY_NUMBERS = [
  { flag: "🇳🇬", country: "Nigeria", number: "112" },
  { flag: "🇺🇸", country: "United States", number: "911" },
  { flag: "🇩🇪", country: "Germany", number: "112 ambulance/fire, 110 police" },
  { flag: "🇨🇦", country: "Canada", number: "911" },
];

export const HEALTH_TIPS = [
  "Keep water nearby and drink when you feel thirsty.",
  "Try to keep a regular sleep and wake schedule.",
  "Wash your hands with soap before eating.",
  "Take a short walk when it fits your day.",
  "Add a fruit or vegetable to your next meal.",
  "Pause for a few slow breaths when you feel stressed.",
  "Look away from your screen regularly to rest your eyes.",
  "Cover coughs and sneezes with a tissue or your elbow.",
  "Use shade, clothing, or sunscreen to protect your skin outdoors.",
  "Make time to speak with someone you trust.",
  "Keep frequently touched surfaces clean.",
  "Choose a comfortable posture when sitting or working.",
  "Make time to stretch gently during long periods of sitting.",
  "Store and prepare food with clean hands and utensils.",
  "Take a few minutes away from screens before bedtime.",
  "Spend a little time outside when the weather allows.",
  "Keep your living space aired out when it is safe to do so.",
  "Take regular breaks during tasks that need close focus.",
  "Notice when you need rest and make room for a pause.",
  "Try to include a source of protein with meals.",
  "Keep a reusable water bottle clean if you use one.",
  "Use hearing protection around loud sounds when available.",
  "Make time for an activity that helps you unwind.",
  "Check that walkways at home are clear to help prevent trips.",
  "Follow food storage guidance on product labels.",
  "Keep up with routine health visits that are available to you.",
  "When outdoors, take breaks in the shade on hot days.",
  "Set a reminder to stand and move during a long work session.",
  "Be kind to yourself when a day does not go as planned.",
  "Reach out to a trusted person when you feel overwhelmed.",
];