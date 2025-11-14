import { useState } from "react"
import { X, ChevronRight, ChevronLeft, Download, CheckCircle2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MetaMaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    id: 1,
    title: "Install MetaMask",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          MetaMask is a browser extension that allows you to interact with the blockchain. Follow these steps to install it:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
          <li>Click the button below to visit the official MetaMask website</li>
          <li>Click "Download" and select your browser (Chrome, Firefox, Brave, or Edge)</li>
          <li>Click "Install MetaMask" on the Chrome Web Store or your browser's extension store</li>
          <li>Click "Add to Chrome" (or your browser) and confirm the installation</li>
        </ol>
        <a
          href="https://metamask.io/download"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg"
        >
          <Download size={20} />
          Download MetaMask
          <ExternalLink size={16} />
        </a>
      </div>
    ),
  },
  {
    id: 2,
    title: "Create Your Wallet",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          After installing MetaMask, you'll need to create a new wallet or import an existing one:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
          <li>Click the MetaMask extension icon in your browser toolbar</li>
          <li>Click "Get Started"</li>
          <li>Choose "Create a Wallet" (or "Import Wallet" if you have a seed phrase)</li>
          <li>Create a strong password (8+ characters)</li>
          <li>Write down your Secret Recovery Phrase and store it safely</li>
          <li>Confirm your recovery phrase by selecting the words in order</li>
        </ol>
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-accent mb-2">⚠️ Important Security Tip</p>
          <p className="text-xs text-muted-foreground">
            Never share your Secret Recovery Phrase with anyone. Store it in a safe place offline.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Add Polygon Network",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Afriverse uses the Polygon network. Add it to your MetaMask:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
          <li>Open MetaMask and click the network dropdown (usually shows "Ethereum Mainnet")</li>
          <li>Click "Add Network" or "Add a network manually"</li>
          <li>Enter these details for Polygon Mumbai Testnet:</li>
        </ol>
        <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
          <div><span className="font-semibold">Network Name:</span> Polygon Mumbai</div>
          <div><span className="font-semibold">RPC URL:</span> https://rpc-mumbai.maticvigil.com</div>
          <div><span className="font-semibold">Chain ID:</span> 80001</div>
          <div><span className="font-semibold">Currency Symbol:</span> MATIC</div>
          <div><span className="font-semibold">Block Explorer:</span> https://mumbai.polygonscan.com</div>
        </div>
        <p className="text-xs text-muted-foreground">
          Click "Save" to add the network to your MetaMask.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Connect to Afriverse",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Now you're ready to connect your wallet to Afriverse:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
          <li>Make sure you're on the Polygon Mumbai network in MetaMask</li>
          <li>Return to Afriverse and click "Connect Wallet"</li>
          <li>MetaMask will open a popup asking you to connect</li>
          <li>Review the permissions and click "Next"</li>
          <li>Click "Connect" to approve the connection</li>
        </ol>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-primary mb-2">✓ You're All Set!</p>
          <p className="text-xs text-muted-foreground">
            Once connected, you'll be able to mint your creative works and interact with the blockchain.
          </p>
        </div>
      </div>
    ),
  },
]

export default function MetaMaskModal({ isOpen, onClose }: MetaMaskModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  if (!isOpen) return null

  const currentStepData = steps.find((s) => s.id === currentStep) || steps[0]
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === steps.length

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Connect MetaMask Wallet</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-300 ease-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-muted/30">
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        step.id <= currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    {index < steps.length - 1 && (
                      <div
                        className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                          step.id < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{currentStepData.title}</h3>
              </div>
              <div className="text-foreground">{currentStepData.content}</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step.id === currentStep ? "bg-primary w-8" : step.id < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {isLastStep ? (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg"
                >
                  <CheckCircle2 size={20} />
                  Got it!
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

