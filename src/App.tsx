import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PreferencesProvider } from './services/preferencesContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Core Landing Page loaded eagerly
import { HomePage } from './pages/HomePage';

// Lazy-loaded pages for optimized performance
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const BiodiversityPage = lazy(() => import('./pages/BiodiversityPage').then(m => ({ default: m.BiodiversityPage })));
const SpeciesDetailPage = lazy(() => import('./pages/SpeciesDetailPage').then(m => ({ default: m.SpeciesDetailPage })));
const AttractionsPage = lazy(() => import('./pages/AttractionsPage').then(m => ({ default: m.AttractionsPage })));
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage').then(m => ({ default: m.TripPlannerPage })));
const OfflineExplorerPage = lazy(() => import('./pages/OfflineExplorerPage').then(m => ({ default: m.OfflineExplorerPage })));
const SOSPage = lazy(() => import('./pages/SOSPage').then(m => ({ default: m.SOSPage })));
const SafetyGuidePage = lazy(() => import('./pages/SafetyGuidePage').then(m => ({ default: m.SafetyGuidePage })));
const ConservationPage = lazy(() => import('./pages/ConservationPage').then(m => ({ default: m.ConservationPage })));
const SightingsPage = lazy(() => import('./pages/SightingsPage').then(m => ({ default: m.SightingsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SourcesPage = lazy(() => import('./pages/SourcesPage').then(m => ({ default: m.SourcesPage })));

// Loading Skeleton for route transitions
const RouteLoadingSkeleton = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-neutral-400">
    <div className="w-12 h-12 rounded-2xl bg-[#0f1f16] border border-[#234533] flex items-center justify-center text-emerald-400 mb-3 animate-pulse shadow-lg">
      <span className="text-2xl">🌿</span>
    </div>
    <div className="text-xs uppercase tracking-widest font-semibold text-emerald-500/80 animate-pulse">
      Loading SGNP Data...
    </div>
  </div>
);

export const App: React.FC = () => {
  const [showInitialLoading, setShowInitialLoading] = useState<boolean>(() => {
    return !sessionStorage.getItem('wildmumbai_intro_seen');
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('wildmumbai_intro_seen', 'true');
    setShowInitialLoading(false);
  };

  return (
    <PreferencesProvider>
      <BrowserRouter>
        {showInitialLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

        <div className="flex flex-col min-h-screen bg-[#070c09] text-white">
          <Navbar />
          
          <main className="flex-1">
            <Suspense fallback={<RouteLoadingSkeleton />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<ExplorePage />} />
                <Route path="/biodiversity" element={<BiodiversityPage />} />
                <Route path="/biodiversity/:id" element={<SpeciesDetailPage />} />
                <Route path="/attractions" element={<AttractionsPage />} />
                <Route path="/planner" element={<TripPlannerPage />} />
                <Route path="/offline" element={<OfflineExplorerPage />} />
                <Route path="/sos" element={<SOSPage />} />
                <Route path="/safety" element={<SafetyGuidePage />} />
                <Route path="/conservation" element={<ConservationPage />} />
                <Route path="/sightings" element={<SightingsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/sources" element={<SourcesPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
          <MobileNav />
        </div>
      </BrowserRouter>
    </PreferencesProvider>
  );
};

export default App;
