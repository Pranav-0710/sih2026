import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const Profile = () => {
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
        toast({ title: "Success", description: "Your name has been updated." });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
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
        toast({ title: "Success", description: "A confirmation email has been sent to your new email address." });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
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
        toast({ title: "Success", description: "Your password has been updated." });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <PageLayout>
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Name</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameUpdate}>
              <Input name="fullName" defaultValue={user?.user_metadata.full_name} className="mb-4" />
              <Button type="submit">Update Name</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Update Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate}>
              <Input name="newEmail" type="email" placeholder="New Email" className="mb-4" />
              <Input name="password" type="password" placeholder="Password" className="mb-4" />
              <Button type="submit">Update Email</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate}>
              <Input name="oldPassword" type="password" placeholder="Old Password" className="mb-4" />
              <Input name="newPassword" type="password" placeholder="New Password" className="mb-4" />
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
    </PageLayout>
  );
};

export default Profile;
