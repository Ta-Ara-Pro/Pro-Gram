import PostForm from "@/components/forms/PostForm"
import { useGetPostById } from "@/lib/react-query/queriesAndmutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom"


const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');

  if(isPending) return <Loader />

  return (
    <div className="flex flex-1" >
      <div className="common-container">
        <div className="max-w-5px flex-start gap-3 justify-start w-full">
          <img src="/assests/icons/edit.svg" width={36} height={36} alt="edit post" />
          <p className="h3-bold md:h2-bold text-left w-full">Edit Post</p>
        </div>
        <PostForm action='Update' post={post} />
      </div>      
    </div>
  )
}

export default EditPost

