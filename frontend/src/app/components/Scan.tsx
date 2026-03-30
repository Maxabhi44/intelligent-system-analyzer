import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, FileText, Package, FolderOpen, CheckCircle2 } from "lucide-react";

export function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesScanned, setFilesScanned] = useState(0);
  const [junkDetected, setJunkDetected] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [complete, setComplete] = useState(false);

  const sampleFiles = [
    "/System/Library/Caches/com.apple.Safari",
    "/Users/Desktop/Downloads/temp_file_2024.tmp",
    "/Applications/Xcode.app/build/cache",
    "/Users/Library/Logs/diagnostic.log",
    "/var/folders/temp/session_data",
  ];

  useEffect(() => {
    if (isScanning && progress < 100) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            setIsScanning(false);
            setComplete(true);
            return 100;
          }
          return next;
        });

        setFilesScanned((prev) => prev + Math.floor(Math.random() * 15) + 5);
        setJunkDetected((prev) => prev + Math.floor(Math.random() * 3));
        setCurrentFile(sampleFiles[Math.floor(Math.random() * sampleFiles.length)]);
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isScanning, progress]);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setFilesScanned(0);
    setJunkDetected(0);
    setComplete(false);
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {!isScanning && !complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="glass-card p-12 rounded-3xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-500/20 rounded-3xl flex items-center justify-center">
                <Search className="w-12 h-12 text-blue-400" />
              </div>
              
              <h2 className="text-3xl font-semibold text-white mb-4">
                Ready to Scan
              </h2>
              <p className="text-white/60 text-lg mb-8">
                ISA will intelligently analyze your system to find optimization opportunities
              </p>

              <button
                onClick={startScan}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
              >
                Start Smart Scan
              </button>

              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <ScanType icon={FileText} label="Junk Files" />
                <ScanType icon={Package} label="Large Files" />
                <ScanType icon={FolderOpen} label="Old Files" />
              </div>
            </div>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-3xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <Search className="w-20 h-20 text-blue-400" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold text-white mb-2">
                Analyzing your system intelligently...
              </h2>
              <p className="text-white/50">This may take a few moments</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <StatBox label="Files Scanned" value={filesScanned.toLocaleString()} />
              <StatBox label="Junk Detected" value={`${junkDetected} items`} color="blue" />
            </div>

            {/* Current File */}
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-xs text-white/40 mb-1">Currently scanning:</div>
              <div className="text-white/60 text-sm font-mono truncate">{currentFile}</div>
            </div>
          </motion.div>
        )}

        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-3xl flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </motion.div>

            <h2 className="text-3xl font-semibold text-white mb-4">
              Scan Complete!
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Found {junkDetected} optimization opportunities
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold text-blue-400 mb-2">2.3 GB</div>
                <div className="text-white/60 text-sm">Can be cleaned</div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold text-purple-400 mb-2">{filesScanned.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Files analyzed</div>
              </div>
            </div>

            <button
              onClick={() => setComplete(false)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              View Results
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ScanType({ icon: Icon, label }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl">
      <Icon className="w-6 h-6 text-white/40 mx-auto mb-2" />
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}

function StatBox({ label, value, color = "white" }: any) {
  const colorClass = color === "blue" ? "text-blue-400" : "text-white";
  
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className={`text-3xl font-bold ${colorClass} mb-2`}>{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}
