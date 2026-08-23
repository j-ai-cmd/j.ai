import { Switch, Route, Router as WouterRouter } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";
import BlogIndex from "@/pages/blogs/index";
import BlogPost from "@/pages/blogs/BlogPost";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/legal" component={Legal} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
