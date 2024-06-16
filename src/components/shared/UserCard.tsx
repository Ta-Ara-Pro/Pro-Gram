import { Link } from "react-router-dom";
import { IUser } from "@/typse";

interface UserCardProps {
  user: IUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`}>
      <div className="user-card border rounded p-4 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg hover:border-primary-500">
        <img src={user.imageUrl} alt={`${user.name}'s profile`} className="w-16 h-16 rounded-full mx-auto" />
        <h2 className="text-xl text-center mt-4">{user.name}</h2>
        <p className="text-center text-gray-600">@{user.username}</p>
      </div>
    </Link>
  );
};

export default UserCard;


