exports.validateForm = (userFormData) => {
    const usernameRegex = /^[a-zA-Z0-9._]{8,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!userFormData.username || !userFormData.email || !userFormData.password || !userFormData.confirmPassword) {
        return "All fields are required.";
    }

    if (!passwordRegex.test(userFormData.password)) {
        return "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character.";
    }

    if (userFormData.password !== userFormData.confirmPassword) {
        return "Passwords do not match.";
    }

    return null; // No validation errors
};