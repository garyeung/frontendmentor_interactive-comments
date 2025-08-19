import { DateTime } from "luxon"
import { useEffect, useState } from "react";
import { duration } from "../service";
import Avatar from "./Avatar";

function UserInfo({avatar, name, createdTime, isCurrent}:{avatar: string, name: string, createdTime: Date|string, isCurrent: boolean}){
    const [current, setCurrent] = useState(DateTime.now());
    let past: DateTime;
    if(typeof createdTime === "string"){
      past = DateTime.fromJSDate(new Date(createdTime));
    }
    else{
      past = DateTime.fromJSDate(createdTime);
    }
    const createdAt = duration(past, current);

    useEffect(()=> {
      const interval = setInterval(()=> {
        setCurrent(DateTime.now())
      }, 1000);

      return () => clearInterval(interval)

    },[])

    return(
        <div className="flex items-center gap-4">
            <Avatar src={avatar}  className="w-8"/>
            <h6 className="font-medium text-dark-blue">{name}</h6>
            {(isCurrent)?<span className="text-white bg-moderate-blue px-1 text-sm font-medium">you</span>:""}
            {<span className="text-grayish-blue">{
              // protect the original data
            (createdAt)? createdAt: createdTime.toString()
            }</span>}
        </div>
    )
}
export default UserInfo;