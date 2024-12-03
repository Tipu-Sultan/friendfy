const createPost = async (postData,{rejectWithValue}) => {
    try {
        const response = await axios.post("/api/posts", postData);
        return response.data;
    } catch (error) {
        rejectWithValue(error.data.error);
    }
}

export const postFeature= {createPost}