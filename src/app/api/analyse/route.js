import { getArray } from "@/lib/getArray";
import { scoreCriteria } from "@/lib/score";
import { HfInference } from "@huggingface/inference";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import { NextResponse } from "next/server";

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const model = "mistralai/Mistral-7B-Instruct-v0.2";

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.pdf_text)
      NextResponse.json({ message: "Data not found", status: 500 });

    const pdfText = data.pdf_text;

    const base = {
      role: "user",
      content: `<"${pdfText}">`,
    };

    const goodResp = await Hf.textGeneration({
      model,
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content:
            "List out the good things about this resume. Only suggest the bad points no good pointers. Don't suggest any shortcomings just the positive points.",
        },
        {
          role: "user",
          content: `Please ensure that the text below is properly formatted in markdown with appropriate indentation, spacing, and hierarchy. The heading should be in h2 tag and should read "What's good". Don't give the output in code block`,
        },
        // {
        //   role: "user",
        //   content:
        //     "the response should be in nicely formatted markdown format with proper indentation and spacing and correct hierarchy with heading as h2 tag `What's good`",
        // },
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
      model,
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content:
            "List out the shortcomings of this resume. Only suggest the bad points no good pointers. Explain what is issue with each point and suggest ways to make it better along with the each pointers.",
        },
        {
          role: "user",
          content:
            "the response should be in nicely formatted markdown format with proper indentation and spacing and correct hierarchy with heading as 'Shortcomings'",
        },
        {
          role: "user",
          content:
            "the response should be in nicely formatted markdown format with proper indentation and spacing and correct hierarchy with heading as 'Shortcomings'",
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
      model,
      inputs: experimental_buildOpenAssistantPrompt([
        base,
        {
          role: "user",
          content: `Give me the total score out of 100, based on the following criteria: ${scoreCriteria}, no decimals. The output should contain the total score of the format [score]/100, no explaination or breakdown required.`,
        },
        {
          role: "user",
          content: "just give the score",
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
      model,
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
      goodPointers: goodResp.generated_text,
      badPointers: badResp.generated_text,
      scoreResume: scoreResume.generated_text.slice(0, 2),
      jobs: getArray(jobs.generated_text),
      model,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: error.message, status: 500, success: false },
      { status: 500 }
    );
  }
}
