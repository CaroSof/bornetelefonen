import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Phone } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Få hjælp</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-teal-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-teal-500" />
              Chat med en rådgiver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start en anonym chat med en af vores rådgivere. Vi er her for at lytte og hjælpe dig.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ 100% anonymt</li>
              <li>✓ Ingen ventetid</li>
              <li>✓ Professionelle rådgivere</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-pink-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-pink-500" />
              Ring til os
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Vi er klar ved telefonen til at tale med dig om alt det, der fylder.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Gratis at ringe</li>
              <li>✓ Åbent hver dag</li>
              <li>✓ Tag den tid du har brug for</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}