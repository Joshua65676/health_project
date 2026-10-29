import { ChatIcon, Clock, Lock, Message, NoteLine, PrivateIcon, SettingIcon, VectorAI } from "../assets";

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