// src/components/AlertViewer.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default function AlertViewer() {
  const [alerts, setAlerts] = useState<AlertLog[]>([])

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('alert_logs')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error loading alerts:', error)
    } else {
      setAlerts(data || [])
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
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
      </div>
    </div>
  )
}
