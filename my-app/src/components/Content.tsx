
function Content({content, replyTo}:{content: string, replyTo?: string}) {

    return (<p className="content">{(replyTo)?<span className="text-moderate-blue font-bold">@{replyTo} </span>: ""}{content}</p>);
}

export default Content;