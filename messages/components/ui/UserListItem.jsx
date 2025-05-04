const UserListItem = ({ user, handleFunction }) => {
    return (
        <div onClick={handleFunction} className='cursor-pointer bg-[#E8E8E8] hover:bg-[#38B2AC] hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 mt-2 rounded-lg gap-2'>
            <img src={user?.image || user?.pic} alt="User" className="rounded-full w-8 h-8 outline-2 outline-blue-500" />
            <div>
                <p className='font-semibold'>{user?.name}</p>
                <p className='text-gray-500'>{user?.email}</p>
            </div>
        </div>
    )
}

export default UserListItem