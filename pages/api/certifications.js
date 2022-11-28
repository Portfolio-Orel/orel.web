const axios = require('axios');
//const res = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/certifications`);
export default async (_, res) => {
    const { data } = await axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/getCertifications`,
        headers: {
            contentType: 'application/json; charset=utf-8',
            accept: '*/*',
        }
    });
    try {
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}