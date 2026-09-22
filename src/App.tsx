/**
 * Routes and chrome.
 *
 * The portal renders without the marketing header and footer — it is a
 * different product wearing the same palette, and giving it the site's nav
 * would invite a signed-in patient back into the sales funnel.
 */

import { useEffect } from "react";
import { Route, Router, Switch, useLocation } from "wouter";

import { DARK_HERO, Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Doctor } from "@/pages/Doctor";
import { International } from "@/pages/International";
import { Journal } from "@/pages/Journal";
import { ArticlePage } from "@/pages/Article";
import { Contact } from "@/pages/Contact";
import { Privacy } from "@/pages/Privacy";
import { Book } from "@/pages/Book";
import { Portal } from "@/pages/Portal";
import { NotFound } from "@/pages/NotFound";

/** Every navigation starts at the top. Without this, moving from the bottom
    of a long page to a short one lands mid-page on an apparently blank screen. */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

/**
 * The path the app is mounted under, with no trailing slash.
 *
 * "" on its own domain, "/elite-clinic" on GitHub Pages. It has to be handed
 * to wouter's Router, or every route is compared against a pathname that
 * still carries the sub-path and nothing but the 404 ever matches.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

export function App() {
  return (
    <Router base={BASE}>
      <Shell />
    </Router>
  );
}

/* Inside the Router, so `useLocation` returns paths relative to the base.
   Reading it in App — outside the provider — would give the raw pathname and
   both checks below would silently stop matching under a sub-path. */
function Shell() {
  const [location] = useLocation();
  const bare = location.startsWith("/portal");
  /* A full-bleed hero runs under the fixed header; padding it down would
     leave a band of surface above the hero. */
  const fullBleed = DARK_HERO.includes(location);

  return (
    <>
      <ScrollToTop />
      {!bare && <Nav />}
      <main className={bare || fullBleed ? "" : "pt-[72px]"}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/doctor" component={Doctor} />
          <Route path="/international" component={International} />
          <Route path="/journal" component={Journal} />
          <Route path="/journal/:slug" component={ArticlePage} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/book" component={Book} />
          <Route path="/portal" component={Portal} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!bare && <Footer />}
    </>
  );
}
