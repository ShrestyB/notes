
import axios from 'axios';

export const getGlossaryTerms = async (noteContent) => {
    try {
        const response = await axios.post('YOUR_AI_TOOL_API_ENDPOINT', { text: noteContent });
        return response.data.terms; 
    } catch (error) {
        console.error('Error fetching glossary terms:', error);
        return [];
    }
};
