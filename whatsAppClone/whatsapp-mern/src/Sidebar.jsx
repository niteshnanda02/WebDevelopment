import React from 'react'
import "./Sidebar.css"
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import {Avatar,IconButton} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SideBarChat from './SideBarChat';
function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src="data:image/jpeg;base64,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"/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>

            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
            <SideBarChat/>
            <SideBarChat/>
            <SideBarChat/>

            </div>
        </div>
    )
}

export default Sidebar
