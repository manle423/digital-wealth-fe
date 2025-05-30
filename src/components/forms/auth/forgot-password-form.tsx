"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"forgot" | "reset">("forgot");
  const [message, setMessage] = useState<string>("");
  const { isLoading } = useAuth();
  const router = useRouter();
  const [savedEmail, setSavedEmail] = useState<string>("");

  const forgotForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      token: "",
      newPassword: "",
    },
  });

  async function onForgotSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      const response = await authService.forgotPassword(values.email);
      
      setMessage(response.message || "If your email exists in our system, you will receive a password reset OTP.");
      if (response.success) {
        setSavedEmail(values.email);
        setStep("reset");
        resetForm.reset({
          email: values.email,
          token: "",
          newPassword: "",
        });
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  }

  async function onResetSubmit(values: ResetPasswordForm) {
    try {
      // Ensure we're using the saved email
      const response = await authService.resetPassword(
        savedEmail || values.email,
        values.token,
        values.newPassword
      );
      
      setMessage(response.message || "Password has been reset successfully");
      if (response.success) {
        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="space-y-4 w-full max-w-[600px]">
      {message && (
        <p className="text-sm font-medium text-center mb-4">
          {message}
        </p>
      )}
      
      {step === "forgot" ? (
        <Form {...forgotForm}>
          <form
            onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
            className="space-y-4"
          >
            <FormField
              control={forgotForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Gửi mã xác nhận"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
            className="space-y-4"
          >
            <div className="text-sm text-muted-foreground mb-4">
              Mã Token đã được gửi đến email: <strong>{savedEmail}</strong>
            </div>
            
            <FormField
              control={resetForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã Token</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập mã Token được gửi đến email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        console.log('Token changed:', e.target.value); // Debug log
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep("forgot");
                  setMessage("");
                }}
              >
                Quay lại
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
} 