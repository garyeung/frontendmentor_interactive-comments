
function TextEditor({text, setText, placeholder}:{text:string,setText:(s:string)=>void, placeholder?: string}){

    return (
          <textarea placeholder={placeholder} value={text}  className="w-full h-full p-4 resize-none border rounded-lg border-light-gray focus:outline-none focus:border-moderate-blue" onChange={(e) => setText(e.target.value)} />
    )
}

export default TextEditor;