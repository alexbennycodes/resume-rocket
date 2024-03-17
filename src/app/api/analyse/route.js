import { scoreCriteria } from "@/lib/score";
import { HfInference } from "@huggingface/inference";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function GET() {
  try {
    const cookieStore = cookies();
    const pdfText = cookieStore.get("pdfText")?.value;

    const base = {
      role: "user",
      content: `<"${pdfText}">`,
    };

    const goodResp = await Hf.textGeneration({
      model: "google/gemma-7b-it",
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content:
            "This text contains the text for a resume. What are the good pointers of the this resume.",
        },
        {
          role: "user",
          content:
            "Don't suggest any shortcoming just the positive points, heading should be 'What's good'",
        },
      ]),
      parameters: {
        max_new_tokens: 1024,
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const badResp = await Hf.textGeneration({
      model: "google/gemma-7b-it",
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content:
            "List out the shortcomings of this resume. Only suggest the bad points no good pointers. Explain what is issue with each point and suggest ways to make it better along with the each pointers.",
        },
      ]),
      parameters: {
        max_new_tokens: 1024,
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const scoreResume = await Hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content: `Give me the total score out of 100, based on the following criteria: ${scoreCriteria}, no decimals. The output should contain the total score of the format [score]/100, no explaination or breakdown required.`,
        },
        {
          role: "user",
          content: "just give the score, nothing else",
        },
        {
          role: "user",
          content: "output should not contain no more than 2 characters",
        },
        {
          role: "user",
          content: "no more than 2 characters, just the final scrore",
        },
      ]),
      parameters: {
        max_new_tokens: 1024,
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const jobs = await Hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content:
            "what jobs could he apply for, the output should an contain an array of job roles, no explaination required",
        },
        {
          role: "user",
          content: "just give an array",
        },
      ]),
      parameters: {
        max_new_tokens: 1024,
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    return NextResponse.json({
      message: "Success",
      status: 201,
      text: pdfText,
      goodPointers: goodResp.generated_text,
      badPointers: badResp.generated_text,
      scoreResume: scoreResume.generated_text,
      jobs: JSON.parse(jobs.generated_text),
    });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: error, status: 500 });
  }
}
