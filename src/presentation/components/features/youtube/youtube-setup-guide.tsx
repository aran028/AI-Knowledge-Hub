"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Youtube, 
  Zap, 
  Shield, 
  Database,
  ExternalLink,
  FileText,
  CheckCircle
} from "lucide-react"

export function YouTubeSetupGuide() {
  const features = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: "Clasificación automática con IA",
      description: "Los videos se analizan y categorizan automáticamente"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Seguridad y privacidad",
      description: "Solo tus videos clasificados son visibles para ti"
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Almacenamiento inteligente", 
      description: "Los datos se almacenan de forma estructurada en Supabase"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Actualizaciones en tiempo real",
      description: "Nuevo contenido aparece automáticamente en la web"
    }
  ]

  const setupSteps = [
    "Configura tu cuenta de n8n (cloud o self-hosted)",
    "Obtén una clave de API de YouTube",
    "Configura el servicio de IA (OpenAI, Anthropic, etc.)",
    "Crea el workflow siguiendo la guía",
    "Configura las variables de entorno",
    "Prueba el webhook con contenido de ejemplo"
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Youtube className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold">Integración de YouTube con IA</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Configura el webhook de n8n para clasificar automáticamente contenido de YouTube 
          relacionado con herramientas de IA y almacenarlo en tu base de datos.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Guía de configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pasos para configurar:</h3>
              <ol className="space-y-3">
                {setupSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs p-0 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Lo que necesitas:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-center text-sm">
                  <CheckCircle className="h-4 w-4" style={{ color: '#F875AA' }} />
                  <span>Cuenta de n8n activa</span>
                </li>
                <li className="flex gap-3 items-center text-sm">
                  <CheckCircle className="h-4 w-4" style={{ color: '#F875AA' }} />
                  <span>API key de YouTube</span>
                </li>
                <li className="flex gap-3 items-center text-sm">
                  <CheckCircle className="h-4 w-4" style={{ color: '#F875AA' }} />
                  <span>Servicio de IA (OpenAI, etc.)</span>
                </li>
                <li className="flex gap-3 items-center text-sm">
                  <CheckCircle className="h-4 w-4" style={{ color: '#F875AA' }} />
                  <span>Variables de entorno configuradas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1">
              <a href="/docs/n8n-webhook-setup.md" target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                Ver guía completa
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ir a n8n
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook endpoint info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Endpoint:</h3>
            <code className="bg-muted px-3 py-2 rounded text-sm block">
              POST http://localhost:3000/api/webhooks/youtube
            </code>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Headers requeridos:</h3>
            <pre className="bg-muted px-3 py-2 rounded text-sm overflow-x-auto">
{`Content-Type: application/json
Authorization: Bearer YOUR_N8N_WEBHOOK_SECRET`}
            </pre>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              El webhook recibirá datos de videos clasificados por IA y los almacenará 
              automáticamente en tu base de datos. Una vez configurado, los videos aparecerán 
              en esta sección organizados por categorías.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}