import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'

const NATURAL_IDENTIFICATION_BASE_URL = 'https://identify.biodiversityanalysis.nl/v1/observation/identify'
const TEMPLATE = 'I want you to act as a encyclopedie that contains useful facts about animals and plants. \
You answer in the style of a pokedex from pokemon using the provided context. \
What is {natureObjectName}? \
Context: \
{wikiContext} \
Answer in german:'

export const handler = async (event) => {
  const body = event?.body && JSON.parse(event.body)
  const imageDataUrl = body?.image_data_url

  if (!imageDataUrl) {
    return {
      statusCode: 400,
      body: 'Missing image_data_url in request body'
    }
  }

  const blob = await getBlobImage(imageDataUrl)

  const natureObjectName = blob && await identify(blob)
  const natureObjectNameGerman = natureObjectName && await getGermanTitle(natureObjectName)
  const wikiContext = natureObjectNameGerman && await getWikiContext(natureObjectNameGerman)

  const text = natureObjectNameGerman && await queryOpenAi(natureObjectNameGerman, wikiContext)
  const response = { text: text }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      ...corsHeaders(event)
    },
    body: JSON.stringify(response)
  }
}

function corsHeaders(event) {
  return {
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': event?.headers?.['Origin'] || '*'
  }
}

async function getGermanTitle(natureObjectName) {
  const url = `https://de.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&srlimit=1&format=json&srsearch=${encodeURIComponent(natureObjectName)}`
  const resp = await fetch(url)
  const json = resp && await resp.json()

  return json?.query?.search?.[0]?.title
}

  async function getWikiContext(title) {
  const url = `https://de.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&explaintext=1&formatversion=2&format=json&titles=${encodeURIComponent(title)}`
  const resp = await fetch(url)
  const json = resp && await resp.json()

  return json?.query?.pages?.[0]?.extract
}

async function queryOpenAi(natureObjectName, wikiContext) {
  const model = new OpenAI({ openAIApiKey: process.env.OPEN_AI_API_KEY, temperature: 0.2 })
  const prompt = new PromptTemplate({ template: TEMPLATE, inputVariables: ['natureObjectName', 'wikiContext'] })

  const chain = new LLMChain({ llm: model, prompt: prompt })
  const resp = await chain.call({ natureObjectName: natureObjectName, wikiContext: wikiContext })

  return resp?.text
}

async function getBlobImage(imageDataUrl) {
  return await (await fetch(imageDataUrl))?.blob()
}

async function identify(blob) {
  const formData = new FormData()
  formData.append('image', blob, 'image.jpeg')

  const resp = await fetch(NATURAL_IDENTIFICATION_BASE_URL, {
    body: formData,
    method: 'POST'
  })

  const json = resp && await resp.json()

  return json?.predictions?.[0]?.taxon?.name
}
