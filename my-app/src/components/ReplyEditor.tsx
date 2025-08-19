import { useEffect, useState } from "react";
import { ReplyProps,  extractAt,  fakeIDMaker, useCommentsStore } from "../service";
import Avatar from "./Avatar";
import TextEditor from "./TextEditor";
import EmptyError from "./EmptyError";

function ReplyEditor({ makeReply, replyTo, toggleReplyButton}:{replyTo:string, makeReply:(r:ReplyProps)=>void, toggleReplyButton:()=>void}) {
    const [text, setText] = useState("");
    const [emptySend, setEmptySend] = useState(false);
    const currentUser = useCommentsStore((store)=> store.data!.currentUser);

    useEffect(()=> {
        setText("@"+replyTo+" "); //initial
    },[])

    const handleClick = () => {
        if(text === "" || extractAt(text)===""){
            setEmptySend(true);
            return;
        }
        else {
            setEmptySend(false);
            const reply: ReplyProps = {
                id: fakeIDMaker(),
                content: extractAt(text),
                user: currentUser,
                createdAt: new Date(),
                score: 0,
                replyingTo: replyTo
            }

            makeReply(reply)
            setText("@"+replyTo+" ");
            toggleReplyButton();
        }
    }
   
    return (
        <><div className="box maker">
            <div className="maker__img">
                <Avatar src={currentUser.image.webp} className="w-8 md:w-10"/>
            </div>
            <div className="maker__editor">
              <EmptyError emptySend={emptySend} />
              <TextEditor text={text} setText={setText} placeholder={"@"+replyTo} />
            </div>
            <div className="maker__button">
                <button onClick={handleClick} className="blue-button">reply</button>
            </div>
        </div>
        </>
    )
}

export default ReplyEditor;