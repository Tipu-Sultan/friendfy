
const registerUser = async (credentials) => {
    try {
        const response = await axios.post("/api/register", {...credentials });
        return response;
    } catch (error) {
        if (response.error) throw new Error(response.error);

    }
}

const loginUser = async (credentials) => {
    try {
        const response = await axios.post("/api/login", {credentials });
        return response;
    } catch (error) {
        if (response.error) throw new Error(response.error);

    }
}

export const authFeature = { registerUser,loginUser }