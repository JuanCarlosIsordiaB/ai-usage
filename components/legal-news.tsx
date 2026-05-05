import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Clock, Bell, Gavel, FileText, AlertCircle } from "lucide-react"

export function LegalNews() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="w-8 h-8 text-secondary" />
            Noticias Jurídicas
          </h1>
          <p className="text-muted-foreground">Mantente actualizado con las últimas reformas y publicaciones del DOF</p>
        </div>
        <Button className="gap-2">
          <Bell className="w-4 h-4" />
          Configurar Alertas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="destructive" className="w-fit">
                    URGENTE
                  </Badge>
                  <CardTitle className="text-xl">Nueva Reforma al Código Civil Federal - Contratos Digitales</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Publicado hace 2 horas • DOF
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Se establecen nuevas disposiciones para la validez jurídica de contratos celebrados por medios
                electrónicos, incluyendo firmas digitales y blockchain...
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Derecho Civil</Badge>
                <Badge variant="outline">Tecnología</Badge>
                <Badge variant="outline">Contratos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className="w-fit bg-chart-4 text-white">REFORMA</Badge>
                  <CardTitle>Modificaciones a la Ley Federal del Trabajo - Teletrabajo</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hace 1 día • DOF
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nuevas regulaciones para el trabajo a distancia, derechos y obligaciones tanto para empleadores como
                trabajadores en modalidad remota...
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Derecho Laboral</Badge>
                <Badge variant="outline">Teletrabajo</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    JURISPRUDENCIA
                  </Badge>
                  <CardTitle>SCJN Establece Criterio sobre Protección de Datos Personales</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hace 3 días • SCJN
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                La Suprema Corte establece precedente importante sobre el alcance de la protección de datos en el ámbito
                digital y redes sociales...
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Datos Personales</Badge>
                <Badge variant="outline">SCJN</Badge>
                <Badge variant="outline">Digital</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Alertas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm font-medium text-destructive">Nuevo plazo para cumplimiento NOM-035</p>
                <p className="text-xs text-muted-foreground">Vence en 15 días</p>
              </div>
              <div className="p-3 bg-chart-4/10 rounded-lg">
                <p className="text-sm font-medium text-chart-4">Actualización sistema e.firma SAT</p>
                <p className="text-xs text-muted-foreground">Vigente desde hoy</p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Reformas Constitucionales
                <Badge variant="outline" className="ml-auto">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Derecho Fiscal
                <Badge variant="outline" className="ml-auto">
                  8
                </Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Derecho Laboral
                <Badge variant="outline" className="ml-auto">
                  5
                </Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Derecho Mercantil
                <Badge variant="outline" className="ml-auto">
                  2
                </Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Jurisprudencia
                <Badge variant="outline" className="ml-auto">
                  12
                </Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas WhatsApp</CardTitle>
              <CardDescription>Recibe notificaciones automáticas de nuevas publicaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <Bell className="w-4 h-4" />
                Activar Alertas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
