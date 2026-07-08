// utils.js - Funciones utilitarias
export function formatMessage(role, text){
    return { role, parts: [{ text }] }
}

export function isValidMessage(message){
    return typeof message === "string" && message.trim().length > 0;
}

export function extractReply(data){
    return data?.reply ?? "No response"
}

export function createUserMessage(text){
    return formatMessage("user", text);
}