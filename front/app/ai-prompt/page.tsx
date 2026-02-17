"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, FileDown, Send, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiPromptTemplate } from "@/lib/ai-prompt-template";
import { toast } from "sonner";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt panoya kopyalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={handleCopy} variant="outline" size="sm" className="gap-1">
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Kopyalandi
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Kopyala
        </>
      )}
    </Button>
  );
}

const steps = [
  {
    icon: FileDown,
    title: "Verileri Export Edin",
    desc: "Fonlar veya Hisseler sayfasindan sectiginiz verileri Excel olarak indirin.",
  },
  {
    icon: Copy,
    title: "Prompt'u Kopyalayin",
    desc: "Asagidaki prompt sablonunu kopyalayip yapay zeka aracina yapisirin.",
  },
  {
    icon: Send,
    title: "AI'a Gonderin",
    desc: "ChatGPT, Claude veya baska bir AI aracina prompt ile birlikte Excel dosyasini gonderin.",
  },
  {
    icon: Save,
    title: "Sonucu Kaydedin",
    desc: "AI'in olusturdugu analiz sonucunu Excel (.xlsx) olarak bilgisayariniza kaydedin.",
  },
  {
    icon: Upload,
    title: "Sisteme Yukleyin",
    desc: "Kaydedilen Excel dosyasini Analizler sayfasindan sisteme yukleyin.",
  },
];

export default function AIPromptPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">{aiPromptTemplate.title}</h1>
        </div>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          {aiPromptTemplate.description}
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="grid gap-3 sm:grid-cols-5">
        {steps.map((step, idx) => (
          <Card key={idx} className="relative">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="mb-1 text-xs">
                Adim {idx + 1}
              </Badge>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompt Tabs */}
      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="funds">Fon Analizi Prompt</TabsTrigger>
          <TabsTrigger value="stocks">Hisse Analizi Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="funds" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Fon Analizi icin AI Prompt</CardTitle>
              <CopyButton text={aiPromptTemplate.promptForFunds} />
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-[400px] leading-relaxed">
                {aiPromptTemplate.promptForFunds}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Hisse Analizi icin AI Prompt</CardTitle>
              <CopyButton text={aiPromptTemplate.promptForStocks} />
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-[400px] leading-relaxed">
                {aiPromptTemplate.promptForStocks}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Example Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ornek AI Ciktisi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            AI aracinin dondurmesi beklenen Excel tablosu asagidaki gibi olmalidir:
          </p>
          <div className="overflow-x-auto">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg leading-relaxed">
              {aiPromptTemplate.exampleOutput}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
