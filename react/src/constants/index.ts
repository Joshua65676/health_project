import { ChatIcon, Clock, Lock, PrivateIcon, SettingIcon } from "../assets";

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