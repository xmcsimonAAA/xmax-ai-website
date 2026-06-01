/*
 * XMAX AI Inc — SEA-inspired Corporate Website
 * 多页面路由架构：首页精简展示 + 独立详情页
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
import CyberCursor from "@/components/CyberCursor";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Infrastructure from "@/pages/Infrastructure";
import Products from "@/pages/Products";
import Business from "@/pages/Business";
import AWSPage from "@/pages/AWS";
import Contact from "@/pages/Contact";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import BusinessUnitPage from "@/pages/BusinessUnitPage";
import LegalPage from "@/pages/LegalPage";
import SimpleContentPage from "@/pages/SimpleContentPage";

/**
 * 自定义 hash location hook：剥离 ?scrollTo=xxx 查询参数，
 * 只把纯路径部分交给 wouter 路由匹配，查询参数仍保留在 URL 中供 ScrollToTop 读取。
 */
function useHashLocationStripped(): [string, (to: string, opts?: Record<string, unknown>) => void] {
  const [loc, navigate] = useHashLocation();
  // 剥离 ? 后面的查询参数，只返回纯路径
  const path = loc.split("?")[0];
  return [path, navigate];
}

function AppRouter() {
  return (
    <Router hook={useHashLocationStripped}>
      <CyberCursor />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/infrastructure" component={Infrastructure} />
          <Route path="/products" component={Products} />
          <Route path="/business/:id" component={BusinessUnitPage} />
          <Route path="/business" component={Business} />
          <Route path="/aws" component={AWSPage} />
          <Route path="/contact" component={Contact} />
          <Route path="/news/:id" component={NewsArticle} />
          <Route path="/news" component={News} />
          <Route path="/privacy">
            <LegalPage type="privacy" />
          </Route>
          <Route path="/terms">
            <LegalPage type="terms" />
          </Route>
          <Route path="/enterprise-service">
            <SimpleContentPage type="enterprise-service" />
          </Route>
          <Route path="/security-governance">
            <SimpleContentPage type="security-governance" />
          </Route>
          <Route>
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-200">404</h1>
                <p className="mt-4 text-slate-500">Page not found</p>
              </div>
            </div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
