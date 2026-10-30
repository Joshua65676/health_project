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