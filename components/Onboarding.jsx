import { api } from '@/app/api/api-collection';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company_code: '',
    role: '',
    companyChoice: ''
  });

  const router = useRouter();

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChoice = (choice) => {
    setFormData(prev => ({
      ...prev,
      companyChoice: choice
    }));
    setStep(3);
  };

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    sector: '',
    size: '',
    description: ''
  });

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCompany = async () => {
    try {
      // Here you would call the API to create a company
      // For example: await api.companies.create(companyData);
      console.log('Company data to submit:', companyData);
      
      // After successful creation, update the form data with the new company info
      setFormData(prev => ({
        ...prev,
        companyName: companyData.name
      }));
      
      // Close the modal and proceed to the next step
      setShowCompanyModal(false);
      setStep(3);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newForm = {
      name: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      role: formData.role,
      company_code: formData.company_code
    }

    // If creating a company, include company data
    if (formData.companyChoice === 'create') {
      newForm.company = {
        name: companyData.name,
        sector: companyData.sector,
        size: companyData.size,
        description: companyData.description
      };
    }

    try {
      // Use the API collection instead of direct fetch
      const response = await api.members.create(newForm);
      console.log("Member added successfully:", response);
      router.push('/');
    } catch (error) {
      console.error("Error adding member:", error);
      console.error("Failed to add member. Please try again.");
    } 
    console.log('Form submitted:', newForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Welcome! Let's get started
        </h2>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-medium text-center text-gray-900">
              Would you like to join or create a company?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleCompanyChoice('join')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Join a Company
              </button>
              <button
                onClick={() => {
                  handleCompanyChoice('create');
                  setShowCompanyModal(true);
                }}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Create a Company
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {formData.companyChoice === 'join' ? (
              <div>
                <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">
                  Enter Company Code
                </label>
                <input
                  id="company_code"
                  name="company_code"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.company_code}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.companyName || companyData.name}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="companySector" className="block text-sm font-medium text-gray-700">
                    Company Sector
                  </label>
                  <input
                    id="companySector"
                    name="companySector"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={companyData.sector}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <input
                    id="companySize"
                    name="companySize"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={companyData.size}
                    readOnly
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Complete
            </button>
          </form>
        )}
      </div>

      {/* Company Creation Modal */}
      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a New Company</DialogTitle>
            <DialogDescription>
              Please provide details about your company to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium col-span-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={companyData.name}
                onChange={handleCompanyInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="sector" className="text-right text-sm font-medium col-span-1">
                Sector
              </label>
              <Select 
                name="sector" 
                value={companyData.sector} 
                onValueChange={(value) => setCompanyData(prev => ({ ...prev, sector: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="size" className="text-right text-sm font-medium col-span-1">
                Size
              </label>
              <Select 
                name="size" 
                value={companyData.size} 
                onValueChange={(value) => setCompanyData(prev => ({ ...prev, size: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium col-span-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={companyData.description}
                onChange={handleCompanyInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompanyModal(false)}>Cancel</Button>
            <Button onClick={handleCreateCompany}>Create Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Onboarding;
