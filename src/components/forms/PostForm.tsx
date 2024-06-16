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
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatedPost } from "@/lib/react-query/queriesAndmutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

////////////////////////////////////////instesd of this a custom validation has been made named:  PostValidation
// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// });

type PostFormProps = {
   post?: Models.Document;        //??????????????
    action: 'Create' | 'Update' }   


export function PostForm({ post, action }: PostFormProps) {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()  //??????????????
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatedPost()


  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();



  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post?.tags.join(',') : '',
    },
  }) 


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === 'Update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if(!updatedPost) {
        toast({title: 'Please try again'})
      }
      return navigate(`/posts/${post.$id}`)
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
      toast({ title: 'Please try agian' })
    }
    navigate('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem className="" >
              <FormLabel className="shad-form_label ">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar mt-3" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="shad-form_label ">Add photos</FormLabel>
              <FileUploader
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
              />
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="shad-form_label ">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="shad-form_label ">Add Tags(seperated by comma " , ")</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn"  {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4 "  onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap"  disabled={ isLoadingCreate || isLoadingUpdate} >
          { isLoadingCreate || isLoadingUpdate  && 'Loading...' } {action} Post
          </Button>
        </div>

      </form>
    </Form>
  );
}

export default PostForm;
