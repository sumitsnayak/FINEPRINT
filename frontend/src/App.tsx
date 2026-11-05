import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScanProvider, useScan } from './context/ScanContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LogFoodModal } from './components/LogFoodModal';
import { PlatformInstallBanner } from './components/PlatformInstallBanner';
import { QuickIngredientTesterModal } from './components/QuickIngredientTesterModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { ScanResultsPage } from './pages/ScanResultsPage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductComparisonPage } from './pages/ProductComparisonPage';
import { FoodDiaryPage } from './pages/FoodDiaryPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { HealthierAlternativesPage } from './pages/HealthierAlternativesPage';
import { ComplaintSubmissionPage } from './pages/ComplaintSubmissionPage';
import { ComplaintHistoryPage } from './pages/ComplaintHistoryPage';
import { SavedProductsPage } from './pages/SavedProductsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';

function AppContent() {
  const { user } = useAuth();
  const { activeScan, setActiveScan } = useScan();

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [lastComplaintRef, setLastComplaintRef] = useState<string | undefined>(undefined);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isQuickTesterOpen, setIsQuickTesterOpen] = useState<boolean>(false);
  const [quickTesterText, setQuickTesterText] = useState<string>('');

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanCompleted = (result: any) => {
    setActiveScan(result);
    setCurrentTab('scan-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAssistant = (product: any) => {
    setActiveScan(product);
    setCurrentTab('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogModalAction = (action: 'scan' | 'capture' | 'import' | 'describe' | 'search') => {
    setIsLogModalOpen(false);
    if (action === 'scan' || action === 'capture' || action === 'import') {
      setCurrentTab('scanner');
    } else if (action === 'describe') {
      setCurrentTab('assistant');
    } else if (action === 'search') {
      setCurrentTab('products');
    }
  };

  // Cross-Platform Keyboard Shortcuts (Mac & Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S: Instant Scanner
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setCurrentTab('scanner');
      }
      // Cmd/Ctrl + K: Search Foods
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentTab('products');
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setIsLogModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white pb-20 md:pb-0">
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Cross-Platform Device Install & Compatibility Banner (Android, iOS, Mac, Windows) */}
      <PlatformInstallBanner />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAnalyzeText={(text) => {
              setQuickTesterText(text);
              setIsQuickTesterOpen(true);
            }}
            onOpenLogModal={() => setIsLogModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onSelectScan={(scanId) => {
              setCurrentTab('scan-results');
            }}
            onOpenLogModal={() => setIsLogModalOpen(true)}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerPage
            onScanCompleted={handleScanCompleted}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'scan-results' && activeScan && (
          <ScanResultsPage
            scanResult={activeScan}
            onNavigate={handleNavigate}
            onAskAssistant={handleAskAssistant}
          />
        )}

        {currentTab === 'products' && (
          <ProductCatalogPage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'product-detail' && selectedProductId && (
          <ProductDetailsPage
            productId={selectedProductId}
            onBack={() => setCurrentTab('products')}
            onNavigate={handleNavigate}
            onAskAssistant={handleAskAssistant}
          />
        )}

        {currentTab === 'compare' && (
          <ProductComparisonPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'diary' && (
          <FoodDiaryPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'assistant' && (
          <AIAssistantPage />
        )}

        {currentTab === 'alternatives' && (
          <HealthierAlternativesPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'report' && (
          <ComplaintSubmissionPage
            onNavigate={handleNavigate}
            onComplaintSubmitted={(ref) => {
              setLastComplaintRef(ref);
            }}
          />
        )}

        {currentTab === 'complaints-history' && (
          <ComplaintHistoryPage
            onNavigate={handleNavigate}
            initialRef={lastComplaintRef}
          />
        )}

        {currentTab === 'saved' && (
          <SavedProductsPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSettingsPage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage />
        )}

        {currentTab === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Clean White & Emerald Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 text-sm">FINEPRINT</span>
            <span>·</span>
            <span className="text-slate-500 font-medium">Food Safety & Standards</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => handleNavigate('landing')} className="hover:text-emerald-700 font-medium transition-colors">Home</button>
            <button onClick={() => handleNavigate('products')} className="hover:text-emerald-700 font-medium transition-colors">Foods</button>
            <button onClick={() => handleNavigate('alternatives')} className="hover:text-emerald-700 font-medium transition-colors">Swaps</button>
            <button onClick={() => handleNavigate('report')} className="hover:text-emerald-700 font-medium transition-colors">Report</button>
          </div>

          <div className="text-center sm:text-right text-slate-400 text-[11px]">
            <span>© 2026 FINEPRINT</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation with Log Modal trigger */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Log Food Bottom Sheet Modal */}
      <LogFoodModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSelectAction={handleLogModalAction}
      />

      {/* Instant Interactive Ingredient Tester Modal */}
      <QuickIngredientTesterModal
        isOpen={isQuickTesterOpen}
        initialText={quickTesterText}
        onClose={() => setIsQuickTesterOpen(false)}
        onOpenFullReport={(result) => {
          setActiveScan(result);
          setCurrentTab('scan-results');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <AppContent />
      </ScanProvider>
    </AuthProvider>
  );
}

