import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from '@/lib/icons';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDark?: boolean;
  defaultEmail?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  isDark = false,
  defaultEmail = "",
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState<"input" | "sent">("input");
  const { toast } = useToast();

  const handleClose = (next: boolean) => {
    if (isSending) return; // don't close mid-request
    if (!next) {
      // reset on close so reopening starts fresh
      setStep("input");
      setEmail(defaultEmail);
    }
    onOpenChange(next);
  };

  const handleSend = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo,
      });

      // Per security best practice, do NOT reveal whether the email exists.
      // Always show the same success state regardless of result.
      if (error && error.status && error.status >= 500) {
        // Only surface genuine server errors to the user
        throw error;
      }

      setStep("sent");
    } catch (err: any) {
      toast({
        title: "Could not send reset email",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-md w-[92vw] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl ${
          isDark ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <div className="px-7 pt-7 pb-6">
          {step === "input" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <DialogHeader className="space-y-3 text-center">
                <div
                  className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-lime-500/15" : "bg-lime-100"
                  }`}
                >
                  <Mail className={`h-6 w-6 ${isDark ? "text-lime-400" : "text-lime-600"}`} />
                </div>
                <DialogTitle
                  className={`text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Reset your password
                </DialogTitle>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Enter the email associated with your account and we&apos;ll send
                  you a secure link to create a new password.
                </p>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSending) handleSend();
                  }}
                  className={`h-12 rounded-xl text-base px-4 ${
                    isDark
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                  }`}
                  disabled={isSending}
                  data-testid="input-forgot-email"
                />
                <Button
                  className="w-full h-12 rounded-xl bg-lime-500 hover:bg-lime-600 text-black font-semibold text-base"
                  onClick={handleSend}
                  disabled={isSending}
                  data-testid="button-send-reset"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  disabled={isSending}
                  className={`w-full flex items-center justify-center gap-1.5 text-sm py-2 transition-opacity hover:opacity-80 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </button>
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div
                className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-emerald-500/15" : "bg-emerald-100"
                }`}
              >
                <CheckCircle2
                  className={`h-8 w-8 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                />
              </div>
              <div className="space-y-2">
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                  Check your inbox
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  If an account exists for <span className="font-semibold">{email}</span>,
                  we&apos;ve sent a password reset link. The link expires in 1 hour.
                </p>
              </div>
              <div
                className={`text-xs px-4 py-3 rounded-xl text-left ${
                  isDark ? "bg-zinc-800 text-gray-400" : "bg-gray-50 text-gray-600"
                }`}
              >
                <p className="font-semibold mb-1">Didn&apos;t get the email?</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure the email address is correct</li>
                  <li>Wait a minute — emails can be delayed</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => setStep("input")}
                >
                  Try another email
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl bg-lime-500 hover:bg-lime-600 text-black font-semibold"
                  onClick={() => handleClose(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
