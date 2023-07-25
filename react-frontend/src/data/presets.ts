export interface Preset {
  id: string
  name: string
}

export const presets: Preset[] = [
  {
    id: "8cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "A microservice architecture running on Kubernetes.",
  },
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "A typical 3 tier web architecture.",
  },
  {
    id: "61eb0e32-2391-4cd3-adc3-66efe09bc0b7",
    name: "A CDN for static assets.",
  },
  {
    id: "a4e1fa51-f4ce-4e45-892c-224030a00bdd",
    name: "A search engine.",
  },
]
