import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import AdmZip from "adm-zip";

dotenv.config();

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

async function generateWithRetryAndFallback(ai: any, params: {
  contents: { parts: any[] };
  config: any;
}) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  const maxRetriesPerModel = 3;
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`Sending parsing request to Gemini using model: ${model} (attempt ${attempt}/${maxRetriesPerModel})...`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.error(`Error on model ${model}, attempt ${attempt}:`, err?.message || err);
        
        const errMsg = (err?.message || "").toLowerCase();
        const errCode = err?.status || err?.code || (err?.error && err.error.code);
        
        // Retrying on transient or network/availability errors
        const isTransient = errMsg.includes("503") || 
                            errMsg.includes("429") || 
                            errMsg.includes("temporary") || 
                            errMsg.includes("demand") || 
                            errMsg.includes("unavailable") || 
                            errMsg.includes("exhausted") || 
                            errCode === 503 || 
                            errCode === 429 || 
                            errCode === 500;
        
        if (!isTransient && attempt === 1) {
          console.log(`Non-transient error detected: ${errMsg}. We will still try next model/retry to be safe.`);
        }

        if (attempt < maxRetriesPerModel) {
          const delay = attempt * 1000; // 1s, 2s
          console.log(`Waiting ${delay}ms before retrying...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    console.log(`Model ${model} failed after ${maxRetriesPerModel} attempts. Trying fallback model if available...`);
  }
  throw lastError;
}

const mediaCache = new Map<string, { mime: string; buffer: Buffer }>();

function registerMedia(mime: string, base64OrBuffer: string | Buffer): string {
  const mediaId = `media-${Math.random().toString(36).substring(2, 15)}`;
  const buffer = Buffer.isBuffer(base64OrBuffer) 
    ? base64OrBuffer 
    : Buffer.from(base64OrBuffer, 'base64');
  mediaCache.set(mediaId, { mime, buffer });
  return `/api/media/${mediaId}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use body-parser with high limits to allow image base64 uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Route to serve cached media files
  app.get("/api/media/:id", (req, res) => {
    const item = mediaCache.get(req.params.id);
    if (!item) {
      return res.status(404).send("Not found");
    }
    res.setHeader("Content-Type", item.mime);
    res.send(item.buffer);
  });

  // API Route for slide parsing
  app.post("/api/parse-slide", async (req, res) => {
    try {
      const { image, mimeType, fileName } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Missing image data" });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets." 
        });
      }

      const promptPart = {
        text: `You are an expert marketing playbook analyst and slide/image parser.
Analyze the uploaded image, screenshot, or extracted presentation text representing a marketing project, and extract its details to populate a comprehensive project review dashboard.

Guidelines for Extraction and Synthesis:
1. Thorough OCR & Visual Analysis: Read all textual and visual content on the slide/image. Identify the marketing project's focus, goals, target audience, channels, geography, execution details, learnings, and performance outcomes.
2. Complete Draft Synthesis (No Blank Fields): To ensure a complete, helpful, and high-quality draft, do NOT leave major fields blank unless there is absolutely no context. If a field (like country, city, context, objective, execution steps, next steps, or lessons learned) is not explicitly labeled on the slide, analyze the surrounding text and synthesize highly relevant, realistic, and coherent details that match the campaign's context. Do not be lazy. Fill in every field with meaningful content based on your professional marketing judgment and the campaign's theme.
3. Map and extract sections to the corresponding schema fields:
   - "title": A highly specific, polished, and short title for the marketing project (e.g., "Bogota Transit QR Code Billboard" or "Dakar Passenger Referral Blast").
   - "region": Must be mapped to one of: "AFRICA", "MENAP", "LATAM", "EUROPE", "CENTRAL ASIA & SOUTH CAUCASUS". (e.g., Senegal -> AFRICA, Saudi Arabia/Riyadh -> MENAP, Colombia/Bogota -> LATAM, Venezuela -> LATAM).
   - "country": The identified country (e.g. Colombia, Senegal, Saudi Arabia). If not explicitly mentioned but can be determined from the city or project, populate it.
   - "city": The identified city (e.g. Bogota, Dakar, Riyadh, Caracas) or leave blank if completely unidentifiable.
   - "date": Date of the campaign or report (YYYY-MM-DD format). Use the current date or a reasonable campaign date if none is found.
   - "targetAudience": The specific targeted audience (e.g., "Drivers", "Passengers", "Female Drivers", "New users", "Tech-savvy commuters").
   - "hqManager": Name of any HQ manager or blank if not mentioned.
   - "localManager": Name of any local manager or blank if not mentioned.
   - "channels": Array of marketing channels used (e.g. ["OOH", "In-App", "WhatsApp", "Social Media", "SMS", "Flyers", "Billboards"]).
   - "context": Provide a robust, detailed paragraph explaining the situational background, problem statement, or market challenge that led to this campaign.
   - "objective": Provide a clear, strategic objective statement of what the campaign aimed to achieve.
   - "execution": Extract or synthesize a detailed list of step-by-step actions taken during the execution of this project (at least 3-4 items).
   - "results": Extract or synthesize a list of key results, outcomes, or successes achieved (at least 2-3 items), referencing any metrics shown.
   - "nextSteps": List logical next steps, scaling opportunities, or future iterations for this project (at least 2-3 items).
   - "lessons": Extract/synthesize a list of "whatWorked" (success factors, key learnings) and "challenges" (friction points, issues faced) to help other markets.
   - "metrics": Extract all numeric metrics, percentages, or KPIs shown. Return them as label and value pairs (e.g., label: "Signups Growth", value: "+18.5K", label: "CPA Reduction", value: "-15%"). If no specific numbers are on the slide, synthesize 2-3 highly realistic KPIs with values based on the campaign's performance context.

4. CRITICAL: Do NOT include any binary, image, base64 data, or HTML formatting in any field. Return standard plain text only.

Your response MUST be a single, valid JSON object matching this schema:
{
  "title": "string",
  "region": "string",
  "country": "string",
  "city": "string",
  "date": "string",
  "targetAudience": "string",
  "hqManager": "string",
  "localManager": "string",
  "channels": ["string"],
  "context": "string",
  "objective": "string",
  "execution": ["string"],
  "results": ["string"],
  "nextSteps": ["string"],
  "lessons": {
    "whatWorked": ["string"],
    "challenges": ["string"]
  },
  "metrics": [{"label": "string", "value": "string"}]
}

Return ONLY the raw JSON. Do not wrap the JSON in markdown code blocks.`
      };

      // Check if uploaded file is a presentation (e.g. PPTX)
      const isPptx = (mimeType && mimeType.includes("presentationml")) || 
                     (fileName && (fileName.toLowerCase().endsWith(".pptx") || fileName.toLowerCase().endsWith(".ppt"))) ||
                     (typeof image === "string" && image.startsWith("UEsDB"));

      let geminiParts: any[] = [];
      let extractedImages: string[] = [];

      if (isPptx) {
        try {
          console.log(`PPTX presentation detected (fileName: ${fileName || 'unnamed'}). Extracting text...`);
          const buffer = Buffer.from(image, 'base64');
          const zip = new AdmZip(buffer);
          const zipEntries = zip.getEntries();
          let extractedText = "";

          // Filter and sort slide entries numerically
          const slideEntries = zipEntries.filter(entry => 
            entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')
          );

          slideEntries.sort((a, b) => {
            const numA = parseInt(a.entryName.match(/\d+/)?. [0] || '0', 10);
            const numB = parseInt(b.entryName.match(/\d+/)?. [0] || '0', 10);
            return numA - numB;
          });

          slideEntries.forEach((entry, idx) => {
            const xml = entry.getData().toString('utf8');
            let slideText = "";

            // PowerPoint slide XML structures text under paragraphs <a:p>
            const paragraphMatches = xml.match(/<a:p[^>]*>([\s\S]*?)<\/a:p>/g);
            if (paragraphMatches && paragraphMatches.length > 0) {
              paragraphMatches.forEach((pMatch) => {
                // Inside each paragraph, extract text runs <a:t>
                const tMatches = pMatch.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g);
                if (tMatches) {
                  let paragraphText = "";
                  tMatches.forEach((tMatch) => {
                    let text = tMatch.replace(/<[^>]+>/g, '');
                    text = text
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&apos;/g, "'");
                    paragraphText += text; // Concatenate runs directly to preserve word structure
                  });
                  const cleanedText = paragraphText.trim().replace(/\s+/g, ' ');
                  if (cleanedText) {
                    slideText += cleanedText + "\n";
                  }
                }
              });
            } else {
              // Fallback to global <a:t> tags if no paragraphs matched
              const matches = xml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g);
              if (matches) {
                matches.forEach((match) => {
                  let text = match.replace(/<[^>]+>/g, '');
                  text = text
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'");
                  if (text.trim()) {
                    slideText += text.trim() + " ";
                  }
                });
              }
            }

            if (slideText.trim()) {
              extractedText += `\n--- Slide ${idx + 1} ---\n` + slideText;
            }
          });

          // Also let's extract media (images/screenshots embedded inside the PPTX slide)
          const mediaEntries = zipEntries.filter(entry => 
            entry.entryName.startsWith('ppt/media/') && 
            (entry.entryName.endsWith('.png') || 
             entry.entryName.endsWith('.jpeg') || 
             entry.entryName.endsWith('.jpg') || 
             entry.entryName.endsWith('.gif'))
          );
          
          let imageCount = 0;
          for (const entry of mediaEntries) {
            if (imageCount >= 3) break;
            try {
              const imgBuffer = entry.getData();
              if (imgBuffer.length > 2500000) continue; // skip files > 2.5MB
              const extension = entry.entryName.split('.').pop()?.toLowerCase() || 'png';
              const mime = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`;
              const mediaUrl = registerMedia(mime, imgBuffer);
              extractedImages.push(mediaUrl);
              imageCount++;
            } catch (imgErr) {
              console.error(`Failed to extract image entry ${entry.entryName}:`, imgErr);
            }
          }

          if (!extractedText.trim()) {
            throw new Error("Could not extract any readable text from the uploaded PPTX presentation.");
          }

          console.log(`Successfully extracted ${extractedText.length} chars of slide text. Sending to Gemini...`);
          geminiParts = [
            { text: `Here is the extracted text content from a PowerPoint presentation slide deck:\n\n${extractedText}` },
            promptPart
          ];
        } catch (unzipErr: any) {
          console.error("PPTX unzipping or parsing failed:", unzipErr);
          throw new Error("PowerPoint parsing failed. Ensure the file contains text slides and is not corrupted: " + unzipErr.message);
        }
      } else {
        // Standard image or native file (like PDF)
        const imagePart = {
          inlineData: {
            mimeType: mimeType || "image/png",
            data: image,
          },
        };
        geminiParts = [imagePart, promptPart];

        // Since the client sent the base64 of the image, return this image as an extracted image
        const extension = (fileName || "").split('.').pop()?.toLowerCase() || 'png';
        const mime = mimeType || (extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`);
        if (mime.startsWith('image/')) {
          const mediaUrl = registerMedia(mime, image);
          extractedImages.push(mediaUrl);
        }
      }

      const response = await generateWithRetryAndFallback(ai, {
        contents: { parts: geminiParts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              region: { type: Type.STRING },
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              date: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              hqManager: { type: Type.STRING },
              localManager: { type: Type.STRING },
              channels: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              context: { type: Type.STRING },
              objective: { type: Type.STRING },
              execution: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              results: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              lessons: {
                type: Type.OBJECT,
                properties: {
                  whatWorked: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  challenges: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["whatWorked", "challenges"]
              },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["label", "value"]
                }
              }
            }
          }
        }
      });

      let parsedText = response.text || "{}";
      
      // Strip out markdown code block characters if present
      if (parsedText.includes("```")) {
        const match = parsedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          parsedText = match[1];
        }
      }
      
      parsedText = parsedText.trim();
      
      try {
        const parsedData = JSON.parse(parsedText);
        parsedData.extractedImages = extractedImages;
        res.json(parsedData);
      } catch (parseError: any) {
        console.error("Failed to parse JSON string. Length:", parsedText.length);
        console.error("Start snippet:", parsedText.slice(0, 500));
        console.error("End snippet:", parsedText.slice(-500));
        throw parseError;
      }
    } catch (error: any) {
      console.error("Gemini Parsing Error:", error);
      res.status(500).json({ error: error.message || "An error occurred while parsing the slide" });
    }
  });

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Express Error Caught:", err);
    res.status(err.status || err.statusCode || 500).json({
      error: err.message || "An unexpected server error occurred",
      details: err.stack || String(err)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

