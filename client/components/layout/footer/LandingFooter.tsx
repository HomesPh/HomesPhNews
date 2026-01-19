import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiFacebook, SiLinkedin } from "react-icons/si";
import { SlSocialTwitter } from "react-icons/sl";

interface LinksListProps {
  title: string;
  items?: { label: string; url?: string; }[]
  className?: string;
}

const LinksList = ({ title, items = [], className }: LinksListProps) => {
  return (
    <div className={cn(["flex flex-col", className])}>
      <span className="mb-4 text-md font-bold">{title}</span>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <span key={index} className="text-sm font-light">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const Links = [
  {
    title: "Countries",
    items: [
      { label: "Canada", url: "#" },
      { label: "Philippines", url: "#" },
      { label: "USA", url: "#" },
      { label: "Dubai", url: "#" },
      { label: "Singapore", url: "#" },
    ]
  },
  {
    title: "Categories",
    items: [
      { label: "Technology", url: "#" },
      { label: "Business", url: "#" },
      { label: "Science", url: "#" },
      { label: "Innovation", url: "#" },
      { label: "Research", url: "#" },
    ]
  },
  {
    title: "About",
    items: [
      { label: "About Us", url: "#" },
      { label: "Contact", url: "#" },
      { label: "Careers", url: "#" },
      { label: "Advertise", url: "#" },
    ]
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", url: "#" },
      { label: "Terms of Use", url: "#" },
      { label: "Cookie Policy", url: "#" },
    ]
  }
];

const FollowUs = () => {
  return (
    <div className="flex flex-col">
      <span className="mb-4 text-md font-bold">Follow Us</span>
      <div className="flex flex-row gap-4">
        <Button size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
          <SlSocialTwitter />
        </Button>
        <Button size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
          <SiFacebook />
        </Button>
        <Button size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
          <SiLinkedin />
        </Button>
      </div>
    </div>
  );
}

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {Links.map((list, index) => (
            <LinksList
              key={index}
              title={list.title}
              items={list.items}
            />
          ))}
          <FollowUs />
        </div>
      </div>
    </footer>
  );
}