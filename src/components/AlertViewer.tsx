// src/components/AlertViewer.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

interface AlertLog {
  id: string
  rule_id: string
  rule_name: string
  alert_level: string
  alert_message: string
  account_id: string
  detected_at: string
  event_data: any
  resolved: boolean
}

const PAGE_SIZE = 10

export default function AlertViewer() {
  const [alerts, setAlerts] = useState<AlertLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filterResolved, setFilterResolved] = useState<'all' | 'unresolved'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    fetchAlerts(1, true)
  }, [filterResolved, filterSeverity])

  const fetchAlerts = async (pageNumber: number, reset = false) => {
    setLoading(true)
    const from = (pageNumber - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('alert_logs')
      .select('*')
      .order('detected_at', { ascending: false })
      .range(from, to)

    if (filterResolved === 'unresolved') {
      query = query.eq('resolved', false)
    }

    if (filterSeverity !== 'all') {
      query = query.eq('alert_level', filterSeverity)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading alerts:', error)
    } else {
      if (data.length < PAGE_SIZE) setHasMore(false)
      setAlerts(reset ? data : [...alerts, ...data])
      setPage(pageNumber)
    }
    setLoading(false)
  }

  const handleLoadMore = () => {
    fetchAlerts(page + 1)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-sm">Resolution</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filterResolved}
            onChange={(e) => setFilterResolved(e.target.value as 'all' | 'unresolved')}
          >
            <option value="all">All</option>
            <option value="unresolved">Unresolved Only</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Severity</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'high' | 'medium' | 'low')}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.map(alert => (
          <Card key={alert.id}>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-md font-semibold">{alert.rule_name}</h3>
                  <p className="text-sm text-gray-500">{alert.alert_message}</p>
                </div>
                <Badge variant={alert.alert_level === 'high' ? 'destructive' : 'default'}>
                  {alert.alert_level.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">Account: {alert.account_id} • {new Date(alert.detected_at).toLocaleString()}</p>
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(alert.event_data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}

        {loading && Array.from({ length: PAGE_SIZE }).map((_, idx) => (
          <Card key={`skeleton-${idx}`}>
            <CardContent className="space-y-2 py-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}

        {!loading && hasMore && (
          <div className="text-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

