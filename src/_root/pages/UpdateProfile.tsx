import { useState } from "react";
import { useParams } from "react-router-dom";
// import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndmutations";
import ProfileUploader from "@/components/shared/ProfileUploader";
import UpdateProfileForm from "@/components/forms/UpdateProfileForm";

const UpdateProfile = () => {
  const { id } = useParams<{ id: string }>();
  // const { user } = useUserContext();
  const { data: currentUser } = useGetUserById(id || "");
  const updateUser = useUpdateUser();

  const [profileImageUrl, setProfileImageUrl] = useState(currentUser?.imageUrl || "/assets/icons/profile-placeholder.svg");

  

  const handleFileChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setProfileImageUrl(newImageUrl);

      // Update user profile with the new image
      updateUser.mutate({
        userId: id as string,  // Ensure id is treated as a string
        name: currentUser?.name,
        bio: currentUser?.bio,
        file: [file],  // Ensure `file` is an array as expected by `updateUser`
        imageUrl: newImageUrl,
        imageId: currentUser?.imageId,
      });
    }
  };

 

  return (
    <div className="flex flex-1 ">
      <div className="common-container justify-start">
        <div className="max-w-5px flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/edit.svg" width={36} height={36} alt="edit" />
          <p className="h3-bold md:h2-bold text-left w-full">Edit Profile</p>
        </div>

        <div  className="max-w-5px flex-start gap-10 justify-start w-full">
          <ProfileUploader             
              fieldChange={handleFileChange}
              mediaUrl={profileImageUrl}
            />
        </div>                 
        <UpdateProfileForm />
      </div>      
    </div>
  );
};

export default UpdateProfile;
