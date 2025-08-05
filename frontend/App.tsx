import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Modern Components
import { ModernHeader } from "@/components/ModernHeader";
import { ModernStatsDashboard } from "@/components/ModernStatsDashboard";
import { FileHashVerifierWithModes } from "@/components/FileHashVerifierWithModes";
import { StatsData, calculateDemoStats, calculateBlockchainStats } from "@/utils/statsCalculator";

function App() {
  const { connected } = useWallet();
  const [currentMode, setCurrentMode] = useState<"demo" | "blockchain">("demo");
  const [stats, setStats] = useState<StatsData>({
    totalFiles: 0,
    totalVerifications: 0,
    filesInDatabase: 0,
    successRate: "100%",
    averageVerificationsPerFile: 0
  });

  // Update stats based on current mode
  useEffect(() => {
    const updateStats = async () => {
      if (currentMode === "demo") {
        const demoStats = calculateDemoStats();
        setStats(demoStats);
      } else if (currentMode === "blockchain" && connected) {
        try {
          const blockchainStats = await calculateBlockchainStats();
          setStats(blockchainStats);
        } catch (error) {
          console.error("Error fetching blockchain stats:", error);
          // Fallback to empty stats
          setStats({
            totalFiles: 0,
            totalVerifications: 0,
            filesInDatabase: 0,
            successRate: "0%",
            averageVerificationsPerFile: 0
          });
        }
      }
    };

    updateStats();
    
    // Listen for storage changes (demo mode)
    const handleStorageChange = () => {
      if (currentMode === "demo") {
        updateStats();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes periodically
    const interval = setInterval(updateStats, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentMode, connected]);

  // Listen for mode changes from the FileHashVerifierWithModes component
  useEffect(() => {
    const handleModeChange = (event: CustomEvent) => {
      setCurrentMode(event.detail.mode);
    };

    window.addEventListener('modeChanged', handleModeChange as EventListener);
    return () => window.removeEventListener('modeChanged', handleModeChange as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-github-dark">
      {/* Modern GitHub-style header */}
      <ModernHeader mode={currentMode} />
      
      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${currentMode === "demo" ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500"} rounded-2xl flex items-center justify-center shadow-2xl`}>
                {currentMode === "demo" ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
              {currentMode === "demo" ? "Demo File Hash Verifier" : "Blockchain File Hash Verifier"}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {currentMode === "demo" 
                ? "Test file hash verification in your browser. Perfect for learning and experimentation with zero cost."
                : "Secure your files with cryptographic hashes on the Aptos blockchain. Verify integrity, prevent tampering, and build trust in your digital assets."
              }
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              {currentMode === "demo" ? (
                <>
                  <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Demo Mode Active
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                    Zero Cost Testing
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    Blockchain Mode Active
                  </div>
                  <div className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
                    Real Aptos Network
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats Dashboard */}
          <ModernStatsDashboard stats={stats} mode={currentMode} />

          {/* Main File Hash Verifier with Mode Toggle */}
                    {/* Main File Hash Verifier with Mode Selection */}
          <div className="card-3d p-8">
            <FileHashVerifierWithModes />
          </div>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-gray-800">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <span>Powered by Aptos Blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <span>SHA-256 Cryptographic Hashing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>Immutable Storage</span>
              </div>
            </div>
            <p className="text-gray-500 mt-4">
              Built with ❤️ for secure file verification
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
