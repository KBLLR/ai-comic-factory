"use server"

import { LLMEngine } from "@/types"
import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"


const hf = new HfInference(process.env.HF_API_TOKEN || process.env.OPENAI_API_KEY);


// note: we always try "inference endpoint" first
const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine
const inferenceEndpoint = `${process.env.HF_INFERENCE_ENDPOINT_URL || ""}`
const inferenceModel = `${process.env.HF_INFERENCE_API_MODEL || ""}`

let hfie: HfInferenceEndpoint

switch (llmEngine) {
  case "INFERENCE_ENDPOINT":
    if (inferenceEndpoint) {
      console.log("Using a custom HF Inference Endpoint")
      hfie = hf.endpoint(inferenceEndpoint)
    } else {
      const error = "No Inference Endpoint URL defined"
      console.error(error)
      throw new Error(error)
    }
    break;
  
  case "INFERENCE_API":
    if (inferenceModel) {
      console.log("Using an HF Inference API Model")
    } else {
      const error = "No Inference API model defined"
      console.error(error)
      throw new Error(error)
    }
    break;
  
  default:
    const error = "No Inference Endpoint URL or Inference API Model defined"
    console.error(error)
    throw new Error(error)
}

export async function predict(inputs: string) {

  console.log(`predict: `, inputs)
  
  const api = llmEngine ==="INFERENCE_ENDPOINT" ? hfie : hf

  let instructions = ""
  try {
    for await (const output of api.textGenerationStream({
      model: llmEngine === "INFERENCE_ENDPOINT" ? undefined : (inferenceModel || undefined),
      inputs,
      parameters: {
        do_sample: true,
        max_new_tokens: 100, // Adjust as necessary
        return_full_text: true,
      },
    })) {
      instructions += output.token.text;
      process.stdout.write(output.token.text);
      if (
        instructions.includes("</s>") || 
        instructions.includes("<s>") ||
        instructions.includes("[INST]") ||
        instructions.includes("[/INST]") ||
        instructions.includes("<SYS>") ||
        instructions.includes("</SYS>") ||
        instructions.includes("") ||
        instructions.includes("")
      ) {
        break;
      }
    }
  } catch (err) {
    console.error(`error during generation: ${err}`);
  }
  
  // The rest of your existing code for cleanup
  return (
    instructions
    .replaceAll("", "")
    .replaceAll("<s>", "")
    .replaceAll("</s>", "")
    .replaceAll("[INST]", "")
    .replaceAll("[/INST]", "") 
    .replaceAll("<SYS>", "")
    .replaceAll("</SYS>", "")
    .replaceAll("", "")
    .replaceAll('""', '"')
  );
}  