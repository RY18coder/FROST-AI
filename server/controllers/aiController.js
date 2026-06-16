import { GoogleGenAI } from "@google/genai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const parseResponseData = (data) => {
  if (Buffer.isBuffer(data)) {
    const text = data.toString("utf8");
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return data;
};

const verifyApiKey = (key, name, res) => {
  if (!key) {
    const message = `${name} is not configured. Set ${name} in your environment.`;
    console.error(message);
    res.status(500).json({ success: false, message });
    return false;
  }
  return true;
};

const handleControllerError = (error, res) => {
  const status = error.response?.status || error.status || 500;
  const responseData = parseResponseData(error.response?.data ?? error.message);

  console.error("Controller error:", status, responseData);

  if (status === 429) {
    return res.status(429).json({
      success: false,
      message:
        "Rate limit exceeded. Please wait a moment or switch to Gemini 2.5 Flash.",
    });
  }

  if (status === 403) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Invalid key or permissions configuration.",
    });
  }

  return res.status(status).json({ success: false, message: responseData });
};

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!verifyApiKey(GEMINI_API_KEY, "GEMINI_API_KEY", res)) return;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const tokenLimit = length === 800 ? 4000 : length === 1200 ? 6000 : 8000;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: tokenLimit,
        temperature: 0.7,
        systemInstruction: "You are an expert article writer. Write comprehensive, well-structured articles with proper headings (H2, H3), engaging introductions, detailed body paragraphs with examples, and strong conclusions. Always write complete, full-length articles — never truncate or summarize. Ensure the output is complete and does not cut off mid-sentence.",
      },
    });

    const content = response.text;

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!verifyApiKey(GEMINI_API_KEY, "GEMINI_API_KEY", res)) return;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        systemInstruction: "You are an expert blog title creator. Generate creative, engaging, and SEO-friendly blog titles. Always provide 5-10 complete title suggestions with brief explanations for why each title works. Format as a numbered list. Never truncate or cut off mid-sentence.",
      },
    });

    const content = response.text;

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (!CLIPDROP_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "ClipDrop API key is not configured.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql` INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;
    res.json({ success: true, content: secure_url });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;
    res.json({ success: true, content: imageUrl });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (!verifyApiKey(GEMINI_API_KEY, "GEMINI_API_KEY", res)) return;

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `You are an expert career coach and resume reviewer. Analyze the following resume thoroughly and provide a comprehensive, detailed review.\n\nStructure your response with these sections:\n1. **Overall Assessment** - A summary of the resume's quality\n2. **Strengths** - What the resume does well (list specific points)\n3. **Weaknesses** - Areas that need improvement (list specific points)\n4. **Section-by-Section Feedback** - Detailed analysis of each resume section\n5. **Actionable Recommendations** - Specific, concrete steps to improve the resume\n6. **ATS Optimization Tips** - How to improve for applicant tracking systems\n7. **Final Verdict** - Overall rating and key takeaways\n\nBe thorough, specific, and constructive. Provide real examples and suggestions.\n\nResume Content:\n\n${pdfData.text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 8000,
        temperature: 0.7,
        systemInstruction: "You are an expert career coach and professional resume reviewer. Always provide complete, detailed, and thorough reviews. Never truncate your response. Write full paragraphs for each section. Ensure the entire response is complete and does not cut off.",
      },
    });

    const content = response.text;

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    res.json({ success: true, content });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
