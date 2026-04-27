import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Loader2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n/i18n-context";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/(shop)/profile")({
  component: ProfilePage,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { session };
  },
});

type ProfileFormValues = {
  name: string;
  image?: string | null;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const { session } = Route.useRouteContext();
  const { t } = useI18n();
  const profileFormSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(2, { message: t("shop.profile.validation.nameMin") }),
        image: z.string().nullable().optional(),
      }),
    [t],
  );
  const passwordFormSchema = useMemo(
    () =>
      z
        .object({
          currentPassword: z.string().min(6, {
            message: t("shop.profile.validation.currentPasswordMin"),
          }),
          newPassword: z.string().min(6, {
            message: t("shop.profile.validation.newPasswordMin"),
          }),
          confirmPassword: z.string().min(6, {
            message: t("shop.profile.validation.confirmPasswordMin"),
          }),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t("shop.profile.validation.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  if (!session.user.name) {
    throw new Error("Authenticated user name is required");
  }

  if (!session.user.email) {
    throw new Error("Authenticated user email is required");
  }

  // update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      return await authClient.updateUser(values);
    },
    onSuccess: () => {
      toast.success(t("shop.profile.profileUpdated"));
      router.invalidate();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("shop.profile.updateFailed"),
      );
    },
  });

  // change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      return await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true, // revoke other sessions
      });
    },
    onSuccess: () => {
      toast.success(t("shop.profile.passwordChanged"));
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("shop.profile.passwordChangeFailed"),
      );
    },
  });

  // user profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session.user.name,
      image: session.user.image,
    },
    values: {
      name: session.user.name,
      image: session.user.image,
    },
  });

  // password change form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // update user profile
  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  // change password
  const onPasswordSubmit = (values: PasswordFormValues) => {
    changePasswordMutation.mutate(values);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">{t("shop.profile.title")}</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="profile">{t("shop.profile.profile")}</TabsTrigger>
          <TabsTrigger value="security">
            {t("shop.profile.security")}
          </TabsTrigger>
        </TabsList>

        {/* user profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("shop.profile.profileInformation")}</CardTitle>
              <CardDescription>
                {t("shop.profile.profileDescription")}
              </CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-6">
                  {/* user avatar */}
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
                    <Avatar className="h-24 w-24">
                      {session.user.image ? (
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                      ) : null}
                      <AvatarFallback className="text-2xl">
                        {session.user.name.charAt(0).toUpperCase() || <User />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <FormField
                        control={profileForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("shop.profile.profilePicture")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/avatar.jpg"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              {t("shop.profile.profilePictureDescription")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* user name */}
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shop.profile.name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("shop.profile.nameDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email (read only) */}
                  <div className="space-y-2">
                    <FormLabel>{t("shop.profile.email")}</FormLabel>
                    <Input value={session.user.email} disabled readOnly />
                    <p className="text-sm text-muted-foreground">
                      {t("shop.profile.emailDescription")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="mt-6 flex justify-end pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending ||
                      !profileForm.formState.isDirty
                    }
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("shop.profile.saving")}
                      </>
                    ) : (
                      t("shop.profile.saveChanges")
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* security settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("shop.profile.changePassword")}</CardTitle>
              <CardDescription>
                {t("shop.profile.passwordDescription")}
              </CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardContent className="space-y-4">
                  {/* current password */}
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("shop.profile.currentPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* new password */}
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shop.profile.newPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("shop.profile.passwordRequirement")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* confirm new password */}
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("shop.profile.confirmNewPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="mt-6 flex justify-end pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={
                      changePasswordMutation.isPending ||
                      !passwordForm.formState.isDirty
                    }
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("shop.profile.changing")}
                      </>
                    ) : (
                      t("shop.profile.changePassword")
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
