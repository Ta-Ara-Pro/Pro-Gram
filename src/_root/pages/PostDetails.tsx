import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById, useDeletePost } from "@/lib/react-query/queriesAndmutations"
import { multiFormatDateString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom"


const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  // Invoke the useDeletePost hook
  const { mutate: deletePost } = useDeletePost();

  // Handle post deletion
  const handleDeletePost = () => {
    if (post) {
      const confirmDelete = window.confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;
      deletePost(
        { postId: post.$id, imageId: post.imageId }, // Replace post.imageId with the correct field if it is not imageId
        // {
        //   onSuccess: () => {
        //     // Redirect or provide feedback upon successful deletion
        //     navigate('/'); // Redirect to the home page or another page
        //   },
        // }
      );
    }}

  return (
    <div className="post_details-containder">
      {isPending ? <Loader /> : (
        <div className="post_details-card" >
          <img src={post?.imageUrl} alt="post" className="post_details-img" />

          <div className="post_details-info">

            <div className="flex-between w-full">

              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">

                <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator" className="rounded-full w-8 lg:h-8  " 
                />
                <div className="flex flex-col">
                  <p className="base-meduim lg:body-bold text-light-1">{post?.creator.name}</p>

                  <div className="flex-center gap- text-light-3">
                    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link to={`/update-post/${post?.$id}`} className={`${ user.id !== post?.creator.$id && 'hidden'}`}>
                  <img src="/assets/icons/edit.svg" width={24} height={24} alt="editS" />
                </Link>
                <Button 
                 onClick={handleDeletePost}
                 variant='ghost' 
                 className={`ghost_details-delete_btn ${ user.id !== post?.creator.$id && 'hidden'}`}>
                  <img  src="/assets/icons/delete.svg" alt="delete" width={24} height={24}/>
                 </Button>
              </div>
            </div>

            <hr className="border w-full vorder-dark-4/80"></hr>

            <div className="flex flex-col w-full small-medium lg:base-regular">
                    <p>{post?.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post?.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex w-full">
                  <PostStats  post={ post } userId={user.id}/>
                </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default PostDetails
