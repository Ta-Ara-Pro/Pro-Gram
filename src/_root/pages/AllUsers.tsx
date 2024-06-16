import { useGetUsers } from '@/lib/react-query/queriesAndmutations';
import UserCard from '@/components/shared/UserCard';
import Loader from '@/components/shared/Loader';
import { IUser } from '@/typse';

const AllUsers = () => {
  const { data, isLoading, error } = useGetUsers(); // Fetch users data

  // console.log('user data : ', data);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  // Ensure data is defined and has the 'documents' property
  const users: IUser[] = data?.documents.map((doc: any) => ({
    id: doc.$id,
    name: doc.name,
    username: doc.username,
    email: doc.email,
    imageUrl: doc.imageUrl,
    // Map other required properties accordingly
  })) ?? [];

  console.log('user data:', users);

  return (
    <div className='felx flex-1 w-full'>
      <div className="max-w-5px flex-start gap-3 justify-start w-full m-10">
        <img src="/assets/icons/people.svg" width={36} height={36} alt="" />
        <p className="h3-bold md:h2-bold text-left w-full">Find your Pro Linkes!</p>
      </div>
      <div className='User-Card_container'>

        <div className="user-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 ">
          {/* passing users data in to user_card components */}
          {users?.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AllUsers;

