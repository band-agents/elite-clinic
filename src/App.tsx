/**
 * Routes and chrome.
 *
 * The portal renders without the marketing header and footer — it is a
 * different product wearing the same palette, and giving it the site's nav
 * would invite a signed-in patient back into the sales funnel.
 */

import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Doctor } from "@/pages/Doctor";
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

export function App() {
  const [location] = useLocation();
  const bare = location.startsWith("/portal");

  return (
    <>
      <ScrollToTop />
      {!bare && <Nav />}
      <main className={bare ? "" : "pt-[72px]"}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/doctor" component={Doctor} />
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
