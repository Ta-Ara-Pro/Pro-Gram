import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/input";
import { Models } from "appwrite";
import { useUpdateUser, useGetUserById } from "@/lib/react-query/queriesAndmutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUpdateUser } from "@/typse";

const formSchema = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().max(2200),
});

type UserFormProps = {
  image?: Models.Document;
};

export function UpdateProfileForm({ image }: UserFormProps) {
  const { user, setUser } = useUserContext();
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });

  const { data: fetchedUser, 
    // refetch: refetchUser 
  } = useGetUserById(user.id); // Assuming there's a useFetchUser hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedUser) {
      setDefaultValues({
        name: fetchedUser.name || "",
        username: fetchedUser.username || "",
        email: fetchedUser.email || "",
        bio: fetchedUser.bio || "",
      });
      form.reset({
        name: fetchedUser.name || "",
        username: fetchedUser.username || "",
        email: fetchedUser.email || "",
        bio: fetchedUser.bio || "",
      });
    }
  }, [fetchedUser, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const imageUrl = image?.imageUrl && isValidUrl(image.imageUrl) ? image.imageUrl : "";

    const updatePayload: IUpdateUser = {
      userId: user.id,
      name: values.name,
      username: values.username,
      email: values.email,
      bio: values.bio,
      file: [],
      imageId: image?.imageId || "", // Ensure imageId is always a string
      imageUrl: imageUrl || "", // Ensure imageUrl is always included
    };

    if (imageUrl) {
      updatePayload.imageUrl = imageUrl; // Add imageUrl to updatePayload conditionally
    }

    console.log("Submitting form with values:", updatePayload);

    try {
      const updateProfile = await updateUser(updatePayload);

      if (!updateProfile) {
        toast({ title: "Please try again" });
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          name: values.name,
          username: values.username,
          email: values.email,
          bio: values.bio,
        }));
        navigate(`/Profile/${user.id}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "An error occurred while updating the profile. Please try again." });
    }
  }

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label ">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label ">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label ">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label ">Bio</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar mt-3" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingUpdate}>
            {isLoadingUpdate ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateProfileForm;
