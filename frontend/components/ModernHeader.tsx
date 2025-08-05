import { WalletSelector } from "./WalletSelector";
import { Github, Zap, Shield, FileCheck, Database, Wallet } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface ModernHeaderProps {
  mode: "demo" | "blockchain";
}

export function ModernHeader({ mode }: ModernHeaderProps) {
  const { connected } = useWallet();

  const getBadges = () => {
    if (mode === "demo") {
      return (
        <>
          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full font-medium border border-blue-500/30">
            Demo Mode
          </span>
          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded-full font-medium border border-green-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Free Testing
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full font-medium border border-purple-500/30 flex items-center gap-1">
            <Database className="w-3 h-3" />
            Blockchain Mode
          </span>
          {connected ? (
            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded-full font-medium border border-green-500/30 flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              Connected
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-300 rounded-full font-medium border border-orange-500/30 flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              Connect Wallet
            </span>
          )}
        </>
      );
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <FileCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FileHash Verifier
              </h1>
              <div className="flex items-center gap-2">
                {getBadges()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-muted-foreground hover:text-accent transition-colors">
            Features
          </a>
          <a href="#demo" className="text-muted-foreground hover:text-accent transition-colors">
            Demo
          </a>
          <a href="#docs" className="text-muted-foreground hover:text-accent transition-colors">
            Docs
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            title="View on GitHub"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          <WalletSelector />
        </div>
      </div>
    </header>
  );
}
