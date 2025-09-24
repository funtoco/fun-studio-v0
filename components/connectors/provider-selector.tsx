/**
 * Provider selection component with capabilities filtering
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllProviders, getProvidersByCapability } from '@/lib/connectors/provider-definitions'
import { ProviderCapabilities } from '@/lib/connectors/provider-definitions'

interface ProviderSelectorProps {
  onSelectProvider: (providerId: string) => void
  filterByCapability?: keyof ProviderCapabilities
  searchTerm?: string
  onSearchChange?: (term: string) => void
}

export function ProviderSelector({ 
  onSelectProvider, 
  filterByCapability,
  searchTerm = '',
  onSearchChange
}: ProviderSelectorProps) {
  const [selectedCapability, setSelectedCapability] = useState<string>('all')
  
  // Get providers based on filters
  const getFilteredProviders = () => {
    let providers = filterByCapability 
      ? getProvidersByCapability(filterByCapability)
      : getAllProviders()
    
    // Filter by capability if selected
    if (selectedCapability !== 'all') {
      providers = providers.filter(provider => 
        provider.capabilities[selectedCapability as keyof ProviderCapabilities]
      )
    }
    
    // Filter by search term
    if (searchTerm) {
      providers = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return providers
  }
  
  const providers = getFilteredProviders()
  
  const capabilityOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'dataSync', label: 'Data Sync' },
    { value: 'realTimeSync', label: 'Real-time Sync' },
    { value: 'webhooks', label: 'Webhooks' },
    { value: 'bulkOperations', label: 'Bulk Operations' },
    { value: 'customFields', label: 'Custom Fields' },
    { value: 'fileUpload', label: 'File Upload' },
    { value: 'search', label: 'Search' },
    { value: 'filtering', label: 'Filtering' },
    { value: 'pagination', label: 'Pagination' }
  ]
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <Select value={selectedCapability} onValueChange={setSelectedCapability}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {capabilityOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map(provider => (
          <Card 
            key={provider.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectProvider(provider.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                {provider.logo && (
                  <img 
                    src={provider.logo} 
                    alt={provider.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Capabilities */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(provider.capabilities)
                    .filter(([, enabled]) => enabled)
                    .map(([capability]) => (
                      <Badge key={capability} variant="secondary" className="text-xs">
                        {capability.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))
                  }
                </div>
              </div>
              
              {/* Authentication Strategies */}
              <div className="mt-3 space-y-1">
                <div className="text-sm font-medium text-gray-700">Auth Methods:</div>
                <div className="flex flex-wrap gap-1">
                  {provider.supportedAuthStrategies.map(strategy => (
                    <Badge key={strategy} variant="outline" className="text-xs">
                      {strategy === 'oauth' ? 'OAuth 2.0' : 
                       strategy === 'api_key' ? 'API Key' :
                       strategy === 'basic_auth' ? 'Basic Auth' :
                       strategy === 'custom' ? 'Custom' : strategy}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Entities */}
              <div className="mt-3 space-y-1">
                <div className="text-sm font-medium text-gray-700">Data Types:</div>
                <div className="text-xs text-gray-600">
                  {provider.entities.length} data type{provider.entities.length !== 1 ? 's' : ''} available
                </div>
              </div>
              
              {/* Rate Limits */}
              {provider.rateLimits && (
                <div className="mt-3 space-y-1">
                  <div className="text-sm font-medium text-gray-700">Rate Limits:</div>
                  <div className="text-xs text-gray-600">
                    {provider.rateLimits.requestsPerMinute}/min, {provider.rateLimits.requestsPerHour}/hour
                  </div>
                </div>
              )}
              
              <Button className="w-full mt-4" variant="outline">
                Configure {provider.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {providers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No providers found matching your criteria.
        </div>
      )}
    </div>
  )
}
