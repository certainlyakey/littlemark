import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandFlower } from "./sticker-art";

export function ShopHeader() {
  return <header className="site-header"><Link to="/" className="brand" aria-label="Littlemark home"><BrandFlower />littlemark<span className="text-muted-foreground">.</span></Link><div className="header-right"><span className="header-note">For their little world.</span><Button variant="ghost" asChild className="header-create"><Link to="/design" search={{ request: "" }}>Make it theirs <ArrowUpRight /></Link></Button></div></header>;
}
export function ShopFooter() {
  return <footer className="site-footer"><span>littlemark. · Little labels. Big personality.</span><span className="flex items-center gap-1.5">Made with a little love <Heart size={12} /></span></footer>;
}