import React from "react";
import "./UserPost.scss";
type postinfo = {
    title: string,
    content: string
}

const UserPost = ({title, content}: postinfo) =>{
    return(<div className="card">
                <div className="card-header">
                    <p className="card-text">{title}</p>
                </div>
                <div className="card-body">
                    <p className="card-text">{content}</p>
                </div>
                <div className="card-footer">
                    <p className="card-text">Auther</p>
                    <button>Buy</button>
                </div>
            </div>);
}

export default UserPost;