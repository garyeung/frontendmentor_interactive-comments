import { useState } from "react";
import { CommentProps, User, fakeIDMaker, useCommentsStore } from "../service";
import Avatar from "./Avatar";
import TextEditor from "./TextEditor";
import EmptyError from "./EmptyError";

function CommentEditor({currentUser}: {currentUser:User}){
    const [text, setText] = useState("");
    const [emptySend, setEmptySend] = useState(false);
    const makeComment = useCommentsStore(sotre=> sotre.makeComment);


    const handleClick = () => {
        if(text === ""){
            setEmptySend(true);
            return;
        }
        else {
            setEmptySend(false);
            const comment: CommentProps = {
            id: fakeIDMaker(),
            content: text,
            user: currentUser,
            createdAt: new Date(),
            score: 0,
            replies: []
             }
            makeComment(comment);
            setText("");
        }
    }
    return(
        <><div className="box maker">
            <div className="maker__img">
                <Avatar src={currentUser.image.webp} className="w-8 md:w-10" />
            </div>
            <div className="maker__editor">
              <EmptyError emptySend={emptySend} />
              <TextEditor text={text} setText={setText} placeholder="Add a comment..." />
            </div>
            <div className="maker__button">
                <button onClick={handleClick} className="blue-button">send</button>
            </div>
        </div>
        </>
    )
}

export default CommentEditor;