import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useFetchUserLikedPosts } from "@/lib/react-query/queriesAndmutations";



const LikedPost = () => {

  const { data: likedPosts, isLoading, isError, error } = useFetchUserLikedPosts();

    // Check if data is still loading
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {likedPosts?.length === 0 ? (
        <div>No liked posts found.</div>
      ) : (
         // Ensure likedPosts is always an array, fallback to empty array if undefined
         <GridPostList posts={likedPosts || []} showUser={false} />
      )}
    </div>
  );
}


export default LikedPost
