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
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { loginSchema } from "@/schemas/auth.schema";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const result = await login(values.email, values.password);
    
    if (result.success) {
      router.push("/");
      return;
    }
    
    if (result.errorMessage) {
      if (result.errorMessage === "INVALID_CREDENTIALS") {
        form.setError("email", { 
          type: "manual", 
          message: "INVALID_CREDENTIALS" 
        });
        form.setError("password", { 
          type: "manual", 
          message: "INVALID_CREDENTIALS" 
        });
      } else {
        form.setError("root", { 
          type: "manual", 
          message: result.errorMessage 
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-[600px] flex-shrink-0"
      >
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <FormField
          control={form.control}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
}
