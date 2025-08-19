
function Avatar({src, className}:{src:string, className: string}){
    return(
        <img src={src} alt="avatar" className={className} />
    )
}

export default Avatar;