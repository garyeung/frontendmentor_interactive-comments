import { useEffect, useState } from "react";
import { CommentReplyProps, ReplyProps, extractAt, fakeLogState, useCommentsStore } from "../service";
import UserInfo from "./UserInfo";
import Content from "./Content";
import ScoreController from "./ScoreController";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";
import ButtonReply from "./ButtonReply";
import ReplyEditor from "./ReplyEditor";
import Delete from "./Delete";
import Update from "./Update";

function CommentReply({data, parentId, setScore, makeReply}:CommentReplyProps){
    const currentUser = useCommentsStore((store) => store.data!.currentUser.username);
    const isCurrent = fakeLogState(data.user.username, currentUser);
    const [clickedReply, setClickedReply] = useState(false);
    const [clickedEdit, setclickedEdit] = useState(false);
    const [clickedDelete, setClickedDelete] = useState(false);
    const [text, setText] = useState("");

    useEffect(()=> {
        if('replyingTo' in data){
            setText("@"+data.replyingTo+" "+data.content);
        }
        else setText(data.content);
    },[clickedEdit]);

    const toggleReply = () => {
        setClickedReply(!clickedReply);
    }
    const toggleEdit = () => {
        setclickedEdit(!clickedEdit);
    }
    const toggleDelete = () => {
        setClickedDelete(!clickedDelete);
    }
    const editComment = useCommentsStore((s)=> s.editComment);
    const editReply = useCommentsStore((s)=> s.editReply);
    const edit = (parentId)? (t:string,r:number) => editReply(t,r,parentId): editComment;

    const handleUpdate = () => {
        const content = extractAt(text);
        if(content !== ""){
        edit(content,data.id);
        setclickedEdit(false);
        }
    }
   
    const middlewareSetReplyScore = useCommentsStore(s => s.setReplyScore);
    const curryingReplySocre = (c:number) => (s:number, r: number) => middlewareSetReplyScore(s,c,r);
    const curryingMakeReply = (id: number) => (r: ReplyProps) => makeReply(r, id);

    const handleReplyScore = curryingReplySocre(data.id);
    const handleMakeReply = (parentId )? curryingMakeReply(parentId):curryingMakeReply(data.id);

    const deleteComment = useCommentsStore(s=> s.deleteComment);
    const middlewareDeleteReply = useCommentsStore(s => s.deleteReply);
    const curryingDeleteReply = (c: number) => (r:number) => middlewareDeleteReply(r,c);

    const deleteCommentOrReply = (parentId)? curryingDeleteReply(parentId): deleteComment;

    const handleDelete = ()=> {
        deleteCommentOrReply(data.id);
        toggleDelete();
    }

    let replies: JSX.Element[] | undefined;
    if('replies' in data){
        replies = data.replies.map((reply) => {
            return <CommentReply data={reply} parentId={data.id} setScore={handleReplyScore} makeReply={makeReply} key={reply.id}  />
        }) 
    }

    return (
    <>
      <div className="box box--grid">
        <div className="box__item box__info">
            <UserInfo avatar={data.user.image.webp} name={data.user.username} createdTime={data.createdAt} isCurrent={isCurrent} />
        </div>
        <div className="box__item box__content items-baseline">
            {(clickedEdit)?<Update setText={setText} text={text} handleUpdate={handleUpdate}/>:
            <Content content={data.content} replyTo={('replyingTo' in data)? data.replyingTo:undefined} />}
        </div>
        <div className="box__item box__score items-center md:justify-center md:items-baseline">
            <ScoreController score={data.score} setScore={setScore} id={data.id} />
        </div>
        <div className="box__item box__reply justify-end items-center gap-x-4">
            {(isCurrent)?
            <><ButtonDelete setDelete={toggleDelete}/><ButtonEdit setEdit={toggleEdit}/></>:
            <ButtonReply setReply={toggleReply}/>}
        </div>
      </div>
      {(clickedReply)?
        <ReplyEditor replyTo={data.user.username} makeReply={handleMakeReply} toggleReplyButton={toggleReply} />: ""}
      {(replies&&replies.length>0)?
        <div className="pl-4 border-l-2 border-light-gray md:ml-10 md:pl-10">{replies}</div>: ""}
      {(clickedDelete)? <Delete cancelDel={toggleDelete} commitDel={handleDelete}/>:""}
    </>)

    
}

export default CommentReply;