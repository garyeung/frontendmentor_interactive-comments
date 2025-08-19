import TextEditor from "./TextEditor";

function Update({text, setText, handleUpdate}:{text: string, setText: (s:string)=> void, handleUpdate: ()=> void}){

    return (
        <div className="flex w-full h-full md:flex-col md:items-end md:gap-4">
            <TextEditor text={text} setText={setText}/>
            <button className="blue-button md:h-20" onClick={handleUpdate}>update</button>
        </div>
    )
}

export default Update;