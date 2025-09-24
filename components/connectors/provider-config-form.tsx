/**
 * Dynamic provider configuration form component
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProviderDefinition } from '@/lib/connectors/provider-definitions'
import { getAuthStrategy, getAvailableStrategies } from '@/lib/connectors/auth-strategies'

interface ProviderConfigFormProps {
  providerId: string
  initialConfig?: Record<string, any>
  onSubmit: (config: Record<string, any>) => void
  onCancel: () => void
}

export function ProviderConfigForm({ 
  providerId, 
  initialConfig = {}, 
  onSubmit, 
  onCancel 
}: ProviderConfigFormProps) {
  const [config, setConfig] = useState<Record<string, any>>(initialConfig)
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')
  const [providerDef, setProviderDef] = useState<any>(null)
  const [authStrategy, setAuthStrategy] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      const def = getProviderDefinition(providerId)
      setProviderDef(def)
      setSelectedStrategy(def.defaultAuthStrategy)
    } catch (error) {
      console.error('Failed to load provider definition:', error)
    }
  }, [providerId])

  useEffect(() => {
    if (selectedStrategy) {
      try {
        const strategy = getAuthStrategy(providerId, selectedStrategy)
        setAuthStrategy(strategy)
      } catch (error) {
        console.error('Failed to load auth strategy:', error)
      }
    }
  }, [providerId, selectedStrategy])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(config)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderField = (fieldName: string, field: any) => {
    const value = config[fieldName] || ''
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={fieldName}
            value={value}
            onChange={(e) => handleConfigChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      
      case 'password':
        return (
          <Input
            id={fieldName}
            type="password"
            value={value}
            onChange={(e) => handleConfigChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(value) => handleConfigChange(fieldName, value)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'textarea':
        return (
          <Textarea
            id={fieldName}
            value={value}
            onChange={(e) => handleConfigChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
          />
        )
      
      case 'boolean':
        return (
          <Switch
            id={fieldName}
            checked={value}
            onCheckedChange={(checked) => handleConfigChange(fieldName, checked)}
          />
        )
      
      default:
        return (
          <Input
            id={fieldName}
            value={value}
            onChange={(e) => handleConfigChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  if (!providerDef || !authStrategy) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{providerDef.name} Configuration</CardTitle>
        <CardDescription>
          {providerDef.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Authentication Strategy Selection */}
          <div className="space-y-2">
            <Label htmlFor="strategy">Authentication Strategy</Label>
            <Select
              value={selectedStrategy}
              onValueChange={setSelectedStrategy}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providerDef.supportedAuthStrategies.map((strategy: string) => {
                  const strategyDef = getAuthStrategy(providerId, strategy)
                  return (
                    <SelectItem key={strategy} value={strategy}>
                      {strategyDef.description}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Provider-specific configuration fields */}
          {providerDef.customConfigFields && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Provider Configuration</h3>
              {providerDef.customConfigFields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field.name, field)}
                </div>
              ))}
            </div>
          )}

          {/* Authentication strategy fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Authentication Configuration</h3>
            {authStrategy.requiredFields.map((fieldName: string) => (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                {renderField(fieldName, { type: 'text', required: true })}
              </div>
            ))}
            
            {authStrategy.optionalFields?.map((fieldName: string) => (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </Label>
                {renderField(fieldName, { type: 'text', required: false })}
              </div>
            ))}
          </div>

          {/* Custom fields for custom auth strategy */}
          {authStrategy.strategy === 'custom' && authStrategy.customFields && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Custom Configuration</h3>
              {authStrategy.customFields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field.name, field)}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
