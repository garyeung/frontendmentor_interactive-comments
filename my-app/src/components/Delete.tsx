
function Delete({cancelDel, commitDel}:{cancelDel:()=>void, commitDel:()=> void}) {
    const warning = "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
    return (
        <div className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-white box mx-4 my-auto grid grid-cols-2 grid-rows-3 gap-4 p-6 md:w-96">
                <div className="box__item row-start-1 col-span-full">
                  <h1 className="text-xl font-bold">Delete comment</h1>
                </div>
                <div className="box__item row-span-2 col-span-full">
                  <p className="content">{warning}</p>
                </div>
                <div className="box__item col-start-1">
                  <button className="blue-button bg-grayish-blue w-full" onClick={()=>cancelDel()}>no, cancel</button>
                </div>
                <div className="box__item ">
                  <button className="blue-button bg-soft-red w-full" onClick={()=>commitDel()}>yes, delete</button>
                </div>
            </div>
        </div>
    )
}

export default Delete;