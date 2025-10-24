// ChatUsers: render list of participants in the room
// Props: users: Array<{ id: string, name: string }>, currentId?: string

export default function ChatUsers({ users = [], currentId }) {
  return (
    <div className="w-full xl:h-[22.5vh] md:h-full h-[20vh] bg-gray-700 rounded-b flex flex-col items-center justify-center gap-2 p-2 py-2 text-white">
      <div className="w-full flex justify-center">
        {users.length} Users
      </div>
      <div className="w-full h-full flex flex-col xl:flex-row xl:flex-wrap gap-2 overflow-y-auto overflow-x-hidden">
        {users.map((u) => (
          <div key={u.id} className="w-[96%] xl:w-[45%] 2xl:w-[31%] h-12 flex gap-4 items-center p-2 px-2 border rounded cursor-pointer hover:bg-gray-600">
            <div className="h-full w-1 bg-yellow-500 rounded"></div>
            <div className="flex flex-col truncate">
              <span className="truncate">{u.name}{currentId && u.id === currentId ? ' (you)' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
