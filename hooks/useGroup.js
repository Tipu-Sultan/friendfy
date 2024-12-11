import { useDispatch, useSelector } from "react-redux";
import {
    fetchRecentChats,
    addChat,
    fetchMessages,
    fetchGroupMessages,
    createGroup,
    fetchFriends,
} from "../redux/slices/chatSlice";
import { useEffect, useState } from "react";

export const useGroup = () => {
    const dispatch = useDispatch();
    const { recentChats, messages, groupMessages, loading, error } = useSelector((state) => state.chat);

    // Fetch group messages
    const loadGroupMessages = (groupId) => {
        dispatch(fetchGroupMessages(groupId));
    };


    return {
        recentChats,
        messages,
        groupMessages,
        loading,
        error,
        loadRecentChats,
        loadGroupMessages,
        handleModalOpen
    };
};
