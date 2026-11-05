import { useState } from 'react'
import {
  MessageSquare,
  QrCode,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Zap,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react'
import { WhatsAppConnectIllustration } from '../OnboardingIllustrations'
import { Input, FormGroup, Label } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { useOnboarding } from '@/context/OnboardingContext'
import { useToast } from '@/components/ui/Toast'

export function Step2WhatsAppConnect() {
  const { state, updateWhatsApp, testWhatsAppPing, verifyWhatsAppOtp } = useOnboarding()
  const { whatsapp } = state
  const { toast } = useToast()

  const [method, setMethod] = useState<'qr' | 'otp'>(whatsapp.verificationMethod)
  const [otpDigits, setOtpDigits] = useState(['9', '8', '2', '', '', ''])
  const [testingPing, setTestingPing] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const handlePing = async () => {
    setTestingPing(true)
    const result = await testWhatsAppPing()
    setTestingPing(false)
    if (result.success) {
      toast({
        type: 'success',
        title: 'Meta Cloud API Connected',
        description: `Webhook responded with HTTP 200 (${result.latency}ms latency). Ready for live WhatsApp traffic.`,
      })
    }
  }

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = clean
    setOtpDigits(next)

    // Auto-advance to next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      nextInput?.focus()
    }

    const fullCode = next.join('')
    if (fullCode.length === 6) {
      verifyWhatsAppOtp(fullCode)
      toast({
        type: 'success',
        title: 'Phone Number Verified',
        description: 'Meta WABA identity confirmed with 2-step verification code.',
      })
    }
  }

  const handleAutoFillTestPin = () => {
    const testCode = ['9', '8', '2', '1', '0', '4']
    setOtpDigits(testCode)
    verifyWhatsAppOtp('982104')
    toast({
      type: 'success',
      title: 'Test PIN Verified',
      description: 'Phone +1 (555) 019-9201 successfully verified with Meta Cloud API.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      {/* Header with illustration */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-100">
        <WhatsAppConnectIllustration className="shrink-0" />
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
            Step 2 of 4 • Channel Integration
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Connect Official WhatsApp Cloud API
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Link your Meta Business Account to receive high-speed customer messages, send automated delivery updates, and run AI copilot chats.
          </p>
        </div>
      </div>

      {/* Main Connection Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-left">
        {/* Live Status Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <MessageSquare size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Meta WABA Status:</span>
                {whatsapp.status === 'connected' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                    <CheckCircle2 size={12} /> Connected & Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {whatsapp.healthLatencyMs
                  ? `Active Ping: ${whatsapp.healthLatencyMs}ms latency • Tier 2 (10k/day)`
                  : 'Ready for initial ping test'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            loading={testingPing}
            onClick={handlePing}
            leftIcon={<RefreshCw size={13} className={testingPing ? 'animate-spin' : ''} />}
          >
            Test Connection Ping
          </Button>
        </div>

        {/* Business Phone & Verified Display Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="waPhone">WhatsApp Business Number</Label>
              <InfoTooltip content="The phone number registered with Meta Cloud API. Customers will see this number when messaging your business on WhatsApp." />
            </div>
            <div className="relative">
              <Input
                id="waPhone"
                value={whatsapp.phoneNumber}
                onChange={(e) => updateWhatsApp({ phoneNumber: e.target.value })}
                placeholder="+1 (555) 019-9201"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={14} /> Meta Verified
              </span>
            </div>
          </FormGroup>

          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="verifiedName">Meta Verified Display Name</Label>
              <InfoTooltip content="Official green-badge business name vetted and approved by Meta Business Manager." />
            </div>
            <Input
              id="verifiedName"
              value={whatsapp.verifiedName}
              onChange={(e) => updateWhatsApp({ verifiedName: e.target.value })}
              placeholder="Acme Retail Official Support"
              required
            />
          </FormGroup>
        </div>

        {/* Verification Method Tabs */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Label>Number Verification Method</Label>
              <InfoTooltip content="Verify your number via Meta QR handshake or SMS 6-digit OTP code." />
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setMethod('qr')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  method === 'qr'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                QR Code Link
              </button>
              <button
                type="button"
                onClick={() => setMethod('otp')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  method === 'otp'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6-Digit PIN Code
              </button>
            </div>
          </div>

          {method === 'qr' ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-5">
              {/* Simulated QR Code */}
              <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-300/80 shadow-xs flex items-center justify-center shrink-0 relative group">
                <div className="w-full h-full bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-2 border-white rounded-sm p-0.5">
                      <div className="w-full h-full bg-white" />
                    </div>
                    <div className="w-6 h-6 border-2 border-white rounded-sm p-0.5">
                      <div className="w-full h-full bg-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-2 border-white rounded-sm p-0.5">
                      <div className="w-full h-full bg-white" />
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Zap size={14} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-left space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-slate-500" />
                  Scan with WhatsApp on your phone
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Open WhatsApp on your device &gt; Settings &gt; Linked Devices &gt; Link a Device. Scan this QR code to authenticate with your Meta sandbox credentials.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Sandbox Handshake Active
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter the 6-digit verification security code sent to {whatsapp.phoneNumber} by Meta:
              </p>

              <div className="flex items-center gap-2 justify-center py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-mono font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Didn't receive SMS?</span>
                <button
                  type="button"
                  onClick={handleAutoFillTestPin}
                  className="text-xs text-violet-600 hover:text-violet-700 font-semibold underline underline-offset-2"
                >
                  ⚡ Auto-fill Test PIN (982-104)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Webhook & Token Credentials (read-only preview) */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Cloud API Webhook Callback URL</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Listening
            </span>
          </div>
          <div className="p-2 rounded bg-slate-800 text-slate-200 text-[11px] break-all select-all">
            {whatsapp.webhookUrl}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Verify Token: <code className="text-violet-300">{whatsapp.verifyToken}</code></span>
            <span>WABA ID: <code className="text-slate-300">{whatsapp.wabaAccountId}</code></span>
          </div>
        </div>
      </div>
    </div>
  )
}
