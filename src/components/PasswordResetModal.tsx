import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, RefreshCw, AlertCircle, ShieldCheck, KeyRound } from "lucide-react";
import { supabase } from "../lib/supabase";

interface PasswordResetModalProps {
  onComplete: () => void;
}

export default function PasswordResetModal({ onComplete }: PasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("[SUPABASE PASSWORD UPDATE ERROR]", error);
        setErrorMessage(error.message || "Failed to update password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("[PASSWORD RESET EXCEPTION]", err);
      setErrorMessage(err?.message || "An unexpected error occurred while updating password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#231a0a]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#dac1c1]/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-50 text-[#95491a] rounded-2xl flex items-center justify-center border border-amber-200 shadow-inner">
            <KeyRound size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#40010d]">Reset Admin Password</h2>
            <p className="text-xs text-[#544243] font-medium">
              Enter your new password to regain admin access.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="space-y-5 bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-emerald-900">Password Updated Successfully!</h3>
              <p className="text-xs text-emerald-800 font-medium">
                Your Supabase account password has been updated. You can now log into the Admin Portal using your new password.
              </p>
            </div>
            <button
              onClick={onComplete}
              className="w-full bg-[#40010d] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#7a2c35] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <ShieldCheck size={16} /> Go to Admin Portal Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#544243] flex items-center gap-1.5">
                <Lock size={13} className="text-[#95491a]" /> NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Enter new password (min. 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:ring-1 focus:ring-[#fd9b65] rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none font-bold text-[#40010d]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95491a] hover:text-[#7a2c35] p-1 transition-colors cursor-pointer"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#544243] flex items-center gap-1.5">
                <Lock size={13} className="text-[#95491a]" /> CONFIRM NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:ring-1 focus:ring-[#fd9b65] rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none font-bold text-[#40010d]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95491a] hover:text-[#7a2c35] p-1 transition-colors cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#40010d] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#7a2c35] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Updating Password...
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Save New Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
