
function EmptyError({emptySend=false}:{emptySend:boolean}) {
    return (
        <span className={`${emptySend? "block ": "hidden"} uppercase text-xs text-red-700 pl-2`}>Empty comment is not allowed!</span>
    )
}

export default EmptyError;