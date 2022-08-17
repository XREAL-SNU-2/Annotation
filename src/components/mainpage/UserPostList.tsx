import React, {useState, useEffect} from "react";
import "./UserPost.scss";
import "./UserPostList.scss";
import UserPost from "./UserPost"
type postinfo = {
    title: string,
    content: string
}

const UserPostList = () =>{

    const [postArr, SetPostArr] = useState([]);

    useEffect(()=>{
        async function getPosts() {
            /*try{

            }
            catch{

            }*/
        }
    })

    return(
        <div className="postlist">
            {postArr?.map((e)=>{
                return(
                    <>
                        <div>

                        </div>
                    </>
                );
            })}
            <UserPost title="Post1" content="LaLALA"/>
            <UserPost title="Post2" content="Choi"/>
            <UserPost title="Post3" content="Soon"/>
            <UserPost title="Post4" content="Soon"/>
            <UserPost title="Post5" content="Soon"/>
            <UserPost title="Post6" content="Soon"/>
        </div>
    );
}

export default UserPostList;