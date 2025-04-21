import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

async function fetchMockups() {
  const response = await fetch('/api/mockups')
  return response.json()
}

export default function MockupGallery() {
  const { data: mockups, isLoading } = useQuery({
    queryKey: ['mockups'],
    queryFn: fetchMockups
  })

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))
        ) : (
          mockups?.map((mockup) => (
            <Card key={mockup.id}>
              <CardHeader>
                <CardTitle>{mockup.design.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={mockup.imageUrl} 
                  alt={mockup.design.name} 
                  className="rounded-lg mb-4"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    Edit
                  </Button>
                  <Button className="w-full">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}