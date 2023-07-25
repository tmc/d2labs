import React, { useState } from 'react';
import { useSubscription } from '@apollo/client'

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"

import { Button } from "@/registry/new-york/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card"
import { Label } from "@/registry/new-york/ui/label"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  // TabsList,
  // TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { Textarea } from "@/registry/new-york/ui/textarea"

// import { CodeViewer } from "./components/code-viewer"
// import { MaxLengthSelector } from "./components/maxlength-selector"
// import { ModelSelector } from "./components/model-selector"
import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"
import { PresetSelector } from "./components/preset-selector"
import { PresetShare } from "./components/preset-share"
// import { TemperatureSelector } from "./components/temperature-selector"
// import { TopPSelector } from "./components/top-p-selector"
// import { models, types } from "./data/models"
import { Preset } from "./data/presets"
import { presets } from "./data/presets"

import { graphql } from '../src/gql-gen'

const models = [{
  name: "Davinci",
  description: "The 13B parameter Davinci model.",
  type:  "davinci", 
}];
const types = [];

const diagramCompletionSubscription = graphql(`
  subscription DiagramSubscriptionPG($prompt: String!) {
    diagramCompletion(prompt: $prompt) {
      text
      isLast
    }
}
`)
//
// set render url based on node env
const RENDER_URL = process.env.NODE_ENV === 'production' ? '/render.png' : 'http://localhost:8080/render.png'


export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("A typical 3 tier web architecture.");
  const [debouncedPrompt, setDebouncedPrompt] = useState(prompt);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setResult("");
      setDebouncedPrompt(prompt);
    }, 500);
    return () => clearTimeout(timeout);
  }, [prompt]);

  // result accumulator:
  const [result, setResult] = useState("");

  useSubscription(diagramCompletionSubscription, {
    variables: {
      prompt: debouncedPrompt,
    },
    onError: (err) => {
      console.error(err)
    },
   onData: (data) => {
     setResult(result + data.data.data?.diagramCompletion?.text);
    },
  });

  // base64 encoded version of the result (debcounced)
  // const srcb64 = btoa(result);
  const [srcb64, setSrcb64] = useState("");
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcb64(btoa(result));
    }, 500);
    return () => clearTimeout(timeout);
  }, [result]);

  const [selectedPreset, setSelectedPreset] = React.useState<Preset>()

  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">d2labs: AI-assisted Architecture Diagramming</h2>
          <div className="ml-auto flex full space-x-2 sm:justify-end">
            <PresetSelector 
            presets={presets}
              selectedPreset={selectedPreset}
              setSelectedPreset={(preset) => {
                setSelectedPreset(preset)
                setPrompt(preset.name)
              }}
            />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
              {/* <CodeViewer /> */}
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_500px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Output
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                  <img 
                  style={{
                    width: '100%', 
                  }}
                  src={`${RENDER_URL}?src=${encodeURIComponent(srcb64)}`}
                        />
                {/* <ModelSelector types={types} models={models} /> */}
                {/* <TemperatureSelector defaultValue={[0.56]} /> */}
                {/* <MaxLengthSelector defaultValue={[256]} /> */}
                {/* <TopPSelector defaultValue={[0.9]} /> */}
              </div>
              <div className="md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0 space-y-2">
                  <div className="flex h-full flex-col space-y-3">
                    <Textarea
                      placeholder="Describe the architecture of a technical system"
                      className="min-h-[60px] flex-1 p-4 md:min-h-[60px] lg:min-h-[60px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="flex items-center space-x-2 space-y-0">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Generated diagram descriptor will appear here"
                      className="generated min-h-[400px] flex-1 p-4 md:min-h-[400px] lg:min-h-[500px]"
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <div className="rounded-md border bg-muted"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[580px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}
