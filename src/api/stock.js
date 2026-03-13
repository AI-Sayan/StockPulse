import axios from 'axios';

const BASE = 'http://localhost:8000';

export const analyzeStock = async (ticker) => {
    const res = await axios.get(`${BASE}/stock/${ticker}/finbert`);
    return res.data;
};
