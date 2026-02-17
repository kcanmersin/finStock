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
    <Button onClick={handleCopy} variant="outline" size="sm" className="gap-1 shrink-0">
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Kopyalandi</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Kopyala</span>
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
    <div className="space-y-6 md:space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-6 w-6 text-primary md:h-7 md:w-7" />
          <h1 className="text-2xl font-bold md:text-3xl">{aiPromptTemplate.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl md:text-base">
          {aiPromptTemplate.description}
        </p>
      </div>

      {/* Workflow Steps - horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {steps.map((step, idx) => (
          <Card key={idx} className="min-w-[140px] shrink-0 md:min-w-0">
            <CardContent className="p-3 text-center md:p-4">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 md:h-10 md:w-10">
                <step.icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
              </div>
              <Badge variant="outline" className="mb-1 text-[10px] md:text-xs">
                Adim {idx + 1}
              </Badge>
              <h3 className="text-xs font-semibold md:text-sm">{step.title}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 hidden sm:block md:text-xs">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompt Tabs */}
      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="funds" className="text-xs sm:text-sm">Fon Analizi Prompt</TabsTrigger>
          <TabsTrigger value="stocks" className="text-xs sm:text-sm">Hisse Analizi Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="funds" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="text-base md:text-lg">Fon Analizi icin AI Prompt</CardTitle>
              <CopyButton text={aiPromptTemplate.promptForFunds} />
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[300px] leading-relaxed md:text-sm md:p-4 md:max-h-[400px]">
                {aiPromptTemplate.promptForFunds}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="text-base md:text-lg">Hisse Analizi icin AI Prompt</CardTitle>
              <CopyButton text={aiPromptTemplate.promptForStocks} />
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[300px] leading-relaxed md:text-sm md:p-4 md:max-h-[400px]">
                {aiPromptTemplate.promptForStocks}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Example Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Ornek AI Ciktisi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3 md:text-sm">
            AI aracinin dondurmesi beklenen Excel tablosu asagidaki gibi olmalidir:
          </p>
          <div className="overflow-x-auto">
            <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded-lg leading-relaxed md:text-sm md:p-4">
              {aiPromptTemplate.exampleOutput}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
