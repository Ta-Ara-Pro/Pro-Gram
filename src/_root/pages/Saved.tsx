import GridPostList from "@/components/shared/GridPostList"
import { useGetSavedPosts } from "@/lib/react-query/queriesAndmutations";
import { Loader } from "lucide-react";


const Saved = () => {

  const { data: savedPosts, isLoading, isError, error } = useGetSavedPosts();

  
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="saved-container">
      <div className="saved-inner_container">
        <h2 className="h3-bold md:h2-bold w-full"> </h2>
      </div>

      <div className="flex w-full max-w-5xl mt-16 mb-7 gap-2">
        <img src="/assets/icons/saved.svg" alt="saved"  width={25}  height={25} />
        <h2 className="body-bold md:h3-bold ">Saved Posts</h2>
      </div>

      <GridPostList posts={savedPosts || []} showUser={false} />
      
    </div>

)}

export default Saved
