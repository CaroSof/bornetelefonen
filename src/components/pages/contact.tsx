import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Kontakt os</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-500" />
              E-mail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              kontakt@bornetelefonen.dk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-500" />
              Åbningstider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Alle dage: 11:00 - 23:00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-500" />
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Børnetelefonen<br />
              1234 København K
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}