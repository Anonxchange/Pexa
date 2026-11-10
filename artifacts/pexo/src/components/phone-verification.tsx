import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CountryCodeSelector } from "./country-code-selector";
import { getCountryByPhoneCode } from "@/lib/localization";

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onSkip?: () => void;
  initialPhone?: string;
  initialCountryCode?: string;
}

export function PhoneVerification({ onVerified, onSkip, initialPhone = "", initialCountryCode = "+234" }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const fullPhoneNumber = countryCode + phoneNumber;
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });
      
      if (error) throw error;
      
      setCodeSent(true);
      toast({
        title: "Code sent!",
        description: `Verification code sent to ${fullPhoneNumber}`,
      });
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) return;

    try {
      setLoading(true);
      
      const fullPhoneNumber = countryCode + phoneNumber;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: verificationCode,
        type: 'sms',
      });
      
      if (error) throw error;

      // Determine country from phone code
      const countryFromPhone = getCountryByPhoneCode(countryCode);

      // Update user profile to mark phone as verified and update country
      if (data.user) {
        const updateData: any = {
          id: data.user.id,
          phone: fullPhoneNumber,
          phone_verified: true,
        };

        // Update country based on phone code, but leave preferred_currency
        // alone — new accounts default to USD and the user can switch to
        // their local currency from settings/header at any time.
        if (countryFromPhone) {
          updateData.country = countryFromPhone.name;
        }

        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert(updateData, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
      
      const successMessage = countryFromPhone 
        ? `Phone number verified! Your country has been set to ${countryFromPhone.name}.`
        : "Phone number verified successfully";
      
      toast({
        title: "Success!",
        description: successMessage,
      });
      
      onVerified(fullPhoneNumber);
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast({
        title: "Error",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!codeSent ? (
        <>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We'll send a 6-digit verification code to your phone number via SMS.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Country Code</Label>
            <CountryCodeSelector value={countryCode} onChange={setCountryCode} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 py-2 border rounded-md bg-muted h-12">
                <span className="text-sm font-medium">{countryCode}</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                className="flex-1 h-12"
              />
            </div>
          </div>
          
          <Button
            onClick={sendVerificationCode}
            disabled={!phoneNumber || loading}
            className="w-full h-12"
          >
            {loading ? "Sending code..." : "Send Verification Code"}
          </Button>
        </>
      ) : (
        <>
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg mb-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Verification code sent to <strong>{countryCode}{phoneNumber}</strong>
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Please check your SMS messages for the 6-digit code.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code" className="text-base font-semibold">Enter Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              disabled={loading}
              maxLength={6}
              className="h-14 text-center text-3xl tracking-[0.5em] font-mono"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setVerificationCode("");
                }}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                Resend Code
              </button>
            </p>
          </div>
          
          <Button
            onClick={verifyCode}
            disabled={!verificationCode || verificationCode.length !== 6 || loading}
            className="w-full h-12"
          >
            {loading ? "Verifying..." : "Verify & Link Phone Number"}
          </Button>
        </>
      )}
      
      {onSkip && (
        <Button
          variant="ghost"
          onClick={onSkip}
          className="w-full"
          disabled={loading}
        >
          Skip for now
        </Button>
      )}
    </div>
  );
}
