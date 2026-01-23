// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { useOrganizations } from './hook/useOrganizations'
import OrganizationCard from './components/OrganizationCard'
import CreateOrgDialog from './components/CreateOrgDialog'

const OrgListContent: React.FC = () => {
  const { data = [], isLoading } = useOrganizations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      <div className='bg-white h-full shadow-lg px-6 py-4'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='relative flex-1'>
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-800' />
            <input
              type='text'
              placeholder='Search organizations...'
              className='w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500'
            />
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium'
            type='button'
          >
            New Org
          </button>
        </div>

        {/* list */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className='space-y-3'>
            {data.map((org) => (
              <OrganizationCard key={org.orgId} org={org} onClick={() => navigate(`/organizations/${org.orgId}`)} />
            ))}
          </div>
        )}
      </div>

      <CreateOrgDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}

const OrganizationPage: React.FC = () => (
  <MainLayout>
    <OrgListContent />
  </MainLayout>
)

export default OrganizationPage

