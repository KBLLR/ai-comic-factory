export function createOpenAIPrompt(messages: Array<{ role: string, content: string }>) {
    const DEFAULT_SYSTEM_PROMPT = "You are a helpful, respectful, and honest assistant. Always answer as helpfully as possible, while being safe. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.";
  
    if (messages[0].role !== "system") {
      messages = [
        { role: "system", content: DEFAULT_SYSTEM_PROMPT },
      ].concat(messages);
    }
  
    let prompt = messages.map((message, index) => {
      let prefix = message.role === "system" ? "System: " : "User: ";
      return `${prefix}${message.content}`;
    }).join("\n");
  
    return prompt;
  }

  