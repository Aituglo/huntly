"use client"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading"; 
import { useToast } from "@/components/ui/use-toast"; 
import { useSession } from "next-auth/react";

const emailFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const passwordFormSchema = z.object({
  newPassword: z.string().min(8),
  oldPassword: z.string(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface ProfileFormProps {
  initialData: any | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast(); // Utilisation des toasts
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: session?.user?.email || "", // Set current email from session as default value
      password: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: initialData || {
      newPassword: "",
      oldPassword: "",
    },
  });

  const onSubmitEmail = async (data: { email: string; password: string }) => {
    setEmailLoading(true);
    try {
      const response = await fetch('/api/user/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast({
        variant: result.status === 200 ? "default" : "destructive",
        title: result.message
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update email",
        description: error.toString(),
      });
    }
    setEmailLoading(false);
  };

  const onSubmitPassword = async (data: { oldPassword: string; newPassword: string }) => {
    setPasswordLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast({
        variant: result.status === 200 ? "default" : "destructive",
        title: result.message
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update password",
        description: error.toString(),
      });
    }
    setPasswordLoading(false);
  };

  return (
    <>
      <Heading title="Profile Management" description="Update your email and password" />
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email</FormLabel>
                <Input {...field} placeholder="Enter your new email" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={emailForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <Input {...field} type="password" placeholder="Enter your current password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={emailLoading} type="submit">Update Email</Button>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <Input {...field} type="password" placeholder="Enter your old password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <Input {...field} type="password" placeholder="Enter your new password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={passwordLoading} type="submit">Update Password</Button>
        </form>
      </Form>
    </>
  );
};

