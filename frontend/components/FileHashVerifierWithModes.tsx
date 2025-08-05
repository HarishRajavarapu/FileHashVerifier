import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileHashVerifierDemo } from "@/components/FileHashVerifierDemo";
import { BlockchainFileHashVerifier } from "@/components/BlockchainFileHashVerifier";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { 
  Zap, 
  Database, 
  TestTube, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle
} from "lucide-react";

type Mode = "demo" | "blockchain";

export function FileHashVerifierWithModes() {
  const [mode, setMode] = useState<Mode>("demo");
  const { connected } = useWallet();

  // Emit mode change events for the parent App component
  useEffect(() => {
    const event = new CustomEvent('modeChanged', { detail: { mode } });
    window.dispatchEvent(event);
  }, [mode]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <div className="card-3d p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Choose Your Mode
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select how you want to use the File Hash Verifier. Demo mode is perfect for testing, 
            while blockchain mode provides permanent, immutable storage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo Mode Card */}
          <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            mode === "demo" 
              ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" 
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          }`} onClick={() => handleModeChange("demo")}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              {mode === "demo" && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2">Demo Mode</h3>
            <p className="text-muted-foreground mb-4">
              Test the functionality locally in your browser. Perfect for learning and experimentation.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free to use - no costs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Instant feedback</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Local storage only</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Data clears on browser reset</span>
              </div>
            </div>

            <Button 
              variant={mode === "demo" ? "default" : "outline"}
              className="w-full"
              onClick={() => handleModeChange("demo")}
            >
              {mode === "demo" ? "Currently Selected" : "Switch to Demo Mode"}
            </Button>
          </div>

          {/* Blockchain Mode Card */}
          <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            mode === "blockchain" 
              ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20" 
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          }`} onClick={() => handleModeChange("blockchain")}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              {mode === "blockchain" && (
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2">Blockchain Mode</h3>
            <p className="text-muted-foreground mb-4">
              Store and verify files on the real Aptos blockchain. Transactions will appear in your Petra wallet and Aptos explorer.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real Aptos blockchain</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Petra wallet integration</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Aptos explorer viewable</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Requires gas fees</span>
              </div>
            </div>

            <Button 
              variant={mode === "blockchain" ? "default" : "outline"}
              className="w-full"
              onClick={() => handleModeChange("blockchain")}
              disabled={mode === "blockchain" && !connected}
            >
              {mode === "blockchain" ? "Currently Selected" : 
               !connected ? "Connect Wallet First" : "Switch to Blockchain Mode"}
            </Button>
          </div>
        </div>

        {/* Mode Benefits Comparison */}
        <div className="mt-8 p-6 bg-muted/20 rounded-xl">
          <h4 className="font-semibold mb-4 text-center">Quick Comparison</h4>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h5 className="font-medium mb-1">Speed</h5>
              <p className="text-muted-foreground">Demo: Instant | Blockchain: ~3-5 seconds</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h5 className="font-medium mb-1">Security</h5>
              <p className="text-muted-foreground">Demo: Local | Blockchain: Real Aptos Network</p>
            </div>
            <div className="text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h5 className="font-medium mb-1">Accessibility</h5>
              <p className="text-muted-foreground">Demo: Browser Only | Blockchain: Global Network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Mode Display */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/20 rounded-xl">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          mode === "demo" ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-400"
        }`}>
          <TestTube className="w-4 h-4" />
          <span className="font-medium">Demo Mode</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          mode === "blockchain" ? "bg-purple-500/20 text-purple-400" : "bg-gray-700 text-gray-400"
        }`}>
          <Database className="w-4 h-4" />
          <span className="font-medium">Blockchain Mode</span>
        </div>
      </div>

      {/* Render Active Component */}
      {mode === "demo" ? (
        <FileHashVerifierDemo />
      ) : (
        <BlockchainFileHashVerifier />
      )}
    </div>
  );
}
