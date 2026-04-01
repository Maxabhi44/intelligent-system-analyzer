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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ padding: "var(--space-xl)" }}
    >
      <div style={{ maxWidth: "var(--content-max-w)", width: "100%" }}>

        {/* ── Idle State ── */}
        {!isScanning && !complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className="glass-card rounded-3xl"
              style={{ padding: "var(--space-2xl)" }}
            >
              {/* Icon */}
              <div
                className="mx-auto bg-blue-500/20 rounded-3xl flex items-center justify-center"
                style={{
                  width: "var(--circle-size)",
                  height: "var(--circle-size)",
                  marginBottom: "var(--space-md)",
                }}
              >
                <Search
                  style={{
                    width: "var(--icon-xl)",
                    height: "var(--icon-xl)",
                  }}
                  className="text-blue-400"
                />
              </div>

              <h2
                className="font-semibold text-white"
                style={{
                  fontSize: "var(--text-hero)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                Ready to Scan
              </h2>
              <p
                className="text-white/60"
                style={{
                  fontSize: "var(--text-lg)",
                  marginBottom: "var(--space-lg)",
                }}
              >
                ISA will intelligently analyze your system to find optimization
                opportunities
              </p>

              <button
                onClick={startScan}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                style={{
                  paddingLeft: "var(--space-xl)",
                  paddingRight: "var(--space-xl)",
                  paddingTop: "var(--btn-py)",
                  paddingBottom: "var(--btn-py)",
                  fontSize: "var(--text-base)",
                }}
              >
                Start Smart Scan
              </button>

              {/* Scan type cards */}
              <div
                className="grid grid-cols-3"
                style={{
                  gap: "var(--space-sm)",
                  marginTop: "var(--space-lg)",
                }}
              >
                <ScanType icon={FileText} label="Junk Files" />
                <ScanType icon={Package} label="Large Files" />
                <ScanType icon={FolderOpen} label="Old Files" />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Scanning State ── */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl"
            style={{ padding: "var(--space-2xl)" }}
          >
            <div
              className="text-center"
              style={{ marginBottom: "var(--space-lg)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto"
                style={{
                  width: "var(--circle-size)",
                  height: "var(--circle-size)",
                  marginBottom: "var(--space-md)",
                }}
              >
                <Search
                  style={{ width: "100%", height: "100%" }}
                  className="text-blue-400"
                />
              </motion.div>

              <h2
                className="font-semibold text-white"
                style={{
                  fontSize: "var(--text-xl)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Analyzing your system intelligently...
              </h2>
              <p
                className="text-white/50"
                style={{ fontSize: "var(--text-sm)" }}
              >
                This may take a few moments
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: "var(--space-lg)" }}>
              <div
                className="flex justify-between text-white/60"
                style={{
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-xs)",
                }}
              >
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
            <div
              className="grid grid-cols-2"
              style={{
                gap: "var(--space-md)",
                marginBottom: "var(--space-md)",
              }}
            >
              <StatBox label="Files Scanned" value={filesScanned.toLocaleString()} />
              <StatBox label="Junk Detected" value={`${junkDetected} items`} color="blue" />
            </div>

            {/* Current File */}
            <div
              className="bg-white/5 rounded-2xl"
              style={{ padding: "var(--space-sm)" }}
            >
              <div
                className="text-white/40"
                style={{
                  fontSize: "var(--text-xs)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Currently scanning:
              </div>
              <div
                className="text-white/60 font-mono truncate"
                style={{ fontSize: "var(--text-sm)" }}
              >
                {currentFile}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Complete State ── */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl text-center"
            style={{ padding: "var(--space-2xl)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto bg-green-500/20 rounded-3xl flex items-center justify-center"
              style={{
                width: "var(--circle-size)",
                height: "var(--circle-size)",
                marginBottom: "var(--space-md)",
              }}
            >
              <CheckCircle2
                style={{
                  width: "var(--icon-xl)",
                  height: "var(--icon-xl)",
                }}
                className="text-green-400"
              />
            </motion.div>

            <h2
              className="font-semibold text-white"
              style={{
                fontSize: "var(--text-hero)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Scan Complete!
            </h2>
            <p
              className="text-white/60"
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-lg)",
              }}
            >
              Found {junkDetected} optimization opportunities
            </p>

            {/* Result Cards */}
            <div
              className="grid grid-cols-2"
              style={{
                gap: "var(--space-sm)",
                marginBottom: "var(--space-lg)",
              }}
            >
              <div
                className="glass-card rounded-2xl"
                style={{ padding: "var(--card-padding)" }}
              >
                <div
                  className="font-bold text-blue-400"
                  style={{
                    fontSize: "var(--text-hero)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  2.3 GB
                </div>
                <div
                  className="text-white/60"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Can be cleaned
                </div>
              </div>
              <div
                className="glass-card rounded-2xl"
                style={{ padding: "var(--card-padding)" }}
              >
                <div
                  className="font-bold text-purple-400"
                  style={{
                    fontSize: "var(--text-hero)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  {filesScanned.toLocaleString()}
                </div>
                <div
                  className="text-white/60"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Files analyzed
                </div>
              </div>
            </div>

            <button
              onClick={() => setComplete(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              style={{
                paddingLeft: "var(--space-xl)",
                paddingRight: "var(--space-xl)",
                paddingTop: "var(--btn-py)",
                paddingBottom: "var(--btn-py)",
                fontSize: "var(--text-base)",
              }}
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
    <div
      className="bg-white/5 rounded-2xl text-center"
      style={{ padding: "var(--space-sm)" }}
    >
      <Icon
        style={{
          width: "var(--icon-lg)",
          height: "var(--icon-lg)",
          margin: "0 auto",
          marginBottom: "var(--space-xs)",
        }}
        className="text-white/40"
      />
      <div
        className="text-white/60"
        style={{ fontSize: "var(--text-xs)" }}
      >
        {label}
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "white" }: any) {
  const colorClass = color === "blue" ? "text-blue-400" : "text-white";

  return (
    <div
      className="glass-card rounded-2xl"
      style={{ padding: "var(--card-padding)" }}
    >
      <div
        className={`font-bold ${colorClass}`}
        style={{
          fontSize: "var(--text-hero)",
          marginBottom: "var(--space-xs)",
        }}
      >
        {value}
      </div>
      <div
        className="text-white/60"
        style={{ fontSize: "var(--text-sm)" }}
      >
        {label}
      </div>
    </div>
  );
}