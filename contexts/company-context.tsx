"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { companies, type Company } from "@/data/companies"
import { currentUser } from "@/data/users"

interface CompanyContextType {
  selectedCompanyId: string | "all"
  selectedCompany: Company | null
  availableCompanies: Company[]
  setSelectedCompanyId: (companyId: string | "all") => void
  isAllCompaniesView: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | "all">("all")

  // Get companies accessible to current user
  const availableCompanies = React.useMemo(() => {
    if (currentUser.role === "admin") {
      return companies
    }
    return companies.filter((company) => currentUser.assignedCompanyIds.includes(company.id))
  }, [])

  // Get selected company object
  const selectedCompany = React.useMemo(() => {
    if (selectedCompanyId === "all") return null
    return companies.find((c) => c.id === selectedCompanyId) || null
  }, [selectedCompanyId])

  const isAllCompaniesView = selectedCompanyId === "all"

  // Persist selection in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedCompanyId")
    if (saved && (saved === "all" || availableCompanies.some((c) => c.id === saved))) {
      setSelectedCompanyId(saved)
    }
  }, [availableCompanies])

  useEffect(() => {
    localStorage.setItem("selectedCompanyId", selectedCompanyId)
  }, [selectedCompanyId])

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        selectedCompany,
        availableCompanies,
        setSelectedCompanyId,
        isAllCompaniesView,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}

