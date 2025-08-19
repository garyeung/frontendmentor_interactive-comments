import { useEffect} from "react"
import { useCommentsStore } from "../service";
import CommentEditor from "./CommentEditor";
import CommentReply from "./CommentReply";
import Attribution from "./Attribution";

function CommentBoard(){
    const data = useCommentsStore((store)=> store.data);
    const fetchData = useCommentsStore((store) => store.fetchData);
    const setCommentScore = useCommentsStore((store) => store.setCommentScore);
    const makeReply = useCommentsStore((store) => store.makeReply)
    const storeData = useCommentsStore(s => s.storeData);

    useEffect(() => {
      //initial
        fetchData()
    },[])

    useEffect(()=> {
      if(data){
        storeData(data); 
      }
    },[data])

    const comments = data? (data.comments.slice().sort((a,b)=> {
                //sort the comment acorrding to the score 
                return b.score - a.score
    }).map((comment)=> {
        return <CommentReply key={comment.id} data={comment} setScore={setCommentScore} makeReply={makeReply}/> })):null

    return (data&& <>
          <div className="mx-auto w-full md:max-w-[800px] font-rubik p-4 text-dark-blue">
            {comments} 
            {<CommentEditor currentUser={data.currentUser}/>}
          </div>
          <Attribution />
        </>)
}

export default CommentBoard;