import { DateTime, DurationLikeObject } from "luxon";
import { create } from "zustand";

export interface DataStruct {
    currentUser: User,
    comments: CommentProps[]
}
export interface User {
        image: {
            png: string,
            webp: string
        },
        username: string,
}

export interface CommentProps {
    id: number,
    content: string,
    createdAt: Date|string,
    score: number,
    user: User,
    replies: ReplyProps[]
}

export interface ReplyProps extends Omit<CommentProps, 'replies'> {
    replyingTo: User["username"],
}

export interface CommentReplyProps {
    data: CommentProps | ReplyProps,
    parentId?:number, //for reply
    setScore: (score: number, id: number) => void,
    makeReply: (reply: ReplyProps, commentId: number) => void,
}
export function duration(start: DateTime, end: DateTime){
    const du = end.diff(start).shiftToAll()
    const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    const toInt = (n:number)=>{
        return Math.floor(n);
    }
    const durationAs = units.map((unit) => {
        const value = toInt(du.as(unit as keyof DurationLikeObject));
        const message = `${value} ${(value === 1)? unit.slice(0,-1): unit} ago` 
         return {
            unit,
            value,
            message
        }
    }).reduce((amount, current) => {
        amount[current.unit] = {
            value: current.value,
            message: current.message
        }
        return amount;
    }, {} as {[key: string]: {value:number, message:string}})
    if(durationAs.seconds.value < 60){
        return 'Just now';
    }
    if(durationAs.minutes.value < 60){
        return durationAs.minutes.message
    }
    if(durationAs.hours.value < 24){
        return durationAs.hours.message
    } 
    if(durationAs.days.value < 7){
        return durationAs.days.message
    }
    if(durationAs.weeks.value < 4){
        return durationAs.weeks.message
    }
    if(durationAs.months.value < 12){
        return durationAs.months.message
    }
    if(durationAs.years.value > 0){
        return durationAs.years.message
    }
    
    return "";
}

export function fakeIDMaker() {
    // optimize: don't include exist id
    return Math.floor(Math.random()*1000)+1;
}

export const extractAt = (text:string) => {
        return text.replace(/@\S+\s/,"").trim()
}

export function fakeLogState(username:string, currentUser: string){
    return username === currentUser; 
}

export type State = {
    data: null| DataStruct
}

export type Action = {
    fetchData: () => void,
    makeComment: (c:CommentProps) =>void,
    setCommentScore: (s:number, commentId: number) => void,
    makeReply: (r: ReplyProps, commentId: number) => void,
    setReplyScore: (s:number, commentId:number, replyId:number) => void,
    deleteComment: (id:number) => void,
    deleteReply: (replyId: number, commentId: number) => void,
    editComment : (text: string, id:number) => void,
    editReply: (text: string, replyId: number, commentId: number) => void,
    storeData: (d:DataStruct) => void,

}

export const useCommentsStore= create<State & Action>((set=>({
    data: null,
    fetchData: async () => {
        if(localStorage.getItem('data')){
            const data = JSON.parse(localStorage.getItem('data')!) as DataStruct;
            set((state) => ({...state, data:data}))
        }
        else{
            //initial
            try {
                const data = await fetch('data.json').then<DataStruct>(r=> r.json());
                localStorage.setItem("data",JSON.stringify(data));
                set((state)=> ({...state,data:data}));
            }
            catch(e) {
                console.log("Error fetching data: ", e);
            }
        }
        
    },
    storeData: (data) => {
        localStorage.setItem("data",JSON.stringify(data));
    },
    makeComment: (comment) => set((state)=> ({ 
        ...state,
        data:{
            ...state.data!,
            comments: [
                ...state.data!.comments,
                comment
            ]
        } 
    })),
    setCommentScore: (score, id) => set((prev) =>({
        ...prev,
        data:{
            ...prev.data!,
            comments: prev.data!.comments.map((comment) => {
                if(comment.id === id){
                    comment.score = score;
                }
                return comment;
            })
        }
    })),
    makeReply: (reply, commentId) => set((prev)=> {
        return {
           ...prev,
           data:{
            ...prev.data!,
            comments: prev.data!.comments.map((c)=> {
                if(c.id === commentId){
                    c.replies.push(reply);
                }
                return c;
            })
           } 
        }
    }),
    setReplyScore: (score, comentId, replyId) => set((store) => {
        return {
            ...store,
            data: {
                ...store.data!,
                comments: store.data!.comments.map((c)=>{
                    if(c.id === comentId && c.replies){
                        c.replies.map((r)=> {
                            if(r.id === replyId){
                                r.score = score
                            }
                            return r;
                        })
                    }
                    return c;
                })
            }
        }
    }),
    deleteComment: (id) => set((store)=> {
        return {
            ...store,
            data:{
                ...store.data!,
                comments: store.data!.comments.filter((c)=> c.id !== id)
            }
        }

    }),
    deleteReply: (replyId, commentId) => set((store) => {
        return {
            ...store,
            data: {
                ...store.data!,
                comments: store.data!.comments.map((c) => {
                    if(c.id === commentId){
                        return {
                            ...c,
                            replies: c.replies.filter(r => r.id !== replyId)
                        }
                    }
                    return c;
                })
            }
        }
    }),
    editComment: (text, id)=> set((store) => {
        return {
            ...store,
            data: {
                ...store.data!,
                comments: store.data!.comments.map((c)=>{
                    if(c.id === id){
                        c.content=text;
                    }
                    return c;
                })
            }
        }
    }),
    editReply: (text, replyId, commentId) => set((store)=> ({
        ...store,
        data: {
            ...store.data!,
            comments: store.data!.comments.map((c)=>{
                if(c.id === commentId){
                    return {
                        ...c,
                        replies: c.replies.map(r=> {
                            if(r.id === replyId){
                                r.content = text;
                            }
                            return r;
                        })
                    }
                }
                return c;
            })
        }
    })),


})))