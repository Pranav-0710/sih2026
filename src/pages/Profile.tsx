import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser, updateUserEmail, reauthenticate, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleNameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = e.currentTarget.fullName.value;
    if (newName) {
      try {
        await updateUser({ data: { full_name: newName } });
        toast({ title: t("common.success", "Success"), description: t("profile.nameUpdated", "Your name has been updated.") });
      } catch (error: any) {
        toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
      }
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEmail = e.currentTarget.newEmail.value;
    const password = e.currentTarget.password.value;
    if (newEmail && password) {
      try {
        await reauthenticate();
        await updateUserEmail(newEmail);
        toast({ title: t("common.success", "Success"), description: t("profile.emailUpdateSent", "A confirmation email has been sent to your new email address.") });
      } catch (error: any) {
        toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
      }
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const oldPassword = e.currentTarget.oldPassword.value;
    const newPassword = e.currentTarget.newPassword.value;
    if (oldPassword && newPassword) {
      try {
        await reauthenticate();
        await updateUser({ password: newPassword });
        toast({ title: t("common.success", "Success"), description: t("profile.passwordUpdated", "Your password has been updated.") });
      } catch (error: any) {
        toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
      }
    }
  };

  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <PageLayout>
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("profile.title", "Profile")}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.updateName", "Update Name")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameUpdate}>
              <Input name="fullName" defaultValue={user?.user_metadata.full_name} className="mb-4" />
              <Button type="submit">{t("profile.updateName", "Update Name")}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.updateEmail", "Update Email")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate}>
              <Input name="newEmail" type="email" placeholder={t("profile.newEmailPlaceholder", "New Email")} className="mb-4" />
              <Input name="password" type="password" placeholder={t("profile.passwordPlaceholder", "Password")} className="mb-4" />
              <Button type="submit">{t("profile.updateEmail", "Update Email")}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.updatePassword", "Update Password")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate}>
              <Input name="oldPassword" type="password" placeholder={t("profile.oldPasswordPlaceholder", "Old Password")} className="mb-4" />
              <Input name="newPassword" type="password" placeholder={t("profile.newPasswordPlaceholder", "New Password")} className="mb-4" />
              <Button type="submit">{t("profile.updatePassword", "Update Password")}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
    </PageLayout>
  );
};

export default Profile;
