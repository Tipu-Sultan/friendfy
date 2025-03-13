'use client'
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentChats, fetchFriends, createGroup, setSelectedUser, joinGroup, getGroupDetails } from "../redux/slices/chatSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export const useUserList = (user, username) => {
    const dispatch = useDispatch();
    const router  = useRouter()
    const { recentChats, groupsFriends, error,groupData } = useSelector((state) => state.chat);
    const [filteredUsers, setFilteredUsers] = useState([]); // Initialize as empty
    const [isModalOpen, setIsModalOpen] = useState(false);



    useEffect(() => {
        setFilteredUsers(recentChats);
    }, [recentChats]);


    useEffect(() => {
        if (recentChats.length === 0) {
            dispatch(fetchRecentChats(user?.username));
        }
    }, [dispatch, recentChats.length, user?.username]);

    const [search, setSearch] = useState('');
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([]);
    const [isMobileView, setIsMobileView] = useState(false);

    // This finds the user whose name or groupId matches the username
    let filteredSelectedUser = null;
    if (username) {
        const decodedUsername = decodeURIComponent(username);
        filteredSelectedUser = recentChats?.find(user => user?.name === decodedUsername || user?.groupId === decodedUsername);
    }


    useEffect(() => {
        dispatch(setSelectedUser(filteredSelectedUser))
    }, [dispatch,username, filteredSelectedUser]);

    const handleSelectedUsers = (selected) => {
        dispatch(setSelectedUser(selected))
        if (selected.type === 'user') {
            router.push(`/chat/${selected?.name}`);
        } else {
            router.push(`/chat/${selected?.groupId}`);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setFilteredUsers(
            recentChats.filter((user) =>
                user.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    const handleCreateGroup = async () => {
        const groupData = {
            name: groupName,
            description: 'A group for study discussions',
            createdBy: user.id,
            members: groupUsers,
            groupImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            settings: { isPrivate: true },
            groupType: 'public',
        };
        const res = await dispatch(createGroup(groupData)).unwrap();
        if (res.status === 201) {
            setShowGroupModal(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        const groupData = {
            groupId: groupId,
            joinBy:user.id,
        };

        const res = await dispatch(joinGroup(groupData)).unwrap();
        if (res.status === 201) {
            setShowGroupModal(false);
        }
    };

    const handleGroupSettings = (groupId)=>{
        dispatch(getGroupDetails(groupId))
        setIsModalOpen(true)
      }

      const updateGroup = (groupId)=>{
        dispatch(getGroupDetails(groupId))
        setIsModalOpen(true)
      }


    const handleModalOpen = () => {
        setShowGroupModal(true);
        dispatch(fetchFriends(user?.username));
    };

    return {
        groupData,
        groupName,
        setGroupName,
        groupUsers,
        setGroupUsers,
        recentChats,
        search,
        filteredUsers,
        error,
        groupsFriends,
        handleCreateGroup,
        handleJoinGroup,
        showGroupModal,
        handleModalOpen,
        handleSearch,
        setShowGroupModal,
        isMobileView,
        setIsMobileView,
        handleSelectedUsers,
        handleGroupSettings,
        isModalOpen, 
        setIsModalOpen,
        updateGroup
    };
};
