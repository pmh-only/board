import { RequestInit } from 'next/dist/server/web/spec-extension/request'

export const fetchJSON =
  (url: string, options: RequestInit = {}) =>
    fetch(url, options).then(res => res.json())

export const fetchJSONBody =
  (url: string, body: any) =>
    fetchJSON(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    })
