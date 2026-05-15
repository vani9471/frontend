import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/uploads`;

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : '';

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(API_URL, formData, config);
    return response.data;
};

const fileService = {
    uploadFile
};

export default fileService;
