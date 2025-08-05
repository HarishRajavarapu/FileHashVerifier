import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ModernFileUpload } from "@/components/ModernFileUpload";
import { ModernFileList } from "@/components/ModernFileList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, CheckCircle, AlertCircle, FileCheck, FileX, Calendar, User } from "lucide-react";

// Demo mode - simulate FileRecord type
type DemoFileRecord = {
  file_name: string;
  file_hash: number[];
  uploader: string;
  timestamp: string;
  verification_count: string;
};

export function FileHashVerifierDemo() {
  const { account } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [verifyFileName, setVerifyFileName] = useState("");
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [allFiles, setAllFiles] = useState<DemoFileRecord[]>([]);
  const [isStoring, setIsStoring] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Verification result modal state
  const [showVerificationResult, setShowVerificationResult] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    fileName: string;
    originalName?: string;
    uploadDate?: string;
    uploader?: string;
    message: string;
  } | null>(null);

  // Demo mode - store files in localStorage
  const DEMO_STORAGE_KEY = "file_hash_verifier_demo_files";

  // Function to calculate SHA-256 hash of a file
  const calculateFileHash = useCallback(async (file: File): Promise<Uint8Array> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return new Uint8Array(hashBuffer);
  }, []);

  // Function to convert Uint8Array to hex string
  const uint8ArrayToHex = useCallback((array: Uint8Array): string => {
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }, []);

  // Load demo files from localStorage
  const loadDemoFiles = useCallback(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        const files = JSON.parse(stored) as DemoFileRecord[];
        setAllFiles(files);
      }
    } catch (error) {
      console.error("Error loading demo files:", error);
    }
  }, []);

  // Save demo files to localStorage
  const saveDemoFiles = useCallback((files: DemoFileRecord[]) => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(files));
      setAllFiles(files);
    } catch (error) {
      console.error("Error saving demo files:", error);
    }
  }, []);

  // Store file hash in demo mode (localStorage)
  const handleStoreFileHash = useCallback(async () => {
    if (!file || !fileName || !fileHash) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file",
      });
      return;
    }

    setIsStoring(true);
    try {
      const hash = await calculateFileHash(file);
      const currentFiles = [...allFiles];
      
      // Check if file already exists
      const existingIndex = currentFiles.findIndex(f => f.file_name === fileName);
      
      const newFile: DemoFileRecord = {
        file_name: fileName,
        file_hash: Array.from(hash),
        uploader: account?.address?.toString() || "demo-user",
        timestamp: Math.floor(Date.now() / 1000).toString(),
        verification_count: "0",
      };

      if (existingIndex >= 0) {
        // Update existing file
        currentFiles[existingIndex] = newFile;
        toast({
          title: "Updated",
          description: `File hash for "${fileName}" updated successfully! (Demo Mode)`,
        });
      } else {
        // Add new file
        currentFiles.push(newFile);
        toast({
          title: "Success",
          description: `File hash for "${fileName}" stored successfully! (Demo Mode)`,
        });
      }

      saveDemoFiles(currentFiles);
      
      // Reset form
      setFile(null);
      setFileName("");
      setFileHash("");
    } catch (error) {
      console.error("Error storing file hash:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to store file hash",
      });
    } finally {
      setIsStoring(false);
    }
  }, [file, fileName, fileHash, calculateFileHash, allFiles, account?.address, saveDemoFiles]);

  // Verify file hash in demo mode - based on content, not filename
  const handleVerifyFileHash = useCallback(async () => {
    if (!verifyFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file for verification",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Calculate hash of the uploaded file
      const hash = await calculateFileHash(verifyFile);
      const hashHex = uint8ArrayToHex(hash);
      
      // Find stored file by matching hash content, not filename
      const storedFile = allFiles.find(f => {
        const storedHashHex = Array.from(f.file_hash)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        return storedHashHex === hashHex;
      });
      
      if (!storedFile) {
        setVerificationResult({
          success: false,
          fileName: verifyFile.name,
          message: "This file content has never been stored in the system. The file may be new, modified, or corrupted."
        });
        setShowVerificationResult(true);
        return;
      }

      // Update verification count for the matched file
      const updatedFiles = allFiles.map(f => 
        f === storedFile 
          ? { ...f, verification_count: (parseInt(f.verification_count) + 1).toString() }
          : f
      );
      saveDemoFiles(updatedFiles);
      
      setVerificationResult({
        success: true,
        fileName: verifyFile.name,
        originalName: storedFile.file_name,
        uploadDate: new Date(parseInt(storedFile.timestamp) * 1000).toLocaleDateString(),
        uploader: storedFile.uploader,
        message: "File content is authentic and matches the stored record!"
      });
      setShowVerificationResult(true);
      
      // Reset form
      setVerifyFile(null);
      setVerifyFileName("");
    } catch (error) {
      console.error("Error verifying file hash:", error);
      setVerificationResult({
        success: false,
        fileName: verifyFile?.name || "Unknown file",
        message: "Failed to verify file hash. Please try again."
      });
      setShowVerificationResult(true);
    } finally {
      setIsVerifying(false);
    }
  }, [verifyFile, allFiles, calculateFileHash, uint8ArrayToHex, saveDemoFiles]);

  // Handle modal close with cleanup
  const handleModalClose = useCallback((open: boolean) => {
    setShowVerificationResult(open);
    if (!open) {
      setVerificationResult(null);
    }
  }, []);

  // Clear all demo data
  // Load demo data on component mount
  useEffect(() => {
    loadDemoFiles();
  }, [loadDemoFiles]);

  return (
    <div className="space-y-8">
      {/* Modern Tabs Interface */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload & Store
          </TabsTrigger>
          <TabsTrigger value="verify" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verify File
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            File Database
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6 mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Store File Hash</h2>
            <p className="text-muted-foreground">
              Upload a file to calculate and store its SHA-256 hash securely
            </p>
          </div>
          
          <ModernFileUpload
            title="Drop files to upload"
            description="Upload a file to calculate and store its SHA-256 hash"
            onFileSelect={async (selectedFile) => {
              setFile(selectedFile);
              setFileName(selectedFile.name);
              try {
                const hash = await calculateFileHash(selectedFile);
                setFileHash(uint8ArrayToHex(hash));
              } catch (error) {
                console.error("Error calculating file hash:", error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to calculate file hash",
                });
              }
            }}
            fileName={fileName}
            fileHash={fileHash}
            onFileNameChange={setFileName}
          />

          {file && fileName && (
            <div className="card-3d p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ready to Store</h3>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Demo Mode
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Name:</span>
                  <span className="font-medium">{fileName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hash Algorithm:</span>
                  <span className="font-medium">SHA-256</span>
                </div>
                {fileHash && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Calculated Hash:</span>
                    <div className="font-mono text-xs bg-muted/50 p-3 rounded-lg border break-all">
                      {fileHash}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleStoreFileHash} 
                disabled={isStoring}
                className="w-full btn-3d"
                size="lg"
              >
                {isStoring ? "Calculating & Storing..." : "Store File Hash (Free)"}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Verify Tab */}
        <TabsContent value="verify" className="space-y-6 mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Verify File Integrity</h2>
            <p className="text-muted-foreground">
              Upload any file to verify its content against stored records
            </p>
          </div>

          <ModernFileUpload
            title="Drop file to verify"
            description="Upload a file to check if its content has been stored before"
            onFileSelect={(selectedFile) => {
              setVerifyFile(selectedFile);
              setVerifyFileName(selectedFile.name);
            }}
            fileName={verifyFileName}
            onFileNameChange={setVerifyFileName}
          />

          {verifyFile && (
            <div className="card-3d p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ready to Verify</h3>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Content-Based Check
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Name:</span>
                  <span className="font-medium">{verifyFile.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">{(verifyFile.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification Method:</span>
                  <span className="font-medium">SHA-256 Content Hash</span>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <strong>Note:</strong> Verification is based on file content, not filename. 
                  Even if the file has been renamed, we can still detect if its content matches any stored record.
                </div>
              </div>

              <Button 
                onClick={handleVerifyFileHash} 
                disabled={isVerifying}
                className="w-full btn-3d"
                size="lg"
                variant="outline"
              >
                {isVerifying ? "Analyzing File Content..." : "Verify File Content (Free)"}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-6 mt-6">
          <ModernFileList 
            files={allFiles} 
            onClearData={() => {
              localStorage.removeItem(DEMO_STORAGE_KEY);
              setAllFiles([]);
              toast({
                title: "Data Cleared",
                description: "All demo files have been removed from local storage.",
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Verification Result Modal */}
      <Dialog open={showVerificationResult} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {verificationResult?.success ? (
                <>
                  <div className="p-2 bg-green-500/20 text-green-400 rounded-full">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  Verification Successful
                </>
              ) : (
                <>
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-full">
                    <FileX className="w-6 h-6" />
                  </div>
                  Verification Failed
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current File:</span>
                  <span className="font-medium">{verificationResult?.fileName}</span>
                </div>
                
                {verificationResult?.success && verificationResult.originalName && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Name:</span>
                      <span className="font-medium">{verificationResult.originalName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Upload Date:
                      </span>
                      <span className="font-medium">{verificationResult.uploadDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Uploader:
                      </span>
                      <span className="font-medium">{verificationResult.uploader}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${verificationResult?.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <p className={`text-sm ${verificationResult?.success ? 'text-green-400' : 'text-red-400'}`}>
                {verificationResult?.message}
              </p>
            </div>

            <Button 
              onClick={() => handleModalClose(false)}
              className="w-full"
              variant={verificationResult?.success ? "default" : "destructive"}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
