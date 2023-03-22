const NATURAL_IDENTIFICATION_BASE_URL = 'https://identify.biodiversityanalysis.nl/v1/observation/identify'
const OPEN_AI_GPT_BASE_URL = 'https://api.openai.com/v1/completions'

exports.handler = async (event) => {
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
  const result = natureObjectName && await generateOpenAiResponse(natureObjectName)
  const text = result?.choices?.[0]?.text

  const responseBody = { text: text }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      ...corsHeaders(event)
    },
    body: JSON.stringify(responseBody)
  }
}

function corsHeaders(event) {
  return {
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Origin': event?.headers?.['Origin'] || '*'
  }
}

async function generateOpenAiResponse(natureObjectName) {
  const requestBody = {
    prompt: `Was ist der deutsche name von ${natureObjectName}? Schreibe zwei Sätze über die interessantesten Fakten zu der Art.`,
    model: 'text-davinci-003',
    max_tokens: 300
  }

  const resp = await fetch(OPEN_AI_GPT_BASE_URL, {
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
    },
    method: 'POST'
  })

  return resp && await resp.json()
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
