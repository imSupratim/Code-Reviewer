import { generateContent } from "../services/ai.services.js";

export const getReview = async(req, res) => {
    const code = req.body.code;

    if(!code){
        res.status(400).send({message: "prompt is required"});
    }

    const result = await generateContent(code);

    return res.send(result);
}